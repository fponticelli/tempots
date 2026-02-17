# Event Delegation in tempo/dom

## Status

Proposal

## Context

tempo/dom currently attaches event listeners **directly to each element** via
`addEventListener` in `BrowserContext.on()` (browser-context.ts:361-373). Every
call to `on.click(...)`, `on.input(...)`, etc. creates a dedicated native
listener on the target element:

```typescript
readonly on = <E>(
  event: string,
  listener: (event: E, ctx: BrowserContext) => void,
  options?: HandlerOptions
): Clear => {
  const handler = (event: Event) => listener(event as E, this)
  this.element.addEventListener(event, handler, options)
  return (removeTree: boolean) => {
    if (removeTree) {
      this.element.removeEventListener(event, handler, options)
    }
  }
}
```

This works well for static or small UIs. However, for dynamic lists rendered by
`ForEach` / `Repeat`, each item gets its own set of event listeners. A list of
1,000 items with click and mouseenter handlers means 2,000 `addEventListener`
calls, 2,000 handler closures, and 2,000 teardown functions.

---

## Proposal A — Delegated Event Renderable

Add a new `Delegate` renderable that attaches a **single listener on a container
element** and dispatches to children by matching `event.target` against a CSS
selector.

### API

```typescript
import { delegate } from '@tempots/dom'

// Single delegated event
html.ul(
  delegate.click('li', (event, ctx) => {
    console.log('Clicked:', event.target)
  }),
  ForEach(items, (item) =>
    html.li(item)
  )
)

// With emit helpers
html.ul(
  delegate.click('li', emitTarget((el) => {
    console.log('Clicked li:', el.textContent)
  })),
  ForEach(items, (item) =>
    html.li(item)
  )
)
```

### Implementation Sketch

```typescript
// New file: src/renderable/delegate.ts

const delegateHandler = <T extends Event>(
  name: string,
  selector: string,
  handler: (event: T, ctx: DOMContext) => void,
  options?: HandlerOptions
): Renderable =>
  domRenderable((ctx: DOMContext) => {
    const el = (ctx as BrowserContext).element

    const listener = (event: Event) => {
      const target = (event.target as Element)?.closest(selector)
      if (target != null && el.contains(target)) {
        handler(event as T, ctx)
      }
    }

    el.addEventListener(name, listener, options)
    return (removeTree: boolean) => {
      if (removeTree) {
        el.removeEventListener(name, listener, options)
      }
    }
  })

export const delegate = new Proxy(
  {} as {
    [EN in keyof HTMLEvents]: (
      selector: string,
      handler: (event: HTMLEvents[EN], ctx: DOMContext) => void,
      options?: HandlerOptions
    ) => Renderable
  },
  {
    get: (_, name: keyof HTMLEvents) => {
      return (
        selector: string,
        fn: (event: HTMLEvents[typeof name], ctx: DOMContext) => void,
        options?: HandlerOptions
      ) => delegateHandler(name, selector, fn, options)
    },
  }
)
```

### Headless Support

In `HeadlessContext`, delegation is a no-op; tests use `trigger()` on specific
elements directly. No changes needed to the headless implementation.

### Trade-offs

| Pro | Con |
|-----|-----|
| Fully opt-in — zero changes to existing code | User must supply a CSS selector, which is a new concept in tempo |
| Single listener regardless of list size | `closest()` has minor per-event cost |
| No churn on item add/remove | Handler doesn't receive item-specific `DOMContext` — only container ctx |
| Compatible with existing `on` proxy pattern | Non-bubbling events (`focus`, `blur`, `mouseenter`, `mouseleave`) won't work |
| Works with any element, not just `ForEach` | `HandlerOptions.once` semantics differ (once per container, not per child) |

---

## Proposal B — `ForEach` / `Repeat` with Built-in Delegation

Modify `ForEach` and `Repeat` to **automatically delegate** specified events
from the container to per-item handlers, using a data attribute to identify
each item.

### API

```typescript
const items = prop(['Apple', 'Banana', 'Cherry'])

ForEach(items, (item, pos) =>
  html.li(
    // These are still per-item handlers conceptually,
    // but under the hood they are delegated from a shared container
    on.click(() => {
      console.log('Clicked:', item.value)
    }),
    item
  )
)
```

### Implementation Sketch

