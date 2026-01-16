# @tempots/vite

Vite plugin for Tempo applications with SSG and SSR support.

## Installation

```bash
npm install @tempots/vite
# or
pnpm add @tempots/vite
```

## Features

- **SSG Mode**: Pre-render pages at build time for static hosting
- **SSR Mode**: Server-side render on each request with HMR support
- **Islands Mode**: Static by default, hydrate only marked interactive components
- **Hybrid Mode**: Combine SSG for static pages with SSR for dynamic ones
- **Vite Integration**: Full HMR support in development

## Usage

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

## Configuration

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `mode` | `'ssg' \| 'ssr' \| 'islands' \| 'hybrid'` | `'ssg'` | Rendering mode |
| `routes` | `string[] \| RouteConfig[] \| (() => Promise<...>) \| 'crawl'` | `'crawl'` | Routes to pre-render (SSG) |
| `seedRoutes` | `string[]` | `['/']` | Seed routes for crawl mode |
| `entry` | `string` | `'src/entry-client.ts'` | Client entry file |
| `ssrEntry` | `string` | `'src/entry-server.ts'` | Server entry file (exports `render` or `App`) |
| `template` | `string` | `'index.html'` | HTML template file |
| `container` | `string` | `'#app'` | App container selector |
| `hydrate` | `boolean` | `true` for SSR/islands | Generate hydration markers |
| `outDir` | `string` | `'dist'` | Output directory |

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
