---
title: Renderables
order: 40
description: Renderables are the building blocks of Tempo applications. They are the templates that are rendered to the DOM. Tempo provides a set of functions to create and manipulate renderables.
---

# Renderables

Renderables or components are the building blocks of Tempo applications. They are the templates that are rendered to the DOM. Tempo provides a set of functions to create and manipulate renderables.

The Renderable functions use the convention of starting with a capital letter. This is to differentiate them from regular functions and to make it easier to identify them in the code. The notable exception is for basic html/svg elements, which are lowercase.

## HTML/SVG, text and Attributes

To create HTML or SVG elements, use the `html` and `svg` objects. Each of them contains the full list of available tags as functions. For example, to create a `div` element, use `html.div()`. To create a `circle` element, use `svg.circle()`.

These functions take an arbitrary number of `TNode` arguments. A `TNode` can be a string, a `Signal<string>`, a `Renderable`, a `Renderable[]` or `null`/`undefined`.

To create text nodes, you can just pass a `string` or a `Signal<string>` where a `TNode` is expected. Alternatively you can be explicit and use the `TextNode()` function.

```ts
const titleSignal = signal('Hello, World!')

html.div(
  'Hello, World!', // <-- this is a text node
  titleSignal, // <-- this is a signal that automatically updates a text node
  html.span('This is a span'),
  TextNode('This is also a text node')
)
```

To create DOM attributes and properties use the `attr` object. It contains functions for all the standard attributes and properties. For example, to set the `id` attribute, use `attr.id('my-id')`.

```ts
html.img(
  attr.id('my-id'),
  attr.src('https://example.com/image.jpg'),
  attr.title(titleSignal)
)
```

You will have noticed that text nodes and attribute values accept both literal values (ex. `'Hello, World!'`) and signals (ex. `titleSignal`). This is because the arguments are typed as `Value<T>` which is a union of `T` and `Signal<T>`. `Value<string>` also happens to be part of the `TNode` union.

### attr.class

The `class` attribute is special in the sense that can be used multiple times in the same element.

```ts
const classSignal = signal('class3 class4')
html.div(attr.class('class1 class2'), attr.class(classSignal))
```

A class attribute can be a string or a signal that emits a string. The string can contain multiple classes separated by spaces.

### Other attributes and elements

There are helper objects to create arbitrary data-attributes, math/svg elements and attributes, and style attributes.

```ts
html.div(
  dataAttr.mydata('myvalue'),
  math.math(
    mathAttr.display('inline'),
    math.mfrac(math.msup(math.mi('π'), math.mn('2')), math.mn('6'))
  ),
  svg.svg(svg.circle(svgAttr.cx(50), svgAttr.cy(50), svgAttr.r(40))),
  style.color('red')
)
```

## Events

Similar to attributes, events can be set using the `on` object. The `on` object contains functions for all the standard events. For example, to set the `click` event, use `on.click(fn)`.

It is fine to use `signal.value` or `signal.get()` to get the value of a signal in an event handler.

### emit helpers

Tempo provides a set of functions to simplify event handling by extracting values from DOM events:

| Helper                            | Description                                    |
| --------------------------------- | ---------------------------------------------- |
| `emitValue(fn)`                   | Extract string value from input/textarea       |
| `emitValueAsNumber(fn)`           | Extract numeric value (uses `valueAsNumber`)   |
| `emitValueAsDate(fn)`             | Extract Date from date input                   |
| `emitValueAsNullableDate(fn)`     | Extract Date or null from date input           |
| `emitValueAsDateTime(fn)`         | Extract Date from datetime-local input         |
| `emitValueAsNullableDateTime(fn)` | Extract Date or null from datetime-local input |
| `emitChecked(fn)`                 | Extract boolean from checkbox/radio            |
| `emitTarget(fn)`                  | Get the target element directly                |

