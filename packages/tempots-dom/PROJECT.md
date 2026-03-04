Tempo DOM is a lightweight UI Framework for building web applications. It has no dependencies and it is built with [TypeScript](https://www.typescriptlang.org/).

To install use:

```bash
# npm
npm install @tempots/dom

# yarn
yarn add @tempots/dom
```

## Animation & Motion

### Easing Functions

All easing functions from `@tempots/core` are re-exported for convenience. See the core package documentation for the full list of 25 standard easings and 3 combinators.

```typescript
import { easeInOutCubic, easeOutElastic, animateSignal, prop } from '@tempots/dom'

const position = prop(0)
const animated = animateSignal(position, {
  duration: 300,
  easing: easeInOutCubic,
})
```

### Signal Tween

An imperative tween that drives a reactive signal from its current value to a target using easing. Complements `animateSignal` (declarative) with explicit `tweenTo()` control.

```typescript
import { createTween, easeInOutCubic } from '@tempots/dom'

const tween = createTween({ x: 0, y: 0 }, {
  duration: 300,
  easing: easeInOutCubic,
  interpolate: (a, b, t) => ({
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,
  }),
})

tween.tweenTo({ x: 100, y: 200 })
// Later: tween.cancel() or tween.dispose()
```

Supports `reducedMotion: Signal<boolean>` to skip animations for accessibility.

### RAF Loop

A `requestAnimationFrame` loop with delta-time tracking. Available as both an imperative utility and a Tempo renderable.

```typescript
import { createRafLoop, RafLoop, html } from '@tempots/dom'

// Imperative (inside WithElement callbacks)
const handle = createRafLoop((dt) => {
  offset = (offset + speed * dt) % totalLength
})
// Later: handle.dispose()

// Renderable (auto-disposes with component lifecycle)
html.canvas(
  RafLoop((dt) => {
    // update canvas each frame
  })
)
```

### Reduced Motion

A reactive signal that tracks the user's `prefers-reduced-motion` system preference. Available as both a factory function and a Tempo Provider.

```typescript
import { createReducedMotionSignal, ReducedMotion, Provide, Use } from '@tempots/dom'

// Standalone
const reducedMotion = createReducedMotionSignal()
if (reducedMotion.get()) {
  // skip animation
}

// As a Provider (app-wide singleton)
Provide(ReducedMotion, undefined,
  Use(ReducedMotion, (reducedMotion) =>
    When(reducedMotion, html.span('Animations disabled'))
  )
)
```

## List Transitions

### TransitionKeyedForEach

A drop-in replacement for `KeyedForEach` that supports exit animations. Items leaving the list stay in the DOM for a configurable duration with an `isExiting` signal, allowing CSS transitions to play before removal.

```typescript
import { TransitionKeyedForEach, prop, html, attr } from '@tempots/dom'

const items = prop([
  { id: '1', text: 'Buy groceries' },
  { id: '2', text: 'Walk the dog' },
])

TransitionKeyedForEach(
  items,
  (item) => item.id,
  (item, position, isExiting) => html.div(
    attr.class('todo-item'),
    attr.class(isExiting.map(e => e ? 'todo-item--exiting' : '')),
    item.map(i => i.text),
  ),
  { exitDuration: 300 }
)
```

```css
.todo-item--exiting {
  animation: fade-out 300ms ease-out forwards;
}
```

Configuration options:
- `exitClass` — CSS class added during exit animation
- `exitDuration` — Milliseconds before DOM removal
- `enterClass` — CSS class added during enter animation
- `enterDuration` — Milliseconds before enter class is removed
- `useAnimationEvents` — Listen for `animationend`/`transitionend` instead of fixed duration

## Touch & Gesture Handlers

### Pinch-Zoom

Two-finger pinch-to-zoom with simultaneous pan. Available as both an imperative handler and a Tempo renderable.

```typescript
import { PinchZoom, prop, html } from '@tempots/dom'
import type { PinchZoomState } from '@tempots/dom'

const viewport = prop<PinchZoomState>({ scale: 1, panX: 0, panY: 0 })

html.div(
  attr.style(viewport.map(v => ({
    transform: `translate(${v.panX}px, ${v.panY}px) scale(${v.scale})`,
  }))),
  PinchZoom(viewport, { minScale: 0.25, maxScale: 4 }),
  // ... content
)
```

### Inertia Scroll

Physics-based inertia for pan/scroll interactions. When the user releases a drag, the surface continues scrolling with exponential velocity decay.

```typescript
import { Inertia, prop, html } from '@tempots/dom'

const offset = prop({ x: 0, y: 0 })

html.div(
  Inertia(
    (dx, dy) => offset.set({
      x: offset.get().x + dx,
      y: offset.get().y + dy,
    }),
    { friction: 0.95 }
  ),
  // ... scrollable content
)
```

## DOM Utilities

### isInputFocused

Checks whether the currently focused element is an editable form control. Useful for keyboard shortcut systems.

```typescript
import { isInputFocused } from '@tempots/dom'

document.addEventListener('keydown', (e) => {
  if (isInputFocused()) return // don't intercept typing
  if (e.key === 'Delete') deleteSelected()
})
```

For more information, see the [Tempo documentation](/).
