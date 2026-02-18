# Optimization: Template Cloning

## Problem

Every row in `KeyedForEach` creates DOM nodes one at a time via individual `document.createElement()` + `appendChild()` calls. For the benchmark Row with 9 elements (tr, 4 td, 2 a, span) + 2 text nodes + 2 comment markers, that's 13 individual DOM API calls per row. At 1000 rows, **13,000 DOM calls** dominate creation time.

This is the key architectural difference between Tempo and frameworks like Solid (which pre-compiles static HTML templates at build time and uses `cloneNode(true)` to stamp out rows in a single native call).

## Concept

Separate the static DOM structure from reactive bindings. Pre-build an HTML template once, clone it per row, then walk the clone to attach signal subscriptions at specific positions.

```
Current:  createElement('tr') -> appendChild(td1) -> appendChild(td2) -> ... x 1000
Proposed: template.content.cloneNode(true) x 1000 -> bind reactive slots
```

## Prototype Results

A hand-written `TemplateRow` was implemented in the keyed benchmark to measure the ceiling. The prototype bypasses Tempo's renderable system for DOM creation (using raw `cloneNode(true)`) but still uses Tempo signals for reactivity.

### CPU (keyed, median of 3 runs)

| Benchmark | Before | Template Clone | Change |
|-----------|--------|----------------|--------|
| 01_run1k | 64.4 ms | **48.6 ms** | **-25%** |
| 02_replace1k | 72.2 ms | **55.6 ms** | **-23%** |
| 07_create10k | 604.1 ms | **466.3 ms** | **-23%** |
| 08_create1k-after | 64.2 ms | 58.8 ms | -8% |
| 03_update10th | 32.8 ms | 32.8 ms | same |
| 04_select1k | 11.2 ms | 11.3 ms | same |
| 05_swap1k | 39.2 ms | 40.1 ms | same |
| 09_clear1k | 30.8 ms | 30.5 ms | same |

### Memory

| Metric | Before | Template Clone | Change |
|--------|--------|----------------|--------|
| 22_run-memory | 9.17 MB | **4.65 MB** | **-49%** |
| 21_ready-memory | 0.70 MB | 0.70 MB | same |
| 25_run-clear-memory | 0.90 MB | 0.90 MB | same |

Creation is ~25% faster and run memory is cut nearly in half. The memory savings come from eliminating per-row BrowserContext instances, intermediate closures, and `clears` arrays that the normal rendering pipeline creates.

For reference: VanillaJS = 2.03 MB, Solid = 2.82 MB. Tempo went from 3.2x VanillaJS to 2.3x.

### What the prototype does

```typescript
const _tpl = document.createElement('template')
_tpl.innerHTML = '<tr><td class="col-md-1">...</td>...</tr>'

function TemplateRow(item: Signal<RowData>, selected: Signal<number>): Renderable {
  return createRenderable(DOM_TYPE, (ctx: DOMContext): Clear => {
    // 1. Clone entire row in one native call
    const tr = _tpl.content.firstChild!.cloneNode(true) as HTMLElement

    // 2. Walk to binding points
    const td0 = tr.children[0] as HTMLElement
    const a1 = (tr.children[1] as HTMLElement).children[0] as HTMLElement

    // 3. Insert into DOM (respecting reference markers)
    const bc = ctx as any
    if (bc.reference !== undefined) {
      bc.element.insertBefore(tr, bc.reference)
    } else {
      bc.element.appendChild(tr)
    }

    // 4. Bind only reactive parts (3 signals per row, same as before)
    const classSignal = computed(...)
    const idSignal = item.map(d => d.id)
    const labelSignal = item.map(d => d.label)

    const d1 = classSignal.on(v => { tr.className = v })
    const d2 = idSignal.on(v => { td0Text.nodeValue = v as any })
    const d3 = labelSignal.on(v => { a1Text.nodeValue = v })

    return (removeTree) => { /* dispose signals, optionally tr.remove() */ }
  })
}
```

### What the prototype eliminates per row

| Allocation | Normal path | Template clone | Saved |
|------------|-------------|----------------|-------|
| `createElement` calls | 8 | 0 | 8 |
| `createTextNode` calls | 2 | 2 | 0 |
| `createComment` calls | 2 | 0 | 2 |
| `appendChild` calls | 12 | 1 | 11 |
| BrowserContext instances | ~13 | 0 | ~13 |
| Renderable closures | ~8 | 1 | ~7 |
| `clears` arrays | ~5 | 0 | ~5 |
| Signal subscriptions | 3 | 3 | 0 |

## Design Constraint

**The current declarative API must be preserved.** Users should continue writing:

```typescript
function Row(item: Signal<RowData>, selected: Signal<number>): Renderable {
  return html.tr(
    attr.class(computed(...)),
    html.td(attr.class('col-md-1'), item.$.id),
    html.td(attr.class('col-md-4'), html.a(item.$.label)),
    html.td(attr.class('col-md-1'), html.a(html.span(...))),
    html.td(attr.class('col-md-6'))
  )
}
```

An explicit `Template()` API (Option A in earlier drafts) was rejected because it fundamentally changes how users think about building renderables. Template cloning should be an internal optimization, not a user-facing paradigm shift.

## Where template cloning applies

Template cloning primarily benefits **repeated rendering of the same structure** — i.e., `ForEach`, `KeyedForEach`, and `Repeat`. These renderables call the same item callback N times, producing the same DOM shape each time with different signal bindings.

One-off elements (the app shell, a modal, a form) don't benefit because they render once.

## The hard problem: conditionals

