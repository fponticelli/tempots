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

These functions take an arbitrary number of `TNode` arguments. A `TNode` can be a string, a `Signal&lt;string&gt;`, a `Renderable`, a `Renderable[]` or `null`/`undefined`.

To create text nodes, you can just pass a `string` or a `Signal&lt;string&gt;` where a `TNode` is expected. Alternatively you can be explicit and use the `TextNode()` function.

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
html.image(
  attr.id('my-id'),
  attr.src('https://example.com/image.jpg'),
  attr.title(titleSignal)
)
```

You will have noticed that text nodes and attribute values accept both literal values (ex. `'Hello, World!'`) and signals (ex. `titleSignal`). This is because the arguments are types as `Value<T>` which is a union of `T` and `Signal<T>`. `Value<string>` also happens to be part of the `TNode` union.

### attr.class

The class attribute is special in the sense that can be used multiple times in the same element.

```ts
const classSignal = signal('class3 class4')
html.div(
  attr.class('class1 class2'),
  attr.class(classSignal)
)
```

A class attribute can be a string or a signal that emits a string. The string can contain multiple classes separated by spaces.

### Other attributes and elements

There are helper objects to create arbitrary data-attributes, math/svg elements and attributes, and style attributes.

```ts
html.div(
  dataAttr.mydata('myvalue'),
  math.math(
    mathAttr.display('inline'),
    math.mfrac(
      math.msup(
        math.mi('π'),
        math.mn('2'),
      ),
      math.mn('6'),
    ),
  ),
  svg.svg(
    svg.circle(svgAttr.cx(50), svgAttr.cy(50), svgAttr.r(40)),
  ),
  style.color('red')
)
```

## Events

Similar to attributes, events can be set using the `on` object. The `on` object contains functions for all the standard events. For example, to set the `click` event, use `on.click(fn)`.

It is fine to use `signal.value` or `signal.get()` to get the value of a signal in an event handler.

### emit

Tempo provides a set of functions to simplify event handling. For example `emitValue` emits the value of the current `input` element when the event is triggered.

## input elements

When using `input` elements it is very common you want to specify the type of the input. Tempo provides a set of functions to create `input` elements with the correct type. For example, to create a `number` input, use `input.number()`.

## bind

Tempo provides functions to bind `Props` to input elements. For example, to bind a `string` prop to an `input` element, use `bindText`. This sets a bidirectional binding between the prop and the input element.

## Conditionals

Tempo has a set of functions to create conditional renderables. For example, to render a `div` element only if a condition is met, use `When` (or `Unless` for its negation).

```ts
const showSignal = makeSignal(true)

When(showSignal,
  html.div('This is visible')
)
```

A second argument can be passed to `When` to specify a renderable to show when the condition is false.

An interesting aspect of conditionals in Tempo, is that there is no DOM rebuilding unless the branch is changed.

### Ensure

In TypeScript it is common to work with values that can be `null` or `undefined`. To render a value only if it is not `null` or `undefined`, use `Ensure`.

```ts
const valueSignal = makeSignal<string | null>('Hello, World!')

Ensure(
  valueSignal,
  v => html.div(v.map(text => `This is visible: ${text}`))
)
```

Unlike `When`, `Ensure` takes a function that returns a renderable. This function is called with a new signal that is guaranteed to be not `null` or `undefined`.

### OneOf

For more complicated pattern matching you can use one of the `OneOf` renderables. You generally match on the value of an object field. For that you can use `OneOfField`, `OneOfKind`, or `OneOfType`.

```ts
type MyType = { kind: 'A', text: string } | { kind: 'B', value: number }

const valueSignal = makeSignal<MyType>({ kind: 'A', text: 'Hello, World!' })

OneOfKind(valueSignal, {
  A: v => html.div('A: ', v.$.text),
  B: v => html.div('B: ', v.$.value.map(String))
})
```

## Loops

Of course you can also render lists of elements. Tempo provides a set of functions to create loops. For example, to render a list of `div` elements, use `ForEach`.

```ts
const itemsSignal = makeSignal(['Item 1', 'Item 2', 'Item 3'])

ForEach(
  itemsSignal,
  (item, position) => html.div(
    position.$.counter.map(String),
    ': ',
    item
  )
)
```

The renderable function takes two arguments. The first is a signal that represent an element of the list. The second is a signal that represents the position of the element in the list. The position signal has a `counter` field that is the 1-based index of the element in the list as well as a `isFirst`, `isLast` and `index`.

`ForEach` accepts an optional third argument to render a separator between elements.

You can wrap your loop in a `NotEmpty` renderable if you want to ensure that the list is not empty. This is useful in the case of structures like `UL` or `OL` where an empty list would not be desired.

```ts
const itemsSignal = makeSignal(['Item 1', 'Item 2', 'Item 3'])

