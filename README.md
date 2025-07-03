# Tempo

[![npm @tempots/dom](https://img.shields.io/npm/v/@tempots/dom?label=@tempots/dom)](https://www.npmjs.com/package/@tempots/dom)
[![npm @tempots/std](https://img.shields.io/npm/v/@tempots/std?label=@tempots/std)](https://www.npmjs.com/package/@tempots/std)
[![npm @tempots/ui](https://img.shields.io/npm/v/@tempots/ui?label=@tempots/ui)](https://www.npmjs.com/package/@tempots/ui)
[![codecov](https://codecov.io/gh/fponticelli/tempots/branch/main/graph/badge.svg)](https://codecov.io/gh/fponticelli/tempots)
[![CI](https://github.com/fponticelli/tempots/workflows/CI/badge.svg)](https://github.com/fponticelli/tempots/actions)
[![GitHub stars](https://img.shields.io/github/stars/fponticelli/tempots?label=Star%20me%20on%20Github&style=social)](https://github.com/fponticelli/tempots)

Tempo is a modern, lightweight UI framework for building dynamic frontend applications with TypeScript. It provides a simple, predictable way to create reactive web interfaces without the complexity of other frameworks.

[Project Homepage](https://tempo-ts.com/)

## Key Features

- **Simple TypeScript Functions**: Build UIs with plain functions, no complex class hierarchies or special syntax
- **Zero Dependencies**: Lightweight and efficient with no external dependencies
- **Predictable Rendering**: Direct DOM updates without a virtual DOM for better performance
- **Reactive by Design**: Built-in reactive state management with Signals
- **Type-Safe**: Fully typed with TypeScript for better developer experience
- **Fine-Grained Control**: Precise control over rendering and updates when needed

## Installation

```bash
# npm
npm install @tempots/dom

# yarn
yarn add @tempots/dom

# pnpm
pnpm add @tempots/dom
```

For UI components and utilities:

```bash
# npm
npm install @tempots/dom @tempots/std @tempots/ui

# yarn
yarn add @tempots/dom @tempots/std @tempots/ui

# pnpm
pnpm add @tempots/dom @tempots/std @tempots/ui
```

## Quick Start

```typescript
import { html, render, prop, on } from '@tempots/dom'

function Counter() {
  // Create a reactive state
  const count = prop(0)

  // Create a UI with the reactive state
  return html.div(
    html.h1('Counter Example'),
    html.div(
      'Count: ',
      count.map(String)
    ),
    html.button(
      on.click(() => count.value--),
      'Decrement'
    ),
    html.button(
      on.click(() => count.value++),
      'Increment'
    )
  )
}

// Render to the DOM
render(Counter(), document.getElementById('app'))
```

## Packages

Tempo consists of three main packages:

### @tempots/dom

The core UI framework that provides the foundation for building web applications. It includes:

- Renderables - The building blocks for creating UI elements
- Signals - Reactive state management
- DOM manipulation utilities
- Event handling

### @tempots/std

A standard library of utility functions for TypeScript that complements Tempo:

- Array, string, and object utilities
- Async helpers
- Validation tools
- Timer functions
- And more

### @tempots/ui

A collection of reusable UI components and renderables built on top of @tempots/dom:

- Common UI components
- Routing utilities
- Form controls
- Layout helpers

## Demos

Check out these demos to see Tempo in action:

- [Hacker News PWA](https://tempo-ts.com/demos/hnpwa/index.html) - A Hacker News reader built with Tempo
- [7GUIs](https://tempo-ts.com/demos/7guis/index.html) - Implementation of the 7GUIs benchmark
- [TodoMVC](https://tempo-ts.com/demos/todomvc/index.html) - The classic TodoMVC example
- [Counter App](https://tempo-ts.com/demos/counter/index.html) - A simple counter application

## Documentation

For comprehensive documentation, visit the [Tempo Documentation Site](https://tempo-ts.com/).

- [Quick Start Guide](https://tempo-ts.com/page/quick-start.html)
- [How Tempo Works](https://tempo-ts.com/page/how-it-works.html)
- [Renderables](https://tempo-ts.com/page/renderables.html)
- [Signals](https://tempo-ts.com/page/signals.html)
- [Building Components](https://tempo-ts.com/page/components.html)

## Why Choose Tempo?

- **Simplicity**: No complex abstractions or special syntax to learn
- **Performance**: Direct DOM updates without the overhead of a virtual DOM
- **Type Safety**: Built with TypeScript for better tooling and fewer runtime errors
- **Lightweight**: Small bundle size for faster loading
- **Predictable**: Clear, functional approach to UI development

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the Apache License 2.0 - see the LICENSE file for details.
