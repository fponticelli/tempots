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
  { threshold: 0.5 }, // Options for intersection observer
  (isVisible) => isVisible.value
    ? html.div('Content is visible!')
    : html.div('Loading...')
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

Simple client-side routing:

```typescript
import { html, render, prop } from '@tempots/dom'
import { Router, Location } from '@tempots/ui'

// Define routes
const app = html.div(
  AppRouter({
    '/': () => html.div('Home page'),
    '/about': () => html.div('About page'),
    '/users/:id': (params) => html.div(`User ID: ${params.id}`),
    '*': () => html.div('404 - Not found')
  })
)

// Render it to the DOM
render(app, document.body)

// Navigate programmatically
Location.navigate('/about')
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
  load: async ({ request }) => {
    const response = await fetch(`https://api.example.com/user/${request}`)
    if (!response.ok) throw new Error('Failed to load user')
    return response.json()
  },
  mapError: error => error instanceof Error ? error.message : String(error),
})({
  loading: () => html.div('Loading...'),
  failure: error => html.div(error.map(message => `Error: ${message}`)),
  success: user => html.div(user.map(u => `Hello, ${u.name}!`)),
})

// Render it to the DOM
render(userQueryView, document.body)

// Trigger a reload by changing the request value
userId.value = 2
```

## Available Components

The library includes the following components and utilities:

- `AutoFocus` - Automatically focus an element
- `AutoSelect` - Automatically select text in an input
- `SelectOnFocus` - Select all text when an input is focused
- `InViewport` - Detect when an element is in the viewport
- `Router` - Simple client-side routing
- `Location` - Navigation and location utilities
- `Query` - Async data loading with loading/error states
- `AsyncResultView` - Display async operation results
- `ResultView` - Display success/failure results
- `PopOver` - Create popup/popover elements
- `HTMLTitle` - Set the document title
- `HiddenWhenEmpty` - Hide an element when its content is empty
- `Appearance` - Apply styles based on light/dark mode
- `Size` - Apply styles based on screen size

## Next Steps

- [Learn more about render](/page/render.html)
- Check out the [demos](/demo/counter.html) to see these components in action
