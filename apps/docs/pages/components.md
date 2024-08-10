---
title: Build your own Renderables or Components
order: 60
description: Reusing Renderables allow an efficient workflow that minimize code duplication and bugs.
---
# Build your own Renderables or Components

A reusable Renderable or Component can be exported as either a constant value or a function.

```ts
const Logo = html.div(attr.class('logo'), html.img(attr.src('logo.png')))
```

In this example, `Logo` is a reusable component. The content of the component remains the same; it doesn’t change. However, it is still reusable because it doesn’t generate a new DOM unless it is `render`ed. It can be applied multiple times in different locations, making it versatile across applications.

Using a capitalized name for your component is a common convention to indicate that it is a component.

You can create a component that is still constant and reusable but has dynamic content.

```ts
const UserView = Async(fetchUser(), (user) => html.div(user.name))
```

The rendered content of the component is dynamic and depends on the result of the `fetchUser()` promise but the promise is executed only once for any instantiation of the component.

## Props

More commonly, you'll see components that take a set of props as argument. In this case the component is a function that returns a `Renderable`.

```ts
const UserView = (user: User) => html.div(user.name)
```

This is a valid component but it is not often what you want in the context of Tempo because it does not allow to update the DOM when the props change. Each application of this component will result in a DOM state that will not change unless the component is re-rendered.

To address this, you want to use `Signal`s instead.

```ts
const UserView = (user: Signal<User>) => html.div(user.$.name)
```

Now, any time the `user` signal changes, the DOM will be updated. Notice that the `$` property is used to access the value of a field wrapped in the signal. It is convenient and type-safe. The equivalent method is `user.at('name')`.

To get the best of both worlds, you can use `Value<T>`.

```ts
const UserView = (user: Value<User>) => html.div(Signal.map(user, (user) => user.name))
```

`Value<T>` is a union type that can be either a `Signal<T>` or a `T`. It is a convenient way to work with signals and values in the same way. `Signal.map` is used to map a `Value<T>` to a new `Value<O>`.

Most Renderables in Tempo accept `Value<T>` instead of `Signal<T>` or `T`.

If you want to create components that take multiple arguments or options, you can shape them the way you want.

## Next Steps

- [Learn more about render](/page/render.html)
