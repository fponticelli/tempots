# Tempo SSR Demo

A demonstration of Server-Side Rendering (SSR) and Islands Architecture with Tempo.

## Features Demonstrated

- **Full Hydration**: Interactive counter that hydrates immediately
- **Islands Architecture**: Multiple counters with different hydration strategies
  - `immediate`: Hydrates as soon as JS loads
  - `idle`: Hydrates when browser is idle
  - `visible`: Hydrates when scrolled into view
- **Server-Side Rendering**: Initial HTML rendered on the server
- **Streaming Support**: Progressive HTML delivery for faster TTFB

## Quick Start

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## Project Structure

```
ssr-demo/
├── src/
│   ├── App.ts           # Main app component with islands
│   ├── entry-client.ts  # Client entry (hydration + islands init)
│   └── entry-server.ts  # Server entry (SSR rendering)
├── index.html           # HTML template
├── server.js            # Express server for SSR
├── package.json
└── vite.config.ts
```

## How It Works

### Server-Side Rendering

The Express server (`server.js`) handles all requests:

1. Loads the `entry-server.ts` module
2. Renders the app to HTML using `@tempots/server`
3. Injects the HTML into the template
4. Sends the complete page to the client

### Client Hydration

The client (`entry-client.ts`) handles interactivity:

1. **Full Hydration**: The main app is hydrated with `hydrate()`
2. **Islands**: Components marked as islands are hydrated with `initIslands()`
3. Each island hydrates based on its strategy (immediate, idle, visible)

### Islands Architecture

Islands are marked in the server-rendered HTML with data attributes:

```html
<div data-tempo-island="Counter"
     data-tempo-props='{"initial":10}'
     data-tempo-hydrate="visible">
  <!-- Server-rendered content -->
</div>
```

The client scans for these markers and hydrates each island when its strategy triggers.

## Scripts

- `pnpm dev` - Start development server with HMR
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm start` - Start production server

## Dependencies

- `@tempots/dom` - Core Tempo rendering
- `@tempots/server` - Server-side rendering
- `@tempots/client` - Client-side hydration and islands
- `express` - HTTP server
- `vite` - Build tool and dev server

## License

Apache-2.0
