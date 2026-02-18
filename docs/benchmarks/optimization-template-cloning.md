# Optimization: Template Cloning

## Status: Implemented

Runtime template cloning is live in `@tempots/render` + `@tempots/dom`. No compiler needed. The existing declarative API is fully preserved.

## Problem

Every row in `KeyedForEach` creates DOM nodes one at a time via individual `document.createElement()` + `appendChild()` calls. For the benchmark Row with 9 elements (tr, 4 td, 2 a, span) + 2 text nodes + 2 comment markers, that's 13 individual DOM API calls per row. At 1000 rows, **13,000 DOM calls** dominate creation time.

This is the key architectural difference between Tempo and frameworks like Solid (which pre-compiles static HTML templates at build time and uses `cloneNode(true)` to stamp out rows in a single native call).

## Results

### CPU (keyed, median of 3 runs, vs VanillaJS)

| Benchmark | Before | After | VanillaJS | Ratio (before) | Ratio (after) |
|-----------|--------|-------|-----------|----------------|---------------|
| 01_run1k | 64.2 ms | **49.2 ms** | 34.8 ms | 1.80x | **1.41x** |
| 02_replace1k | 70.4 ms | **56.5 ms** | 39.0 ms | 1.74x | **1.45x** |
| 07_create10k | 649.8 ms | **490.7 ms** | 372.7 ms | 1.66x | **1.32x** |
| 08_create1k-after | 79.0 ms | **63.4 ms** | 41.6 ms | 1.86x | **1.52x** |
| 03_update10th | 29.1 ms | 25.0 ms | 22.6 ms | 1.39x | 1.11x |
| 04_select1k | 6.7 ms | 8.1 ms | 8.0 ms | 1.00x | 1.01x |
| 05_swap1k | 41.9 ms | 40.5 ms | 30.0 ms | 1.26x | 1.35x |
| 09_clear1k | 25.8 ms | 24.8 ms | 16.2 ms | 1.43x | 1.53x |

| Metric | Before | After |
|--------|--------|-------|
| **Geo mean (CPU, keyed)** | **1.44x** | **1.29x** |

### Memory

| Metric | Before | After | VanillaJS | Ratio |
|--------|--------|-------|-----------|-------|
| 22_run-memory | 10.02 MB | **5.26 MB** | 2.03 MB | **2.59x** |
| 21_ready-memory | 0.71 MB | 0.70 MB | 0.55 MB | 1.28x |
| 25_run-clear-memory | 1.00 MB | 1.03 MB | 0.55 MB | 1.86x |

Run memory dropped nearly in half, from ~5x to ~2.6x VanillaJS. The savings come from eliminating per-row BrowserContext instances, intermediate closures, and `clears` arrays that the normal rendering pipeline creates.

### Non-keyed variant

Non-keyed Tempo reached **1.11x geo mean**, beating Solid (1.16x). The replace benchmark at 0.41x VanillaJS is particularly striking: the non-keyed full-replacement fast path combined with template cloning produces rows faster than hand-written vanilla code replaces them.

## Design Constraint

**The declarative API is preserved.** Users continue writing:

```typescript
function Row(item: Signal<RowData>, selected: Signal<number>): Renderable {
  return html.tr(
    selectedClass(selected, item.value.id, 'danger'),
    html.td(attr.class('col-md-1'), item.$.id),
    html.td(attr.class('col-md-4'), html.a(item.$.label)),
    html.td(attr.class('col-md-1'), html.a(html.span(...))),
    html.td(attr.class('col-md-6'))
  )
}
```

Template cloning is a fully internal optimization. No user-facing API changes.

## Architecture

```
@tempots/render (platform-agnostic)
  template-engine.ts  — TemplateEngine interface
  render-kit.ts       — kind metadata on renderables + template cache in KeyedForEach/Repeat

@tempots/dom (DOM-specific)
  template/types.ts   — SlotInfo, CompiledTemplate types
  template/builder.ts — walk renderable tree -> build DOM template programmatically
  template/hydrator.ts — clone template, walk paths, wire bindings
  template/engine.ts  — DOMTemplateEngine (fingerprint, build, extract, hydrate)
```

### How it works

**Step 1: Kind metadata.** Built-in renderables carry structural metadata beyond the base `{ type, render }`:

| Renderable | `kind` | Extra fields |
|------------|--------|-------------|
| `El('div', ...)` | `'element'` | `tag`, `children` |
| `attr.class('foo')` | `'static-attr'` | `name`, `value` |
| `attr.class(signal)` | `'dynamic-attr'` | — |
| `'hello'` (static text) | `'static-text'` | `text` |
| `Signal<string>` (signal text) | `'dynamic-text'` | `source`, `transform` |
| `Fragment(...)` | `'fragment'` | `children` |
| `Empty` | `'empty'` | — |
| Any opaque renderable | `undefined` | — |

**Step 2: Fingerprinting.** A structural fingerprint is computed by walking the renderable tree. Two trees with the same fingerprint produce identical DOM structures (same elements, attributes, text nodes in the same positions). Only signal identities and text values differ.

**Step 3: Template building.** The builder walks the renderable tree and constructs a DOM template **programmatically** (not via `innerHTML`) to avoid HTML parser normalization issues with `<tr>`, `<td>`, and other context-dependent elements. Dynamic positions become slots:

