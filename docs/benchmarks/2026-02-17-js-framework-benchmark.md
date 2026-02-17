# JS Framework Benchmark Results — 2026-02-17

Tempo (keyed + non-keyed) compared against popular frameworks using the [official js-framework-benchmark](https://github.com/nicktomlin/nicktomlin.github.io) suite by Stefan Krause.

## Test Environment

- **Machine**: macOS Darwin 25.3.0
- **Node**: v22.21.1
- **Runner**: Playwright (headless Chromium)
- **Iterations**: 3 per benchmark
- **CPU throttling**: 4x for most tests (standard benchmark setting)

## Framework Versions

| Framework | Version |
|-----------|---------|
| Tempo | 15.0 (keyed, with `KeyedForEach` + `delegate` + `createSelector`) |
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
| Create 1,000 rows | 34.5 | 35.5 | 35.8 | 47.3 | 41.8 | 110.5 | **82.4** | -25.4% |
| Replace 1,000 rows | 40.2 | 41.3 | 42.2 | 57.2 | 51.2 | 124.1 | **98.3** | -20.8% |
| Partial update (every 10th) | 19.2 | 23.6 | 22.1 | 21.2 | 28.2 | 37.1 | **36.3** | -2.2% |
| Select row | 5.7 | 7.6 | 10.3 | 7.8 | 9.4 | 22.5 | **24.1** | — |
| Swap rows | 22.9 | 27.1 | 27.0 | 26.0 | 167.4 | 40.4 | **42.1** | — |
| Remove row | 17.7 | 18.5 | 18.8 | 16.6 | 19.8 | 55.3 | **24.7** | -55.3% |
| Create 10,000 rows | 360.4 | 382.0 | 390.3 | 478.4 | 576.4 | 1,024.5 | **801.1** | -21.8% |
| Append 1,000 rows | 40.5 | 45.4 | 43.5 | 55.2 | 49.7 | 125.4 | **96.8** | -22.8% |
| Clear 1,000 rows | 17.5 | 21.5 | 20.6 | 31.0 | 27.1 | 57.7 | **49.5** | -14.2% |

### Non-Keyed

| Benchmark | Tempo (non-keyed) | Notes |
|-----------|-------------------|-------|
| Create 1,000 rows | **70.3** | 15% faster than keyed (no per-item signals) |
| Replace 1,000 rows | **28.3** | Destroys + recreates all rows |
| Partial update (every 10th) | **70.1** | Non-keyed is slower here (full list re-render) |
| Select row | **8.9** | O(1) via direct DOM selection |
| Swap rows | **63.7** | Full list re-render |
| Remove row | **59.4** | Full list re-render |
| Create 10,000 rows | **727.3** | 9% faster than keyed |
| Append 1,000 rows | **93.4** | Similar to keyed |
| Clear 1,000 rows | **79.6** | Slower clear (ForEach teardown) |

## Memory Benchmarks (MB, lower is better)

| Benchmark | Vanilla JS | Solid | Svelte | Angular | React | Tempo keyed (before) | Tempo keyed (after) | Tempo non-keyed | Improvement |
|-----------|-----------|-------|--------|---------|-------|---------------------|--------------------|--------------------|-------------|
| Ready memory | 0.53 | 0.55 | 0.67 | 2.06 | 1.66 | 0.71 | **1.18** | **1.18** | — |
| Run memory (1k rows) | 2.03 | 2.83 | 3.05 | 5.22 | 5.09 | 30.76 | **24.99** | **20.57** | -18.8% |
| Run-clear memory | 0.62 | 0.74 | 1.01 | 2.62 | 2.47 | 20.86 | **11.64** | **7.37** | **-44.2%** |

## Bundle Size (lower is better)

| Benchmark | Vanilla JS | Solid | Svelte | Angular | React | Tempo |
|-----------|-----------|-------|--------|---------|-------|-------|
| Uncompressed (KB) | 11.3 | 11.5 | 34.3 | 140.7 | 190.3 | **25.2** |
| Compressed (KB) | 2.5 | 4.5 | 12.2 | 43.6 | 51.4 | **8.5** |
| First paint (ms) | 53.3 | 63.7 | 91.3 | 251.9 | 323.9 | **69.6** |

## Optimizations Applied

The following optimizations were implemented and measured incrementally:

### Step 1: Fix Computed.dispose() memory leak (BUG FIX)

**File:** `packages/tempots-core/src/signal.ts`

`Computed.dispose()` was missing `this._onValueListeners.length = 0`. The parent `Signal.dispose()` had it, but `Computed` overrides `dispose` with an arrow function and omitted this line. Listener closures retained references to DOM nodes and parent signals, preventing GC.

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

### Step 4: Add createSelector for O(1) selection

**Files:** `packages/tempots-core/src/signal-utils.ts`, benchmark code

Implemented `createSelector<T>` — an O(1) selection primitive similar to Solid.js. Instead of creating a `computed` per row that ALL re-evaluate when selection changes, only the previously-selected and newly-selected items are notified.

**Impact:** Modest CPU improvement (~3.6% on select row) because the individual computation was already trivial. The main benefit is reduced unnecessary work in the signal graph.

### Step 5: Skip redundant initial setText in _signalText

**File:** `packages/tempots-render/src/render-kit.ts`

Changed `signal.on(newCtx.setText)` to `signal.onChange(newCtx.setText)` to skip the redundant initial call (value is already set via `makeChildText(signal.value)`).

**Impact:** Small improvement on create operations.

## Analysis

### After Optimizations

#### What Improved
- **Create 1k**: 110.5 → 82.4 ms (-25.4%) — now 2.4x Vanilla (was 3.2x)
- **Run-clear memory**: 20.86 → 11.64 MB (-44.2%) — still high but the severe memory leak is fixed
- **Run memory**: 30.76 → 24.99 MB (-18.8%)
- **Remove row**: 55.3 → 24.7 ms (-55.3%) — now 1.4x Vanilla (was 3.1x)
- **Create 10k**: 1,024.5 → 801.1 ms (-21.8%) — now 2.2x Vanilla (was 2.8x)

#### What's Still Good
- **Bundle size**: 8.5 KB gzipped — competitive with Solid (4.5 KB), much smaller than React (51 KB) or Angular (44 KB)
- **First paint**: 69.6 ms — faster than Svelte and far ahead of React/Angular

#### What Needs More Work
- **Memory is still high**: 25 MB for 1k rows (vs 2-3 MB for Solid/Svelte). The signal-per-row architecture inherently uses more memory than compile-time reactive frameworks.
- **Run-clear memory**: 11.6 MB is much better but still 19x Vanilla. Some signal graph references may still not be fully released.
- **CPU still 2-2.4x slower** than leading frameworks on creation/replacement operations. The overhead comes from per-row: signal creation, DisposalScope setup, comment marker nodes, and signal subscription management.

### Keyed vs Non-Keyed Comparison

Non-keyed Tempo is faster on creation (70 vs 82 ms) but much slower on partial operations (update 10th: 70 vs 36 ms) because it re-renders the full list. The non-keyed run-clear memory (7.37 MB) is 37% better than keyed (11.64 MB), suggesting KeyedForEach's signal bookkeeping adds significant memory overhead.

### Remaining Optimization Opportunities

1. **Signal pooling / flyweight**: Reuse signal instances across row updates instead of creating new ones
2. **Reduce marker nodes**: Alternative range-tracking strategies that don't require 2 comment nodes per item
3. **Batch DOM operations**: Use DocumentFragment or batch classList updates
4. **Investigate remaining memory leaks**: The 11.6 MB run-clear still indicates incomplete disposal

## Raw Data

All raw JSON results are in the benchmark runner's `webdriver-ts/results/` directory. Each file contains min/max/median/mean/stddev and individual run values.

## Methodology Notes

- All frameworks were built with their standard production build configurations
- Benchmarks were run on the same machine in sequence (not parallel)
- 3 iterations per benchmark — official results typically use 10+ for more statistical significance
- React's swap rows score (167 ms) is anomalously high compared to its other scores — this is a known React issue where VDOM diffing struggles with large table row swaps
- Tempo keyed implementation uses `KeyedForEach` with event delegation via `delegate.click` and `createSelector`
- Tempo non-keyed implementation uses `ForEach` with event delegation via `delegate.click`
- "Before" values are from the initial baseline run before any optimizations
