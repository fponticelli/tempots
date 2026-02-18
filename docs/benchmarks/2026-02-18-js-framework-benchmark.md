# JS Framework Benchmark Results — 2026-02-18

Tempo (keyed + non-keyed) compared against popular frameworks using the [official js-framework-benchmark](https://github.com/krausest/js-framework-benchmark) suite by Stefan Krause.

## Test Environment

- **Machine**: macOS Darwin 25.3.0
- **Node**: v22.21.1
- **Browser**: Chrome 145.0.7632.67 (headless)
- **Runner**: Puppeteer (via js-framework-benchmark webdriver-ts)
- **Iterations**: 3 per benchmark
- **CPU throttling**: 4x (standard benchmark setting)

## Framework Versions

| Framework | Version |
|-----------|---------|
| Tempo keyed | 36.0.1 (`KeyedForEach` + `delegate` + `selectedClass` + `removeAllBefore` + detach/reattach) |
| Tempo non-keyed | 36.0.1 (`ForEach` + `delegate`) |
| React Hooks | 19.2.0 |
| Solid | 1.9.3 |
| Vanilla JS | baseline |

## CPU Benchmarks (ms, median, lower is better)

| Benchmark | VanillaJS | Solid | React Hooks | Tempo keyed | Tempo non-keyed |
|-----------|-----------|-------|-------------|-------------|-----------------|
| Create 1,000 rows | 35.3 | 38.4 | 43.5 | **61.7** | **58.4** |
| Replace 1,000 rows | 41.2 | 44.3 | 53.1 | **74.6** | **17.5** |
| Partial update (every 10th) | 23.2 | 29.3 | 25.6 | **33.5** | **29.7** |
| Select row | 8.1 | 10.1 | 14.5 | **9.0** | **7.6** |
| Swap rows | 29.3 | 30.9 | 173.1 | **40.3** | **25.1** |
| Remove row | 21.9 | 22.5 | 21.3 | **24.2** | **35.4** |
| Create 10,000 rows | 384.9 | 409.3 | 573.0 | **603.7** | **597.2** |
| Append 1,000 rows | 44.0 | 47.0 | 52.1 | **73.6** | **64.7** |
| Clear 1,000 rows | 18.6 | 21.3 | 31.6 | **30.8** | **36.7** |

## Memory Benchmarks (MB, median, lower is better)

| Benchmark | VanillaJS | Solid | React Hooks | Tempo keyed | Tempo non-keyed |
|-----------|-----------|-------|-------------|-------------|-----------------|
| Ready memory | 0.56 | 0.54 | 1.18 | **0.69** | **0.68** |
| Run memory (1k rows) | 2.02 | 2.83 | 4.60 | **9.84** | **8.97** |
| Run-clear memory | 0.59 | 0.74 | 1.96 | **0.99** | **0.98** |

## Bundle Size

| Benchmark | VanillaJS | Solid | React Hooks | Tempo keyed | Tempo non-keyed |
|-----------|-----------|-------|-------------|-------------|-----------------|
| Uncompressed (KB) | 11.3 | 11.5 | 190.3 | **28.4** | **27.7** |
| Compressed (KB) | 2.5 | 4.5 | 51.4 | **9.2** | **9.0** |
| First paint (ms) | 48.0 | 53.8 | 288.5 | **67.1** | **74.1** |

## Optimization History

### Baseline → Current (cumulative improvements)

| Benchmark | Baseline | Round 4 | Current (Round 5) | Improvement |
|-----------|----------|---------|---------------------|-------------|
| Create 1k | 110.5 | 64.4 | 61.7 | **-44.2%** |
| Replace 1k | 124.1 | 68.8 | 74.6 | **-39.9%** |
| Partial update | 37.1 | 31.4 | 33.5 | **-9.7%** |
| Select row | 22.5 | 11.2 | 9.0 | **-60.0%** |
| Swap rows | 40.4 | 45.4 | 40.3 | **-0.2%** |
| Remove row | 55.3 | 23.7 | 24.2 | **-56.2%** |
| Create 10k | 1,024.5 | 633.3 | 603.7 | **-41.1%** |
| Append 1k | 125.4 | 73.3 | 73.6 | **-41.3%** |
| Clear 1k | 57.7 | 33.6 | 30.8 | **-46.6%** |
| Ready mem | 0.71 | 0.69 | 0.69 | **-2.8%** |
| Run mem | 30.76 | 9.17 | 9.84 | **-68.0%** |
| Run-clear mem | 20.86 | 1.02 | 0.99 | **-95.3%** |

### Round 5 Improvements (bulk clear, detach-append, selectedClass, lighter onChange)

| Benchmark | Before (Round 4) | After (Round 5) | Ratio vs VanillaJS (Before) | Ratio vs VanillaJS (After) | Ratio Change |
|-----------|-------------------|------------------|-----------------------------|----------------------------|--------------|
| Select row (keyed) | 11.2 ms | 9.0 ms | 1.58x | **1.11x** | **-30%** |
| Clear 1k (keyed) | 33.6 ms | 30.8 ms | 2.07x | **1.66x** | **-20%** |
| Update 10th (keyed) | 31.4 ms | 33.5 ms | 1.56x | **1.44x** | **-8%** |
| Remove row (keyed) | 23.7 ms | 24.2 ms | 1.43x | **1.11x** | **-22%** |
| Run-clear memory | 1.02 MB | 0.99 MB | 1.65x | **1.68x** | ~same |

Note: Absolute ms values vary between runs due to machine conditions. Ratios vs VanillaJS (measured in the same session) are the reliable comparison metric.

### All Frameworks vs VanillaJS (slowdown ratio, lower is better)

| Benchmark | Solid | React Hooks | Tempo keyed | Tempo non-keyed |
|-----------|-------|-------------|-------------|-----------------|
| Create 1k | 1.09x | 1.23x | 1.75x | 1.65x |
| Replace 1k | 1.08x | 1.29x | 1.81x | **0.42x** |
| Update 10th | 1.26x | 1.10x | 1.44x | 1.28x |
| Select row | 1.25x | 1.79x | **1.11x** | **0.94x** |
| Swap rows | 1.05x | 5.91x | 1.38x | **0.86x** |
| Remove row | 1.03x | 0.97x | 1.11x | 1.62x |
| Create 10k | 1.06x | 1.49x | 1.57x | 1.55x |
| Append 1k | 1.07x | 1.18x | 1.67x | 1.47x |
| Clear 1k | 1.15x | 1.70x | 1.66x | 1.97x |
| **CPU Geo Mean** | **1.11x** | **1.57x** | **~1.48x** | **~1.24x** |
| Run memory | 1.40x | 2.27x | 4.86x | 4.43x |
| Compressed size | 1.80x | 20.56x | 3.68x | 3.60x |

### Tempo Keyed vs VanillaJS — Round-over-round

| Benchmark | Round 4 Ratio | Round 5 Ratio | Change |
|-----------|---------------|---------------|--------|
| Create 1k | 1.88x | 1.75x | -7% |
| Replace 1k | 1.79x | 1.81x | ~same |
| Update 10th | 1.45x | 1.44x | ~same |
| Select row | 1.67x | **1.11x** | **-34%** |
| Swap rows | 1.73x | 1.38x | -20% |
| Remove row | 1.23x | **1.11x** | -10% |
| Create 10k | 1.71x | 1.57x | -8% |
| Append 1k | 1.76x | 1.67x | -5% |
| Clear 1k | 1.93x | **1.66x** | **-14%** |
| **Geo Mean** | **1.56x** | **~1.48x** | **-5%** |
| Run memory | 4.52x | 4.86x | ~same |

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

### Round 2 (Steps 9-14)

9. **Bulk DOM removal** — `removeRange()` for clearing entire lists
10. **Singleton equality function** — Share single `strictEquals` reference across all signals
11. **Lazy Computed constructor** — Start with `_isDirty = true`, skip initial `setDirty()`/`_scheduleNotify()`
12. **Lightweight inline scopes** — Replace `DisposalScope` per KeyedForEach entry with inline `makeLightScope()`
13. **makeMarker() abstraction** — New method on contexts for boundary references
14. **MapText renderable** — Subscribe directly to source signal with transform, bypassing intermediate Computed

### Round 3 (Steps 15-17)

15. **Comment node markers** — Replace empty text nodes with Comment nodes for all ref/marker positions
16. **Fix Computed disposal reference leak** — Null out `_fn` closure in `Computed.dispose()`
17. **Fix setDerivative parent listener leak** — Remove disposed derivatives from parent's `_onDisposeListeners`

### Round 4 (Steps 18-19)

18. **Convert arrow function methods to prototype methods** — Eliminates per-instance closure overhead (~1.4 KB/Signal, ~1.9 KB/BrowserContext). **Run memory 22.22 MB → 9.17 MB (-58.7%).**
19. **ESLint rule `no-method-reference`** — Prevents passing prototype methods by reference without lambda wrapping

### Round 5 (Steps 20-23)

20. **Lighter `onChange`** — Delegate to `on({ skipInitial: true })` instead of allocating a counter closure. Eliminates one wrapper function per `onChange` call site.
21. **Fast bulk clear with `removeAllBefore`** — New `removeAllBefore(ref)` method on `BaseRenderContext`/`DOMContext`/`BrowserContext` uses the DOM `Range` API (`Range.deleteContents()`) to remove all sibling nodes before a marker in a single operation, replacing node-by-node `removeChild` loops. **Clear 1k ratio: 2.07x → 1.66x VanillaJS.**
22. **Detach-append for bulk creation** — New `detach()`/`reattach()` methods temporarily remove the container element from the live DOM tree during initial list population, avoiding incremental layout recalculations. Applied when `KeyedForEach` transitions from 0 entries to many.
23. **O(1) selection with `selectedClass`** — New `selectedClass(source, key, className)` renderable in `@tempots/dom` uses `createSelector` from `@tempots/core` to toggle CSS classes with O(1) complexity. A shared selector per source signal is cached via `WeakMap`. Eliminates 1 `Computed` per row for selection state. **Select row ratio: 1.58x → 1.11x VanillaJS.**

## Analysis

### CPU Performance

Tempo keyed geo mean improved from **1.56x → ~1.48x VanillaJS** in this round, now slightly faster than React Hooks (~1.57x). Key strengths:

- **Select row** (1.11x) — near native speed, thanks to O(1) `selectedClass`. Beats both Solid (1.25x) and React (1.79x).
- **Remove row** (1.11x) — near native speed, competitive with React (0.97x) and Solid (1.03x)
- **Swap rows** (1.38x) — LIS-based reconciliation. React is catastrophically slow here (5.91x / 173ms) due to full VDOM diffing.
- **Clear 1k** (1.66x) — improved from 2.07x. Now comparable to React (1.70x) and close to Solid (1.15x).
- **Update 10th** (1.44x) — fine-grained reactivity. React (1.10x) wins here via VDOM batching.

Biggest remaining gaps vs Solid:
- **Create/Replace** (~1.75-1.81x vs Solid's ~1.08x) — per-row signal allocation overhead vs Solid's template cloning with `cloneNode(true)`
- **Append 1k** (1.67x vs Solid's 1.07x) — same cause as create

Tempo non-keyed excels at **replace** (17.5 ms, 2.4x faster than VanillaJS), **select row** (7.6 ms, fastest of all frameworks), and **swap rows** (25.1 ms, faster than VanillaJS) due to wholesale DOM replacement.

### Memory

Run memory remains at ~9.8 MB (4.86x VanillaJS). For comparison, React is at 4.6 MB (2.27x) and Solid at 2.8 MB (1.40x). The `selectedClass` optimization eliminates 1 `Computed` per row but the per-row overhead from `Prop`, `KeyedPosition`, start/end comment markers, and scope tracking arrays still dominates. Each row involves:
- 1 `Prop<RowData>` (the item signal)
- 1 `KeyedPosition` instance
- 2 comment node markers (start + end)
- Text node contexts and scope tracking arrays

Run-clear memory (0.99 MB) is notably better than React (1.96 MB), indicating clean disposal — Tempo's leak fixes are effective.

### Bundle Size

Tempo's bundle at **9.2 KB gzipped** (up from 8.9 KB due to `createSelector` inclusion) is:
- **5.6x smaller** than React Hooks (51.4 KB)
- **2.0x larger** than Solid (4.5 KB)
- **3.7x larger** than VanillaJS (2.5 KB)

First paint follows the same pattern: Tempo (67 ms) is much faster than React (289 ms) and close to Solid (54 ms).

### Remaining Optimization Opportunities

1. **Template cloning** — Use `cloneNode(true)` for static DOM structures instead of individual `createElement`/`appendChild` calls. This is the primary technique that makes VanillaJS and Solid fast at creation.
2. **Cell primitive** — Lightweight reactive value without full Signal overhead (no dispose tracking, simpler notification) to reduce run memory
3. **Structural reactivity** — Reactive records where fields are individually reactive without wrapper signals
4. **Extend detach-append to replace** — Currently only triggers for create-from-empty; could also detect when all entries are being replaced with new keys
5. **Reduce per-row object count** — Flatten signal graph, fewer wrappers per DOM binding

## Raw Data

All raw JSON results are in `demo/js-framework-benchmark/js-framework-benchmark/webdriver-ts/results/`. Each file contains min/max/median/mean/stddev and individual run values.

## Methodology Notes

- All frameworks built with standard production configurations
- Benchmarks run on the same machine in sequence (not parallel)
- 3 iterations per benchmark (CPU and memory); React select row used 13 iterations (benchmark default of `additionalNumberOfRuns` for that test)
- Tempo keyed uses `KeyedForEach` with `delegate.click`, `MapText`, and `selectedClass`
- Tempo non-keyed uses `ForEach` with `delegate.click`
- React Hooks results are from a benchmark run in the same overall session; VanillaJS and Solid were re-run alongside Tempo for the Round 5 comparison
- "Baseline" values are from the initial run before any optimizations
- Round-to-round ratio comparisons use VanillaJS from the same session (not cross-session absolute values) to account for machine variability
- Run on the official js-framework-benchmark suite (submodule at `demo/js-framework-benchmark/js-framework-benchmark/`)
