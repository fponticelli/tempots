---
title: Signals
order: 40
description: Signals are the reactive data stores. They are used to manage state and notify state changes.
---
# Signals

Signals are the reactive data stores. They are used to manage state and notify state changes.

## Create signals

There are three types of signals: `Signal`, `Prop`, and `Computed`. A `Signal` is a readonly object that can be observed but not updated. A `Prop` is a writable object that can be updated. A `Computed` is a readonly object that is derived from other signals.

To create a signal, use the `makeSignal()`, `makeProp()`, and `makeComputed()` functions.

```tsx
// create a signal that cannot be updated
const signal = makeSignal(0)

// create a signal that can be updated
const prop = makeProp(0)
prop.value = 1
console.log(prop.value) // 1

// create a computed signal
const computed = makeComputed(() => signal.value + prop.value, [signal, prop])
```

When you create a Computed signal, you need to provide a function that returns the value of the signal. The function will be called whenever the dependency signals in the second argument change. There is no magic here, if you don't provide the dependency signals, the computed signal will not update.

Signals can also be created from promises using the `Signal.ofPromise()` static method.

```ts
const signal = Signal.ofPromise(fetchRemoteData(), [])
```

The first argument is a promise that resolves to the value of the signal. The second argument is a default value that is used until the promise resolves.

## Read signals

Once you have a signal, you can read its value using the `value` property (or `get()` function). You generally don't access the `value` property directly unless you are referring it within an event handler or a computed signal.

Since signals are reactive, you can listen to changes using the `on()` method. The method returns a function that you can call to stop listening to changes.

This is how tempo monitors changes and updates the DOM.

When you add a callback to a signal, the callback is called immediately with the current value of the signal.

## Modify props

You can update a prop using the `set()` method or using the `value` setter. They both take a new value and update the signal. You can also update a prop using the `update()` method. The method takes a function that receives the current value and returns the new value.

```ts
const prop = makeProp(0)
prop.set(1)
prop.value = 2
prop.update(v => v + 1)
```

## Effects

You can also create side effects using the `makeEffect()` function. The function takes a function that performs the side effect and an array of signals that the side effect depends on. The function is called immediately and whenever the dependency signals change. The function returns a function that you can call to stop the side effect.

## Transform signals

You can transform signals using the `map()`, `filter()`, `flatMap()`, and other functions. These functions create a new signal that is derived from the original signal.

Since you will often work with signals of objects, you might find the `$` property useful. `$` is an object that contains signals for each property of the object. This makes it easy to work with signals of objects.

```ts
const prop = makeProp({ name: 'John', age: 30 })
console.log(prop.$.name.value) // John
```

The `at()` function is equivalent to `$` but it takes a key as an argument.

## Next Steps

- [Learn more about Building your own Renderables](/page/components.html)
- [Learn more about render](/page/render.html)
