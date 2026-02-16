Core types and utilities for the multi-context Tempo framework. This package provides the foundational signal system, disposal management, and rendering primitives shared across all Tempo rendering contexts.

## Installation

```bash
npm install @tempots/core
```

## Features

- **Signal System** - Reactive state management with `Signal`, `Prop`, and `Computed`
- **Disposal Scopes** - Automatic resource lifecycle management
- **Renderables** - Type-safe renderable abstraction for multi-context rendering
- **Providers** - Dependency injection via `makeProviderMark`
- **Signal Utilities** - Rich set of derived signal operators

## Signals

Signals are the reactive primitives that drive all state management in Tempo:

```typescript
import { prop, computed, effect } from '@tempots/core'

// Prop: read-write signal
const count = prop(0)

// Computed: derived signal
const doubled = computed(() => count.value * 2)

// Effect: side-effect on signal changes
effect(() => console.log('Count:', count.value))

// Update triggers reactivity
count.set(5) // logs "Count: 5", doubled.value === 10
```

### Signal Transformations

```typescript
// Map, filter, flatMap
const label = count.map(n => `Count: ${n}`)
const positive = count.filter(n => n > 0)

// Async mapping
const data = count.mapAsync(async n => fetch(`/api/${n}`).then(r => r.json()))

// Feed into another prop
const target = prop('')
count.feedProp(target, n => String(n))
```

### Signal Utilities

```typescript
import { and, or, not, notNil, throttleSignal, distinctUntilChanged, accumulateSignal } from '@tempots/core'

// Boolean combinators
const canSubmit = and(isValid, isNotLoading)
const showWarning = or(hasError, isExpired)
const isHidden = not(isVisible)

// Throttle rapid updates
const throttled = throttleSignal(mouseMoveSignal, 16) // ~60fps

// Skip duplicate values
const unique = distinctUntilChanged(searchQuery)

// Accumulate values (scan/reduce)
const sum = accumulateSignal(valueSignal, (acc, val) => acc + val, 0)
```

### Storage-Backed Props

```typescript
import { localStorageProp, sessionStorageProp, storedProp } from '@tempots/core'

const theme = localStorageProp({ key: 'theme', defaultValue: 'light' })
const token = sessionStorageProp({ key: 'auth-token', defaultValue: '' })
```

### History / Undo-Redo

```typescript
import { prop, propHistory } from '@tempots/core'

const counter = prop(0)
const history = propHistory(counter)

counter.set(1); counter.set(2); counter.set(3)
history.undo()  // counter.value === 2
history.redo()  // counter.value === 3
history.go(0)   // counter.value === 0
```

## Disposal Scopes

Signals created within a `DisposalScope` are automatically tracked and disposed when the scope is disposed:

```typescript
import { DisposalScope, prop, computed } from '@tempots/core'

const scope = new DisposalScope()
const count = scope.prop(0)
const doubled = scope.computed(() => count.value * 2)

// Later: disposes both signals
scope.dispose()
```

## Core Types

### Renderable

The universal rendering abstraction that all platform packages build upon:

```typescript
import { createRenderable } from '@tempots/core'

const MY_TYPE = Symbol('MY_RENDERABLE')

const myComponent = createRenderable(MY_TYPE, (ctx) => {
  // Render logic here
  return (removeTree) => {
    // Cleanup logic here
  }
})
```

### TNode

Represents any content that can be rendered — renderables, strings, signals of strings, arrays, or null:

```typescript
type TNode<CTX, TType> = Renderable<CTX, TType> | Value<string> | null | undefined | Renderable<CTX, TType>[]
```

### Value

A type that can be either a static value or a reactive signal:

```typescript
type Value<T> = T | Signal<T>
```

## Usage

`@tempots/core` is typically used indirectly through platform-specific packages like `@tempots/dom` or `@tempots/native`. Those packages re-export the signal system and provide higher-level APIs built on these core types.

For more information, see the [Tempo documentation](/).
