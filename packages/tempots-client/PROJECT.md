Tempo Client provides client-side hydration utilities for Tempo SSR applications. Hydrate server-rendered HTML to make it interactive, or use the islands architecture to selectively hydrate only interactive components.

## Installation

```bash
npm install @tempots/client
```

## Features

- **hydrate** - Hydrate server-rendered HTML with client-side interactivity
- **startClient** - High-level client initialization with islands support
- **Islands Architecture** - Hydrate only interactive components while keeping the rest static
- Multiple hydration strategies: immediate, idle, visible, and media query-based

## Quick Example

```typescript
import { startClient } from '@tempots/client'
import { App } from './App'
import { Counter, TodoList } from './islands'

startClient({
  app: () => App(),
  islands: { Counter, TodoList },
  container: '#app',
})
```

## Islands Architecture

Islands allow selective hydration of interactive components:

```typescript
import { islandMarker, attr, html } from '@tempots/dom'

const CounterIsland = (initial: number) => html.div(
  ...islandMarker('Counter', { initial }, 'visible').map(
    ({ name, value }) => attr[name](value)
  ),
  html.span(String(initial))  // Static placeholder
)
```

Hydration strategies:
- `"immediate"` - Hydrate as soon as possible
- `"idle"` - Hydrate when browser is idle
- `"visible"` - Hydrate when scrolled into view
- `{ media: "(min-width: 768px)" }` - Hydrate when media query matches

For complete documentation, see [SSR & Headless Rendering](/page/ssr-headless.html).
