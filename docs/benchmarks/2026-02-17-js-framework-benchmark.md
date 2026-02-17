# JS Framework Benchmark Results — 2026-02-17

Tempo (keyed) compared against popular frameworks using the [official js-framework-benchmark](https://github.com/nicktomlin/nicktomlin.github.io) suite by Stefan Krause.

## Test Environment

- **Machine**: macOS Darwin 25.2.0
- **Node**: v22.21.1
- **Runner**: Playwright (headless Chromium)
- **Iterations**: 3 per benchmark
- **CPU throttling**: 4x for most tests (standard benchmark setting)

## Framework Versions

| Framework | Version |
|-----------|---------|
| Tempo | 15.0 (keyed, with `KeyedForEach` + `delegate`) |
| Solid | 1.9.3 |
| Svelte | 5.42.1 |
| React (hooks) | 19.2.0 |
| Angular (control flow) | 21.0.5 |
| Vanilla JS | baseline |

## CPU Benchmarks (ms, lower is better)

| Benchmark | Vanilla JS | Solid | Svelte | Angular | React | Tempo | Tempo vs Vanilla |
|-----------|-----------|-------|--------|---------|-------|-------|-----------------|
| Create 1,000 rows | 34.5 | 35.5 | 35.8 | 47.3 | 41.8 | **110.5** | 3.2x |
| Replace 1,000 rows | 40.2 | 41.3 | 42.2 | 57.2 | 51.2 | **124.1** | 3.1x |
| Partial update (every 10th) | 19.2 | 23.6 | 22.1 | 21.2 | 28.2 | **37.1** | 1.9x |
| Select row | 5.7 | 7.6 | 10.3 | 7.8 | 9.4 | **22.5** | 4.0x |
| Swap rows | 22.9 | 27.1 | 27.0 | 26.0 | 167.4 | **40.4** | 1.8x |
| Remove row | 17.7 | 18.5 | 18.8 | 16.6 | 19.8 | **55.3** | 3.1x |
| Create 10,000 rows | 360.4 | 382.0 | 390.3 | 478.4 | 576.4 | **1,024.5** | 2.8x |
| Append 1,000 rows | 40.5 | 45.4 | 43.5 | 55.2 | 49.7 | **125.4** | 3.1x |
| Clear 1,000 rows | 17.5 | 21.5 | 20.6 | 31.0 | 27.1 | **57.7** | 3.3x |

## Memory Benchmarks (MB, lower is better)

| Benchmark | Vanilla JS | Solid | Svelte | Angular | React | Tempo | Tempo vs Vanilla |
|-----------|-----------|-------|--------|---------|-------|-------|-----------------|
| Ready memory | 0.53 | 0.55 | 0.67 | 2.06 | 1.66 | **0.71** | 1.3x |
| Run memory (1k rows) | 2.03 | 2.83 | 3.05 | 5.22 | 5.09 | **30.76** | 15.2x |
| Run-clear memory | 0.62 | 0.74 | 1.01 | 2.62 | 2.47 | **20.86** | 33.6x |

## Bundle Size (lower is better)

| Benchmark | Vanilla JS | Solid | Svelte | Angular | React | Tempo |
|-----------|-----------|-------|--------|---------|-------|-------|
| Uncompressed (KB) | 11.3 | 11.5 | 34.3 | 140.7 | 190.3 | **25.0** |
| Compressed (KB) | 2.5 | 4.5 | 12.2 | 43.6 | 51.4 | **8.5** |
| First paint (ms) | 53.3 | 63.7 | 91.3 | 251.9 | 323.9 | **72.0** |

## Analysis

### What's Good

- **Bundle size**: Tempo ships 8.5 KB gzipped — competitive with Solid (4.5 KB) and much smaller than React (51 KB) or Angular (44 KB).
- **First paint**: 72 ms is fast — faster than Svelte and far ahead of React/Angular.
- **Ready memory**: 0.71 MB baseline is reasonable — comparable to Svelte.

### What's Concerning

#### CPU Performance (2-3x slower than leaders)

Tempo is consistently 2-3x slower than Vanilla JS / Solid / Svelte on all row manipulation benchmarks. The bottleneck is in row creation — creating 1,000 rows takes 110 ms vs 35 ms for Solid/Svelte.

Likely causes:
- **Per-item signal overhead**: Each row creates a `Prop<T>`, `KeyedPosition` (with 6+ derived signals via `.map()`), a `DisposalScope`, and two comment marker nodes. Solid creates 0 signals per row (data is plain objects); Svelte creates 0 explicit signals (compiler handles reactivity).
- **Computed selection check**: `computed(() => item.value.id === selected.value ? 'danger' : '', [item, selected])` runs for every row on every selection change — O(n). Solid uses `createSelector` which is O(1).
- **Comment marker nodes**: KeyedForEach inserts 2 comment nodes per row (start/end markers for range tracking). These are invisible to `Element.children` but cost memory and creation time.

#### Memory Usage (critical — 10-30x overhead)

This is the most serious issue. **30.8 MB for 1,000 rows is ~15x more than Vanilla JS** and ~10x more than Solid/Svelte. The run-clear memory test (which measures memory retained after creating and clearing rows 5 times) shows **20.9 MB**, indicating severe memory leaks — signals and/or DOM nodes are not being properly released on clear.

Likely causes:
- **Signal graph retention**: Each row creates 6+ derived signals (via `KeyedPosition.map()`) plus the value `Prop`. If disposal doesn't fully sever the signal graph, these accumulate.
- **DisposalScope leaks**: The `clear()` function may not be fully disposing all nested scopes and their signal subscriptions.
- **DOM reference cycles**: Comment markers + content nodes may create reference chains that prevent GC.

### Priority Recommendations

1. **Fix memory leaks** (P0): The 20.9 MB run-clear memory is a showstopper. Investigate whether `clear()` on KeyedForEach actually disposes all Prop/Signal/DisposalScope instances. Compare with ForEach's memory behavior.

2. **Optimize row creation** (P1): Profile where the 110 ms is spent. Consider batching DOM operations or reducing per-item signal allocations.

3. **Add O(1) selection** (P1): Implement a `createSelector`-like primitive that only updates the previously-selected and newly-selected rows, rather than running a computed for every row.

4. **Reduce marker overhead** (P2): Consider alternative range-tracking strategies that don't require 2 extra DOM nodes per item (e.g., firstChild/lastChild of a lightweight container, or item count tracking).

5. **Benchmark non-keyed variant** (P2): The non-keyed implementation (ForEach + delegate) should also be benchmarked to isolate KeyedForEach-specific overhead from general Tempo overhead.

## Raw Data

All raw JSON results are in the benchmark runner's `webdriver-ts/results/` directory. Each file contains min/max/median/mean/stddev and individual run values.

## Methodology Notes

- All frameworks were built with their standard production build configurations
- Benchmarks were run on the same machine in sequence (not parallel)
- Only 3 iterations per benchmark — official results typically use 10+ for more statistical significance
- React's swap rows score (167 ms) is anomalously high compared to its other scores — this is a known React issue where VDOM diffing struggles with large table row swaps
- Tempo implementation uses `KeyedForEach` with event delegation via `delegate.click`
