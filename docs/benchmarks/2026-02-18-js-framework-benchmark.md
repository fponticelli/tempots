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
| Tempo keyed | 36.0.1 (`KeyedForEach` + `delegate` + `selectedClass` + `removeAllBefore` + detach/reattach + full-replace fast path + skip-KeyedPosition) |
| Tempo non-keyed | 36.0.1 (`ForEach` + `delegate`) |
| React Hooks | 19.2.0 |
| Solid | 1.9.3 |
| Vanilla JS | baseline |

## CPU Benchmarks (ms, median, lower is better)

| Benchmark | VanillaJS | Solid | React Hooks | Tempo keyed | Tempo non-keyed |
|-----------|-----------|-------|-------------|-------------|-----------------|
| Create 1,000 rows | 37.4 | 38.4 | 43.5 | **62.2** | **61.8** |
| Replace 1,000 rows | 41.5 | 44.3 | 53.1 | **64.3** | **17.4** |
| Partial update (every 10th) | 27.3 | 29.3 | 25.6 | **30.4** | **32.2** |
| Select row | 8.8 | 10.1 | 14.5 | **8.6** | **8.1** |
| Swap rows | 31.9 | 30.9 | 173.1 | **43.4** | **26.7** |
| Remove row | 20.9 | 22.5 | 21.3 | **24.5** | **35.2** |
| Create 10,000 rows | 383.3 | 409.3 | 573.0 | **587.1** | **594.6** |
| Append 1,000 rows | 43.6 | 47.0 | 52.1 | **78.7** | **61.8** |
| Clear 1,000 rows | 17.1 | 21.3 | 31.6 | **28.8** | **34.3** |

## Memory Benchmarks (MB, median, lower is better)

| Benchmark | VanillaJS | Solid | React Hooks | Tempo keyed | Tempo non-keyed |
|-----------|-----------|-------|-------------|-------------|-----------------|
| Ready memory | 0.52 | 0.54 | 1.18 | **0.70** | **0.70** |
| Run memory (1k rows) | 2.03 | 2.83 | 4.60 | **9.79** | **8.97** |
| Run-clear memory | 0.63 | 0.74 | 1.96 | **0.99** | **0.99** |

## Bundle Size

| Benchmark | VanillaJS | Solid | React Hooks | Tempo keyed | Tempo non-keyed |
|-----------|-----------|-------|-------------|-------------|-----------------|
| Uncompressed (KB) | 11.3 | 11.5 | 190.3 | **28.5** | **27.9** |
| Compressed (KB) | 2.5 | 4.5 | 51.4 | **9.3** | **9.1** |
| First paint (ms) | 53.9 | 53.8 | 288.5 | **74.6** | **73.7** |

## Optimization History

### Baseline → Current (cumulative improvements)

| Benchmark | Baseline | Round 4 | Round 5 | Current (Round 6) | Improvement |
|-----------|----------|---------|---------|---------------------|-------------|
| Create 1k | 110.5 | 64.4 | 61.7 | 62.2 | **-43.7%** |
| Replace 1k | 124.1 | 68.8 | 74.6 | 64.3 | **-48.2%** |
| Partial update | 37.1 | 31.4 | 33.5 | 30.4 | **-18.1%** |
| Select row | 22.5 | 11.2 | 9.0 | 8.6 | **-61.8%** |
| Swap rows | 40.4 | 45.4 | 40.3 | 43.4 | +7.4% |
| Remove row | 55.3 | 23.7 | 24.2 | 24.5 | **-55.7%** |
| Create 10k | 1,024.5 | 633.3 | 603.7 | 587.1 | **-42.7%** |
| Append 1k | 125.4 | 73.3 | 73.6 | 78.7 | **-37.2%** |
| Clear 1k | 57.7 | 33.6 | 30.8 | 28.8 | **-50.1%** |
| Ready mem | 0.71 | 0.69 | 0.69 | 0.70 | **-1.4%** |
| Run mem | 30.76 | 9.17 | 9.84 | 9.79 | **-68.2%** |
| Run-clear mem | 20.86 | 1.02 | 0.99 | 0.99 | **-95.3%** |

### Round 5 Improvements (bulk clear, detach-append, selectedClass, lighter onChange)

