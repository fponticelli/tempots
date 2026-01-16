Tempo Vite is a Vite plugin for building Tempo applications with SSR, SSG, or islands architecture. It provides automatic route discovery, static site generation, and seamless integration with Vite's build system.

## Installation

```bash
npm install @tempots/vite
```

## Features

- **SSG Mode** - Static site generation with pre-rendered HTML
- **SSR Mode** - Server-side rendering for dynamic content
- **Islands Mode** - Selective hydration of interactive components
- **Route Crawling** - Automatic route discovery by crawling internal links
- Seamless Vite integration

## Quick Example

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import { tempo } from '@tempots/vite'

export default defineConfig({
  plugins: [
    tempo({
      mode: 'ssg',
      ssrEntry: 'src/entry-server.ts',
      routes: 'crawl',  // Auto-discover routes
      hydrate: true,
    })
  ]
})
```

## Route Discovery

```typescript
// Explicit routes
tempo({ routes: ['/', '/about', '/contact'] })

// Dynamic routes
tempo({
  routes: async () => {
    const posts = await fetchBlogPosts()
    return ['/', ...posts.map(p => `/blog/${p.slug}`)]
  }
})

// Crawl with seed routes (default)
tempo({
  routes: 'crawl',
  seedRoutes: ['/', '/docs'],
})
```

For complete documentation, see [SSR & Headless Rendering](/page/ssr-headless.html).