```ts
const name = prop('')
const age = prop(0)
const birthDate = prop<Date | null>(null)
const isSubscribed = prop(false)

html.form(
  // Text input - use prop.set directly as callback
  html.input(
    attr.type('text'),
    attr.value(name),
    on.input(emitValue(name.set))
  ),

  // Number input - use filter for validation
  html.input(
    attr.type('number'),
    attr.value(age.map(String)),
    on.input(
      emitValueAsNumber(v => {
        if (!isNaN(v)) age.set(v)
      })
    )
  ),

  // Date input - prop.set works directly
  html.input(
    attr.type('date'),
    on.change(emitValueAsNullableDate(birthDate.set))
  ),

  // Checkbox - prop.set works directly
  html.input(
    attr.type('checkbox'),
    attr.checked(isSubscribed),
    on.change(emitChecked(isSubscribed.set))
  ),

  // Direct element access
  html.input(
    on.focus(
      emitTarget((input: HTMLInputElement) => {
        input.select() // Select all text on focus
      })
    )
  )
)
```

**Emit Options:**

All emit helpers accept an optional second argument for event control:

```ts
type EmitOptions = {
  preventDefault?: boolean
  stopPropagation?: boolean
  stopImmediatePropagation?: boolean
}

// Example: prevent form submission
on.submit(
  emitTarget(
    () => {
      console.log('Form submitted')
    },
    { preventDefault: true }
  )
)
```

### Delegated Events

For containers with many similar children (such as lists rendered with `ForEach`), attaching individual `on` handlers to each item creates one listener per element. The `delegate` object provides an alternative: a single event listener on the **container** that matches children by CSS selector using `Element.closest()`.

```ts
import { html, delegate, ForEach, prop } from '@tempots/dom'

const items = prop(['Apple', 'Banana', 'Cherry'])

html.ul(
  delegate.click('li', (event) => {
    const li = (event.target as Element).closest('li')!
    console.log('Clicked:', li.textContent)
  }),
  ForEach(items, (item) => html.li(item))
)
```

`delegate` uses the same proxy pattern as `on`, so all standard events are available (`delegate.click`, `delegate.input`, `delegate.keydown`, etc.). It accepts an optional third argument for `HandlerOptions` (`once`, `passive`, `signal`).

**When to use `delegate` vs `on`:**

| Use `on` | Use `delegate` |
| --- | --- |
| Small/static number of elements | Large or dynamic lists (`ForEach`, `Repeat`) |
| Need per-element context | One handler for many similar children |
| Non-bubbling events (`focus`, `blur`, `mouseenter`, `mouseleave`) | Standard bubbling events (`click`, `input`, `keydown`, etc.) |

> **Note:** Delegated events rely on event bubbling. Events that do not bubble (`focus`, `blur`, `mouseenter`, `mouseleave`) will not be captured by delegation. Use `on` for those.

## input elements

When using `input` elements it is very common you want to specify the type of the input. Tempo provides a set of functions to create `input` elements with the correct type. For example, to create a `number` input, use `input.number()`.

## bind

Tempo provides functions to bind `Props` to input elements. For example, to bind a `string` prop to an `input` element, use `BindText`. Other bind functions include `BindNumber`, `BindDate`, `BindDateTime`, and `BindChecked`. These set a bidirectional binding between the prop and the input element.

```ts
import { prop, input, BindText, BindNumber, BindDate, BindDateTime, BindChecked } from '@tempots/dom'

// Text binding - syncs input value with prop
const email = prop('')
input.text(BindText(email))

// Number binding - parses input as number
const age = prop(0)
input.number(BindNumber(age))

// Date binding - syncs with date input
const birthDate = prop(new Date())
input.date(BindDate(birthDate))

// DateTime binding - syncs with datetime-local input
const appointmentTime = prop(new Date())
input['datetime-local'](BindDateTime(appointmentTime))

// Checkbox binding - syncs checked state
const isSubscribed = prop(false)
input.checkbox(BindChecked(isSubscribed))
```

## Conditionals

Tempo has a set of functions to create conditional renderables. For example, to render a `div` element only if a condition is met, use `When` (or `Unless` for its negation).

```ts
const showSignal = signal(true)

When(showSignal, () => html.div('This is visible'))
```

A second argument can be passed to `When` to specify a renderable to show when the condition is false.

An interesting aspect of conditionals in Tempo, is that there is no DOM rebuilding unless the branch is changed.

### Ensure

In TypeScript it is common to work with values that can be `null` or `undefined`. To render a value only if it is not `null` or `undefined`, use `Ensure`.

```ts
const valueSignal = signal<string | null>('Hello, World!')

Ensure(valueSignal, v => html.div(v.map(text => `This is visible: ${text}`)))
```