| Benchmark | Before (Round 4) | After (Round 5) | Ratio vs VanillaJS (Before) | Ratio vs VanillaJS (After) | Ratio Change |
|-----------|-------------------|------------------|-----------------------------|----------------------------|--------------|
| Select row (keyed) | 11.2 ms | 9.0 ms | 1.58x | **1.11x** | **-30%** |
| Clear 1k (keyed) | 33.6 ms | 30.8 ms | 2.07x | **1.66x** | **-20%** |
| Update 10th (keyed) | 31.4 ms | 33.5 ms | 1.56x | **1.44x** | **-8%** |
| Remove row (keyed) | 23.7 ms | 24.2 ms | 1.43x | **1.11x** | **-22%** |
| Run-clear memory | 1.02 MB | 0.99 MB | 1.65x | **1.68x** | ~same |

### Round 6 Improvements (full-replace fast path, skip-KeyedPosition)

| Benchmark | Before (Round 5) | After (Round 6) | Ratio vs VanillaJS (Before) | Ratio vs VanillaJS (After) | Ratio Change |
|-----------|-------------------|------------------|-----------------------------|----------------------------|--------------|
| Replace 1k (keyed) | 74.6 ms | 64.3 ms | 1.81x | **1.55x** | **-14%** |
| Update 10th (keyed) | 33.5 ms | 30.4 ms | 1.44x | **1.11x** | **-23%** |
| Select row (keyed) | 9.0 ms | 8.6 ms | 1.11x | **0.98x** | **-12%** |
| Create 1k (keyed) | 61.7 ms | 62.2 ms | 1.75x | **1.66x** | **-5%** |
| Create 10k (keyed) | 603.7 ms | 587.1 ms | 1.57x | **1.53x** | **-3%** |

Note: Absolute ms values vary between runs due to machine conditions. Ratios vs VanillaJS (measured in the same session) are the reliable comparison metric.

### All Frameworks vs VanillaJS (slowdown ratio, lower is better)

| Benchmark | Solid | React Hooks | Tempo keyed | Tempo non-keyed |
|-----------|-------|-------------|-------------|-----------------|
| Create 1k | 1.03x | 1.16x | 1.66x | 1.65x |
| Replace 1k | 1.07x | 1.28x | **1.55x** | **0.42x** |
| Update 10th | 1.07x | 0.94x | **1.11x** | 1.18x |
| Select row | 1.15x | 1.65x | **0.98x** | **0.92x** |
| Swap rows | 0.97x | 5.43x | 1.36x | **0.84x** |
| Remove row | 1.08x | 1.02x | 1.17x | 1.68x |
| Create 10k | 1.07x | 1.49x | 1.53x | 1.55x |
| Append 1k | 1.08x | 1.20x | 1.81x | 1.42x |
| Clear 1k | 1.25x | 1.85x | 1.68x | 2.01x |
| **CPU Geo Mean** | **1.08x** | **1.50x** | **~1.40x** | **~1.24x** |
| Run memory | 1.39x | 2.27x | 4.82x | 4.42x |
| Compressed size | 1.80x | 20.56x | 3.72x | 3.64x |

### Tempo Keyed vs VanillaJS — Round-over-round

| Benchmark | Round 4 Ratio | Round 5 Ratio | Round 6 Ratio | R5→R6 Change |
|-----------|---------------|---------------|---------------|--------------|
| Create 1k | 1.88x | 1.75x | 1.66x | -5% |
| Replace 1k | 1.79x | 1.81x | **1.55x** | **-14%** |
| Update 10th | 1.45x | 1.44x | **1.11x** | **-23%** |
| Select row | 1.67x | **1.11x** | **0.98x** | **-12%** |
| Swap rows | 1.73x | 1.38x | 1.36x | ~same |
| Remove row | 1.23x | **1.11x** | 1.17x | +5% |
| Create 10k | 1.71x | 1.57x | 1.53x | -3% |
| Append 1k | 1.76x | 1.67x | 1.81x | +8% |
| Clear 1k | 1.93x | **1.66x** | 1.68x | ~same |
| **Geo Mean** | **1.56x** | **~1.48x** | **~1.40x** | **-5%** |
| Run memory | 4.52x | 4.86x | 4.82x | ~same |

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

### Round 6 (Steps 24-25)

24. **Full-replacement fast path** — Detects when all old keys are absent from the new key set (e.g., replace1k benchmark). Uses bulk `removeAllEntries()` with `removeAllBefore` (Range API) + `detach()`/`reattach()` instead of 1000 individual `removeEntry()` calls. The survivor check is O(n) with a Set lookup. After bulk removal, entries are empty, so the existing `wasBulkCreate` detach logic triggers naturally. **Replace 1k ratio: 1.81x → 1.55x VanillaJS (-14%).**
25. **Skip unused KeyedPosition** — Detects via `item.length >= 2` whether the user callback uses the position parameter. When unused (the common case), skips `new KeyedPosition(...)` allocation, `setIndex()` calls during reordering, and `dispose()` on removal. Saves 1 object + multiple method calls per row. **Update 10th ratio: 1.44x → 1.11x VanillaJS (-23%).**

