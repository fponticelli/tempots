---
title: Renderables
order: 40
---
# Renderables

Renderables or components are the building blocks of Tempo applications. They are the templates that are rendered to the DOM. Tempo provides a set of functions to create and manipulate renderables.

## HTML/SVG, text and Attributes

To create HTML or SVG elements, use the `html` and `svg` objects. Each of them contains the full list of available tags as functions. For example, to create a `div` element, use `html.div()`. To create a `circle` element, use `svg.circle()`.

These functions take an arbitrary number of `TNode` arguments. A `TNode` can be a string, a `Signal&lt;string&gt;`, a `Renderable`, a `Renderable[]` or null or undefined.

To create text nodes, you can just pass a `string` or a `Signal&lt;string&gt;` where a `TNode` is expected. Alternatively you can be explicit and use the `text()` function.

## Events

## Inputs

### AutoFocus

### AutoSelect

### Bind

## Conditionals

### When, Ensure, Unless, NotEmpty, oneof, conjunction

## Loops

### Repeat

### ForEach

## Lifecycle

### OnMount

### OnUnmount

## Other

### Fragment

### Comment

## Providers and Consumers

## Ctx

## DomEl

## Empty

## Task

## Async

## MapSignal

## DOM

### Appearance

### HiddenWhenEmpty

### HtmlTitle

### InViewport

### Portal

### Size

