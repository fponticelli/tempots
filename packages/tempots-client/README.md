# @tempots/client

Client-side hydration utilities for Tempo applications with SSR support.

## Installation

```bash
npm install @tempots/client
# or
pnpm add @tempots/client
```

## Features

- **Hydration**: Attach client-side interactivity to server-rendered HTML
- **Islands Architecture**: Partial hydration with lazy loading strategies
- **Multiple Hydration Strategies**: immediate, idle, visible, and media query-based
- **Full Tempo Compatibility**: Works seamlessly with Tempo signals and components

## Usage

### Quick Start with `startClient()`

The simplest way to initialize your client-side application:

```typescript
// entry-client.ts
import { startClient } from '@tempots/client'
import { App, Counter, TodoList } from './app'

startClient({
  app: () => App(),              // App to render in client-only mode
  islands: { Counter, TodoList }, // Islands to hydrate
  debug: true,                    // Optional: enable debug logging
})
```

`startClient()` automatically:
- Detects SSR vs client-only mode
- Initializes islands with their hydration strategies
- Sets up HMR cleanup (when available)

### Basic Hydration (Low-Level)

For more control, use the low-level `hydrate()` function:

```typescript
import { hydrate } from '@tempots/client'
import { App } from './App'

// Server-rendered HTML is already in the DOM
const container = document.getElementById('app')!

// Hydrate with client-side interactivity
const cleanup = hydrate(App(), container)

// Later, to cleanup all event listeners:
cleanup()
```

### Islands Architecture

Islands allow you to hydrate only specific interactive components while keeping the rest as static HTML.

#### Server-side: Mark islands

```typescript
import { html } from '@tempots/dom'
import {
  ISLAND_ATTR,
  ISLAND_OPTIONS_ATTR,
  ISLAND_HYDRATE_ATTR,
} from '@tempots/client'

// Or use the islandMarker helper
import { islandMarker } from '@tempots/client'

const Page = () => html.div(
  html.h1('Static content - no JS shipped'),

  // This counter will be hydrated as an island
  html.div(
    ...islandMarker('Counter', { initial: 10 }, 'visible'),
    // Server-rendered content
    html.button('-'),
    html.span('10'),
    html.button('+'),
  ),
)
```

#### Client-side: Initialize islands

```typescript
import { initIslands } from '@tempots/client'
import { Counter } from './islands/Counter'

// Initialize all islands found in the document
const cleanup = initIslands({
  Counter,
})
```

### Hydration Strategies

Islands support multiple hydration strategies to optimize loading performance:

```typescript
// Hydrate immediately when JS loads
islandMarker('Counter', options, 'immediate')

// Hydrate when browser is idle (requestIdleCallback)
islandMarker('Counter', options, 'idle')

// Hydrate when scrolled into view (IntersectionObserver)
islandMarker('Counter', options, 'visible')

// Hydrate when media query matches
islandMarker('Counter', options, { media: '(min-width: 768px)' })
```

## API

### `startClient(options)`

High-level function to initialize the Tempo client with automatic SSR detection.

**Options:**
- `app?: () => Renderable` - App component for client-only rendering
- `islands: IslandRegistry` - Map of island names to component factories
- `container?: string | HTMLElement` - Container selector or element (default: `"#app"`)
- `providers?: Providers` - Providers to inject during hydration
- `debug?: boolean` - Enable debug logging (default: `false`)

**Returns:** `() => void` - Cleanup function

**Example:**
```typescript
startClient({
  app: () => App(),
  islands: { Counter, TodoList },
  container: '#app',
  debug: true,
})
```

### `hydrate(renderable, container, options?)`

Hydrates server-rendered HTML with client-side interactivity.

**Parameters:**
- `renderable: Renderable` - The Tempo renderable (should match server render)
- `container: HTMLElement` - Container with server-rendered content
- `options?: HydrateOptions` - Optional configuration

**Options:**
- `providers?: Providers` - Providers to inject during hydration
- `removeMarkers?: boolean` - Remove hydration markers after hydration (default: true)

**Returns:** `() => void` - Cleanup function

### `hydrateIsland(element, component, componentOptions, hydrateOptions?)`

Hydrates a single island element.

**Parameters:**
- `element: HTMLElement` - The island container element
- `component: (options: O) => Renderable` - Component factory
- `componentOptions: O` - Options to pass to the component
- `hydrateOptions?: IslandHydrateOptions` - Optional configuration

**Returns:** `() => void` - Cleanup function

### `initIslands(registry, options?)`

Scans the document for islands and hydrates them based on their strategy.

**Parameters:**
- `registry: IslandRegistry` - Map of island names to component factories
- `options?: IslandHydrateOptions` - Optional configuration

**Returns:** `() => void` - Cleanup function for all islands

### `islandMarker(name, options, strategy?)`

Creates attributes for marking an island during server-side rendering.

**Parameters:**
- `name: string` - Island name (must match registry key)
- `options: unknown` - Options to serialize
- `strategy?: HydrationStrategy` - When to hydrate (default: 'visible')

**Returns:** `Array<{ name: string; value: string }>` - Attribute list

## Constants

- `ISLAND_ATTR` - Attribute name for island markers (`data-tempo-island`)
- `ISLAND_HYDRATE_ATTR` - Attribute for hydration strategy (`data-tempo-hydrate`)
- `ISLAND_OPTIONS_ATTR` - Attribute for serialized options (`data-tempo-options`)
- `HYDRATION_ID_ATTR` - Attribute for hydration IDs (`data-tts-id`)

## License

Apache-2.0