| Renderable kind | Template action |
|----------------|-----------------|
| `element` | `createElement(tag)`, recurse children |
| `static-attr` | `setAttribute(name, value)` |
| `dynamic-attr` | Record slot pointing to parent element |
| `static-text` | `createTextNode(text)` |
| `dynamic-text` | `createTextNode('')` + record slot |
| `fragment` | Inline children (no DOM node) |
| `empty` | No-op |
| Opaque renderable | `createComment('')` + record slot |

**Step 4: Clone and hydrate.** For each new row:

1. `template.fragment.cloneNode(true)` — single native call creates entire DOM structure
2. Walk the clone **before insertion** to capture slot node references
3. Insert clone into live DOM (moves nodes from DocumentFragment)
4. Hydrate each slot:
   - **dynamic-text**: Wire `source.onChange` directly to the cloned text node
   - **dynamic-attr**: Create a BrowserContext wrapping the cloned element, call `render()`
   - **slot** (opaque): Create a BrowserContext with the comment as insertion reference, call `render()`, then remove the template's comment placeholder

**Step 5: Template cache in KeyedForEach/Repeat.** The cache is scoped per list instance:

- **1st item**: Compute fingerprint + build template. If either fails, disable and fall back to normal rendering.
- **2nd item**: Verify fingerprint matches. If mismatch, disable permanently.
- **Items 3+**: Clone and hydrate directly (no fingerprint check).

### What template cloning eliminates per row

| Allocation | Normal path | Template clone | Saved |
|------------|-------------|----------------|-------|
| `createElement` calls | 8 | 0 (1 `cloneNode`) | 8 |
| `createTextNode` calls | 2 | 0 (cloned) | 2 |
| `createComment` calls | 2 | 0 (cloned) | 2 |
| `appendChild` calls | 12 | 1 | 11 |
| BrowserContext instances | ~13 | ~3 (for slots) | ~10 |
| Renderable closures | ~8 | 0 | ~8 |
| `clears` arrays | ~5 | 1 | ~4 |
| Signal subscriptions | 3 | 3 | 0 |

## Where template cloning applies

Template cloning benefits **repeated rendering of the same structure**: `ForEach`, `KeyedForEach`, and `Repeat`. These renderables call the same item callback N times, producing the same DOM shape with different signal bindings.

One-off elements (app shell, modals, forms) don't benefit because they render once.

## Handling conditionals

When a row contains conditionals (`When`, `OneOf`, `MapSignal`, nested `ForEach`), those renderables have no `kind` metadata (they're opaque). The template builder creates a comment placeholder slot for each one. After cloning, the opaque renderable is rendered normally into a BrowserContext anchored at the comment — it doesn't know it's inside a template.

This means the static parts of the row are cloned efficiently, while dynamic/conditional parts fall back to normal rendering. Degradation is graceful: if the entire renderable tree is opaque, the template builder returns `null` and normal rendering is used.

## Implementation notes

### Programmatic DOM construction

The template is built via `document.createElement()` / `document.createTextNode()` — not `innerHTML`. This avoids HTML parser normalization issues: `<tr>` inside a `<div>` fragment would be stripped by the parser, but programmatic construction works correctly regardless of element context.

### Walk-before-insert pattern

After `cloneNode(true)`, the clone is a DocumentFragment. Slot node references are captured by walking the fragment **before** inserting it into the live DOM. The `insertBefore`/`appendChild` call moves nodes from the fragment, but the JS references captured during the walk remain valid.

### HeadlessContext fallback

`engine.build()` returns `null` when `!ctx.isBrowser()`, so headless (test) contexts fall back to normal rendering automatically. No HeadlessContext changes were needed.

### html.* proxy children must be spread

A critical implementation detail: the `html.*` proxy must spread children directly to `El`:

```typescript
// Correct — children are direct El children
return El(tagName, ...children)

// Wrong — wraps children in a Fragment, breaking template builder
return El(tagName, children.flatMap(renderableOfTNode))
```

The second form passes a single array to `El`'s rest parameter, causing all children to be wrapped in a Fragment. This breaks the template builder because `static-attr` and `dynamic-attr` renderables are only recognized as direct children of an `element` node, not as Fragment children. The builder would silently fail on the first item, disabling template cloning for all subsequent items.

## Resolved design questions

1. **Scope of metadata**: `El` renderables carry `kind`, `tag`, and `children`. Attribute renderables carry `kind`, `name`, `value`. Signal text carries `kind`, `source`, `transform`. This is per-definition metadata — negligible memory cost.
2. **Template cache keying**: Structural fingerprinting (string built from tag names, attr names/values, slot positions). The fingerprint is verified on the 2nd item; if the structure varies, caching is disabled.
3. **SVG/MathML**: Programmatic construction via `createElementNS` — no `innerHTML` issues.
4. **SSR compatibility**: `build()` returns `null` for non-browser contexts. Normal rendering is used.
5. **Provider access**: Slot hydration creates BrowserContext instances that inherit the parent's provider chain.
6. **Nested templates**: Each `KeyedForEach`/`Repeat` has its own template cache. A nested list inside a row template becomes a slot (comment placeholder), and the inner list builds its own template independently.
