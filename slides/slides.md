---
theme: default
title: "TempoTS: The Framework You Actually Understand"
info: |
  A ~20 minute presentation on why JS/TS developers should adopt TempoTS.
class: text-center
drawings:
  persist: false
transition: slide-left
mdc: true
---

# You've read the docs.

# Watched the tutorials.

---
layout: center
class: text-center
---

# You still don't understand what your framework is doing.

---
layout: center
class: text-center
---

# Your "Hello World" is 150KB.

---
layout: center
class: text-center
---

# You chose TypeScript for type safety.

# Your templates ignore it.

---
layout: center
class: text-center
---

# You forgot to clean up a subscription.

# Memory leak.

# Production.

---
layout: center
class: text-center
---

# ...There has to be a better way.

---
layout: center
---

# The Industry is Converging

<div class="text-3xl mt-8">

React (2013) → Hooks (2019) → Signals (2023) → **?**

</div>

<v-click>

<div class="mt-12 text-2xl text-gray-400">

The answer: **Signals + Direct DOM**

</div>

</v-click>

---
layout: center
class: text-center
---

# What if we followed this to its logical conclusion?

---
layout: center
class: text-center
---

<div class="text-6xl font-bold mb-4">TempoTS</div>

<div class="text-2xl text-gray-400">The framework you actually understand.</div>

---

# What is TempoTS?

<v-clicks>

- **Zero Dependencies** - No npm bloat
- **Direct DOM Manipulation** - No Virtual DOM overhead
- **Fine-Grained Reactivity** - Signals that update exactly what changed
- **Automatic Memory Management** - No cleanup code needed
- **Pure TypeScript** - No JSX, no templates, no magic

</v-clicks>

---

# The Mental Model

<div class="text-3xl mt-8 text-center">

**Functions that return DOM**

</div>

```ts {all|1-3|5-9|all}
// A component is just a function
function Greeting(name: string) {
  return html.div('Hello, ', name, '!')
}

// Compose naturally
function App() {
  return html.div(
    Greeting('World'),
    Greeting('TempoTS')
  )
}
```

---

# Creating Elements

Type-safe element factories:

```ts {all|1-2|4-7|9-12}
// HTML elements
html.div(), html.span(), html.button(), html.input()

// With children
html.div(
  html.h1('Title'),
  html.p('Paragraph')
)

// Input helpers with automatic type attribute
input.text()      // <input type="text">
input.checkbox()  // <input type="checkbox">
```

---

# Attributes & Events

```ts {all|1-5|7-11|13-17}
// Attributes via attr.*
html.button(
  attr.class('btn primary'),
  attr.disabled(false),
)

// Events via on.*
html.button(
  on.click(() => console.log('clicked!')),
  on.mouseenter(() => console.log('hover')),
)

// Combine freely
html.button(
  attr.class('btn'),
  on.click(handleClick),
  'Click me'
)
```

---

# Signals: Reactive State

```ts {all|1-2|4-6|8-10}
// Create a signal with prop()
const count = prop(0)

// Read the value
console.log(count.value) // 0
count.set(5)             // Update it

// Or update based on current value
count.update(v => v + 1)
console.log(count.value) // 6
```

<v-click>

<div class="mt-8 p-4 bg-blue-900/30 rounded">

**Key insight**: Signals are observable values. When they change, anything subscribed to them updates automatically.

</div>

</v-click>

---

# Computed Values

Derive new signals from existing ones:

```ts {all|1|3-4|6-7|9-11}
const count = prop(0)

// .map() creates a computed signal
const doubled = count.map(v => v * 2)

// .at() accesses nested properties
const name = user.at('profile').at('name')

// Chain transformations
const display = count
  .map(v => v * 2)
  .map(v => `Value: ${v}`)
```

---

# Value&lt;T&gt;: The Bridge

<div class="text-xl mb-4">You don't always need Signals</div>

