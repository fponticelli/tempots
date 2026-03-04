---
title: Signals
order: 40
description: Signals are the reactive data stores. They are used to manage state and notify state changes.
---

# Signals

Signals are the reactive data stores. They are used to manage state and notify state changes.

## Create signals

There are three types of signals: `Signal`, `Prop`, and `Computed`. A `Signal` is a readonly object that can be observed but not updated. A `Prop` is a writable object that can be updated. A `Computed` is a readonly object that is derived from other signals.

To create a signal, use the `signal()`, `prop()`, and `computed()` (or `computedOf`) functions.

```tsx
// create a signal that cannot be updated
const s = signal(0)

// create a signal that can be updated
const p = prop(0)
p.value = 1
console.log(p.value) // 1

// create a computed signal from a single dependency
const c1 = computed(() => s.value * 2, [s])

// for multiple signals, prefer computedOf - cleaner syntax with type-safe values
const c2 = computedOf(s, p)((sVal, pVal) => sVal + pVal)
```

When you create a Computed signal, you need to provide a function that returns the value of the signal. The function will be called whenever the dependency signals in the second argument change. There is no magic here, if you don't provide the dependency signals, the computed signal will not update.

Signals can also be created from promises using the `Signal.ofPromise()` static method.

```ts
const userSignal = Signal.ofPromise(
  fetch('/api/user').then(r => r.json()),
  null, // initial value before promise resolves
  error => ({ error: String(error) }) // optional error recovery function
)
```

The first argument is a promise that resolves to the value of the signal. The second argument is the initial value used until the promise resolves. An optional third argument is an error recovery function.

## Read signals

Once you have a signal, you can read its value using the `value` property (or `get()` function). You generally don't access the `value` property directly unless you are referring it within an event handler or a computed signal.

Since signals are reactive, you can listen to changes using the `on()` method. The method returns a function that you can call to stop listening to changes.

This is how tempo monitors changes and updates the DOM.

When you add a callback to a signal, the callback is called immediately with the current value of the signal.

## Modify props

You can update a prop using the `set()` method or using the `value` setter. They both take a new value and update the signal. You can also update a prop using the `update()` method. The method takes a function that receives the current value and returns the new value.

```ts
const p = prop(0)
p.set(1)
p.value = 2
p.update(v => v + 1)
```

## Effects

You can also create side effects using the `effect()` function. The function takes a function that performs the side effect and an array of signals that the side effect depends on. The function is called immediately and whenever the dependency signals change. The function returns a function that you can call to stop the side effect.

## Transform signals

You can transform signals using the `map()`, `filter()`, `flatMap()`, and other functions. These functions create a new signal that is derived from the original signal.

```ts
const count = prop(0)
const doubled = count.map(x => x * 2) // ✨ Auto-disposed
const positive = count.filter(x => x > 0) // ✨ Auto-disposed
```

**Automatic Disposal:** All derived signals (created with `.map()`, `.filter()`, `.flatMap()`, etc.) are automatically tracked and disposed when used within renderables. No manual cleanup needed!

Since you will often work with signals of objects, you might find the `$` property useful. `$` is an object that contains signals for each property of the object. This makes it easy to work with signals of objects.

```ts
const prop = prop({ name: 'John', age: 30 })
console.log(prop.$.name.value) // John
```

The `at()` function is equivalent to `$` and it takes the key as an argument.

## Automatic Memory Management

When you create signals within a renderable, Tempo automatically tracks them and disposes them when the component is removed from the DOM. This applies to:

- **Signal creation**: `prop()`, `signal()`, `computed()`, `computedOf()`
- **Signal transformations**: `.map()`, `.filter()`, `.flatMap()`, `.filterMap()`, etc.
- **Effects**: `effect()` functions

```ts
import { html, prop, render } from '@tempots/dom'

const MyComponent = () => {
  const count = prop(0) // ✨ Auto-disposed
  const doubled = count.map(x => x * 2) // ✨ Auto-disposed

  return html.div('Count: ', count, ' Doubled: ', doubled)
}

const clear = render(MyComponent(), document.body)
// Later: clear() will automatically dispose count and doubled
```

### Long-Lived Signals

If you need to create a signal that outlives the current component scope, use `untracked()`:

