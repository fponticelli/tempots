---
title: Troubleshooting & FAQ
order: 110
description: Common issues, solutions, and frequently asked questions about Tempo.
---
# Troubleshooting & FAQ

This page addresses common issues and questions that may arise when working with Tempo.

## Common Mistakes

### Renderables should not be payloads to signals

The following is an anti-pattern.

```typescript
function Counter() {
  const p = prop(1);
  // DON'T!
  return p.map((value) => html.div(String(value)));
}
```

This is how it should work:

```typescript
function Counter() {
  const p = prop(1);
  // DO!
  return html.div(p.map(String));
}
```

In the rare case where a signal should really contain a Renderable, the `MapSignal` component is the way to go. The reason to avoid it is that the entire sub-tree DOM is re-rendered when the `prop` changes which is potentially inefficient.

```typescript
function Counter() {
  const p = prop(1);
  // Correct but inefficient
  return MapSignal(p, (value) => html.div(String(value)));
}
```

## Frequently Asked Questions

### How does Tempo compare to React, Vue, or Angular?

Tempo is a lightweight UI framework that takes a different approach:

- **No Virtual DOM**: Tempo directly updates the DOM, which can be more efficient for many use cases.
- **Fully Typed**: Built from the ground up with TypeScript for excellent type safety.
- **Zero Dependencies**: Tempo has no external dependencies, making it lightweight.
- **Functional Approach**: Uses plain functions rather than classes or JSX.
- **Fine-Grained Reactivity**: Uses signals for precise updates rather than re-rendering components.

### Can I use Tempo with existing libraries?

Yes! Tempo can be integrated with most JavaScript libraries. Since Tempo directly manipulates the DOM, you can use it alongside other libraries that do the same. You can:

1. Use the `WithElement` renderable to get a reference to a DOM element
2. Initialize third-party libraries with that element
3. Clean up resources with `OnDispose`

```typescript
import { html, WithElement, OnDispose } from '@tempots/dom'
import SomeThirdPartyLib from 'some-third-party-lib'

const ThirdPartyComponent = () => html.div(
  WithElement(element => {
    // Initialize the third-party library
    const instance = new SomeThirdPartyLib(element)

    // Return a cleanup function
    return OnDispose(() => {
      instance.destroy()
    })
  })
)
```

The other way around is also possible. You can use Tempo to create renderables that can be used in other libraries. Just get access to a parent node and use `render` to render Tempo content. The function returned by `render` can be used to dispose of the rendered content.

```ts
import { render } from '@tempots/dom'

const cancel = render(
  html.div('Hello World'),
  document.getElementById('root')
)

// later
cancel()
```

### Does Tempo support Server-Side Rendering (SSR)?

Tempo has experimental support for server-side rendering. The `DOMContext` includes an `isFirstLevel` property that can be used to mark nodes for server-side rendering and hydration. However, this feature is still under development.

## Common Issues

### Signals not updating the UI

If your signals are changing but the UI isn't updating, check:

1. **Signal Dependencies**: For computed signals, make sure you've included all dependencies in the dependency array.

```typescript
// Incorrect - missing dependency
// This still works but it only updates on variations of signal1
const computed = computed(() => signal1.value + signal2.value, [signal1])

// Correct
const computed = computed(() => signal1.value + signal2.value, [signal1, signal2])
```

2. **Signal Equality**: Signals use reference equality by default. For objects, you might need to provide a custom equality function.

```typescript
// Custom equality function for objects
const userSignal = signal(
  { name: 'John', age: 30 },
  (a, b) => a.name === b.name && a.age === b.age
)
```

3. **Immutable Updates**: When updating objects or arrays in props, make sure to create new references.

```typescript
// Incorrect - mutating the array
const items = prop([1, 2, 3])
items.value.push(4) // UI won't update!

// Correct - creating a new array
items.value = [...items.value, 4]
```

### Memory Leaks

If your application is experiencing memory leaks, check:

1. **Cleanup Functions**: Make sure you're properly cleaning up resources with `OnDispose`.

```typescript
WithElement(element => {
  const interval = setInterval(() => {
    // Do something
  }, 1000)

  return OnDispose(() => {
    clearInterval(interval)
  })
})
```

2. **Signal Listeners**: When working outside the renderable context, if you manually add listeners to signals, make sure to remove them.

```typescript
const clear = signal.on(value => {
  // Do something with value
})

// Later, when no longer needed
clear()
```

If a Signal is disposed, it will automatically remove all listeners and you don't need to call `clear`.

Within renderables, the scope is automatically tracked and signals are automatically disposed. The exception to that is if you define a signal in an async context where the scope cannot be automatically tracked. In this case you will have to manually dispose the signal.

3. **Event Listeners**: If you manually add DOM event listeners, make sure to remove them.

```typescript
WithElement(element => {
  const handler = () => console.log('Clicked')
  element.addEventListener('click', handler)

  return OnDispose(() => {
    element.removeEventListener('click', handler)
  })
})
```

### TypeScript Errors

If you're encountering TypeScript errors:

1. **Check TypeScript Version**: Tempo requires TypeScript 4.7 or later.

2. **Import Types**: Make sure you're importing types correctly.

```typescript
// Import types
import { Renderable, Signal, Prop } from '@tempots/dom'
```

3. **Generic Type Parameters**: Make sure you're providing the correct type parameters.

```typescript
// Specify the type parameter
const userSignal = signal<User | null>(null)
```

## Next Steps

- [Learn more about Signals](/page/signals.html)
- [Explore Examples & Best Practices](/page/examples.html)
- [Check out the Demos](/demo/hnpwa.html)
