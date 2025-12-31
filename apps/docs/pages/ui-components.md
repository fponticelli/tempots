---
title: UI Components
order: 80
description: The @tempots/ui library provides a set of reusable UI components and renderables to accelerate development with Tempo.
---
# UI Components (@tempots/ui)

The `@tempots/ui` package is a collection of reusable UI components and renderables built on top of `@tempots/dom` to accelerate development with Tempo. This package provides higher-level abstractions for common UI patterns and components.

## Installation

```bash
# npm
npm install @tempots/dom @tempots/std @tempots/ui

# yarn
yarn add @tempots/dom @tempots/std @tempots/ui

# pnpm
pnpm add @tempots/dom @tempots/std @tempots/ui
```

Note: `@tempots/dom` and `@tempots/std` are peer dependencies and must be installed alongside `@tempots/ui`.

## Features

### UI Components

The library provides a set of reusable UI components:

#### AutoFocus and AutoSelect

```typescript
import { html, render } from '@tempots/dom'
import { AutoFocus, AutoSelect } from '@tempots/ui'

// Create an input that automatically gets focus
const focusedInput = html.input(
  AutoFocus(), // Automatically focus this input when rendered
  AutoSelect()  // Automatically select all text when focused
)

// Render it to the DOM
render(focusedInput, document.body)
```

#### InViewport

Detect when an element is in the viewport:

```typescript
import { html, render } from '@tempots/dom'
import { InViewport } from '@tempots/ui'

// Create an element that detects when it's in the viewport
const lazyLoadedContent = InViewport(
  { mode: 'partial', once: false }, // mode: 'partial' | 'full', once?: boolean
  (isVisible) => isVisible.map(v => v
    ? html.div('Content is visible!')
    : html.div('Loading...'))
)

// Render it to the DOM
render(lazyLoadedContent, document.body)
```

#### HTMLTitle

Set the document title:

```typescript
import { html, render, prop } from '@tempots/dom'
import { HTMLTitle } from '@tempots/ui'

// Create a title that updates when the signal changes
const title = prop('Welcome to my app')
const app = html.div(
  HTMLTitle(title),
  html.h1(title)
)

// Render it to the DOM
render(app, document.body)

// Update the title
title.value = 'New page title'
```

#### Router

Client-side routing with `RootRouter` and `ChildRouter`:

```typescript
import { html, render, Provide, Use } from '@tempots/dom'
import { RootRouter, ChildRouter, Location, NavigationService } from '@tempots/ui'

// Define routes - handlers receive a Signal<RouteInfo>
const app = Provide(Location, {}, () =>
  RootRouter({
    '/': () => html.div('Home page'),
    '/about': () => html.div('About page'),
    '/users/:id': (info) => html.div('User ID: ', info.$.params.$.id),
    '/admin/*': () => AdminRoutes(),
    '*': () => html.div('404 - Not found')
  })
)

// Nested routes with ChildRouter
const AdminRoutes = () => ChildRouter({
  '/users': () => html.div('Admin Users'),
  '/settings': () => html.div('Admin Settings'),
  '*': () => html.div('Admin 404')
})

// Render it to the DOM
render(app, document.body)

// Navigate programmatically using NavigationService
NavigationService.navigate('/about')
```

#### Query

Handle async data loading with loading/error states:

```typescript
import { html, prop, render } from '@tempots/dom'
import { Query } from '@tempots/ui'

// Create a query that loads data from an API
const userId = prop(1)

const userQueryView = Query({
  request: userId,
  load: async ({ request, abortSignal }) => {
    const response = await fetch(`https://api.example.com/user/${request}`, { signal: abortSignal })
    if (!response.ok) throw new Error('Failed to load user')
    return response.json()
  },
  convertError: error => error instanceof Error ? error.message : String(error),
  pending: ({ previous, reload }) => html.div('Loading...'),
  failure: ({ error, reload }) => html.div(
    error.map(message => `Error: ${message}`),
    html.button(on.click(reload), 'Retry')
  ),
  success: ({ value, reload }) => html.div(
    value.map(u => `Hello, ${u.name}!`),
    html.button(on.click(reload), 'Refresh')
  ),
})

// Render it to the DOM
render(userQueryView, document.body)

// Trigger a reload by changing the request value
userId.value = 2
```

## Available Components

The library includes the following components and utilities:

### Input & Focus
- `AutoFocus` - Automatically focus an element
- `AutoSelect` - Automatically select text in an input
- `SelectOnFocus` - Select all text when an input is focused

### Viewport & Layout
- `InViewport` - Detect when an element is in the viewport
- `WhenInViewport` - Conditional rendering based on viewport visibility
- `WindowSize` - Track window dimensions
- `ElementRect` - Track element size and position
- `PopOver` - Create popup/popover elements
- `HiddenWhenEmpty` - Hide an element when its content is empty

### Routing
- `RootRouter` - Root-level client-side routing
- `ChildRouter` - Nested routing for sub-routes
- `Location` - Provider for reactive location state
- `NavigationService` - Programmatic navigation utilities
- `Anchor` - Navigation-aware anchor element

### Async Operations
- `Query` - Async data loading with loading/error states
- `Mutation` - Handle async mutations (POST/PUT operations)
- `AsyncResultView` - Display async operation results
- `ResultView` - Display success/failure results

### Events & Interaction
- `OnClickOutside` - Detect clicks outside an element
- `OnKeyPressed` - Handle keyboard events with modifier support
- `OnEnterKey` - Handle Enter key press
- `OnEscapeKey` - Handle Escape key press

### Utilities
- `HTMLTitle` - Set the document title
- `Appearance` - Detect and react to light/dark mode
- `classes` - Conditional CSS class binding
- `Ticker` / `ticker` - Counter/timer signal utilities
- `makeRelativeTime` - Human-readable relative time formatting

## Next Steps

- [Learn more about render](/page/render.html)
- Check out the [demos](/demo/counter.html) to see these components in action
