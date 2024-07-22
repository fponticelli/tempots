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

To create text nodes, you can just pass a `string` or a `Signal&lt;string&gt;` where a `TNode` is expected. Alternatively you can be explicit and use the `TextNode()` function.

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

#### EmitValue

#### EmitValueAsNumber

#### EmitValueAsDate

#### EmitValueAsDateTime

#### EmitChecked

#### EmitPreventDefault

#### EmitStopPropagation

#### EmitStopImmediatePropagation

## input elements

### input.*

### bind

#### BindDate

#### BindDateTime

#### BindNumber

#### BindText

#### BindChecked

## Conditionals

### When/Unless

### Empty

### Ensure

### NotEmpty

### oneof

### OneofBool

### OneofField

### OneofKind

### OneofTuple

### OneofType

### OneofValue

## Loops

### Repeat

### ForEach

### Conjunction

### NotEmpty

## Lifecycle

### OnMount

### OnUnmount

### OnCtx

## Other

### Fragment

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

### Async

## MapSignal

## DOM

### Portal

### DomEl

## Next Steps

- [Learn more about Signals](/page/signals.html)
- [Learn more about render](/page/render.html)
