# JS Framework Benchmark Results — 2026-02-17

Tempo (keyed + non-keyed) compared against popular frameworks using the [official js-framework-benchmark](https://github.com/krausest/js-framework-benchmark) suite by Stefan Krause.

## Test Environment

- **Machine**: macOS Darwin 25.3.0
- **Node**: v22.21.1
- **Browser**: Chrome 145.0.7632.67 (headless)
- **Runner**: Puppeteer (via js-framework-benchmark webdriver-ts)
- **Iterations**: 5 per benchmark (15 for select row)
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
| Create 1,000 rows | 34.3 | 38.0 | **73.8** | **66.5** |
| Replace 1,000 rows | 38.4 | 44.9 | **83.5** | **18.6** |
| Partial update (every 10th) | 21.7 | 24.5 | **32.3** | **29.4** |
| Select row | 6.7 | 9.8 | **13.4** | **7.4** |
| Swap rows | 26.3 | 29.1 | **41.7** | **25.4** |
| Remove row | 19.3 | 21.3 | **23.7** | **35.9** |
| Create 10,000 rows | 369.7 | 396.7 | **700.7** | **635.0** |
| Append 1,000 rows | 41.6 | 45.9 | **83.5** | **73.7** |
| Clear 1,000 rows | 17.4 | 23.7 | **38.0** | **41.7** |

## Memory Benchmarks (MB, lower is better)

| Benchmark | VanillaJS | Solid | Tempo keyed | Tempo non-keyed |
|-----------|-----------|-------|-------------|-----------------|
| Ready memory | 0.55 | 0.56 | **0.73** | **0.73** |
| Run memory (1k rows) | 2.03 | 2.82 | **21.75** | **20.38** |
| Run-clear memory | 0.62 | 0.74 | **10.61** | **6.68** |

## Bundle Size

| Benchmark | VanillaJS | Solid | Tempo keyed | Tempo non-keyed |
|-----------|-----------|-------|-------------|-----------------|
| Uncompressed (KB) | 11.3 | 11.5 | **27.1** | **27.0** |
| Compressed (KB) | 2.5 | 4.5 | **8.9** | **8.9** |
| First paint (ms) | 45.0 | 52.8 | **70.7** | **64.9** |

## Optimization History

### Baseline → Current (cumulative improvements)

| Benchmark | Baseline | Current | Improvement |
|-----------|----------|---------|-------------|
| Create 1k | 110.5 | 73.8 | **-33.2%** |
| Replace 1k | 124.1 | 83.5 | **-32.7%** |
| Partial update | 37.1 | 32.3 | **-12.9%** |
| Select row | 22.5 | 13.4 | **-40.4%** |
| Swap rows | 40.4 | 41.7 | +3.2% (within noise) |
| Remove row | 55.3 | 23.7 | **-57.1%** |
| Create 10k | 1,024.5 | 700.7 | **-31.6%** |
| Append 1k | 125.4 | 83.5 | **-33.4%** |
| Clear 1k | 57.7 | 38.0 | **-34.1%** |
| Ready mem | 0.71 | 0.73 | +2.8% (within noise) |
| Run mem | 30.76 | 21.75 | **-29.3%** |
| Run-clear mem | 20.86 | 10.61 | **-49.1%** |

### Tempo Keyed vs VanillaJS (slowdown ratio)

| Benchmark | Ratio | Category |
|-----------|-------|----------|
| Create 1k | 2.15x | Good |
| Replace 1k | 2.18x | Good |
| Update 10th | 1.49x | Excellent |
| Select row | 1.99x | Good |
| Swap rows | 1.58x | Excellent |
| Remove row | 1.23x | Excellent |
| Create 10k | 1.90x | Good |
| Append 1k | 2.01x | Good |
| Clear 1k | 2.19x | Good |

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

## Analysis

### CPU Performance

Tempo keyed is approximately **2x VanillaJS** across most operations, which is competitive with many reactive frameworks. Key strengths:
- **Remove row** (1.23x) — bulk removal is nearly native
- **Update 10th** (1.49x) — fine-grained reactivity pays off
- **Swap rows** (1.58x) — keyed reconciliation is efficient

Compared to Solid (the fastest reactive framework), Tempo is roughly 1.5-2x slower on creation/replacement but within the same order of magnitude.

### Memory

Memory remains the biggest gap:
- **Run memory**: 21.75 MB vs 2.03 MB (VanillaJS) / 2.82 MB (Solid) — **~10x overhead**
- **Run-clear memory**: 10.61 MB vs 0.62 MB — significant retention after clearing

The signal-per-row architecture creates substantially more objects than compile-time reactive frameworks. Each row involves:
- 1 `Prop<RowData>` (the item signal)
- 1 `KeyedPosition` instance
- Several text node contexts and marker nodes
- Scope tracking arrays

### Bundle Size

Tempo's bundle at **8.9 KB gzipped** is competitive — nearly 2x Solid (4.5 KB) but far smaller than React (51 KB) or Angular (44 KB). First paint at 70.7 ms is excellent.

### Remaining Optimization Opportunities

1. **Cell primitive**: Lightweight reactive value without full Signal overhead (no dispose tracking, simpler notification)
2. **Structural reactivity**: Reactive records where fields are individually reactive without wrapper signals
3. **Comment node markers**: Currently `makeMarker()` delegates to text nodes; Comment nodes could be cheaper in some engines
4. **Reduce per-row object count**: Flatten signal graph, fewer wrappers per DOM binding

## Raw Data

All raw JSON results are in `demo/js-framework-benchmark/js-framework-benchmark/webdriver-ts/results/`. Each file contains min/max/median/mean/stddev and individual run values.

## Methodology Notes

- All frameworks built with standard production configurations
- Benchmarks run on the same machine in sequence (not parallel)
- 5 iterations per CPU benchmark, 5 for memory, 15 for select row (with warmup)
- Tempo keyed uses `KeyedForEach` with `delegate.click` and `MapText`
- Tempo non-keyed uses `ForEach` with `delegate.click`
- "Baseline" values are from the initial run before any optimizations
- Run on the official js-framework-benchmark suite (submodule at `demo/js-framework-benchmark/js-framework-benchmark/`)
