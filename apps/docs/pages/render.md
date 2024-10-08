---
title: Render
order: 100
description: Rendering is the final act of applying Renderables to the DOM. When defining renderables, nothing in the DOM is changed or updated, not until those renderables are applied using either render() or renderWithContext().
---
# Render

Rendering is the final act of applying `Renderable`s to the DOM. When defining renderables, nothing in the DOM is changed or updated, not until those renderables are applied using either `render()` or `renderWithContext()`. Both functions return a `cancel` function that can be used to undo the modifications described in the applied renderables.

## render()

A rendering function that takes two mandatory arguments, a `Renderable` that describes the change to apply to the DOM and a parent node (either as an instance or as a CSS selector) where to apply those changes.

Optionally you can pass an object with the following options:

* a `document` instance to be used during the rendering. This is only necessary in special context, like rendering in a non-browser context when using a string selector for `parent`.
* the `clear` option indicates if the rendering operation should also remove the contents that were potentially generated by the SSR component.

```ts
function render(
  node: Renderable,
  parent: Node | string,
  { doc, clear }: { doc?: Document; clear?: boolean } = {}
): () => void
```

## renderWithContext()

`renderWithContext()` is a more atomic operation that requires an already instantiated `DOMContext`. Like `render` it returns a `cancel` function.

```ts
function renderWithContext(node: Renderable, ctx: DOMContext): () =&gt; void
```

## Next Steps

Check the API documentation for the Tempo libraries:

- [@tempots/dom](/library/tempots-dom.html)
- [@tempots/std](/library/tempots-std.html)
- [@tempots/ui](/library/tempots-ui.html)
- [@tempots/ssr](/library/tempots-ssr.html)
- [@tempots/color](/library/tempots-color.html)
