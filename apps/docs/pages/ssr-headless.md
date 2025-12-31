---
title: SSR & Headless Rendering
order: 85
description: Server-side rendering and headless rendering with Tempo for improved performance and SEO.
---

# SSR & Headless Rendering

Tempo supports server-side rendering (SSR) and headless rendering for scenarios where you need to render your application without a browser environment. This is useful for:

- **SEO optimization** - Pre-render pages for search engine crawlers
- **Performance** - Send pre-rendered HTML for faster initial page loads
- **Testing** - Run component tests without a browser
- **Static site generation** - Generate static HTML files at build time

## Headless Rendering

The `runHeadless` function allows you to render Tempo components without a browser DOM:

```typescript
import { runHeadless, html, prop } from '@tempots/dom'

// Create a renderable component
const App = () => {
  const count = prop(0)
  return html.div(
    html.h1('Hello, World!'),
    html.p('Count: ', count.map(String)),
    html.button(
      on.click(() => count.update(n => n + 1)),
      'Increment'
    )
  )
}

// Run in headless mode
const { clear, root, currentURL } = runHeadless(() => App(), {
  startUrl: 'https://example.com',
  selector: 'body',
})

// The root contains the rendered structure
console.log(root) // HeadlessPortal with rendered content

// Clean up when done
clear()
```

### HeadlessOptions

```typescript
type HeadlessOptions = {
  startUrl?: Value<string> // Initial URL (default: 'https://example.com')
  selector: string // Root element selector (e.g., 'body', '#app')
  providers?: Providers // Providers to inject
}
```

## Server-Side Rendering with Adapters

To convert the headless render result to actual HTML, use the `HeadlessAdapter` class. This allows integration with HTML manipulation libraries like Cheerio.

### Cheerio Example

```typescript
import * as cheerio from 'cheerio'
import { runHeadless, HeadlessAdapter, HeadlessPortal } from '@tempots/dom'

const renderToHTML = (App: () => Renderable): string => {
  // Run the app headlessly
  const { root, clear } = runHeadless(() => App(), { selector: 'body' })

  // Load a base HTML template
  const $ = cheerio.load(
    '<!DOCTYPE html><html><head></head><body></body></html>'
  )

  // Create an adapter for Cheerio
  const adapter = new HeadlessAdapter<cheerio.Cheerio<any>>({
    select: (selector: string) => [$(selector)],
    getAttribute: (el, name) => el.attr(name) ?? null,
    setAttribute: (el, name, value) => {
      if (value === null) {
        el.removeAttr(name)
      } else {
        el.attr(name, value)
      }
    },
    getClass: el => el.attr('class') ?? '',
    setClass: (el, value) => {
      if (value === null) {
        el.removeAttr('class')
      } else {
        el.attr('class', value)
      }
    },
    getStyles: el => {
      const style = el.attr('style') ?? ''
      // Parse style string to object
      return Object.fromEntries(
        style
          .split(';')
          .filter(s => s.includes(':'))
          .map(s => s.split(':').map(p => p.trim()))
      )
    },
    setStyles: (el, styles) => {
      const styleStr = Object.entries(styles)
        .map(([k, v]) => `${k}: ${v}`)
        .join('; ')
      if (styleStr) {
        el.attr('style', styleStr)
      } else {
        el.removeAttr('style')
      }
    },
    appendHTML: (el, html) => el.append(html),
    getInnerHTML: el => el.html() ?? '',
    setInnerHTML: (el, html) => el.html(html),
    getInnerText: el => el.text() ?? '',
    setInnerText: (el, text) => el.text(text),
  })

  // Apply the headless render to the Cheerio DOM
  // Second parameter enables placeholders for hydration
  adapter.setFromRoot(root, true)

  // Clean up
  clear()

  // Return the final HTML
  return $.html()
}
```

## Hydration

When pre-rendering on the server, you can enable placeholders that allow the client to restore dynamic content:

### Server Side

```typescript
// Enable placeholders when setting from root
adapter.setFromRoot(root, true) // true = setPlaceholders
```

### Client Side

```typescript
import { render, restoreTempoPlaceholders } from '@tempots/dom'

// First, restore any placeholders from SSR
restoreTempoPlaceholders()

// Then render the app normally
render(App(), document.body, { clear: false })
```

## Context-Aware Rendering

Use `WithBrowserCtx` and `WithHeadlessCtx` to conditionally render content based on the environment:

```typescript
import { html, WithBrowserCtx, WithHeadlessCtx } from '@tempots/dom'

const App = () =>
  html.div(
    // Only renders in browser
    WithBrowserCtx(ctx => {
      // Access browser-specific APIs
      return html.div('Browser width: ', window.innerWidth.toString())
    }),

    // Only renders in headless mode
    WithHeadlessCtx(ctx => {
      return html.div('Server-rendered content')
    }),

    // Renders in both environments
    html.p('This renders everywhere')
  )
```

## Next Steps

- [Learn more about render](/page/render.html)
- [Explore the Providers pattern](/page/providers.html)
- [Discover UI Components](/page/ui-components.html)
