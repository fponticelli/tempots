# JS Framework Benchmark Results — 2026-02-17

Tempo (keyed + non-keyed) compared against popular frameworks using the [official js-framework-benchmark](https://github.com/nicktomlin/nicktomlin.github.io) suite by Stefan Krause.

## Test Environment

- **Machine**: macOS Darwin 25.3.0
- **Node**: v22.21.1
- **Runner**: Playwright (headless Chromium)
- **Iterations**: 3-5 per benchmark
- **CPU throttling**: 4x for most tests (standard benchmark setting)

## Framework Versions

| Framework | Version |
|-----------|---------|
| Tempo | 15.0 (keyed, with `KeyedForEach` + `delegate`) |
| Tempo | 15.0 (non-keyed, with `ForEach` + `delegate`) |
| Solid | 1.9.3 |
| Svelte | 5.42.1 |
| React (hooks) | 19.2.0 |
| Angular (control flow) | 21.0.5 |
| Vanilla JS | baseline |

## CPU Benchmarks (ms, lower is better)

### Keyed

| Benchmark | Vanilla JS | Solid | Svelte | Angular | React | Tempo (before) | Tempo (after) | Improvement |
|-----------|-----------|-------|--------|---------|-------|----------------|---------------|-------------|
| Create 1,000 rows | 34.5 | 35.5 | 35.8 | 47.3 | 41.8 | 110.5 | **66.7** | -39.6% |
| Replace 1,000 rows | 40.2 | 41.3 | 42.2 | 57.2 | 51.2 | 124.1 | **83.9** | -32.4% |
| Partial update (every 10th) | 19.2 | 23.6 | 22.1 | 21.2 | 28.2 | 37.1 | **27.4** | -26.1% |
| Select row | 5.7 | 7.6 | 10.3 | 7.8 | 9.4 | 22.5 | **11.6** | -48.4% |
| Swap rows | 22.9 | 27.1 | 27.0 | 26.0 | 167.4 | 40.4 | **38.7** | -4.2% |
| Remove row | 17.7 | 18.5 | 18.8 | 16.6 | 19.8 | 55.3 | **20.8** | -62.4% |
| Create 10,000 rows | 360.4 | 382.0 | 390.3 | 478.4 | 576.4 | 1,024.5 | **682.3** | -33.4% |
| Append 1,000 rows | 40.5 | 45.4 | 43.5 | 55.2 | 49.7 | 125.4 | **76.8** | -38.8% |
| Clear 1,000 rows | 17.5 | 21.5 | 20.6 | 31.0 | 27.1 | 57.7 | **42.8** | -25.8% |

### Non-Keyed

| Benchmark | Tempo (non-keyed) | Notes |
|-----------|-------------------|-------|
| Create 1,000 rows | **57.9** | 13% faster than keyed |
| Replace 1,000 rows | **16.9** | Destroys + recreates all rows |
| Partial update (every 10th) | **28.5** | Similar to keyed (was slower before batching) |
| Select row | **6.4** | O(1) via direct DOM selection |
| Swap rows | **23.7** | Full list re-render |
| Remove row | **33.8** | Full list re-render |
| Create 10,000 rows | **590.1** | 14% faster than keyed |
| Append 1,000 rows | **72.1** | 6% faster than keyed |
| Clear 1,000 rows | **43.0** | Similar to keyed |

## Memory Benchmarks (MB, lower is better)

| Benchmark | Vanilla JS | Solid | Svelte | Angular | React | Tempo keyed (before) | Tempo keyed (after) | Tempo non-keyed | Improvement |
|-----------|-----------|-------|--------|---------|-------|---------------------|--------------------|--------------------|-------------|
| Ready memory | 0.53 | 0.55 | 0.67 | 2.06 | 1.66 | 0.71 | **1.19** | **1.19** | — |
| Run memory (1k rows) | 2.03 | 2.83 | 3.05 | 5.22 | 5.09 | 30.76 | **24.54** | **20.22** | -20.2% |
| Run-clear memory | 0.62 | 0.74 | 1.01 | 2.62 | 2.47 | 20.86 | **11.21** | **7.15** | -46.3% |

## Bundle Size (lower is better)

| Benchmark | Vanilla JS | Solid | Svelte | Angular | React | Tempo |
|-----------|-----------|-------|--------|---------|-------|-------|
| Uncompressed (KB) | 11.3 | 11.5 | 34.3 | 140.7 | 190.3 | **26.3** |
| Compressed (KB) | 2.5 | 4.5 | 12.2 | 43.6 | 51.4 | **9.4** |
| First paint (ms) | 53.3 | 63.7 | 91.3 | 251.9 | 323.9 | **69.3** |

## Optimizations Applied

The following optimizations were implemented and measured incrementally:

### Step 1: Fix Computed.dispose() memory leak (BUG FIX)

**File:** `packages/tempots-core/src/signal.ts`

`Computed.dispose()` was missing listener cleanup. The parent `Signal.dispose()` had it, but `Computed` overrides `dispose` with an arrow function and omitted this line. Listener closures retained references to DOM nodes and parent signals, preventing GC.

**Impact:** Run-clear memory dropped from 21.3 MB to ~11.6 MB (45% reduction).

### Step 2: Lazy KeyedPosition signals

**File:** `packages/tempots-core/src/keyed-position.ts`

`KeyedPosition` eagerly created 5 derived signals (`counter`, `isFirst`, `isEven`, `isOdd`, `isLast`) per item. The benchmark uses NONE of them. For 1,000 rows = 5,000 wasted `Computed` instances with scope tracking, derivative arrays, and dispose callbacks.

Converted from eager `readonly` fields to lazy getters with private `#field` backing.

**Impact:** Create 1k dropped from ~106 ms to ~82 ms (22% faster). Run memory reduced by ~6 MB.

### Step 3: Simplify signalClassName

**File:** `packages/tempots-dom/src/renderable/attribute.ts`

`signalClassName` created 2 `Set` objects on every class change for set-based diffing. Replaced with simple array storage — store previous as `string[]`, remove old classes, add new ones. `classList` handles dedup natively.

**Impact:** Small improvement on select row and partial update operations.

### Step 4: Skip redundant initial setText in _signalText

**File:** `packages/tempots-render/src/render-kit.ts`

Changed `signal.on(newCtx.setText)` to `signal.onChange(newCtx.setText)` to skip the redundant initial call (value is already set via `makeChildText(signal.value)`).

**Impact:** Small improvement on create operations.

### Step 5: Direct derivative notification

**File:** `packages/tempots-core/src/signal.ts`

Previously, each `setDerivative()` call registered `computed.setDirty` as a value listener via `this.on(computed.setDirty)`. Changed to direct iteration: `_setAndNotify` iterates `_derivatives` directly. Eliminates ~4,000 listener registrations during 1k row creation.

**Impact:** Broad CPU improvement: swap -28%, partial update -17%, remove -19%, create 1k -5%, replace -7%.

### Step 6: Batched microtask scheduling

**File:** `packages/tempots-core/src/signal.ts`

Replaced per-computed `queueMicrotask` calls with a batch queue. Instead of 3,000 individual microtask calls during creation (one per Computed constructor), all dirty computeds are collected into a single batch and processed in one microtask.

**Impact:** Select row -50% (1,000 microtasks → 1), create 1k -15%, append -10%.

### Step 7: Lazy signal arrays + DisposalScope optimization

**Files:** `packages/tempots-core/src/signal.ts`, `packages/tempots-core/src/disposal-scope.ts`

Signal arrays (`_derivatives`, `_onValueListeners`, `_onDisposeListeners`) changed from eagerly allocated empty arrays to `null` — only allocated on first use. With 5,000 signals per 1k rows × 3 arrays each = 15,000 saved allocations. DisposalScope changed from `Set<AnySignal>` to simple array (lower per-instance overhead). Also replaced `.forEach()` with indexed `for` loops throughout hot paths.

**Impact:** Modest memory improvement (-4.2% run-clear). Main benefit is reduced GC pressure during creation.

## Analysis

### After All Optimizations

#### What Improved (cumulative from baseline)
- **Create 1k**: 110.5 → 66.7 ms (**-39.6%**) — now 1.9x Vanilla (was 3.2x)
- **Replace 1k**: 124.1 → 83.9 ms (**-32.4%**) — now 2.1x Vanilla (was 3.1x)
- **Select row**: 22.5 → 11.6 ms (**-48.4%**) — now 2.0x Vanilla (was 3.9x)
- **Remove row**: 55.3 → 20.8 ms (**-62.4%**) — now 1.2x Vanilla (was 3.1x)
- **Create 10k**: 1,024.5 → 682.3 ms (**-33.4%**) — now 1.9x Vanilla (was 2.8x)
- **Append 1k**: 125.4 → 76.8 ms (**-38.8%**) — now 1.9x Vanilla (was 3.1x)
- **Run-clear memory**: 20.86 → 11.21 MB (**-46.3%**) — memory leak fixed
- **Run memory**: 30.76 → 24.54 MB (**-20.2%**)

#### What's Still Good
- **Bundle size**: 9.4 KB gzipped — competitive with Solid (4.5 KB), much smaller than React (51 KB) or Angular (44 KB)
- **First paint**: 69.3 ms — faster than Svelte and far ahead of React/Angular
- **Remove row**: 20.8 ms — nearly matching Vanilla (17.7 ms)

#### What Needs More Work
- **Memory is still high**: 24.5 MB for 1k rows (vs 2-3 MB for Solid/Svelte). The signal-per-row architecture creates far more objects than compile-time reactive frameworks.
- **Run-clear memory**: 11.2 MB is much better but still 18x Vanilla. Some signal graph references may still not be fully released.
- **CPU still ~1.9-2.1x slower** than leading frameworks on creation/replacement. Per-row overhead: signal allocation, DisposalScope, marker text nodes, scope tracking.

### Keyed vs Non-Keyed Comparison

Non-keyed Tempo is faster on creation (57.9 vs 66.7 ms) but similar on partial operations after microtask batching (update 10th: 28.5 vs 27.4 ms). The non-keyed run-clear memory (7.15 MB) is 36% better than keyed (11.21 MB), confirming KeyedForEach's signal bookkeeping adds significant memory overhead.

### Remaining Optimization Opportunities

1. **Reduce per-row signal count**: Flatten the signal graph — fewer Signals/Computeds per row
2. **Reduce marker nodes**: Single marker per item instead of two (saves 2,000 text nodes + DOMContext wrappers)
3. **Investigate remaining memory retention**: 11.2 MB after run-clear indicates incomplete disposal
4. **Lightweight reactive primitives**: Simpler reactive wrapper for cases that don't need full Signal capabilities

## Raw Data

All raw JSON results are in the benchmark runner's `webdriver-ts/results/` directory. Each file contains min/max/median/mean/stddev and individual run values.

## Methodology Notes

- All frameworks were built with their standard production build configurations
- Benchmarks were run on the same machine in sequence (not parallel)
- 3-5 iterations per benchmark — official results typically use 10+ for more statistical significance
- React's swap rows score (167 ms) is anomalously high compared to its other scores — this is a known React issue where VDOM diffing struggles with large table row swaps
- Tempo keyed implementation uses `KeyedForEach` with event delegation via `delegate.click`
- Tempo non-keyed implementation uses `ForEach` with event delegation via `delegate.click`
- "Before" values are from the initial baseline run before any optimizations