NotEmpty(
  itemsSignal,
  items => html.ul(
    ForEach(
      items,
      item => html.li(item),
      html.br()
    ),
  ),
  () => 'No items'
)
```

`Repeat` takes a signal that represents the number of times to repeat the renderable. It is useful when you want to repeat a renderable a fixed number of times.

```ts
const countSignal = makeSignal(3)

Repeat(
  countSignal,
  pos => html.div(pos.$.counter.map(String))
)
```

If you know ahead of time the number and content of the elements, you can use a regular loop to create an array of renderables.

```ts
const items = ['Item 1', 'Item 2', 'Item 3']

html.div(
  items.map((item, index) => html.div(String(index), ': ', item))
)
```

## Lifecycle

For more advanced use cases, Tempo provides a set of functions to handle the lifecycle of a renderable. For example, to run a function when a renderable is mounted, use `OnMount`. This will take a callback function that will be called with the HTML Dom Element just mounted. Similarly `OnCtx` will take a callback function that will be called with the current `DOMContext`.

```ts
html.div(
  // element is the DIV Element just mounted
  OnMount(element => {
    console.log('Mounted', element)
  })
)
```

Whenever you want to cleanup resources when a renderable is unmounted, use `OnUnmount`.

```ts
html.div(
  OnMount(element => {
    const listener = () => console.log('Clicked')
    element.addEventListener('click', listener)
    OnUnmount(removeTree => {
      if (removeTree) {
        element.removeEventListener('click', listener)
      }
    })
  })
)
```

## Fragment/Empty

You can use `Fragment` where a single renderable is expected but you want to render multiple components. Similarly, you can use `Empty` to fill a slot with nothing.

## Providers and Consumers

To simplify the structure of a larger project, it is often useful to use a Provider/Consumer pattern. In a high-level component, you can provide a value (or function, or signal, or anything really) that is consumed by a lower-level component. You can use `WithProvider` to provide a single value, and `UseProvider` to consume it.

They both required a `ProviderMark` to be passed as the first argument. This is a unique symbol that is used to identify the provider. You can use `makeProviderMark` to create a unique mark for your own provider/consumer.

```ts
type Preferences = Signal<{ theme: string }>
const PreferencesMark = makeProviderMark<Preferences>('Preferences')

const MyComponent = WithProvider(
  PreferencesMark,
  makeSignal({ theme: 'bubbly' }),
  html.div(
    UseProvider(PreferencesMark, value => html.div(value.$.theme))
  )
)
```

When creating reusable providers, you probably want to wrap them in a provider function. This function has generally the signature `(node: TNode) => Renderable`.

```ts
const PreferencesProvider = (node: TNode) => {
  const preferences = makeSignal<Preferences>({ theme: 'bubbly' })
  return WithProvider(
    PreferencesMark,
    preferences,
    node
  )
}
```

Similarly on the consumer side, you can have:

```ts
const UsePreferences = (fn: (preferences: Signal<Preference>) => TNode) =>
  UseProvider(PreferencesMark, fn)
```

Now you can use them together for easy access to the preferences:

```ts
PreferencesProvider(
  html.div(
    UsePreferences(preferences => html.div(preferences.$.theme))
  )
)
```

## Asynchrnous Operations

If you are dealing with asynchronous operations, you can use `Async` to render a promise or `Task` to render a function that returns a promise. More likely than not you will want to use a combination of `Signal`s and `Promise` to define your UI. Let's take as an example loading from an API.

```ts
const dataSignal = Signal.ofPromise<string | null>(
  async () => {
    const res = await fetch('https://api.example.com/data')
    return r.text()
  },
  null // this is the default state before the promise resolves
)

html.div(
  Ensure(
    dataSignal,
    data => html.div(data),
    html.div('Loading...')
  )
)
```

Often you will want to refetch when some parameter changes.

```ts
const idSignal = makeSignal(1)

const dataSignal = idSignal.mapAsync<string | null>(
  async (id) => {
    const res = await fetch(`https://api.example.com/data/${id}`)
    return r.text()
  },
  null // this is the default state before the promise resolves
)

// the rest remains the same
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
- [Learn more about render](/page/render.html)
