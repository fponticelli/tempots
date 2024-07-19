---
title: Quick Start
order: 10
description: Get started with Tempo in a few simple steps.
---
# Quick Start

Tempo can be used for fully fledged single-page applications or simple widgets. Either way, it is easy to get started:

1.	Define a template or component
2.	Render it to the DOM at a specific location

## Hello World

A classic “Hello World” example:

```ts
import { html, render } from '@tempots/dom'

// Define a template
const HelloWorld = html.h1('Hello World')

// Render it to the DOM
render(HelloWorld, document.body)
```

The `render()` call returns a function that can be used to remove the rendered template from the DOM:

```ts
// Render it to the DOM
const remove = render(HelloWorld, document.body)

// Remove it from the DOM after 1 second
setTimeout(() => {
  console.log('Removing HelloWorld')
  remove()
}, 1000)
```

## Add state and interactivity

State in Tempo is managed through signals. Signals are reactive and can be used to update the DOM (or anything else) when they change. A `Signal` is a readonly object that can be observed but not updated. A `Prop` is a writable object that can be updated. A `Computed` is a readonly object that is derived from other signals.

Here is an example of a simple counter:

```ts
import { html, on, render, useProp } from '@tempots/dom'

// Define a writeable signal
const count = useProp(0)

// Define a template
const Counter = html.div(
  html.h1(count.map(v => `count: ${v}`)),
  html.div(
    html.button(on.click(() => count.value++), '+'),
    html.button(on.click(() => count.value--), '-'),
  )
)

// Render it to the DOM
render(Counter, document.body)
```

The `count` signal is updated by mutating the `count.value` that computes a new value based on the current value. `count` can also be set directly by calling `count.set()` or update with a function with `count.update(v => v+1)`.

What about ``count.map(v => `count: ${v}`)``? This is a `Computed` signal that is derived from the `count` signal. It will update whenever `count` changes. The `map()` function is a helper function that maps the value of the signal to a new value.

Events are handled by using the functions associated to the `on` object. The `on.click()` function creates an event listener for the `click` event.

Note that differently from other frameworks, Tempo does not make a distinction between children nodes, attributes, properties, or event handlers. Everything satisfies the same `Renderable` type and `Renderable`s can be nested in any component that accept children. This brings a lot of flexibility and simplicity to the API. One exmaple is that you can use the `Portal` component not just to render the content of a selected element but also change/add to its attributes, classes and event handlers.

## Next Steps

- [Installation](/page/installation)
- Learn more about [how Tempo works](/page/how-it-works)

