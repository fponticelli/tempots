Platform-agnostic shared renderables for the Tempo framework. This package provides the `createRenderKit` factory that each platform (DOM, Native, etc.) calls with its own renderable factory to get correctly-branded shared renderables.

## Installation

```bash
npm install @tempots/render
```

## Overview

`@tempots/render` sits between `@tempots/core` (signals, types) and platform packages (`@tempots/dom`, `@tempots/native`). It implements all the shared rendering logic — conditional rendering, list rendering, async data loading, dependency injection — in a platform-agnostic way.

Each platform package calls `createRenderKit()` with its own factory function to get renderables branded for that platform's type system.

## Features

- **Conditional Rendering** - `When`, `Unless`, `Ensure`, `EnsureAll`, `NotEmpty`
- **List Rendering** - `ForEach`, `Repeat`
- **Pattern Matching** - `OneOf`, `OneOfValue`, `OneOfField`, `OneOfKind`, `OneOfType`, `OneOfTuple`
- **Async Data** - `Task`, `Async` with pending/success/error states
- **Dependency Injection** - `Provide`, `Use` for provider-based context sharing
- **Composition** - `Fragment`, `Empty`, `Conjunction`
- **Signal Mapping** - `MapSignal` for rendering signal-driven content

## How It Works

### The RenderKit Factory

```typescript
import { createRenderKit } from '@tempots/render'

// Each platform creates its own branded kit
const domKit = createRenderKit<DOMContext, typeof DOM_TYPE>({
  type: DOM_TYPE,
  create: (renderFn) => ({ type: DOM_TYPE, render: renderFn }),
  renderTNode: (ctx, node) => { /* DOM-specific TNode rendering */ },
  wrapContext: (ctx, providers) => ctx.withProviders(providers),
  getProviders: (ctx) => ctx.providers,
})

// domKit now has: When, ForEach, Repeat, OneOf, Task, Provide, Use, etc.
// All correctly typed for DOMContext
```

### Shared Renderables

All renderables returned by `createRenderKit` share the same implementation but are branded for their specific platform:

```typescript
// These work identically on DOM and Native
When(isVisible, () => content)
ForEach(items, (item, position) => renderItem(item))
Provide(ThemeProvider, darkTheme, content)
Use(ThemeProvider, theme => renderWithTheme(theme))
Task({ run: () => fetchData(), success: data => renderData(data) })
```

## Architecture

```
@tempots/core (signals, types)
       |
@tempots/render (shared renderables via createRenderKit)
       |
  +----+--------+
  |             |
@tempots/dom  @tempots/native
```

This layered architecture ensures:
- **Code reuse**: Conditional rendering, list rendering, etc. are implemented once
- **Type safety**: Each platform's renderables are branded and cannot be mixed
- **Extensibility**: New platforms only need to implement the factory config

For more information, see the [Tempo documentation](/).
