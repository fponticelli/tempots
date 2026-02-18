# Optimization: Template Cloning

## Problem

Every row in `KeyedForEach` creates DOM nodes one at a time via individual `document.createElement()` + `appendChild()` calls. For the benchmark Row with 9 elements (tr, 4 td, 2 a, span) + 2 text nodes + 2 comment markers, that's 13 individual DOM API calls per row. At 1000 rows, **13,000 DOM calls** dominate creation time.

This is the key architectural difference between Tempo (64.4 ms create 1k) and Solid (38.0 ms) / VanillaJS (34.3 ms). Solid pre-compiles static HTML templates at build time and uses `cloneNode(true)` to stamp out rows in a single native call.

## Concept

Separate the static DOM structure from reactive bindings. Pre-build an HTML template once, clone it per row, then walk the clone to attach signal subscriptions at specific positions.

```
Current:  createElement('tr') → appendChild(td1) → appendChild(td2) → ... × 1000
Proposed: template.content.cloneNode(true) × 1000 → bind reactive slots
```

## Current Pipeline

```
html.tr(attr.class(signal), html.td(...), ...)
  ↓
El('tr', [signalClassName(signal), El('td', [...]), ...])   ← Definition (no DOM yet)
  ↓
render(ctx):
  ctx.makeChildElement('tr')      ← createElement + appendChild
  signalClassName.render(trCtx)   ← signal.on(...)
  El('td').render(trCtx)          ← createElement + appendChild
    MapText.render(tdCtx)         ← createTextNode + signal.onChange(...)
  ...repeat for each child...
  ↓
returns clear()
```

Every `El()` call creates a renderable closure. Every `.render()` call creates a DOM element, a BrowserContext, and a clear closure. For the benchmark row that's:

- 13 `createElement`/`createTextNode`/`createComment` calls
- 11 BrowserContext allocations
- ~12 closures
- ~5 arrays

## Proposed API

### Option A: `Template()` renderable

A new renderable that accepts an HTML string and a binding function:

```typescript
import { Template, slot } from '@tempots/dom'

const RowTemplate = Template(
  '<tr><td class="col-md-1"></td><td class="col-md-4"><a></a></td><td class="col-md-1"><a><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a></td><td class="col-md-6"></td></tr>',
  (root, ctx) => {
    // root is the cloned <tr> element
    // Return binding disposers
    const tr = root
    const td1 = tr.children[0] as HTMLElement
    const td2 = tr.children[1] as HTMLElement
    const a2 = td2.children[0] as HTMLElement

    return {
      // Reactive class on <tr>
      class: (signal: Signal<string>) => signalClassName(signal).render(ctx.withElement(tr)),
      // Text in td1
      id: (signal: Signal<string>) => bindText(td1, signal),
      // Text in a2
      label: (signal: Signal<string>) => bindText(a2, signal),
    }
  }
)

function Row(item: Signal<RowData>, selected: Signal<number>): Renderable {
  return RowTemplate(root => {
    root.class(computed(() => item.value.id === selected.value ? 'danger' : '', [item, selected]))
    root.id(MapText(item, d => String(d.id)))
    root.label(MapText(item, d => d.label))
  })
}
```

**Pros:** Explicit, maximum performance, no magic.
**Cons:** Manual slot wiring, HTML string is fragile, verbose.

### Option B: `html.tr.template(...)` — automatic template extraction

Extend the `html` proxy so that on first render, the static structure is cached as a template. Subsequent renders clone the cached template.

```typescript
// Same API as today — no changes to user code
function Row(item: Signal<RowData>, selected: Signal<number>): Renderable {
  return html.tr(
    attr.class(computed(...)),
    html.td(attr.class('col-md-1'), MapText(item, d => String(d.id))),
    html.td(attr.class('col-md-4'), html.a(MapText(item, d => d.label))),
    html.td(attr.class('col-md-1'), html.a(html.span(attr.class('glyphicon glyphicon-remove'), aria.hidden(true)))),
    html.td(attr.class('col-md-6'))
  )
}
```

Under the hood, `El()` marks each child as either static or dynamic. On first render:
1. Build the full DOM tree normally
2. Record the positions of dynamic bindings (e.g., "child 0 of <tr> needs signal class binding")
3. Cache the static HTML as a `<template>` element

On subsequent renders:
1. `template.content.cloneNode(true)` — one native call
2. Walk the clone to the recorded positions
3. Attach only the dynamic bindings

**Pros:** Zero API change, automatic, works for all elements.
**Cons:** First render is slower (builds + caches), needs a way to identify "same structure" across renders, more complex implementation.

### Option C: Compile-time template extraction (Vite plugin)

A Vite plugin that transforms `html.tr(...)` calls at build time into optimized template + binding code.

