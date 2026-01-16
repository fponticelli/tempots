---
title: Installation
order: 20
description: Install Tempo using npm or yarn.
---
# Installation

Tempo is available as a package on npm. You can install it using npm or yarn:

```bash
# npm
npm install @tempots/dom

# yarn
yarn add @tempots/dom
```

Tempo is written in TypeScript so types are generated and included in the package. You can use Tempo with or without TypeScript. If you are using TypeScript, you will get full type checking and autocompletion.

`@tempots/dom` doesn't have any dependency. If you use `@tempots/ui` you will also need to install `@tempots/dom` and `@tempots/std` as they are peer dependencies.

## Additional Packages

Tempo provides additional packages for specific use cases:

| Package | Purpose |
|---------|---------|
| `@tempots/std` | Standard library with utilities and common patterns |
| `@tempots/ui` | Pre-built UI components |
| `@tempots/server` | Server-side rendering to strings and streams |
| `@tempots/client` | Client-side hydration and islands architecture |
| `@tempots/vite` | Vite plugin for SSG with automatic route discovery |

### For SSR/SSG Projects

If you're building a server-rendered or static site, install the SSR packages:

```bash
npm install @tempots/dom @tempots/server @tempots/client @tempots/vite
```

See [SSR & Headless Rendering](/page/ssr-headless.html) for detailed documentation.

## Next Steps

- [How does Tempo work?](/page/how-it-works.html)
- [Learn more about Renderables](/page/renderables.html)
- [Learn more about Signals](/page/signals.html)
- [Learn more about Building your own Renderables](/page/components.html)
- [SSR & Headless Rendering](/page/ssr-headless.html)
- [Explore Examples & Best Practices](/page/examples.html)
- [Learn more about render](/page/render.html)
