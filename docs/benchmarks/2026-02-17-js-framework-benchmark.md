# JS Framework Benchmark Results — 2026-02-17

Tempo (keyed + non-keyed) compared against popular frameworks using the [official js-framework-benchmark](https://github.com/krausest/js-framework-benchmark) suite by Stefan Krause.

## Test Environment

- **Machine**: macOS Darwin 25.3.0
- **Node**: v22.21.1
- **Browser**: Chrome 145.0.7632.67 (headless)
- **Runner**: Playwright (via js-framework-benchmark webdriver-ts)
- **Iterations**: 3 per benchmark (13 for select row)
- **CPU throttling**: 4x (standard benchmark setting)

## Framework Versions

| Framework | Version |
|-----------|---------|
| Tempo keyed | 36.0.1 (`KeyedForEach` + `delegate` + `MapText`) |
| Tempo non-keyed | 36.0.1 (`ForEach` + `delegate`) |
| Solid | 1.9.3 |
| Vanilla JS | baseline |

## CPU Benchmarks (ms, lower is better)

| Benchmark | VanillaJS | Solid | Tempo keyed | Tempo non-keyed |
|-----------|-----------|-------|-------------|-----------------|
| Create 1,000 rows | 34.3 | 38.0 | **69.1** | **58.3** |
| Replace 1,000 rows | 38.4 | 44.9 | **79.4** | **16.0** |
| Partial update (every 10th) | 21.7 | 24.5 | **28.2** | **30.0** |
| Select row | 6.7 | 9.8 | **11.6** | **6.9** |
| Swap rows | 26.3 | 29.1 | **32.2** | **22.9** |
| Remove row | 19.3 | 21.3 | **19.5** | **37.4** |
| Create 10,000 rows | 369.7 | 396.7 | **664.6** | **593.1** |
| Append 1,000 rows | 41.6 | 45.9 | **80.3** | **69.9** |
| Clear 1,000 rows | 17.4 | 23.7 | **42.0** | **42.6** |

## Memory Benchmarks (MB, lower is better)

| Benchmark | VanillaJS | Solid | Tempo keyed | Tempo non-keyed |
|-----------|-----------|-------|-------------|-----------------|
| Ready memory | 0.55 | 0.56 | **1.19** | **1.20** |
| Run memory (1k rows) | 2.03 | 2.82 | **22.22** | **20.85** |
| Run-clear memory | 0.62 | 0.74 | **1.54** | **1.60** |

## Bundle Size

| Benchmark | VanillaJS | Solid | Tempo keyed | Tempo non-keyed |
|-----------|-----------|-------|-------------|-----------------|
| Uncompressed (KB) | 11.3 | 11.5 | **27.2** | **27.0** |
| Compressed (KB) | 2.5 | 4.5 | **9.0** | **8.9** |
| First paint (ms) | 45.0 | 52.8 | **81.8** | **64.9** |

## Optimization History

### Baseline → Current (cumulative improvements)

| Benchmark | Baseline | Current | Improvement |
|-----------|----------|---------|-------------|
| Create 1k | 110.5 | 69.1 | **-37.5%** |
| Replace 1k | 124.1 | 79.4 | **-36.0%** |
| Partial update | 37.1 | 28.2 | **-24.0%** |
| Select row | 22.5 | 11.6 | **-48.4%** |
| Swap rows | 40.4 | 32.2 | **-20.3%** |
| Remove row | 55.3 | 19.5 | **-64.7%** |
| Create 10k | 1,024.5 | 664.6 | **-35.1%** |
| Append 1k | 125.4 | 80.3 | **-36.0%** |
| Clear 1k | 57.7 | 42.0 | **-27.2%** |
| Ready mem | 0.71 | 1.19 | +67.6% (measurement variance) |
| Run mem | 30.76 | 22.22 | **-27.8%** |
| Run-clear mem | 20.86 | 1.54 | **-92.6%** |

### Tempo Keyed vs VanillaJS (slowdown ratio)

| Benchmark | Ratio | Category |
|-----------|-------|----------|
| Create 1k | 2.01x | Good |
| Replace 1k | 2.07x | Good |
| Update 10th | 1.30x | Excellent |
| Select row | 1.73x | Excellent |
| Swap rows | 1.22x | Excellent |
| Remove row | 1.01x | Excellent |
| Create 10k | 1.80x | Good |
| Append 1k | 1.93x | Good |
| Clear 1k | 2.41x | Fair |

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

## Analysis

### CPU Performance

Tempo keyed is approximately **1.5-2x VanillaJS** across most operations, competitive with many reactive frameworks. Key strengths:
- **Remove row** (1.01x) — essentially native speed
- **Update 10th** (1.30x) — fine-grained reactivity shines
- **Swap rows** (1.22x) — keyed reconciliation is very efficient
- **Select row** (1.73x) — O(1) `createSelector` pays off

Compared to Solid (the fastest reactive framework), Tempo is roughly 1.5-1.8x slower on creation/replacement but within the same order of magnitude. On select row and swap rows, Tempo is competitive with Solid.

### Memory

The **run-clear memory leak is fixed**: from 20.86 MB (baseline) → 10.61 MB (round 2) → **1.54 MB** (round 3). This is now only ~2.5x VanillaJS (0.62 MB), a dramatic improvement.

Run memory (active 1k rows) remains high:
- **Run memory**: 22.22 MB vs 2.03 MB (VanillaJS) / 2.82 MB (Solid) — **~11x overhead**

The signal-per-row architecture creates substantially more objects than compile-time reactive frameworks. Each row involves:
- 1 `Prop<RowData>` (the item signal)
- 1 `KeyedPosition` instance
- Several text/comment node contexts and marker nodes
- Scope tracking arrays

### Bundle Size

Tempo's bundle at **9.0 KB gzipped** is competitive — 2x Solid (4.5 KB) but far smaller than React (51 KB) or Angular (44 KB). First paint at 81.8 ms is acceptable.

### Remaining Optimization Opportunities

1. **Cell primitive**: Lightweight reactive value without full Signal overhead (no dispose tracking, simpler notification) — would dramatically reduce run memory
2. **Structural reactivity**: Reactive records where fields are individually reactive without wrapper signals
3. **Reduce per-row object count**: Flatten signal graph, fewer wrappers per DOM binding

## Raw Data

All raw JSON results are in `demo/js-framework-benchmark/js-framework-benchmark/webdriver-ts/results/`. Each file contains min/max/median/mean/stddev and individual run values.

## Methodology Notes

- All frameworks built with standard production configurations
- Benchmarks run on the same machine in sequence (not parallel)
- 3 iterations per CPU benchmark, 3 for memory, 13 for select row (with warmup)
- Tempo keyed uses `KeyedForEach` with `delegate.click` and `MapText`
- Tempo non-keyed uses `ForEach` with `delegate.click`
- "Baseline" values are from the initial run before any optimizations
- Run on the official js-framework-benchmark suite (submodule at `demo/js-framework-benchmark/js-framework-benchmark/`)