## Analysis

### CPU Performance

Tempo keyed geo mean improved from **1.56x → ~1.48x → ~1.40x VanillaJS** across Rounds 5-6, now comfortably faster than React Hooks (~1.50x). Key strengths:

- **Select row** (0.98x) — **faster than VanillaJS**, thanks to O(1) `selectedClass`. Beats both Solid (1.15x) and React (1.65x).
- **Update 10th** (1.11x) — dramatically improved from 1.44x. Skipping KeyedPosition `setIndex()` across 1000 rows eliminates significant per-update overhead. Now competitive with Solid (1.07x).
- **Replace 1k** (1.55x) — improved from 1.81x. Full-replacement fast path with bulk DOM removal + detach-append. Still gap vs Solid (1.07x) due to per-row signal allocation.
- **Swap rows** (1.36x) — LIS-based reconciliation. React is catastrophically slow here (5.43x / 173ms) due to full VDOM diffing.
- **Clear 1k** (1.68x) — comparable to React (1.85x), gap vs Solid (1.25x).
- **Create 1k** (1.66x) — slight improvement from 1.75x due to fewer allocations (no KeyedPosition).

Biggest remaining gaps vs Solid:
- **Create** (~1.66x vs Solid's ~1.03x) — per-row signal allocation overhead vs Solid's template cloning with `cloneNode(true)`
- **Append 1k** (1.81x vs Solid's 1.08x) — same cause as create

Tempo non-keyed excels at **replace** (17.4 ms, 2.4x faster than VanillaJS), **select row** (8.1 ms, faster than VanillaJS), and **swap rows** (26.7 ms, faster than VanillaJS) due to wholesale DOM replacement.

### Memory

Run memory remains at ~9.8 MB (4.82x VanillaJS). For comparison, React is at 4.6 MB (2.27x) and Solid at 2.8 MB (1.39x). The KeyedPosition skip optimization eliminates 1 object per row when unused, but the per-row overhead from `Prop`, start/end comment markers, and scope tracking arrays still dominates. Each row involves:
- 1 `Prop<RowData>` (the item signal)
- 2 comment node markers (start + end)
- Text node contexts and scope tracking arrays

Run-clear memory (0.99 MB) is notably better than React (1.96 MB), indicating clean disposal — Tempo's leak fixes are effective.

### Bundle Size

Tempo's bundle at **9.3 KB gzipped** is:
- **5.6x smaller** than React Hooks (51.4 KB)
- **2.0x larger** than Solid (4.5 KB)
- **3.7x larger** than VanillaJS (2.5 KB)

First paint follows the same pattern: Tempo (67 ms) is much faster than React (289 ms) and close to Solid (54 ms).

### Remaining Optimization Opportunities

1. **Template cloning** — Use `cloneNode(true)` for static DOM structures instead of individual `createElement`/`appendChild` calls. This is the primary technique that makes VanillaJS and Solid fast at creation.
2. **Cell primitive** — Lightweight reactive value without full Signal overhead (no dispose tracking, simpler notification) to reduce run memory
3. **Structural reactivity** — Reactive records where fields are individually reactive without wrapper signals
4. **Reduce per-row object count** — Flatten signal graph, fewer wrappers per DOM binding

## Raw Data

All raw JSON results are in `demo/js-framework-benchmark/js-framework-benchmark/webdriver-ts/results/`. Each file contains min/max/median/mean/stddev and individual run values.

## Methodology Notes

- All frameworks built with standard production configurations
- Benchmarks run on the same machine in sequence (not parallel)
- 3 iterations per benchmark (CPU and memory); React select row used 13 iterations (benchmark default of `additionalNumberOfRuns` for that test)
- Tempo keyed uses `KeyedForEach` with `delegate.click`, `MapText`, and `selectedClass`
- Tempo non-keyed uses `ForEach` with `delegate.click`
- React Hooks and Solid results are from earlier benchmark runs; VanillaJS was re-run alongside Tempo for each round comparison
- "Baseline" values are from the initial run before any optimizations
- Round-to-round ratio comparisons use VanillaJS from the same session (not cross-session absolute values) to account for machine variability
- Run on the official js-framework-benchmark suite (submodule at `demo/js-framework-benchmark/js-framework-benchmark/`)