```ts {all|1-2|4-6|8-14}
// Value<T> = T | Signal<T>
// The API accepts both!

// Static values work fine
html.button(attr.disabled(false))
html.div(attr.class('card'))

// Mix freely in the same component
html.div(
  attr.class('card'),                              // static
  attr.class(isActive.map(a => a ? 'active' : '')), // reactive
  'Hello ',                                         // static text
  userName                                          // reactive text
)
```

<v-click>

<div class="mt-4 p-4 bg-green-900/30 rounded">

**Use signals where you need reactivity. Use literals everywhere else.**

</div>

</v-click>

---
layout: two-cols
---

# How Signals Update the DOM

<div class="text-sm">

```ts
const disabled = prop(false)

html.button(
  attr.disabled(disabled),
  'Submit'
)
```

</div>

::right::

<div class="ml-4">

```
┌──────────────────┐
│ disabled = false │
└────────┬─────────┘
         │
         ▼
┌────────────────────────┐
│ <button>Submit</button>│
└────────────────────────┘
```

<v-click>

```
         │
         │ disabled.set(true)
         ▼

┌──────────────────┐
│ disabled = true  │
└────────┬─────────┘
         │
         ▼
┌─────────────────────────────────┐
│ <button disabled>Submit</button>│
└─────────────────────────────────┘
```

</v-click>

</div>

---
layout: center
---

# No Virtual DOM.

# No diffing.

# Just: `element.disabled = true`

---

# Demo: Counter

<TempoDemo demo="counter" />

---

# Demo: Counter with Derived State

<TempoDemo demo="counter-derived" />

---

# Conditional Rendering

```ts {all|1|3-6|8-12}
const isLoggedIn = prop(false)

// When(condition, thenFn, elseFn?)
When(isLoggedIn,
  () => html.span('Welcome back!'),
  () => html.span('Please log in')
)

// Only renders the active branch
// Automatically switches when signal changes
// Clean up happens automatically
// No manual if/else in render
```

---

# List Rendering

```ts {all|1|3-8|10-14}
const items = prop(['Apple', 'Banana', 'Cherry'])

// ForEach(arraySignal, renderFn)
ForEach(items, (item, position) =>
  html.li(
    item,
    position.isLast ? '' : ', '
  )
)

// Efficient updates:
// - Only changed items re-render
// - Additions/removals handled automatically
// - Each item gets its own cleanup scope
```

---

# Demo: Todo Item

<TempoDemo demo="todo-item" />

---

# Storage Persistence

```ts {all|1-5|7-8|10-12}
// localStorage with automatic sync
const settings = localStorageProp({
  key: 'app-settings',
  defaultValue: { theme: 'dark', fontSize: 14 }
})

// Cross-tab synchronization built in!
// Change in one tab → updates all tabs

// sessionStorage works the same way
const tempData = sessionStorageProp({
  key: 'temp-data',
  defaultValue: null
})
```

---

# State Management: Reducer Pattern

```ts {all|1-3|5-11|13-16}
// Define your state and actions
type State = { count: number; todos: Todo[] }
type Action = { type: 'increment' } | { type: 'addTodo'; title: string }

// Create a reducer
function update(state: State, action: Action): State {
  switch (action.type) {
    case 'increment': return { ...state, count: state.count + 1 }
    case 'addTodo': return { ...state, todos: [...state.todos, newTodo(action.title)] }
  }
}

// Use it
const state = prop<State>({ count: 0, todos: [] })
const dispatch = state.reducer(update)
dispatch({ type: 'increment' })
```

---

# TodoMVC Architecture

```ts
// State with localStorage persistence
const state = localStorageProp<State>({
  key: 'todomvc-tempo',
  defaultValue: { filter: Filter.All, todos: [] }
})

// Derived signals for filtered view
const visibleTodos = state.map(({ todos, filter }) =>
  todos.filter(filterFn(filter))
)

// Dispatch actions
const dispatch = state.reducer(update)

// Render with ForEach
ForEach(visibleTodos, todo => TodoItem({ todo, dispatch }))
```

