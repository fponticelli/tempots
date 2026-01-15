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

### Basic Hydration

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
  ISLAND_PROPS_ATTR,
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
islandMarker('Counter', props, 'immediate')

// Hydrate when browser is idle (requestIdleCallback)
islandMarker('Counter', props, 'idle')

// Hydrate when scrolled into view (IntersectionObserver)
islandMarker('Counter', props, 'visible')

// Hydrate when media query matches
islandMarker('Counter', props, { media: '(min-width: 768px)' })
```

## API

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

### `hydrateIsland(element, component, props, options?)`

Hydrates a single island element.

**Parameters:**
- `element: HTMLElement` - The island container element
- `component: (props: P) => Renderable` - Component factory
- `props: P` - Props to pass to the component
- `options?: IslandHydrateOptions` - Optional configuration

**Returns:** `() => void` - Cleanup function

### `initIslands(registry, options?)`

Scans the document for islands and hydrates them based on their strategy.

**Parameters:**
- `registry: IslandRegistry` - Map of island names to component factories
- `options?: IslandHydrateOptions` - Optional configuration

**Returns:** `() => void` - Cleanup function for all islands

### `islandMarker(name, props, strategy?)`

Creates attributes for marking an island during server-side rendering.

**Parameters:**
- `name: string` - Island name (must match registry key)
- `props: unknown` - Props to serialize
- `strategy?: HydrationStrategy` - When to hydrate (default: 'visible')

**Returns:** `Array<{ name: string; value: string }>` - Attribute list

## Constants

- `ISLAND_ATTR` - Attribute name for island markers (`data-tempo-island`)
- `ISLAND_HYDRATE_ATTR` - Attribute for hydration strategy (`data-tempo-hydrate`)
- `ISLAND_PROPS_ATTR` - Attribute for serialized props (`data-tempo-props`)
- `HYDRATION_ID_ATTR` - Attribute for hydration IDs (`data-tts-id`)

## License

Apache-2.0
