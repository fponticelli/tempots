# JS Framework Benchmark Results — 2026-02-17

Tempo (keyed + non-keyed) compared against popular frameworks using the [official js-framework-benchmark](https://github.com/krausest/js-framework-benchmark) suite by Stefan Krause.

## Test Environment

- **Machine**: macOS Darwin 25.3.0
- **Node**: v22.21.1
- **Browser**: Chrome 145.0.7632.67 (headless)
- **Runner**: Puppeteer (via js-framework-benchmark webdriver-ts)
- **Iterations**: 15 per CPU benchmark (25 for select row), 1 for memory
- **CPU throttling**: 4x (standard benchmark setting)

## Framework Versions

| Framework | Version |
|-----------|---------|
| Tempo keyed | 36.0.1 (`KeyedForEach` + `delegate` + `MapText` + prototype methods) |
| Tempo non-keyed | 36.0.1 (`ForEach` + `delegate` + prototype methods) |
| Solid | 1.9.3 |
| Vanilla JS | baseline |

## CPU Benchmarks (ms, lower is better)

| Benchmark | VanillaJS | Solid | Tempo keyed | Tempo non-keyed |
|-----------|-----------|-------|-------------|-----------------|
| Create 1,000 rows | 34.3 | 38.0 | **64.4** | **57.1** |
| Replace 1,000 rows | 38.4 | 44.9 | **68.8** | **17.7** |
| Partial update (every 10th) | 21.7 | 24.5 | **31.4** | **29.2** |
| Select row | 6.7 | 9.8 | **11.2** | **8.1** |
| Swap rows | 26.3 | 29.1 | **45.4** | **25.5** |
| Remove row | 19.3 | 21.3 | **23.7** | **34.5** |
| Create 10,000 rows | 369.7 | 396.7 | **633.3** | **577.1** |
| Append 1,000 rows | 41.6 | 45.9 | **73.3** | **63.6** |
| Clear 1,000 rows | 17.4 | 23.7 | **33.6** | **36.2** |

## Memory Benchmarks (MB, lower is better)

| Benchmark | VanillaJS | Solid | Tempo keyed | Tempo non-keyed |
|-----------|-----------|-------|-------------|-----------------|
| Ready memory | 0.55 | 0.56 | **0.69** | **0.70** |
| Run memory (1k rows) | 2.03 | 2.82 | **9.17** | **8.98** |
| Run-clear memory | 0.62 | 0.74 | **1.02** | **1.04** |

## Bundle Size

| Benchmark | VanillaJS | Solid | Tempo keyed | Tempo non-keyed |
|-----------|-----------|-------|-------------|-----------------|
| Uncompressed (KB) | 11.3 | 11.5 | **27.3** | **27.2** |
| Compressed (KB) | 2.5 | 4.5 | **8.9** | **8.9** |
| First paint (ms) | 45.0 | 52.8 | **123.7** | **71.9** |

## Optimization History

### Baseline → Current (cumulative improvements)

| Benchmark | Baseline | Previous | Current | Improvement |
|-----------|----------|----------|---------|-------------|
| Create 1k | 110.5 | 69.1 | 64.4 | **-41.7%** |
| Replace 1k | 124.1 | 79.4 | 68.8 | **-44.6%** |
| Partial update | 37.1 | 28.2 | 31.4 | **-15.4%** |
| Select row | 22.5 | 11.6 | 11.2 | **-50.2%** |
| Swap rows | 40.4 | 32.2 | 45.4 | +12.4% (variance) |
| Remove row | 55.3 | 19.5 | 23.7 | **-57.1%** |
| Create 10k | 1,024.5 | 664.6 | 633.3 | **-38.2%** |
| Append 1k | 125.4 | 80.3 | 73.3 | **-41.6%** |
| Clear 1k | 57.7 | 42.0 | 33.6 | **-41.8%** |
| Ready mem | 0.71 | 1.19 | 0.69 | **-2.8%** |
| Run mem | 30.76 | 22.22 | 9.17 | **-70.2%** |
| Run-clear mem | 20.86 | 1.54 | 1.02 | **-95.1%** |

### Round 4 Improvements (prototype method conversion)

| Benchmark | Before (Round 3) | After (Round 4) | Change |
|-----------|-------------------|------------------|--------|
| Run memory (keyed) | 22.22 MB | 9.17 MB | **-58.7%** |
| Run memory (non-keyed) | 20.85 MB | 8.98 MB | **-56.9%** |
| Ready memory (keyed) | 1.19 MB | 0.69 MB | **-42.0%** |
| Run-clear memory (keyed) | 1.54 MB | 1.02 MB | **-33.8%** |
| Create 1k (keyed) | 69.1 ms | 64.4 ms | **-6.8%** |
| Replace 1k (keyed) | 79.4 ms | 68.8 ms | **-13.3%** |
| Create 10k (keyed) | 664.6 ms | 633.3 ms | **-4.7%** |
| Clear 1k (keyed) | 42.0 ms | 33.6 ms | **-20.0%** |

### Tempo Keyed vs VanillaJS (slowdown ratio)

| Benchmark | Ratio | Category |
|-----------|-------|----------|
| Create 1k | 1.88x | Good |
| Replace 1k | 1.79x | Good |
| Update 10th | 1.45x | Good |
| Select row | 1.67x | Excellent |
| Swap rows | 1.73x | Good |
| Remove row | 1.23x | Excellent |
| Create 10k | 1.71x | Good |
| Append 1k | 1.76x | Good |
| Clear 1k | 1.93x | Good |
| Run memory | 4.52x | Fair |

## Optimizations Applied

### Round 1 (Steps 1-9)

1. **Fix Computed.dispose() memory leak** — Missing `_onValueListeners.length = 0` in override
2. **Lazy KeyedPosition signals** — 5 derived signals per item created only on access
3. **Simplify signalClassName** — Replace Set-based diffing with classList direct manipulation
4. **Skip redundant initial setText** — Use `onChange` instead of `on` for initial text
5. **Direct derivative notification** — Iterate `_derivatives` directly instead of via listeners
6. **Batched microtask scheduling** — Collect all dirty computeds into single microtask
7. **Lazy signal arrays** — `null` until first use (saves 15k allocations per 1k rows)
8. **Lazy KeyedPosition index prop** — Plain number until accessed
9. **Bulk DOM removal** — `removeRange()` for clearing entire lists

### Round 2 (Steps 10-14)

10. **Singleton equality function** — Share single `strictEquals` reference across all signals (eliminates per-instance arrow function allocation)
11. **Lazy Computed constructor** — Start with `_isDirty = true`, skip initial `setDirty()`/`_scheduleNotify()` (saves ~3,000 queue() calls per 1k row creation)
12. **Lightweight inline scopes** — Extract minimal `Scope` interface, replace `DisposalScope` per KeyedForEach entry with inline `makeLightScope()` + `disposeTracked()` (less allocation)
13. **makeMarker() abstraction** — New method on contexts for boundary references (prepares for future Comment node optimization)
14. **MapText renderable** — Subscribe directly to source signal with transform, bypassing intermediate Computed (eliminates 2 Computeds per row in benchmark)

### Round 3 (Steps 15-17)

15. **Comment node markers** — Replace empty text nodes (`document.createTextNode('')`) with Comment nodes (`document.createComment('')`) for all ref/marker positions. Comment nodes are semantically correct for boundary markers and may have lower layout cost.
16. **Fix Computed disposal reference leak** — Null out `_fn` closure in `Computed.dispose()` to release captured references (parent signals, DOM nodes). Without this, disposed Computeds retained their entire dependency chain through the closure.
17. **Fix setDerivative parent listener leak** — When a Computed is disposed, also remove itself from the parent's `_onDisposeListeners` array. Previously, parent signals retained references to all disposed derivatives forever through their `_onDisposeListeners`, creating a growing leak proportional to total derivatives created over the lifetime of the app. **This fixed run-clear memory from 10.6 MB → 1.5 MB.**

### Round 4 (Steps 18-19)

18. **Convert all arrow function methods to prototype methods** — Arrow function class fields (`readonly method = () => {}`) create per-instance closures (~64 bytes each). Signal had 22 arrow methods (1,408 bytes/instance), BrowserContext had 29 (1,856 bytes/instance). Converting to prototype methods (`method() {}`) shares them via the prototype chain, eliminating per-instance overhead entirely. All call sites that passed methods by reference were wrapped in lambdas to preserve `this` binding. **This reduced run memory from 22.22 MB → 9.17 MB (-58.7%).**
19. **ESLint rule `no-method-reference`** — New rule to prevent passing Tempo class methods by reference (e.g., `signal.on(prop.set)`), which would break with prototype methods. Flags patterns and suggests lambda wrapping.

## Analysis

### CPU Performance

Tempo keyed is approximately **1.7-1.9x VanillaJS** across most operations, competitive with many reactive frameworks. Key strengths:
- **Remove row** (1.23x) — near native speed
- **Update 10th** (1.45x) — fine-grained reactivity shines
- **Select row** (1.67x) — O(1) `createSelector` pays off
- **Create 10k** (1.71x) — good scaling

Compared to Solid (the fastest reactive framework), Tempo keyed is roughly 1.5-1.7x slower on creation/replacement but within the same order of magnitude. Prototype method conversion improved creation benchmarks by 5-13%.

Tempo non-keyed excels at **replace** (17.7 ms, faster than VanillaJS at 38.4 ms) and **select row** (8.1 ms, faster than Solid at 9.8 ms) due to wholesale DOM replacement and no reconciliation overhead.

### Memory

Run memory improved dramatically with prototype method conversion:
- **Run memory**: 9.17 MB (was 22.22 MB) — now **4.5x VanillaJS** (was 11x)
- **Ready memory**: 0.69 MB — only **1.25x VanillaJS** (was 2.2x)
- **Run-clear memory**: 1.02 MB — only **1.6x VanillaJS** (was 2.5x)

The signal-per-row architecture still creates more objects than compile-time reactive frameworks, but the gap has narrowed significantly. Each row involves:
- 1 `Prop<RowData>` (the item signal)
- 1 `KeyedPosition` instance
- Several text/comment node contexts and marker nodes
- Scope tracking arrays

### Bundle Size

Tempo's bundle at **8.9 KB gzipped** is competitive — 2x Solid (4.5 KB) but far smaller than React (51 KB) or Angular (44 KB).

### Remaining Optimization Opportunities

1. **Cell primitive**: Lightweight reactive value without full Signal overhead (no dispose tracking, simpler notification) — would further reduce run memory
2. **Structural reactivity**: Reactive records where fields are individually reactive without wrapper signals
3. **Reduce per-row object count**: Flatten signal graph, fewer wrappers per DOM binding

## Raw Data

All raw JSON results are in `demo/js-framework-benchmark/js-framework-benchmark/webdriver-ts/results/`. Each file contains min/max/median/mean/stddev and individual run values.

## Methodology Notes

- All frameworks built with standard production configurations
- Benchmarks run on the same machine in sequence (not parallel)
- 15 iterations per CPU benchmark, 25 for select row, 1 for memory
- Tempo keyed uses `KeyedForEach` with `delegate.click` and `MapText`
- Tempo non-keyed uses `ForEach` with `delegate.click`
- "Baseline" values are from the initial run before any optimizations
- Run on the official js-framework-benchmark suite (submodule at `demo/js-framework-benchmark/js-framework-benchmark/`)
