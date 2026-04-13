---
title: SSR & Headless Rendering
order: 85
description: Server-side rendering, static site generation, and client hydration with Tempo.
---

# SSR & Headless Rendering

Tempo provides comprehensive support for server-side rendering (SSR), static site generation (SSG), and client-side hydration through dedicated packages:

| Package | Purpose |
|---------|---------|
| `@tempots/server` | Server-side rendering to strings and streams |
| `@tempots/client` | Client-side hydration and islands architecture |
| `@tempots/vite` | Vite plugin for SSG with automatic route discovery |

## Why SSR/SSG?

- **SEO optimization** - Pre-render pages for search engine crawlers
- **Performance** - Send pre-rendered HTML for faster initial page loads
- **Static hosting** - Deploy to CDNs without a server
- **Progressive enhancement** - Pages work before JavaScript loads

## @tempots/server

The server package provides functions to render Tempo components to HTML strings or streams.

### Installation

```bash
npm install @tempots/server
```

### renderToString

Renders a component to an HTML string:

```typescript
import { renderToString } from '@tempots/server'
import { html } from '@tempots/dom'

const App = () => html.div(
  html.h1('Hello, World!'),
  html.p('Rendered on the server.')
)

const htmlString = await renderToString(App(), {
  url: 'https://example.com/page',
  generatePlaceholders: true, // Enable hydration markers
})
```

### renderToStream

Renders to a Node.js Readable stream for streaming SSR:

```typescript
import { renderToStream } from '@tempots/server'

app.get('/', (req, res) => {
  const stream = renderToStream(App(), {
    url: req.url,
    onShellReady: () => res.write('<!DOCTYPE html>'),
    onAllReady: () => res.end(),
  })
  stream.pipe(res)
})
```

### createRenderer

High-level convenience function for SSR entry points:

```typescript
// entry-server.ts
import { createRenderer } from '@tempots/server'
import { App } from './App'

export const { render, renderStream } = createRenderer(
  (options) => App(options),
  {
    hydrate: true,
    getData: async (url) => {
      // Fetch data for this URL
      return { user: await fetchUser() }
    }
  }
)
```

## @tempots/client

The client package provides hydration and islands architecture support.

### Installation

```bash
npm install @tempots/client
```

### hydrate

Hydrates server-rendered HTML with client-side interactivity:

```typescript
import { hydrate } from '@tempots/client'
import { App } from './App'

// Server-rendered HTML is already in the DOM
const cleanup = hydrate(App(), document.getElementById('app')!)
```

### startClient

High-level client initialization with islands support:

```typescript
import { startClient } from '@tempots/client'
import { App } from './App'
import { Counter, TodoList } from './islands'

startClient({
  app: () => App(),
  islands: { Counter, TodoList },
  container: '#app',
  debug: true,
})
```

### Islands Architecture

Islands allow you to hydrate only interactive components while keeping the rest static:

```typescript
// Define an island component
import { html, prop, on } from '@tempots/dom'

export const Counter = (options: unknown) => {
  const { initial = 0 } = (options ?? {}) as { initial?: number }
  const count = prop(initial)

  return html.div(
    html.button(on.click(() => count.update(n => n - 1)), '-'),
    html.span(count.map(String)),
    html.button(on.click(() => count.update(n => n + 1)), '+'),
  )
}

// Mark islands in your SSR template
import { islandMarker, attr } from '@tempots/dom'

const CounterIsland = (initial: number) => html.div(
  ...islandMarker('Counter', { initial }, 'visible').map(
    ({ name, value }) => attr[name](value)
  ),
  // Static placeholder content
  html.span(String(initial))
)
```

Hydration strategies:
- `"immediate"` - Hydrate as soon as possible
- `"idle"` - Hydrate when browser is idle
- `"visible"` - Hydrate when scrolled into view
- `{ media: "(min-width: 768px)" }` - Hydrate when media query matches

## @tempots/vite

The Vite plugin provides SSG with automatic route discovery.

### Installation

```bash
npm install @tempots/vite
```

### Configuration

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import { tempo } from '@tempots/vite'

export default defineConfig({
  plugins: [
    tempo({
      mode: 'ssg',           // 'spa' (default), 'ssg', 'ssr', 'islands', or 'hybrid'
      routes: 'crawl',       // Auto-discover routes (default)
      seedRoutes: ['/'],     // Starting points for crawling
      ssrEntry: 'src/entry-server.ts',
      container: '#app',
      hydrate: true,
    })
  ]
})
```

### Route Discovery

By default, the plugin crawls your site starting from `/` and discovers all internal links:

```typescript
// Explicit routes
tempo({
  routes: ['/', '/about', '/contact'],
})

// Dynamic routes
tempo({
  routes: async () => {
    const posts = await fetchBlogPosts()
    return ['/', ...posts.map(p => `/blog/${p.slug}`)]
  },
})

// Crawl with multiple entry points
tempo({
  routes: 'crawl',
  seedRoutes: ['/', '/docs', '/api'],
})
```

### Project Structure

```
my-app/
├── src/
│   ├── App.ts              # Main app component
│   ├── entry-client.ts     # Client entry (hydration)
│   └── entry-server.ts     # Server entry (rendering)
├── index.html              # HTML template
└── vite.config.ts          # Vite configuration
```

### Entry Files

**entry-server.ts:**
```typescript
import { renderToString } from '@tempots/server'
import { App } from './App'

export async function render(url: string): Promise<string> {
  return renderToString(App(), {
    url,
    generatePlaceholders: true,
  })
}
```

**entry-client.ts:**
```typescript
import { render } from '@tempots/dom'
import { App } from './App'

render(App(), document.getElementById('app')!)
```

## Low-Level API: runHeadless

For advanced use cases, you can use the low-level headless rendering API:

```typescript
import { runHeadless, html } from '@tempots/dom'

const App = () => html.div(
  html.h1('Hello, World!'),
  html.p('Headless rendered')
)

const { root, clear, currentURL } = runHeadless(() => App(), {
  startUrl: 'https://example.com',
  selector: 'body',
})

// Get HTML output
const htmlOutput = root.contentToHTML(true) // true = include placeholders

// Clean up
clear()
```

## Context-Aware Rendering

Conditionally render based on environment:

```typescript
import { html, WithBrowserCtx, WithHeadlessCtx } from '@tempots/dom'

const App = () => html.div(
  // Only in browser
  WithBrowserCtx(() =>
    html.div('Window width: ', window.innerWidth.toString())
  ),

  // Only in headless/SSR
  WithHeadlessCtx(() =>
    html.div('Server-rendered placeholder')
  ),

  // Both environments
  html.p('Universal content')
)
```

## Next Steps

- [Quick Start](/page/quick-start.html) - Get started with Tempo
- [Renderables](/page/renderables.html) - Learn about the building blocks
- [Signals](/page/signals.html) - Reactive state management
- [Examples](/page/examples.html) - Common patterns and best practices