---

# Routing

```ts {all|1-5|7-14}
// Define routes
const routes = [
  { path: '/', component: Home },
  { path: '/about', component: About },
  { path: '/user/:id', component: UserProfile }
]

// Router component handles everything
Router(routes, {
  notFound: () => html.div('404 - Not Found')
})

// Navigate programmatically
Location.push('/user/123')
```

---

# Async Data

```ts {all|1-5|7-16}
// Query component handles loading states
Query({
  query: () => fetch('/api/users').then(r => r.json()),
  // ...
})

// With full state handling
Query({
  query: fetchUsers,
  onLoading: () => html.div('Loading...'),
  onError: (err) => html.div('Error: ', err.message),
  onSuccess: (users) =>
    html.ul(
      ForEach(signal(users), user => html.li(user.name))
    )
})
```

---

# Framework Comparison

| Aspect | TempoTS | React | Vue | Solid |
|--------|---------|-------|-----|-------|
| DOM Strategy | Direct | Virtual DOM | Virtual DOM | Direct |
| Reactivity | Fine-grained | Component-level | Component-level | Fine-grained |
| Dependencies | **Zero** | Many | Some | Some |
| Memory | **Auto-disposal** | GC dependent | GC dependent | Auto cleanup |
| TypeScript | **Native** | JSX gaps | Template gaps | Good |

---

# Pros: Simplicity & Type Safety

<v-clicks>

- **Just functions and signals** - No classes, no decorators, no magic
- **Full TypeScript support** - No JSX type holes, no template string gaps
- **Predictable behavior** - Direct DOM updates, no batching surprises
- **Easy to debug** - Set a breakpoint, see exactly what happens

</v-clicks>

---

# Pros: Performance & Size

<v-clicks>

- **Automatic cleanup** - Signals disposed when components unmount
- **No memory leaks** - Forget about cleaning up subscriptions
- **Zero dependencies** - Nothing but your code
- **Small bundle** - ~88KB for the full DOM package

</v-clicks>

---

# Cons: Ecosystem

<v-clicks>

- **Smaller community** - Fewer Stack Overflow answers
- **Fewer ready-made components** - No massive UI library ecosystem
- **Limited tooling** - No dedicated DevTools (yet)

</v-clicks>

---

# Cons: Learning Curve

<v-clicks>

- **Reactive programming concepts** - Signals require a mental shift
- **Less familiar patterns** - No JSX, different from React/Vue
- **Functional style** - May be unfamiliar to class-oriented developers

</v-clicks>

---

# When to Use TempoTS

<v-clicks>

- **TypeScript-first projects** - Where type safety actually matters
- **Performance-critical apps** - Where Virtual DOM overhead hurts
- **When understanding matters** - No magic, no hidden behavior
- **Smaller to medium apps** - Where ecosystem size doesn't matter
- **Learning reactive programming** - Clean, minimal implementation

</v-clicks>

---

# Getting Started

```bash
npm install @tempots/dom
```

```ts
import { html, prop, on, render } from '@tempots/dom'

function App() {
  const count = prop(0)
  return html.div(
    html.p('Count: ', count),
    html.button(on.click(() => count.update(v => v + 1)), '+')
  )
}

render(App(), document.getElementById('app')!)
```

---

# Resources

<v-clicks>

- **GitHub**: github.com/fponticelli/tempots
- **Demos**:
  - Counter - The basics
  - TodoMVC - Real patterns
  - HackerNews PWA - Production complexity
  - 7GUIs - Comprehensive UI patterns

</v-clicks>

---
layout: center
class: text-center
---

# "The best framework is the one you understand."

---
layout: center
class: text-center
---

<div class="text-6xl font-bold mb-8">Try it.</div>

<div class="text-2xl">

`npm install @tempots/dom`

</div>

<div class="mt-8 text-gray-400">

github.com/fponticelli/tempots

</div>
