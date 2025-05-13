# Tempo DOM (@tempots/dom)

Tempo DOM is a lightweight UI framework for building web applications with TypeScript. It provides a simple, functional approach to creating reactive user interfaces with direct DOM manipulation. This package has no dependencies and serves as the core of the Tempo ecosystem.

[![npm version](https://img.shields.io/npm/v/@tempots/dom.svg)](https://www.npmjs.com/package/@tempots/dom)
[![license](https://img.shields.io/npm/l/@tempots/dom.svg)](https://github.com/fponticelli/tempots/blob/main/LICENSE)

## Installation

```bash
# npm
npm install @tempots/dom

# yarn
yarn add @tempots/dom

# pnpm
pnpm add @tempots/dom
```

## Key Concepts

### Renderables

Renderables are the building blocks of Tempo applications. A Renderable is a function that:
1. Takes a context (typically a DOM context)
2. Performs some operations on that context (like creating DOM elements)
3. Returns a cleanup function

```typescript
import { html, render } from '@tempots/dom'

// Create a simple renderable
const HelloWorld = html.h1('Hello World')

// Render it to the DOM
render(HelloWorld, document.body)
```

### Signals

Signals are reactive values that automatically update the UI when they change:

```typescript
import { html, render, prop, on } from '@tempots/dom'

function Counter() {
  // Create a reactive state
  const count = prop(0)

  return html.div(
    html.div('Count: ', count.map(String)),
    html.button(on.click(() => count.value--), 'Decrement'),
    html.button(on.click(() => count.value++), 'Increment')
  )
}

render(Counter(), document.body)
```

### HTML Elements

Tempo provides a convenient way to create HTML elements using the `html` object:

```typescript
import { html } from '@tempots/dom'

const myDiv = html.div(
  html.h1('Title'),
  html.p('Paragraph text'),
  html.button('Click me')
)
```

### Attributes and Events

Add attributes and event handlers to elements:

```typescript
import { html, attr, on } from '@tempots/dom'

const button = html.button(
  attr.class('primary-button'),
  attr.disabled(false),
  on.click(() => console.log('Button clicked')),
  'Click Me'
)
```

### Conditional Rendering

Render content conditionally:

```typescript
import { html, When, prop } from '@tempots/dom'

const isLoggedIn = prop(false)

const greeting = html.div(
  When(
    isLoggedIn,
    () => html.span('Welcome back!'),
    () => html.span('Please log in')
  )
)
```

### Lists and Iterations

Render lists of items:

```typescript
import { html, ForEach, prop } from '@tempots/dom'

const items = prop(['Apple', 'Banana', 'Cherry'])

const list = html.ul(
  ForEach(items, (item) =>
    html.li(item)
  )
)
```

## Documentation

For comprehensive documentation, visit the [Tempo Documentation Site](https://tempo-ts.com/).

## Examples

Check out the [examples directory](https://github.com/fponticelli/tempots/tree/main/demo) for complete examples.

## License

This package is licensed under the Apache License 2.0.
