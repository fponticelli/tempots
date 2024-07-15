---
title: Render
order: 50
---
# Render

## render()

```ts
function renderWithContext(node: Renderable, ctx: DOMContext): () =&gt; void
```

## renderWithContext()

```ts
function render(
  node: Renderable,
  parent: Node | string,
  { doc, clear }: { doc?: Document; clear?: boolean } = {}
): () =&gt; void
```