```typescript
// Input (user writes this)
html.tr(
  attr.class(computed(...)),
  html.td(attr.class('col-md-1'), MapText(item, d => String(d.id))),
)

// Output (compiler generates this)
const __tpl_1 = document.createElement('template')
__tpl_1.innerHTML = '<tr><td class="col-md-1"></td></tr>'

domRenderable(ctx => {
  const clone = __tpl_1.content.cloneNode(true) as DocumentFragment
  const tr = clone.firstChild as HTMLElement
  const td1 = tr.children[0] as HTMLElement
  ctx.appendOrInsert(tr)

  // Dynamic bindings only
  const c1 = signalClassName(computed(...)).render(ctx.withElement(tr))
  const c2 = MapText(item, d => String(d.id)).render(ctx.withElement(td1))

  return (removeTree) => { c1(false); c2(false); if (removeTree) tr.remove() }
})
```

**Pros:** Maximum performance, zero runtime overhead, best tree shaking.
**Cons:** Requires build tooling, harder to debug, complex compiler.

## Recommended Approach: Option A first, then Option B

Option A is the fastest to implement and gives the benchmark the maximum boost immediately. Option B can be layered on later for ergonomics.

## Architecture: Template renderable

```typescript
// New file: packages/tempots-dom/src/renderable/template.ts

type TemplateSlots<S> = {
  // S is a user-defined slots object
  // Each slot is a function that accepts a Signal and returns a Clear
}

type TemplateBinder<S> = (
  root: HTMLElement,
  ctx: DOMContext
) => S

function Template<S>(
  html: string,
  binder: TemplateBinder<S>
): (setup: (slots: S) => void) => Renderable
```

Internal flow:
1. **First call**: Parse HTML into a `<template>` element (cached globally)
2. **Each render**: `template.content.cloneNode(true)`, call binder to get slot accessors, call setup to wire signals
3. **Clear**: Dispose signal subscriptions, optionally remove cloned DOM

### BrowserContext integration

Template-cloned elements bypass `makeChildElement`. Instead:
- Clone produces a `DocumentFragment` with the full subtree
- The fragment is inserted via `ctx.appendOrInsert(fragment.firstChild)`
- A new `DOMContext` is created with `ctx.withElement(clonedRoot)` for dynamic bindings
- Only reactive binding points need BrowserContext instances

### KeyedForEach integration

No changes needed. `KeyedForEach` calls `renderableOfTNode(item(valueProp, position)).render(endRef)`. If `item()` returns a Template renderable, it renders via cloning instead of createElement. The Clear lifecycle is identical.

## Expected Impact

### Memory (per 1000 rows)

| Component | Current | With Template | Savings |
|-----------|---------|---------------|---------|
| BrowserContext instances | 13/row → 13,000 | ~4/row → 4,000 | **~500 KB** |
| Closures | ~12/row → 12,000 | ~5/row → 5,000 | **~500 KB** |
| `clears` arrays | ~5/row → 5,000 | ~2/row → 2,000 | **~150 KB** |
| DOM nodes | ~12/row (unchanged) | ~12/row (unchanged) | 0 |
| **Total** | ~9.17 MB | **~8.0 MB** | **~1.15 MB (-13%)** |

### CPU (create 1k rows)

| Operation | Current | With Template | Why |
|-----------|---------|---------------|-----|
| DOM creation | 13 calls/row | 1 `cloneNode` + 1 `appendChild` | Native bulk clone |
| Context creation | 13/row | ~4/row | Only for reactive bindings |
| Signal subscriptions | 3/row | 3/row (unchanged) | Still need per-instance reactivity |
| **Estimated total** | 64.4 ms | **~40-50 ms** | ~25-40% faster creation |

The biggest CPU win is replacing 9+ `createElement` + `appendChild` calls with a single `cloneNode(true)`. Browser engines optimize `cloneNode` heavily — it copies the internal DOM representation without re-parsing.

## Files to Create/Modify

| File | Change |
|------|--------|
| `packages/tempots-dom/src/renderable/template.ts` | **New** — `Template()` renderable |
| `packages/tempots-dom/src/index.ts` | Export `Template` |
| `demo/js-framework-benchmark/keyed/src/main.ts` | Use `Template()` in Row function |
| `packages/tempots-dom/test/template.spec.ts` | **New** — tests |

## Open Questions

1. **SVG/MathML support**: `innerHTML` doesn't work for SVG. Need `createElementNS` approach or skip template cloning for namespaced elements.
2. **Nested templates**: Should a Template inside a Template be supported? Or is it only for leaf row patterns?
3. **SSR compatibility**: HeadlessContext doesn't have `cloneNode`. Template rendering would need a fallback path.
4. **Provider access**: Template-cloned elements still need access to the provider chain for `Use()` within templates.