Unlike `When`, `Ensure` takes a function that returns a renderable. This function is called with a new signal that is guaranteed to be not `null` or `undefined`.

### OneOf

`OneOf` helpers allow matching a signal and rendering a branch based on its
value. Several variations exist depending on what you want to match.

```ts
const status = signal<{ loading: true } | { error: string }>({ loading: true })

OneOf(status, {
  loading: () => html.div('Loading...'),
  error: e => html.div('Error:', e),
})
```

#### OneOfValue

```ts
const mode = signal<'view' | 'edit'>('view')

OneOfValue(mode, {
  view: () => html.div('Viewing'),
  edit: () => html.div('Editing'),
})
```

#### OneOfTuple

```ts
const pair = signal(['A', 1] as ['A' | 'B', number])

OneOfTuple(pair, {
  A: n => html.div('A:', n.map(String)),
  B: n => html.div('B:', n.map(String)),
})
```

#### OneOfField

```ts
type State =
  | { state: 'loading' }
  | { state: 'error'; message: string }
  | { state: 'ready'; content: string }

const state = signal<State>({ state: 'loading' })

OneOfField(state, 'state', {
  loading: () => html.div('Loading...'),
  error: s => html.div('Error:', s.$.message),
  ready: s => html.div('Ready:', s.$.content),
})
```

#### OneOfKind

```ts
type MyType = { kind: 'A'; text: string } | { kind: 'B'; value: number }

const valueSignal = signal<MyType>({ kind: 'A', text: 'Hello, World!' })

OneOfKind(valueSignal, {
  A: v => html.div('A:', v.$.text),
  B: v => html.div('B:', v.$.value.map(String)),
})
```

#### OneOfType

```ts
type Msg = { type: 'inc'; value: number } | { type: 'dec'; value: number }

const msg = signal<Msg>({ type: 'inc', value: 1 })

OneOfType(msg, {
  inc: m => html.div('Inc', m.$.value.map(String)),
  dec: m => html.div('Dec', m.$.value.map(String)),
})
```

## Loops

Of course you can also render lists of elements. Tempo provides a set of functions to create loops. For example, to render a list of `div` elements, use `ForEach`.

```ts
const itemsSignal = signal(['Item 1', 'Item 2', 'Item 3'])

ForEach(itemsSignal, (item, position) =>
  html.div(position.$.counter.map(String), ': ', item)
)
```

The renderable function takes two arguments. The first is a signal that represent an element of the list. The second is a signal that represents the position of the element in the list. The position signal has a `counter` field that is the 1-based index of the element in the list as well as a `isFirst`, `isLast` and `index`.

`ForEach` accepts an optional third argument to render a separator between elements.

You can wrap your loop in a `NotEmpty` renderable if you want to ensure that the list is not empty. This is useful in the case of structures like `UL` or `OL` where an empty list would not be desired.

```ts
const itemsSignal = signal(['Item 1', 'Item 2', 'Item 3'])

NotEmpty(
  itemsSignal,
  items => html.ul(ForEach(items, item => html.li(item))),
  () => 'No items'
)
```

`Repeat` takes a signal that represents the number of times to repeat the renderable. It is useful when you want to repeat a renderable a fixed number of times.

```ts
const countSignal = signal(3)

Repeat(countSignal, pos =>
  html.div(`${pos.counter} of `, pos.$.total.map(String))
)
```

`counter` is a fixed value so it is not wrapped in a signal but `total` is a signal as it can vary when `countSignal` changes.

If you know ahead of time the number and content of the elements, you can use a regular loop to create an array of renderables.

```ts
const items = ['Item 1', 'Item 2', 'Item 3']

html.div(items.map((item, index) => html.div(String(index), ': ', item)))
```

## Lifecycle

For more advanced use cases, Tempo provides a set of functions to handle the lifecycle of a renderable. For example, to run a function when a renderable is mounted, use `WithElement`. This will take a callback function that will be called with the HTML DOM Element just mounted. Similarly `WithCtx` will take a callback function that will be called with the current `DOMContext`, and `WithBrowserCtx` for browser-specific contexts.

```ts
html.div(
  // element is the DIV Element just mounted
  WithElement(element => {
    console.log('Mounted', element)
  })
)
```

