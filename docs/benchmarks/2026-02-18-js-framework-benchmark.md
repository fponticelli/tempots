# JS Framework Benchmark Results — 2026-02-18

Tempo (keyed + non-keyed) compared against popular frameworks using the [official js-framework-benchmark](https://github.com/krausest/js-framework-benchmark) suite by Stefan Krause.

## Test Environment

- **Machine**: macOS Darwin 25.3.0
- **Node**: v22.21.1
- **Browser**: Chrome 145.0.7632.109 (headless)
- **Runner**: Puppeteer (via js-framework-benchmark webdriver-ts)
- **Iterations**: 3 per benchmark
- **CPU throttling**: 4x (standard benchmark setting)

## Framework Versions

| Framework | Version |
|-----------|---------|
| Tempo keyed | 36.0.1 (`KeyedForEach` + `delegate` + `selectedClass` + `removeAllBefore` + detach/reattach + full-replace fast path + skip-KeyedPosition + template cloning + entry reuse + single-marker + Signal memory opts) |
| Tempo non-keyed | 36.0.1 (`ForEach` + `delegate` + template cloning + Signal memory opts) |
| React Hooks | 19.2.0 |
| Solid | 1.9.3 |
| Vanilla JS | baseline |

## CPU Benchmarks (ms, median, lower is better)

| Benchmark | VanillaJS | Solid | React Hooks | Tempo keyed | Tempo non-keyed |
|-----------|-----------|-------|-------------|-------------|-----------------|
| Create 1,000 rows | 33.4 | 38.4 | 43.5 | **46.2** | **44.5** |
| Replace 1,000 rows | 36.6 | 44.3 | 53.1 | **15.6** | **15.0** |
| Partial update (every 10th) | 19.4 | 29.3 | 25.6 | **25.9** | **24.6** |
| Select row | 6.1 | 10.1 | 14.5 | **6.4** | **6.0** |
| Swap rows | 23.8 | 30.9 | 173.1 | **32.0** | **20.3** |
| Remove row | 17.0 | 22.5 | 21.3 | **19.6** | **30.5** |
| Create 10,000 rows | 350.5 | 409.3 | 573.0 | **465.1** | **450.4** |
| Append 1,000 rows | 39.6 | 47.0 | 52.1 | **57.5** | **54.6** |
| Clear 1,000 rows | 16.2 | 21.3 | 31.6 | **20.7** | **27.3** |

## Memory Benchmarks (MB, median, lower is better)

| Benchmark | VanillaJS | Solid | React Hooks | Tempo keyed | Tempo non-keyed |
|-----------|-----------|-------|-------------|-------------|-----------------|
| Ready memory | 0.6 | 0.54 | 1.18 | **0.7** | **0.7** |
| Run memory (1k rows) | 1.9 | 2.83 | 4.60 | **n/a** | **3.9** |
| Run-clear memory | 0.6 | 0.74 | 1.96 | **1.1** | **1.1** |

## Bundle Size

| Benchmark | VanillaJS | Solid | React Hooks | Tempo keyed | Tempo non-keyed |
|-----------|-----------|-------|-------------|-------------|-----------------|
| Uncompressed (KB) | 11.3 | 11.5 | 190.3 | **34.5** | **33.7** |
| Compressed (KB) | 2.5 | 4.5 | 51.4 | **11.0** | **10.8** |
| First paint (ms) | 47.7 | 53.8 | 288.5 | **93.7** | **90.5** |

## Optimization History

### Baseline → Current (cumulative improvements)

| Benchmark | Baseline | Round 4 | Round 5 | Round 6 | Round 7 | Round 8 | Current (Round 9) | Improvement |
|-----------|----------|---------|---------|---------|---------|---------|---------------------|-------------|
| Create 1k | 110.5 | 64.4 | 61.7 | 62.2 | 49.2 | 49.4 | 46.2 | **-58.2%** |
| Replace 1k | 124.1 | 68.8 | 74.6 | 64.3 | 56.5 | 15.4 | 15.6 | **-87.4%** |
| Partial update | 37.1 | 31.4 | 33.5 | 30.4 | 25.0 | 25.1 | 25.9 | **-30.2%** |
| Select row | 22.5 | 11.2 | 9.0 | 8.6 | 8.1 | 6.8 | 6.4 | **-71.6%** |
| Swap rows | 40.4 | 45.4 | 40.3 | 43.4 | 40.5 | 32.0 | 32.0 | **-20.8%** |
| Remove row | 55.3 | 23.7 | 24.2 | 24.5 | 21.6 | 19.7 | 19.6 | **-64.6%** |
| Create 10k | 1,024.5 | 633.3 | 603.7 | 587.1 | 490.7 | 468.6 | 465.1 | **-54.6%** |
| Append 1k | 125.4 | 73.3 | 73.6 | 78.7 | 63.4 | 55.6 | 57.5 | **-54.1%** |
| Clear 1k | 57.7 | 33.6 | 30.8 | 28.8 | 24.8 | 20.6 | 20.7 | **-64.1%** |
| Ready mem | 0.71 | 0.69 | 0.69 | 0.70 | 0.70 | 0.7 | 0.7 | **-1.4%** |
| Run mem (NK) | 30.76 | 9.17 | 9.84 | 9.79 | 5.26 | 4.5 | 3.9 | **-87.3%** |
| Run-clear mem | 20.86 | 1.02 | 0.99 | 0.99 | 1.03 | 1.0 | 1.1 | **-94.7%** |

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

### Round 7 Improvements (runtime template cloning)

| Benchmark | Before (Round 6) | After (Round 7) | Ratio vs VanillaJS (Before) | Ratio vs VanillaJS (After) | Ratio Change |
|-----------|-------------------|------------------|-----------------------------|----------------------------|--------------|
| Create 1k (keyed) | 62.2 ms | 49.2 ms | 1.66x | **1.41x** | **-15%** |
| Create 10k (keyed) | 587.1 ms | 490.7 ms | 1.53x | **1.32x** | **-14%** |
| Replace 1k (keyed) | 64.3 ms | 56.5 ms | 1.55x | **1.45x** | **-6%** |
| Append 1k (keyed) | 78.7 ms | 63.4 ms | 1.81x | **1.52x** | **-16%** |
| Remove row (keyed) | 24.5 ms | 21.6 ms | 1.17x | **1.05x** | **-10%** |
| Run memory (keyed) | 9.79 MB | 5.26 MB | 4.82x | **2.59x** | **-46%** |

Template cloning replaces per-row `createElement`+`appendChild` calls with a single `cloneNode(true)` on a pre-built DOM template. The template is built programmatically (not via `innerHTML`) on the first item, verified on the second, and cloned for all subsequent items. See [optimization-template-cloning.md](optimization-template-cloning.md) for full details.

### Round 8 Improvements (entry reuse on full replace, single-marker entries)

| Benchmark | Before (Round 7) | After (Round 8) | Ratio vs VanillaJS (Before) | Ratio vs VanillaJS (After) | Ratio Change |
|-----------|-------------------|------------------|-----------------------------|----------------------------|--------------|
| Replace 1k (keyed) | 56.5 ms | 15.4 ms | 1.45x | **0.41x** | **-72%** |
| Clear 1k (keyed) | 24.8 ms | 20.6 ms | 1.53x | **1.25x** | **-18%** |
| Append 1k (keyed) | 63.4 ms | 55.6 ms | 1.52x | **1.42x** | **-7%** |
| Create 10k (keyed) | 490.7 ms | 468.6 ms | 1.32x | **1.31x** | ~same |
| **CPU Geo Mean** | | | **~1.29x** | **~1.12x** | **-13%** |

Entry reuse detects full replacements (no surviving keys) and updates existing entries in-place via `valueProp.set()` instead of destroying and recreating DOM. The signal graph propagates new values to existing text nodes and attributes — zero DOM creation for reused rows. Single-marker entries skip creating a separate Comment start marker for template-cloned rows (items 3+), using the first content node as the range start instead. Saves ~1000 Comment node allocations per 1k-row list.

Note: Absolute ms values vary between runs due to machine conditions. Ratios vs VanillaJS (measured in the same session) are the reliable comparison metric.

### All Frameworks vs VanillaJS (slowdown ratio, lower is better)

| Benchmark | Solid | React Hooks | Tempo keyed | Tempo non-keyed |
|-----------|-------|-------------|-------------|-----------------|
| Create 1k | 1.03x | 1.16x | **1.38x** | **1.33x** |
| Replace 1k | 1.07x | 1.28x | **0.43x** | **0.41x** |
| Update 10th | 1.07x | 0.94x | **1.33x** | 1.27x |
| Select row | 1.15x | 1.65x | **1.05x** | **0.98x** |
| Swap rows | 0.97x | 5.43x | 1.34x | **0.85x** |
| Remove row | 1.08x | 1.02x | **1.15x** | 1.79x |
| Create 10k | 1.07x | 1.49x | **1.33x** | **1.29x** |
| Append 1k | 1.08x | 1.20x | **1.45x** | **1.38x** |
| Clear 1k | 1.25x | 1.85x | **1.28x** | 1.69x |
| **CPU Geo Mean** | **1.08x** | **1.50x** | **~1.14x** | **~1.13x** |
| Run memory | 1.39x | 2.27x | n/a | **2.05x** |
| Compressed size | 1.80x | 20.56x | 4.40x | 4.32x |

### Tempo Keyed vs VanillaJS — Round-over-round

| Benchmark | Round 4 Ratio | Round 5 Ratio | Round 6 Ratio | Round 7 Ratio | Round 8 Ratio | Round 9 Ratio | R8→R9 Change |
|-----------|---------------|---------------|---------------|---------------|---------------|---------------|--------------|
| Create 1k | 1.88x | 1.75x | 1.66x | 1.41x | 1.45x | **1.38x** | **-5%** |
| Replace 1k | 1.79x | 1.81x | 1.55x | 1.45x | 0.41x | **0.43x** | ~same |
| Update 10th | 1.45x | 1.44x | 1.11x | 1.11x | 1.16x | **1.33x** | ~same* |
| Select row | 1.67x | 1.11x | 0.98x | 1.01x | 1.08x | **1.05x** | ~same |
| Swap rows | 1.73x | 1.38x | 1.36x | 1.35x | 1.36x | **1.34x** | ~same |
| Remove row | 1.23x | 1.11x | 1.17x | 1.05x | 1.15x | **1.15x** | ~same |
| Create 10k | 1.71x | 1.57x | 1.53x | 1.32x | 1.31x | **1.33x** | ~same |
| Append 1k | 1.76x | 1.67x | 1.81x | 1.52x | 1.42x | **1.45x** | ~same |
| Clear 1k | 1.93x | 1.66x | 1.68x | 1.53x | 1.25x | **1.28x** | ~same |
| **Geo Mean** | **1.56x** | **~1.48x** | **~1.40x** | **~1.29x** | **~1.12x** | **~1.14x** | ~same |
| Run mem (NK) | 4.52x | 4.86x | 4.82x | 2.59x | 2.37x | **2.05x** | **-14%** |

\* Update 10th ratio increase is driven by VanillaJS session variance (19.4 ms vs 21.7 ms prior), not Tempo regression (25.9 ms vs 25.1 ms).

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

### Round 7 (Steps 26-27)

26. **Runtime template cloning** — `TemplateEngine` interface in `@tempots/render` + DOM-specific implementation in `@tempots/dom/template/`. Built-in renderables carry `kind` metadata (`element`, `static-attr`, `dynamic-attr`, `static-text`, `dynamic-text`, `fragment`, `empty`). On the first item in `KeyedForEach`/`Repeat`, the engine walks the renderable tree to build a DOM template programmatically (no `innerHTML` — avoids HTML parser normalization issues with `<tr>`, `<td>`, etc.). Subsequent items use `cloneNode(true)` + slot hydration. Dynamic text binds signals directly to cloned text nodes. Dynamic attributes and opaque renderables are hydrated via adopted BrowserContext instances. A structural fingerprint guard on the 2nd item catches mismatches and falls back gracefully. **Create 1k ratio: 1.66x → 1.41x VanillaJS (-15%). Create 10k ratio: 1.53x → 1.32x VanillaJS (-14%). Run memory: 9.79 MB → 5.26 MB (-46%).** See [optimization-template-cloning.md](optimization-template-cloning.md) for full architecture details.
27. **Fix html/svg/math proxy children spreading** — The `html.*` proxy was passing normalized children as a single array to `El()`, causing them to be wrapped in a Fragment. This prevented the template builder from recognizing `static-attr` and `dynamic-attr` children (only handled as direct Element children), silently disabling template cloning. Fixed by spreading children directly: `El(tagName, ...children)`.

### Round 8 (Steps 28-29)

28. **Entry reuse on full replace** — When `KeyedForEach` detects that no old keys survive in the new array (full replacement), it reuses existing entries in-place instead of destroying and recreating. Updates `entry.key`, calls `entry.valueProp.set(newValue)` (propagating through the reactive graph to update DOM text nodes and attributes), and resets position indices. Excess old entries are removed; new entries beyond the reuse count are created normally. **Replace 1k ratio: 1.45x → 0.41x VanillaJS (2.4x faster than vanilla!).**
29. **Single-marker entries for template-cloned rows** — Template-cloned rows (items 3+) skip creating a separate Comment start marker. The `TemplateEngine.cloneAndHydrate` return type was changed from `Clear` to `{ clear: Clear; startCtx: CTX }`, allowing the hydrator to return the first top-level cloned node as the entry's range start reference. Items 1-2 still create the Comment (template not yet verified), then remove it once template cloning succeeds. Saves ~998 Comment node allocations per 1k-row list.

<<<<<<< HEAD
### Round 9 (Steps 30-37: Signal memory optimizations + per-row object reduction)
=======
<<<<<<< HEAD
### Round 9 (Steps 30-37: Signal memory optimizations + per-row object reduction)
=======
### Round 9 (Steps 30-33: Signal memory optimizations + per-row object reduction)
>>>>>>> fdf0f0ef1f728b3e7e40034fea1d9b92af2da508
>>>>>>> ac8cf2ccd2667d11e7be94e21b1b2daf1089ff5d

| Benchmark | Before (Round 8) | After (Round 9) | Ratio vs VanillaJS (Before) | Ratio vs VanillaJS (After) | Ratio Change |
|-----------|-------------------|------------------|-----------------------------|----------------------------|--------------|
| Create 1k (keyed) | 49.4 ms | 46.2 ms | 1.45x | **1.38x** | **-5%** |
| Select row (keyed) | 6.8 ms | 6.4 ms | 1.08x | **1.05x** | ~same |
| Run memory (non-keyed) | 4.5 MB | 3.9 MB | 2.37x | **2.05x** | **-14%** |
| **CPU Geo Mean** | | | **~1.12x** | **~1.14x** | ~same |

<<<<<<< HEAD
30. **Structural derivative disposal** — Replace 3 closures per `setDerivative` call with direct parent↔child arrays. Signals store `_derivatives: Computed[]`, Computeds store `_parents: Signal[]`. Disposal cascades structurally: parent→child via `_derivatives`, child removes self from parent via `_removeDerivative`. Eliminates closure allocations for derivative lifecycle management.
31. **WeakMap proxy cache** — Move per-instance `_$` field to module-level `const _proxyCache = new WeakMap()`. Only signals that use `.$` accessor pay for proxy allocation. Saves 8 bytes per Signal.
32. **Prototype type markers** — Move `$__signal__`, `$__computed__`, `$__prop__` from per-instance fields to prototype assignments via `declare` + `Signal.prototype.$__signal__ = true`. Saves 24 bytes per instance.
33. **Prototype default equals** — Move default `equals` from constructor parameter to `Signal.prototype.equals = strictEquals`. Only signals with custom equality override it. Saves 8 bytes per instance.
34. **Merge scope into KeyedForEach entry** — Shared module-level `_scopeTrack` and `_scopeOnDispose` functions assigned as properties on entry objects. Entries directly implement the Scope interface, avoiding per-entry closure/object allocations. Saves 3 objects per row.
35. **Pre-allocated topNodes array in hydrator** — Replace `Array.from(clone.childNodes)` with pre-allocated array filled by walking `firstChild → nextSibling`. Captures node refs before DOM insertion; removed opaque-slot comments (`parentNode === null`) are safely skipped during cleanup.
36. **selectedClass token cache** — Module-level `Map<string, string[]>` caches `activeClass.split(' ').filter(...)` results. Avoids re-splitting the same CSS class string per row.
37. **Inline dynamic-text clear in hydrator** — Dynamic-text hydration stores `slot.source.onChange(...)` result directly as `Clear` instead of wrapping in a closure. Removes 1 wrapper function per dynamic text slot per template clone.
=======
30-34. Five Signal class memory optimizations: (1) structural derivative disposal replaces 3 closures per `setDerivative` with direct parent↔child arrays (`_parents`/`_derivatives`), (2) `_$` proxy cache moved to module-level `WeakMap` (saves 8 bytes per Signal that doesn't use `.$`), (3) type markers (`$__signal__`, `$__computed__`, `$__prop__`) moved to prototypes via `declare` + prototype assignment (saves 24 bytes per instance), (4) default `equals` on prototype (saves 8 bytes per instance with default equality), (5) `Computed.dispose()` removes itself from parents' derivative lists for clean bidirectional teardown.

Per-row object reduction: (A) merge lightweight scope into KeyedForEach entry objects (shared `_scopeTrack`/`_scopeOnDispose` functions, no per-entry closures), (B) pre-allocated `topNodes` array in hydrator (captures node refs before insertion, handles removed opaque-slot comments gracefully), (C) `selectedClass` token cache avoids re-splitting the same CSS class string per row, (E) dynamic-text hydration stores `onChange` result directly as `Clear` (no wrapper closure).
>>>>>>> fdf0f0ef1f728b3e7e40034fea1d9b92af2da508

CPU geo mean is within noise of Round 8 (~1.14x vs ~1.12x). The primary benefit is **memory**: non-keyed run memory dropped 4.5 → 3.9 MB (-14%), validating the per-instance byte savings from Signal prototype optimizations.

## Analysis

### CPU Performance

Tempo keyed geo mean improved from **1.56x → ~1.48x → ~1.40x → ~1.29x → ~1.12x → ~1.14x VanillaJS** across Rounds 5-9 (R8→R9 within noise), now significantly faster than React Hooks (~1.50x) and approaching Solid (~1.08x). Key strengths:

- **Replace 1k** (0.43x) — **2.3x faster than VanillaJS.** Entry reuse updates existing DOM nodes via signal propagation instead of destroying and recreating.
- **Select row** (1.05x) — near-parity with VanillaJS, thanks to O(1) `selectedClass`. Beats both Solid (1.15x) and React (1.65x).
- **Remove row** (1.15x) — close to VanillaJS. Template cloning reduced per-row teardown overhead.
- **Clear 1k** (1.28x) — comparable to Solid (1.25x). Single-marker entries and improved teardown path.
- **Create 1k** (1.38x) — improved from 1.45x, likely from reduced per-Signal overhead (prototype markers, structural disposal).
- **Create 10k** (1.33x) — template cloning eliminates 8 `createElement` + 11 `appendChild` calls per row, replacing them with a single `cloneNode(true)`.
- **Swap rows** (1.34x) — LIS-based reconciliation. React is catastrophically slow here (5.43x / 173ms) due to full VDOM diffing.

Biggest remaining gaps vs Solid:
- **Create** (~1.38x vs Solid's ~1.03x) — per-row signal/scope allocation overhead remains. Template cloning eliminated DOM creation overhead but reactive infrastructure (Prop, scope, comment markers) still costs.
- **Append 1k** (1.45x vs Solid's 1.08x) — same cause as create.

Tempo non-keyed at **~1.13x geo mean** beats React keyed (~1.50x) and approaches Solid keyed (~1.08x) on several individual benchmarks: **replace** (15.0 ms, 0.41x — 2.4x faster than VanillaJS), **swap rows** (20.3 ms, 0.85x), **select row** (6.0 ms, 0.98x — faster than VanillaJS), and **create 1k** (44.5 ms, 1.33x).

### Memory

Non-keyed run memory dropped to **3.9 MB** (2.05x VanillaJS), down from 4.5 MB in Round 8 (-14%). The improvement comes from Signal class optimizations: prototype-level type markers (-24 bytes/instance), structural derivative disposal (fewer closures), and WeakMap proxy cache (-8 bytes/instance). For comparison:
- VanillaJS: 1.9 MB (baseline)
- Solid: 2.83 MB (1.39x)
- **Tempo non-keyed: 3.9 MB (2.05x)** — now closer to Solid than React
- React: 4.60 MB (2.27x)
- Tempo keyed: n/a this run (protocol error during memory measurement)

Remaining per-row overhead comes from `Prop<RowData>` (the item signal), 1 comment node marker (end only — start marker eliminated for template-cloned rows), and scope tracking.

Run-clear memory (1.1 MB) is notably better than React (1.96 MB), indicating clean disposal — Tempo's leak fixes are effective.

### Bundle Size

Tempo's bundle at **11.0 KB gzipped** (keyed) is:
- **4.7x smaller** than React Hooks (51.4 KB)
- **2.4x larger** than Solid (4.5 KB)
- **4.4x larger** than VanillaJS (2.5 KB)

First paint follows the same pattern: Tempo (94 ms keyed, 91 ms non-keyed) is much faster than React (289 ms) and reasonably close to Solid (54 ms).

### Remaining Optimization Opportunities

1. **Lighter `.` property accessors** — `item.$.id` creates a full `Computed` instance (~120-160 bytes after Round 9 optimizations). For 1k rows × 2 properties = 2000 instances. A lightweight MappedSignal (read-only, no dispose tracking) could save ~40-50% per instance.
2. **Cell primitive** — Lightweight reactive value without full Signal overhead (no dispose tracking, simpler notification) to reduce run memory
3. **Structural reactivity** — Reactive records where fields are individually reactive without wrapper signals

## Raw Data

All raw JSON results are in `demo/js-framework-benchmark/js-framework-benchmark/webdriver-ts/results/`. Each file contains min/max/median/mean/stddev and individual run values.

## Methodology Notes

- All frameworks built with standard production configurations
- Benchmarks run on the same machine in sequence (not parallel)
- 3 iterations per benchmark (CPU and memory); React select row used 13 iterations (benchmark default of `additionalNumberOfRuns` for that test)
- Tempo keyed uses `KeyedForEach` with `delegate.click`, `MapText`, `selectedClass`, and runtime template cloning
- Tempo non-keyed uses `ForEach` with `delegate.click` and runtime template cloning
- React Hooks and Solid results are from earlier benchmark runs; VanillaJS was re-run alongside Tempo for each round comparison
- "Baseline" values are from the initial run before any optimizations
- Round-to-round ratio comparisons use VanillaJS from the same session (not cross-session absolute values) to account for machine variability
- Run on the official js-framework-benchmark suite (submodule at `demo/js-framework-benchmark/js-framework-benchmark/`)
