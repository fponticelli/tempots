---
title: How Does It Work?
order: 30
---
# How Does It Work?

## Renderable

The core of Tempo is the `Renderable` type. A `Renderable` is just a function with the following signature:

```ts
type Renderable = (context: DOMContext) =&gt; Clear

type Clear = (removeTree: boolean) =&gt; void
```

The `Renderable` function is called with a `DOMContext` object that provides access to the DOM and other utilities. The `Renderable` function returns a `Clear` function that can be used to remove the rendered template from the DOM.

This simple signature allows for a lot of flexibility and it is quite easy to reason about. Let's take the `Fragment` component as an example. The `Fragment` component is a special component that can have multiple children but dones't contribute anything to the DOM by itself. It is used to group multiple renderables together. Here is the implementation:

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

In the API you will often find that you need to pass a `TNode` (for `TempoNode`) to existing renderables. A `TNode` is a type that is the union of commonly used types in Tempo. It can be a `Renderable`, a `Signal&lt;string&gt;`, a `Prop&lt;string&gt;`, a `Computed&lt;string&gt;`, a `string`, `undefined`, or `null` or an `Array&lt;Renderable&gt;`. The `renderableOfTNode` function is a helper function that converts a `TNode` to a `Renderable`.

`TNode` is used to make the API more flexible and to allow for a more declarative syntax.

```ts
html.div('Hello World')
// equivalent to
html.div(text('Hello World'))
```

### Clear

The `Clear` function is used to remove the rendered template from the DOM. Its single argument `removeTree` is a hint to the implementation that any DOM modification applied by this `Renrable` should be removed. When set to false, the implementation can assume that its parent will be removed from the DOM and only side effects that are not related to the DOM should be removed (for example clearing an interval or a timeout). When set to true, the implementation should remove all DOM modifications.

### TNode

When a `TNode` is of type `string` or `Value&lt;string&gt;` (an alias for `Signal&lt;string&gt; | string`), it is treated as a text node. `TNode` is a `Renderable`, it is treated as a component. When a `TNode` is `undefined` or `null`, it is ignored.

## DOMContext

TODO

## Signals

TODO
