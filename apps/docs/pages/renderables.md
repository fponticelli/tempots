---
title: Renderables
order: 40
description: Renderables are the building blocks of Tempo applications. They are the templates that are rendered to the DOM. Tempo provides a set of functions to create and manipulate renderables.
---
# Renderables

Renderables or components are the building blocks of Tempo applications. They are the templates that are rendered to the DOM. Tempo provides a set of functions to create and manipulate renderables.

## HTML/SVG, text and Attributes

To create HTML or SVG elements, use the `html` and `svg` objects. Each of them contains the full list of available tags as functions. For example, to create a `div` element, use `html.div()`. To create a `circle` element, use `svg.circle()`.

These functions take an arbitrary number of `TNode` arguments. A `TNode` can be a string, a `Signal&lt;string&gt;`, a `Renderable`, a `Renderable[]` or `null`/`undefined`.

To create text nodes, you can just pass a `string` or a `Signal&lt;string&gt;` where a `TNode` is expected. Alternatively you can be explicit and use the `Text()` function.

### attr.class

special because reusable

### aria.*

### dataAttr.*

### math/mathAttrs

### El/ElNS

### style.*

## Events

### on.*

### OnChecked

```ts
const OnChecked = (fn: (event: boolean) =&gt; void) =&gt; Renderable
```

### emit

#### emit.value

#### emit.valueAsNumber

#### emit.valueAsDate

#### emit.valueAsDateTime

#### emit.checked

#### emit.preventDefault

#### emit.stopPropagation

#### emit.stopImmediatePropagation

## input elements

### input.*

### bind.*

#### bind.date

#### bind.dateTime

#### bind.number

#### bind.text

#### bind.checked

## Conditionals

### When/Unless

```ts
const When = (
  condition: Signal&lt;boolean&gt;,
  then: TNode,
  otherwise?: TNode
) =&gt; Renderable
```

### Empty

### Ensure

### NotEmpty

### oneof

### oneof.bool

### oneof.field

### oneof.kind

### oneof.tuple

### oneof.type

### oneof.value

## Loops

### Repeat

```ts
const Repeat = (
  times: Signal&lt;number&gt;,
  element: (index: Signal&lt;Position&gt;) =&gt; TNode,
  separator?: (pos: Signal&lt;Position&gt;) =&gt; TNode
): Renderable
```

### ForEach

```ts
const ForEach = &lt;T&gt;(
  signal: Signal&lt;T[]&gt;,
  item: (value: Signal&lt;T&gt;, position: Signal&lt;Position&gt;) =&gt; TNode,
  separator?: (pos: Signal&lt;Position&gt;) =&gt; TNode
): Renderable
```

### Conjunction

### NotEmpty

```ts
function NotEmpty&lt;T&gt;(
  signal: Signal&lt;T[]&gt;,
  display: Renderable,
  whenEmpty: Renderable = Empty
): Renderable
```

## Lifecycle

### OnMount

```ts
const OnMount =
  &lt;T extends Element&gt;(
    fn: (element: T) =&gt; Clear | undefined | void
  ): Renderable
```

### OnUnmount

```ts
const OnUnmount =
  (fn: (removeTree: boolean, ctx: DOMContext) =&gt; void): Renderable
```

### OnCtx

```ts
const OnCtx = (fn: (ctx: DOMContext) =&gt; Clear) =&gt; Renderable
```

## Other

### Fragment

```ts
const Fragment = (...children: TNode[]) =&gt; Renderable
```

### MapSignal

## Providers and Consumers

### Provide

### Use

### UseProvider

### UseProviders

### WithProvider

## Ctx

## Empty

## Promises

### Task

```ts
const Task = &lt;T&gt;(
  task: () =&gt; Promise&lt;T&gt;,
  options:
    | {
        pending?: TNode
        then: (value: T) =&gt; TNode
        error?: (error: unknown) =&gt; TNode
      }
    | ((value: T) =&gt; TNode)
) =&gt; Renderable
```

### Async

## MapSignal

```ts
const MapSignal = &lt;T&gt;(
  signal: Signal&lt;T&gt;,
  fn: (value: T) =&gt; Renderable
): Renderable
```

## DOM

### Portal

```ts
const Portal = (selector: string, node: TNode) =&gt; Renderable
```

### DomEl