Whenever you want to cleanup resources when a renderable is unmounted, use `OnDispose`.

```ts
html.div(
  WithElement(element => {
    const listener = () => console.log('Clicked')
    element.addEventListener('click', listener)
    return OnDispose((removeTree, ctx) => {
      if (removeTree) {
        element.removeEventListener('click', listener)
      }
    })
  })
)
```

## Fragment/Empty

You can use `Fragment` where a single renderable is expected but you want to render multiple components. Similarly, you can use `Empty` to fill a slot with nothing.

## Providers

To simplify the structure of a larger project, it is often useful to use a Provide/Use pattern. In a high-level component, you can provide a value (or function, or signal, or anything really) that is consumed by a lower-level component. You can use `Provide` to provide a single value (or a record or a function), and `Use` to consume it.

A provider is a simple object that knows how to provide a context value and how to identify itself.

```ts
const Preferences = {
  mark: makeProviderMark<Signal<Preferences>>('Preferences'),
  create: () => {
    const preferences = signal({ theme: 'bubbly' })
    // the implementation, it must return an object with
    return { value: preferences, dispose: preferences.dispose }
  },
}
```

The provider can be made available this way:

```ts
const MyComponent = Provide(
  Preferences,
  {}, // options (can be empty)
  () => html.div(...)
)
```

And it can be used this way:

```ts
Use(Preferences, value => html.div(value.$.theme))
```

If you want to `set` and/or `use` multiple providers at once, you can use `WithProvider`.

```ts
WithProvider(({ set, use }) => {
  set(Preferences, {})
  const preferences = use(Preferences)
  return html.div(preferences.$.theme)
})
```

## Asynchronous Operations

Tempo provides two renderables for handling async operations: `Async` and `Task`.

### Async vs Task

- **`Async(promise, options)`** - Wraps an existing Promise. The promise starts executing immediately when created.
- **`Task(fn, options)`** - Wraps a function that returns a Promise. The function is called when the component renders (lazy execution).

```ts
import { Async, Task } from '@tempots/dom'

// Async: promise executes immediately when this line runs
const immediateLoad = Async(
  fetch('/api/data').then(r => r.json()),
  {
    pending: () => html.div('Loading...'),
    then: data => html.div('Data: ', JSON.stringify(data)),
    error: err => html.div('Error: ', String(err))
  }
)

// Task: fetch only happens when the component renders
const lazyLoad = Task(
  () => fetch('/api/data').then(r => r.json()),
  {
    pending: () => html.div('Loading...'),
    then: data => html.div('Data: ', JSON.stringify(data)),
    error: err => html.div('Error: ', String(err))
  }
)

// Shorthand: just pass a function for the success case
const simpleTask = Task(
  () => fetch('/api/data').then(r => r.json()),
  data => html.div('Data: ', JSON.stringify(data))
)
```

### Using Signals for Reactive Data

More often you'll want to combine `Signal`s with `Promise` for reactive data fetching:

```ts
const dataSignal = Signal.ofPromise<string | null>(
  fetch('https://api.example.com/data').then(res => res.text()),
  null // initial value before the promise resolves
)

html.div(Ensure(dataSignal, data => html.div(data), html.div('Loading...')))
```

When you need to refetch based on changing parameters, use `mapAsync`:

```ts
const idSignal = signal(1)

const dataSignal = idSignal.mapAsync<string | null>(
  async id => {
    const res = await fetch(`https://api.example.com/data/${id}`)
    return res.text()
  },
  null // default value before the promise resolves
)

// dataSignal automatically refetches when idSignal changes
```

## Portal

A `Portal` is a way to render a renderable in a different part of the DOM. This is useful when you want to render a modal, a tooltip or you want to make changes to the `head` element. The `HTMLTitle` renderable defined in the `@tempots/ui` package is a good example of this.

```ts
export const HTMLTitle = (title: Value<string>) =>
  Portal('head > title', attr.innerText(title))
```

## Next Steps

- [Learn more about Signals](/page/signals.html)
- [Learn more about Building your own Renderables](/page/components.html)
- [Learn more about Providers](/page/providers.html)
- [Discover UI Components](/page/ui-components.html)
- [Explore Examples & Best Practices](/page/examples.html)
- [Learn more about render](/page/render.html)
