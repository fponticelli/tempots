Tempo Server provides server-side rendering (SSR) utilities for Tempo applications. Render your Tempo components to HTML strings or streams for faster initial page loads and better SEO.

## Installation

```bash
npm install @tempots/server
```

## Features

- **renderToString** - Render components to HTML strings
- **renderToStream** - Stream rendered HTML for faster time-to-first-byte
- **createRenderer** - High-level convenience function for SSR entry points
- Hydration placeholder generation for client-side rehydration

## Quick Example

```typescript
import { renderToString } from '@tempots/server'
import { html } from '@tempots/dom'

const App = () => html.div(
  html.h1('Hello, SSR!'),
  html.p('Rendered on the server.')
)

const htmlString = await renderToString(App(), {
  url: 'https://example.com/page',
  generatePlaceholders: true,
})
```

For complete documentation, see [SSR & Headless Rendering](/page/ssr-headless.html).