```ts
import { untracked, prop } from '@tempots/dom'

const globalState = untracked(() => prop(0)) // Not auto-disposed
// Remember to dispose manually when done: globalState.dispose()
```

## Signal Methods Reference

### Listening Methods

| Method                         | Description                                                                                   |
| ------------------------------ | --------------------------------------------------------------------------------------------- |
| `on(listener, options?)`       | Listen to value changes. Called immediately with current value. Returns unsubscribe function. |
| `onChange(listener, options?)` | Like `on()` but skips the initial call - only fires on actual changes.                        |
| `hasListeners()`               | Returns `true` if the signal has any registered listeners.                                    |

**Listener Options:**

```ts
type ListenerOptions = {
  skipInitial?: boolean // Don't call immediately with current value
  once?: boolean // Unsubscribe after first call
  abortSignal?: AbortSignal // Cancel via AbortController
}
```

### Transformation Methods

| Method                                 | Description                                                  |
| -------------------------------------- | ------------------------------------------------------------ |
| `map(fn, equals?)`                     | Transform values to a new type. Returns a Computed signal.   |
| `flatMap(fn, equals?)`                 | Map then flatten nested signals.                             |
| `filter(predicate, startValue?)`       | Only emit values matching predicate.                         |
| `filterMap(fn, startValue, equals?)`   | Map + filter in one operation. Skips null/undefined results. |
| `mapMaybe(fn, alt)`                    | Map with fallback for null/undefined results.                |
| `mapAsync(fn, alt, recover?, equals?)` | Async transformation with abort support.                     |
| `tap(fn)`                              | Execute side effect without modifying value.                 |

```ts
const count = prop(5)

// Transform to different types
const doubled = count.map(n => n * 2)
const message = count.map(n => `Count is ${n}`)

// Filter values
const positive = count.filter(n => n > 0)

// Async transformation
const userData = userId.mapAsync(
  async (id, { abortSignal }) => {
    const res = await fetch(`/api/users/${id}`, { signal: abortSignal })
    return res.json()
  },
  null // initial value
)

// Side effects without modifying
const logged = count.tap(n => console.log('Value:', n))
```

### Object Access Methods

| Method    | Description                                                                                              |
| --------- | -------------------------------------------------------------------------------------------------------- |
| `at(key)` | Get a signal for a specific property of the value.                                                       |
| `$`       | Proxy object providing signals for all properties. `signal.$.name` is equivalent to `signal.at('name')`. |

### Disposal Methods

| Method                | Description                                     |
| --------------------- | ----------------------------------------------- |
| `dispose()`           | Dispose the signal and release all resources.   |
| `isDisposed()`        | Returns `true` if the signal has been disposed. |
| `onDispose(listener)` | Register a callback to run when disposed.       |

### Prop-Specific Methods

| Method          | Description                                              |
| --------------- | -------------------------------------------------------- |
| `set(value)`    | Set a new value.                                         |
| `update(fn)`    | Update value using a function: `prop.update(v => v + 1)` |
| `reducer(fn)`   | Create a reducer function with effects.                  |
| `iso(get, set)` | Create a bidirectional transformation (isomorphism).     |
| `atProp(key)`   | Get a writable Prop for a specific property.             |

```ts
const user = prop({ name: 'John', age: 30 })

// Get writable access to nested property
const nameProp = user.atProp('name')
nameProp.value = 'Jane' // Updates user.value.name
```

### Static Methods

| Method                                               | Description                     |
| ---------------------------------------------------- | ------------------------------- |
| `Signal.ofPromise(promise, init, recover?, equals?)` | Create signal from a Promise.   |
| `Signal.is(value)`                                   | Check if a value is a Signal.   |
| `Prop.is(value)`                                     | Check if a value is a Prop.     |
| `Computed.is(value)`                                 | Check if a value is a Computed. |

## Storage Utilities

Tempo provides utilities for persisting signals to browser storage with automatic synchronization across tabs.

### localStorageProp

Creates a Prop backed by localStorage:

```ts
import { localStorageProp } from '@tempots/dom'

const theme = localStorageProp({
  key: 'app-theme',
  defaultValue: 'light',
})

// Value persists across page reloads
theme.value = 'dark'
```

### sessionStorageProp

Creates a Prop backed by sessionStorage (cleared when browser closes):

```ts
import { sessionStorageProp } from '@tempots/dom'

const formData = sessionStorageProp({
  key: 'checkout-form',
  defaultValue: { email: '', address: '' },
})
```