Each `Repeat` iteration would stamp a `data-tempo-idx` attribute on its root
element. A shared listener on the container created by `Repeat` would intercept
bubbling events, read the `data-tempo-idx` from `event.target.closest(...)`,
and dispatch to the correct handler by index.

This requires:

1. **A handler registry** in the `Repeat` scope that maps
   `(eventName, index) → handler`.
2. **A modified `DOMContext.on()`** that, when inside a delegated scope,
   registers the handler in the registry instead of calling `addEventListener`.
3. **A `DelegationScope` provider** set by `Repeat` and consumed by `on`:

```typescript
// Inside Repeat's render function:
const registry = new Map<string, Map<number, (e: Event) => void>>()
const containerCtx = ctx.setProvider(delegationScopeMark, registry)

// Attach one listener per event type lazily:
// When the first handler for 'click' is registered at index 0,
// add a single 'click' listener on the container.

// Inside ctx.on() — check for delegation scope:
if (providers[delegationScopeMark]) {
  const registry = providers[delegationScopeMark]
  // Register instead of addEventListener
  const handlers = registry.get(event) ?? new Map()
  handlers.set(currentIndex, handler)
  registry.set(event, handlers)
  return () => handlers.delete(currentIndex)
}
```

### Trade-offs

| Pro | Con |
|-----|-----|
| Zero API change for users — delegation is automatic | Significant complexity in `Repeat` and `DOMContext.on()` |
| Preserves per-item `DOMContext` and typed handlers | Only works inside `ForEach` / `Repeat`, not general containers |
| Handles cleanup automatically via existing disposal scopes | Requires each item to have a single root element for `data-tempo-idx` |
| All existing emit helpers (`emitValue`, `emitChecked`, etc.) work unchanged | Non-bubbling events still need direct attachment as fallback |
| Separator elements need special handling to avoid incorrect index mapping | Adds implicit behavior that may surprise users debugging events |

---

## Proposal C — `on` with Explicit `delegate` Option

Extend the existing `HandlerOptions` with a `delegate` flag or selector. When
provided, the handler is attached to the nearest ancestor element instead of
the current element.

### API

```typescript
html.ul(
  ForEach(items, (item) =>
    html.li(
      // Attaches to the <ul>, delegates via closest('li')
      on.click((event, ctx) => {
        console.log('Clicked:', item.value)
      }, { delegate: true }),
      item
    )
  )
)
```

Or with an explicit selector:

```typescript
on.click(handler, { delegate: 'li.active' })
```

### Implementation Sketch

When `delegate: true`, `BrowserContext.on()` would:

1. Walk up to `this.element.parentElement` (the container).
2. Create a selector matching the current element (tag + classes or a
   generated `data-tempo-delegate-id`).
3. Attach via `closest()` on the parent.

When `delegate` is a string selector, use that selector directly.

### Trade-offs

| Pro | Con |
|-----|-----|
| Minimal API surface — reuses existing `on` proxy | `delegate: true` needs heuristics to identify the current element |
| Per-item context preserved | Each `on.click(..., { delegate: true })` still creates its own entry |
| Compatible with all existing emit helpers | Without a shared registry, you get N registrations on the parent — same memory, different attachment point |
| Explicit opt-in per handler | Unless combined with Proposal B's registry, this is delegation in name only |

---

## Recommendation

**Proposal A** is the pragmatic choice. It:

- Is **fully additive** — no changes to existing code paths.
- Provides **clear semantics** — delegation is explicit and the user controls
  the selector.
- Has **minimal implementation complexity** — ~50 lines of new code, no changes
  to `DOMContext`, `BrowserContext`, `HeadlessContext`, `Repeat`, or `ForEach`.
- Composes naturally with existing patterns: use `on` for individual elements,
  use `delegate` for containers with many similar children.

**Proposal B** is the most powerful but carries the highest risk. It would be
worth revisiting if profiling shows that `ForEach` with hundreds of items is a
real bottleneck in practice.

**Proposal C** is the weakest — without a shared registry it doesn't actually
reduce listener count, and with a registry it converges on Proposal B's
complexity.

### Suggested Next Step

Implement Proposal A as a standalone `delegate` renderable in
`src/renderable/delegate.ts`, export it from the package index, and add tests
covering:

1. Basic delegation (click on child matches selector).
2. Events from nested elements bubble up correctly.
3. Events outside the selector are ignored.
4. Cleanup removes the single listener.
5. Works alongside direct `on` handlers on the same element.
