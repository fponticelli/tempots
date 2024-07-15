---
title: How Does It Work?
order: 30
---
# How Does It Work?

## Renderable

The core of Tempo is the `Renderable` type. A `Renderable` is a function with the following signature:

```ts
type Renderable = (context: DOMContext) =&gt; Clear
type Clear = (removeTree: boolean) =&gt; void
```

The `Renderable` function takes a `DOMContext` object, which provides access to the DOM and other utilities. The function returns a `Clear` function that removes the rendered template from the DOM.

This simple signature offers flexibility and ease of use. For instance, consider the `Fragment` component, which can have multiple children but doesn’t contribute to the DOM itself. It’s used to group multiple renderables together. Here’s its implementation:

```ts
export const Fragment =
  (...children: TNode[]): Renderable =&gt;
  (ctx: DOMContext) =&gt; {
    const clears = children.map(child =&gt; renderableOfTNode(child)(ctx))
    return (removeTree: boolean) =&gt; {
      clears.forEach(clear =&gt; clear(removeTree))
    }
  }
```

In Tempo, you often pass a `TNode` (short for Tempo Node) to existing renderables. A `TNode` is a union type that includes commonly used types in Tempo: `Renderable`, `Signal&lt;string&gt;`, `Prop&lt;string&gt;`, `Computed&lt;string&gt;`, `string`, `undefined`, `null`, or an `Array&lt;Renderable&gt;`. The renderableOfTNode function helps convert a TNode to a Renderable.

Using `TNode` makes the API more flexible and allows for a more declarative syntax.

```ts
html.div('Hello World')
// equivalent to
html.div(Text('Hello World'))
```

### Clear

The `Clear` function removes the rendered template from the DOM. Its argument, removeTree, indicates whether to remove all DOM modifications and side effects such as clearing an interval or timeout (`true`) or only side effects (`false`).

### TNode

A `TNode` is treated differently based on its type:

- string or `Value<string>` (alias for `Signal<string> | string`): Treated as a text node.
- `undefined` or `null`: Ignored.
- `Renderable`: Left unmodified.
- `Renderable[]`: Gets wrapped into a `Fragment`.

## DOMContext

The `DOMContext` object, passed to the Renderable function, provides access to the DOM and other utilities. It has the following properties:

- `element`: The Element instance associated with this context.
- `reference`: An optional Node instance serving as a reference for this context.
- `document`: The Document instance associated with this context.

The reference node, `TextNode` with an empty string, acts as a placeholder when elements are added or removed between siblings. It’s useful for `Renderables` like `ForEach` or `When`, which need to track element positions in the DOM.

Additionally, `DOMContext` contains a collection of providers for shared state between Renderables, avoiding prop drilling and keeping the API clean. The `isFirstLevel` property, still experimental, marks nodes for server-side rendering and hydration.