### storedProp Options

Both `localStorageProp` and `sessionStorageProp` accept these options:

```ts
type StorageOptions<T> = {
  key: Value<string> // Storage key (can be reactive)
  defaultValue: T | (() => T) // Default when not in storage
  serialize?: (v: T) => string // Custom serialization (default: JSON.stringify)
  deserialize?: (v: string) => T // Custom deserialization (default: JSON.parse)
  equals?: (a: T, b: T) => boolean // Equality function
  syncTabs?: boolean // Sync across browser tabs (default: true)
  onKeyChange?: 'load' | 'migrate' | 'keep' // Behavior when key changes
}
```

### syncProp

For cross-tab synchronization of any Prop:

```ts
import { syncProp, prop } from '@tempots/dom'

// Create a synchronized prop
const sharedState = syncProp({
  key: 'shared-state',
  prop: prop({ count: 0 }),
})

// Changes in one tab automatically appear in other tabs
sharedState.value = { count: 1 }
```

## Animation

Tempo provides built-in signal animation support to smoothly transition between values.

### animateSignal

Creates a new signal that smoothly interpolates whenever the source signal changes:

```ts
import { prop, animateSignal, easeInOutCubic } from '@tempots/dom'

const position = prop(0)
const animated = animateSignal(position, {
  duration: 300,
  easing: easeInOutCubic,
})

// When position changes, animated smoothly transitions to the new value
position.set(100) // animated smoothly goes from 0 to 100
```

### Easing Functions

Tempo includes 25 standard easing functions covering all common animation curves:

| Family | In | Out | InOut |
|--------|------|------|-------|
| Quad | `easeInQuad` | `easeOutQuad` | `easeInOutQuad` |
| Cubic | `easeInCubic` | `easeOutCubic` | `easeInOutCubic` |
| Quart | `easeInQuart` | `easeOutQuart` | `easeInOutQuart` |
| Sine | `easeInSine` | `easeOutSine` | `easeInOutSine` |
| Expo | `easeInExpo` | `easeOutExpo` | `easeInOutExpo` |
| Back | `easeInBack` | `easeOutBack` | `easeInOutBack` |
| Bounce | `easeInBounce` | `easeOutBounce` | `easeInOutBounce` |
| Elastic | `easeInElastic` | `easeOutElastic` | `easeInOutElastic` |

Plus `linear` (identity) and three **combinators** for building custom easings:

```ts
import { reverseEasing, mirrorEasing, chainEasing, easeInQuad, easeOutElastic } from '@tempots/dom'

// Reverse: plays easing backwards (easeIn → easeOut)
const myEaseOut = reverseEasing(easeInQuad)

// Mirror: symmetric in-out from a single ease-in
const myEaseInOut = mirrorEasing(easeInQuad)

// Chain: compose two easings (first half + second half)
const dramatic = chainEasing(easeInQuad, easeOutElastic)
```

### createTween

For imperative control over animations (e.g., animate to a target on user action), use `createTween`:

```ts
import { createTween, easeInOutCubic, interpolateNumber } from '@tempots/dom'

const tween = createTween(0, {
  duration: 300,
  easing: easeInOutCubic,
})

// Animate to target value on demand
tween.tweenTo(100)

// Read current animated value
tween.value.get() // smoothly approaches 100

// Cancel mid-animation
tween.cancel()

// Clean up
tween.dispose()
```

`createTween` supports a `reducedMotion` signal to respect the user's accessibility preference — when `true`, `tweenTo()` sets the value immediately without animation.

### Reduced Motion

Track the user's `prefers-reduced-motion` system preference reactively:

```ts
import { createReducedMotionSignal, createTween } from '@tempots/dom'

const reducedMotion = createReducedMotionSignal()

const tween = createTween(0, {
  duration: 300,
  reducedMotion, // automatically skips animation when user prefers reduced motion
})
```

The `ReducedMotion` provider makes this available app-wide via the `Provide`/`Use` pattern — see the [Providers page](/page/providers.html).

## Next Steps

- [Learn more about Building your own Renderables](/page/components.html)
- [Explore the Standard Library](/page/std-library.html)
- [Troubleshooting & FAQ](/page/troubleshooting.html)
- [Learn more about render](/page/render.html)
