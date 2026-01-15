# @tempots/server

Server-side rendering utilities for Tempo applications.

## Installation

```bash
npm install @tempots/server
# or
pnpm add @tempots/server
```

## Features

- **Streaming SSR**: Stream HTML to the client for faster Time To First Byte (TTFB)
- **String rendering**: Generate complete HTML strings for simpler use cases
- **Static markup**: Generate HTML without hydration markers for emails, PDFs, etc.
- **Full Tempo compatibility**: Works with all Tempo renderables, signals, and providers

## Usage

### Quick Start with `createRenderer()`

The simplest way to set up your server-side rendering entry point:

```typescript
// entry-server.ts
import { createRenderer } from '@tempots/server'
import { App } from './app'

export const { render, renderStream } = createRenderer(App, {
  getData: (url) => ({
    timestamp: new Date().toISOString(),
    path: new URL(url, 'https://example.com').pathname,
  }),
})

export { App }
```

This creates standard `render()` and `renderStream()` functions ready for use with your Express/Vite server.

### Streaming (Recommended for large pages)

```typescript
import { renderToStream } from '@tempots/server'
import { html } from '@tempots/dom'
import express from 'express'

const App = () => html.div(
  html.h1('Hello, World!'),
  html.p('This is streamed from the server.')
)

const app = express()

app.get('/', (req, res) => {
  res.setHeader('Content-Type', 'text/html')
  const stream = renderToStream(App(), {
    url: req.url,
    onShellReady: () => {
      // Shell is ready, headers can be sent
    },
    onAllReady: () => {
      // All content has been rendered
    },
    onError: (error) => {
      console.error('Render error:', error)
    }
  })
  stream.pipe(res)
})
```

### String Rendering

```typescript
import { renderToString } from '@tempots/server'
import { html } from '@tempots/dom'

const App = () => html.div(
  html.h1('Hello, World!'),
  html.p('This is rendered on the server.')
)

const htmlString = await renderToString(App())
```

### Static Markup (No hydration)

```typescript
import { renderToStaticMarkup } from '@tempots/server'
import { html } from '@tempots/dom'

const EmailTemplate = () => html.div(
  html.h1('Welcome!'),
  html.p('Thank you for signing up.')
)

const markup = await renderToStaticMarkup(EmailTemplate())
// Use for emails, PDFs, etc.
```

## API

### `createRenderer(App, options?)`

High-level function to create standard render functions for SSR entry points.

**Parameters:**
- `App: (options: O) => Renderable` - The app component factory

**Options:**
- `getData?: (url: string) => O | Promise<O>` - Function to get initial data for each request
- `hydrate?: boolean` - Generate hydration placeholders (default: `true`)
- `selector?: string` - Root element selector (default: `"body"`)
- `providers?: Providers` - Providers to inject during rendering

**Returns:** `{ render, renderStream }`
- `render(url: string): Promise<string>` - Renders to HTML string
- `renderStream(url: string): Readable` - Renders to stream

**Example:**
```typescript
export const { render, renderStream } = createRenderer(App, {
  getData: (url) => ({ timestamp: Date.now() }),
  hydrate: true,
})
```

### `renderToStream(renderable, options?)`

Renders a Renderable to a Node.js Readable stream.

**Options:**
- `url?: string` - Initial URL for routing (default: 'https://example.com')
- `selector?: string` - Root element selector (default: 'body')
- `generatePlaceholders?: boolean` - Include hydration markers (default: false)
- `providers?: Providers` - Providers to inject during rendering
- `onShellReady?: () => void` - Called when shell content is ready
- `onAllReady?: () => void` - Called when all content is rendered
- `onError?: (error: Error) => void` - Called on render errors

### `renderToString(renderable, options?)`

Renders a Renderable to an HTML string.

**Options:**
- `url?: string` - Initial URL for routing
- `selector?: string` - Root element selector
- `generatePlaceholders?: boolean` - Include hydration markers
- `providers?: Providers` - Providers to inject during rendering
- `onError?: (error: Error) => void` - Called on render errors

### `renderToStaticMarkup(renderable, options?)`

Renders a Renderable to static HTML without hydration markers.

Same options as `renderToString` except `generatePlaceholders` is forced to `false`.

## License

Apache-2.0
