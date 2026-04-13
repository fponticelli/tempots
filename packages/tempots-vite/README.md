# @tempots/vite

Vite plugin for Tempo applications with SPA, SSG, and SSR support.

## Installation

```bash
npm install @tempots/vite
# or
pnpm add @tempots/vite
```

## Features

- **SPA Mode** (default): Pure client-side rendering, no server pipeline
- **SSG Mode**: Pre-render pages at build time for static hosting
- **SSR Mode**: Server-side render on each request with HMR support
- **Islands Mode**: Static by default, hydrate only marked interactive components
- **Hybrid Mode**: Combine SSG for static pages with SSR for dynamic ones
- **HMR**: Component-level hot module replacement with state preservation

## Usage

### Single-Page Application (SPA)

Pure client-side rendering — the default. No `entry-server.ts` required:

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import { tempo } from '@tempots/vite'

export default defineConfig({
  plugins: [tempo()]
})
```

### Static Site Generation (SSG)

Pre-render pages at build time:

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import { tempo } from '@tempots/vite'

export default defineConfig({
  plugins: [
    tempo({
      mode: 'ssg',
      routes: ['/', '/about', '/contact'],
    })
  ]
})
```

### Server-Side Rendering (SSR)

Render pages on each request:

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import { tempo } from '@tempots/vite'

export default defineConfig({
  plugins: [
    tempo({
      mode: 'ssr',
      ssrEntry: 'src/entry-server.ts',
    })
  ]
})
```

### Islands Architecture

Static by default, hydrate only interactive components:

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import { tempo } from '@tempots/vite'

export default defineConfig({
  plugins: [
    tempo({
      mode: 'islands',
    })
  ]
})
```

## HMR (Hot Module Replacement)

The plugin provides automatic HMR for Tempo applications in dev mode. No code changes required — just add the plugin.

### How It Works

- **File-level HMR**: The plugin detects `render()` calls and wraps them in an HMR boundary. When any file changes, the app re-renders without a full page reload.
- **Component-level HMR**: Calls to PascalCase functions imported from local modules (e.g., `ItemLink(item)`) are wrapped in component boundaries. When a component's source file changes, only the subtrees using that component re-render — the rest of the page is untouched.
- **State preservation**: `Prop` signals assigned to variables (`const count = prop(0)`) are automatically labeled in dev mode. Their values are snapshotted before a hot update and restored after re-render.
- **Error overlay**: If a re-render throws, Vite's native error overlay shows the error. Fixing the code and saving dismisses it automatically.

### Component Naming Convention

The component-level HMR uses PascalCase as a heuristic to identify component functions:

- `ItemLink`, `PageFeedView`, `App` — **wrapped** (PascalCase, imported from relative path)
- `loadRoute`, `formatItem` — **not wrapped** (camelCase)
- `When`, `ForEach`, `Fragment` — **not wrapped** (imported from `@tempots/dom`, not a relative path)

### HMR Configuration

HMR is enabled by default in dev mode. To disable:

```typescript
tempo({ hmr: false })
```

## Configuration

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `mode` | `'spa' \| 'ssg' \| 'ssr' \| 'islands' \| 'hybrid'` | `'spa'` | Rendering mode |
| `routes` | `string[] \| RouteConfig[] \| (() => Promise<...>) \| 'crawl'` | `'crawl'` | Routes to pre-render (SSG) |
| `seedRoutes` | `string[]` | `['/']` | Seed routes for crawl mode |
| `entry` | `string` | `'src/entry-client.ts'` | Client entry file |
| `ssrEntry` | `string` | `'src/entry-server.ts'` | Server entry file (exports `render` or `App`) |
| `template` | `string` | `'index.html'` | HTML template file |
| `container` | `string` | `'#app'` | App container selector |
| `hydrate` | `boolean` | `true` for SSR/islands | Generate hydration markers |
| `outDir` | `string` | `'dist'` | Output directory |
| `hmr` | `boolean \| { errorBoundary?: boolean }` | `true` | HMR configuration (dev mode only) |

### Route Configuration

Routes can be simple strings or objects with more options:

```typescript
tempo({
  mode: 'ssg',
  routes: [
    '/',                              // Simple path
    '/about',
    { path: '/blog', output: 'blog.html' },  // Custom output
  ]
})
```

### Automatic Route Discovery (Default)

By default, the plugin automatically discovers routes by crawling internal links starting from `/`:

```typescript
tempo({
  mode: 'ssg',
  // routes: 'crawl' is the default
})
```

Customize crawling with seed routes:

```typescript
tempo({
  mode: 'ssg',
  routes: 'crawl',
  seedRoutes: ['/', '/api', '/docs'],  // Start crawling from multiple entry points
})
```

The crawler:
- Follows all internal links (`href` starting with `/`)
- Skips external links and static assets
- Handles `.html` routes
- Strips query strings and hash fragments

### Dynamic Routes

Use a function to generate routes dynamically:

```typescript
tempo({
  mode: 'ssg',
  routes: async () => {
    const posts = await fetchBlogPosts()
    return [
      '/',
      '/about',
      ...posts.map(post => `/blog/${post.slug}`)
    ]
  }
})
```

## API

### `tempo(options?)`

Creates the Tempo Vite plugin.

**Returns:** `Plugin[]` - Array of Vite plugins

### `renderApp(app, options?)`

Helper to render a Tempo app to HTML string. Useful for custom SSR setups.

```typescript
import { renderApp } from '@tempots/vite'
import { App } from './App'

const html = await renderApp(App(), { hydrate: true })
```

## Project Structure

Recommended project structure for SSR:

```
my-app/
├── src/
│   ├── App.ts           # Main app component
│   ├── entry-client.ts  # Client entry (hydration)
│   └── entry-server.ts  # Server entry (rendering)
├── index.html           # HTML template
├── server.js            # Express/Node server
└── vite.config.ts       # Vite configuration
```

## Example: Full SSR Setup

See the [ssr-demo](../../demo/ssr-demo) for a complete working example.

## License

Apache-2.0