When a row contains conditionals (`When`, `OneOf`, `MapSignal`, nested `ForEach`), the DOM shape can vary between items:

```typescript
(item, pos) => html.tr(
  html.td(item.$.id),
  When(item.map(d => d.active),
    () => html.td('Active'),
    () => html.td('Inactive')
  )
)
```

The template captured from item 1 (where `active=true`) would contain the "Active" td. But item 2 (where `active=false`) needs the "Inactive" td. The template is wrong.

### Partial templates with comment markers as anchors

The solution is to **not template through conditionals**. The template contains only the guaranteed-static skeleton, with comment markers as holes where dynamic/conditional content renders normally:

```html
<!-- Template for the row above: -->
<tr>
  <td><!-- text binding: id --></td>
  <!-- dynamic hole: When renders here -->
</tr>
```

After cloning:
1. Walk to the text node placeholder, subscribe the id signal
2. Walk to the comment marker, create a DOMContext with it as reference, render `When(...)` normally from that point

The `When` renderable doesn't know it's inside a template — it gets a context with the cloned comment as insertion reference and works exactly as today.

### Classifying renderables

To build the template, we need to classify each child as **static** (bake into template) or **dynamic** (leave a comment hole):

| Child type | Classification | In template |
|------------|----------------|-------------|
| `El('div', ...)` with only static children | Static element | Full element |
| `El('div', ...)` with any dynamic children | Static shell | Element, with comment holes for dynamic children |
| `attr.class('fixed')` | Static attribute | Baked into HTML |
| `attr.class(signal)` | Dynamic attribute | Record binding point |
| `'hello'` / `42` / `true` | Static text | Text node in template |
| `Signal<string>` | Dynamic text | Text node placeholder + binding |
| `When(...)`, `OneOf(...)`, `MapSignal(...)` | Dynamic renderable | Comment marker hole |
| `ForEach(...)`, `KeyedForEach(...)` | Dynamic renderable | Comment marker hole |
| Any opaque `Renderable` | Dynamic renderable | Comment marker hole |

The challenge: renderables are currently opaque (`{ type, render }` objects). There's no way to peek inside an `El` renderable to know its children, or to distinguish it from a `When` renderable, without actually rendering it.

## Possible approaches

### Approach 1: TNode tree analysis (pre-render)

Analyze the TNode tree returned by the item callback *before* rendering it. Walk the tree structurally:

- `El('div', children...)` can be inspected because `El` returns a renderable with known structure
- Static attrs, text, signals can be classified by type
- Everything else is an opaque renderable -> comment hole

**Requires:** Tagging `El` renderables with structural metadata (e.g., a `_templateInfo` field containing tag name, namespace, children list) so the analyzer can walk into them. Attribute renderables would need similar tagging.

**Flow:**
1. First item: call `item(signal, position)` -> get TNode tree
2. Walk tree, build template HTML + binding plan
3. Render first item normally (or from the template immediately)
4. Items 2-N: clone template, walk binding plan, apply bindings

**Concern:** Adds metadata to every `El` and `attr` renderable. This is per-renderable-definition, not per-instance, so the memory cost is minimal. But it changes the internal Renderable shape.

### Approach 2: Recording BrowserContext (first-render capture)

Wrap BrowserContext during the first item's render. The wrapper intercepts all DOM calls, builds the real DOM AND records what happened:

- `makeChildElement('tr')` -> create element + record "element at path [0]"
- `makeChildText(signal.value)` -> create text node + record "text binding at path [0, 0]"
- `makeRef()` -> create comment + record "dynamic hole at path [0, 1]"

After the first render completes, extract the template from the recorded structure.

**Concern:** Hard to distinguish "direct bindings" (signal subscriptions on elements the recording context created) from "conditional renders" (subscriptions created by opaque renderables like `When`). The recording context sees all DOM operations but doesn't know which come from `El` vs `When`.

### Approach 3: Compile-time extraction (Vite plugin)

A Vite plugin transforms `html.tr(...)` calls at build time. It can statically analyze the AST to separate static HTML from dynamic expressions.

**Pros:** Maximum performance, no runtime overhead, no metadata on renderables.
**Cons:** Requires build tooling, complex compiler, harder to debug, doesn't work for dynamic component patterns.

## Recommendation

**Approach 1 (TNode tree analysis)** is the most tractable for a runtime-only solution. It requires adding structural metadata to `El` and `attr` renderables, but:

- The metadata is per-definition, not per-instance (negligible memory)
- It's purely internal — no user-facing API changes
- It degrades gracefully: any unrecognized renderable becomes a comment hole
- It works with existing ForEach/KeyedForEach without changes to their API

Approach 3 (compile-time) could be layered on later for maximum performance, using Approach 1 as the runtime fallback.

## Open questions

1. **Scope of metadata:** What exactly should `El` renderables carry? Tag name + namespace + classified children list? Or just a "template key" that groups identical structures?
2. **Template cache keying:** How to identify "same structure" across item callback invocations? The item callback is a function — calling it with different signals produces renderables with the same structure but different signal instances. Could use the callback identity as cache key.
3. **SVG/MathML:** `innerHTML` doesn't work for SVG. Need `createElementNS` approach or skip template cloning for namespaced elements.
4. **SSR compatibility:** HeadlessContext doesn't have `cloneNode`. Template rendering would need a fallback path (render normally).
5. **Provider access:** Template-cloned elements still need access to the provider chain. Bindings rendered into comment holes need the correct provider context.
6. **Nested templates:** A `KeyedForEach` inside a row item — should the inner list also get its own template? Or only the outermost repeated structure?
