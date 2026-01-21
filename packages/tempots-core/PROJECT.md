# Tempo Core (@tempots/core)

The foundational package for the Tempo framework, providing core types and utilities shared across all rendering contexts (DOM, ThreeJS, Konva, PixiJS, etc.). This package enables a consistent programming model across different rendering targets while maintaining strong type safety.

## Overview

`@tempots/core` defines the fundamental abstractions that all Tempo rendering contexts are built upon. It provides the type definitions, interfaces, and utilities that ensure type-safe, consistent behavior regardless of the target rendering environment.

## Key Features

- **Multi-Context Support**: Core abstractions work across DOM, ThreeJS, Konva, PixiJS, and other rendering targets
- **Type Safety**: Symbol-based branding ensures compile-time type checking across contexts
- **Reactive Values**: Built-in support for reactive values and Signals
- **Lightweight**: Minimal footprint with no external dependencies
- **Extensible**: Easy to build new rendering contexts on top of the core types

## Core Concepts

### Renderable

A `Renderable` is the fundamental unit that can be rendered into any context. It consists of:

- `type`: A symbol for runtime type checking
- `render(ctx)`: A method that renders content and returns a cleanup function

```typescript
import { Renderable, RenderContext, Clear } from '@tempots/core'

const MY_TYPE = Symbol('MY_RENDERABLE')

const myRenderable: Renderable<RenderContext, typeof MY_TYPE> = {
  type: MY_TYPE,
  render: (ctx) => {
    // Render logic here
    return (removeTree) => {
      // Cleanup logic here
    }
  }
}
```

### RenderContext

The base interface for all rendering contexts. Context-specific implementations (DOM, ThreeJS, etc.) extend this interface with their own methods.

```typescript
interface RenderContext {
  clear(removeTree: boolean): void
}
```

### HierarchicalContext

Extended interface for contexts that support hierarchical rendering with ordered children. Provides the `makeRef()` method for creating reference markers that preserve insertion points.

```typescript
interface HierarchicalContext extends RenderContext {
  makeRef(): this
}
```

### Clear Function

A function that cleans up rendered content. The `removeTree` parameter indicates whether to remove the entire tree or just event listeners and subscriptions.

```typescript
type Clear = (removeTree: boolean) => void
```

### TNode

A flexible type representing any content that can be rendered:

```typescript
type TNode<CTX extends RenderContext, TType extends symbol> =
  | Renderable<CTX, TType>
  | Value<string>
  | undefined
  | null
  | Renderable<CTX, TType>[]
```

### Value

Represents a value that can be either static or reactive (a Signal):

```typescript
type Value<T> = T | Signal<T>
```

## API

### createRenderable

Creates a renderable object from a render function and type symbol:

```typescript
import { createRenderable } from '@tempots/core'

const MY_TYPE = Symbol('MY_RENDERABLE')

const myComponent = createRenderable(MY_TYPE, (ctx) => {
  // Render logic
  return (removeTree) => {
    // Cleanup logic
  }
})
```

### makeProviderMark

Creates a unique symbol for dependency injection:

```typescript
import { makeProviderMark } from '@tempots/core'

interface UserService {
  getUser(id: string): Promise<User>
}

const USER_SERVICE = makeProviderMark<UserService>('UserService')
```

## Building Custom Contexts

The core package enables building custom rendering contexts for any target:

### DOM Context Example

```typescript
import { createRenderable, type Renderable } from '@tempots/core'
import type { DOMContext } from './dom-context'

export const DOM_RENDERABLE_TYPE = Symbol('DOM_RENDERABLE')
export type DOMRenderable = Renderable<DOMContext, typeof DOM_RENDERABLE_TYPE>

export function domRenderable(
  renderFn: (ctx: DOMContext) => Clear
): DOMRenderable {
  return createRenderable(DOM_RENDERABLE_TYPE, renderFn)
}
```

### ThreeJS Context Example

```typescript
import { createRenderable, type Renderable } from '@tempots/core'
import type { ThreeContext } from './three-context'

export const THREE_RENDERABLE_TYPE = Symbol('THREE_RENDERABLE')
export type ThreeRenderable = Renderable<ThreeContext, typeof THREE_RENDERABLE_TYPE>

export function threeRenderable(
  renderFn: (ctx: ThreeContext) => Clear
): ThreeRenderable {
  return createRenderable(THREE_RENDERABLE_TYPE, renderFn)
}
```

## Type Safety

The symbol-based branding system ensures compile-time type safety, preventing mixing of incompatible renderables:

```typescript
// Valid: DOM renderable in DOM context
html.div(html.span('Hello'))

// Invalid: ThreeJS renderable in DOM context
html.div(mesh.box({ width: 1, height: 1, depth: 1 }))
// Type error: ThreeRenderable is not assignable to DOMNode
```

## Integration

This package is typically used indirectly through context-specific packages like `@tempots/dom`. However, you can import it directly when:

- Building a new rendering context
- Creating shared utilities across contexts
- Implementing advanced patterns like multi-context rendering

## Installation

```bash
npm install @tempots/core
# or
pnpm add @tempots/core
# or
yarn add @tempots/core
```

## Contributing

See the main [Tempo repository](https://github.com/fponticelli/tempots) for contribution guidelines.
