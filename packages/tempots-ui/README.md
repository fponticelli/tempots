# Tempo UI (@tempots/ui)

A collection of reusable UI components and renderables built on top of @tempots/dom to accelerate development with Tempo. This package provides higher-level abstractions for common UI patterns and components.

[![npm version](https://img.shields.io/npm/v/@tempots/ui.svg)](https://www.npmjs.com/package/@tempots/ui)
[![license](https://img.shields.io/npm/l/@tempots/ui.svg)](https://github.com/fponticelli/tempots/blob/main/LICENSE)

## Installation

```bash
# npm
npm install @tempots/dom @tempots/std @tempots/ui

# yarn
yarn add @tempots/dom @tempots/std @tempots/ui

# pnpm
pnpm add @tempots/dom @tempots/std @tempots/ui
```

Note: @tempots/dom and @tempots/std are peer dependencies and must be installed alongside @tempots/ui.

## Features

### UI Components

The library provides a set of reusable UI components:

```typescript
import { html, render } from '@tempots/dom'
import { AutoFocus, AutoSelect, InViewport } from '@tempots/ui'

// Create an input that automatically gets focus
const focusedInput = html.input(
  AutoFocus(), // Automatically focus this input when rendered
  AutoSelect()  // Automatically select all text when focused
)

// Create an element that detects when it's in the viewport
const lazyLoadedContent = InViewport(
  {}, // Options for intersection observer
  (isVisible) => isVisible.value
    ? html.div('Content is visible!')
    : html.div('Loading...')
)

render(html.div(focusedInput, lazyLoadedContent), document.body)
```

### Routing

The library includes a simple but powerful routing system:

```typescript
import { render } from '@tempots/dom'
import { Router, Location } from '@tempots/ui'

const AppRouter = Router({
  '/': () => html.div('Home Page'),
  '/about': () => html.div('About Page'),
  '/users/:id': (info) => {
    // Access route parameters
    const userId = info.$.params.$.id
    return html.div('User Profile: ', userId)
  },
  '*': () => html.div('404 - Not Found')
})

render(AppRouter, document.body)

// Navigate programmatically
Location.navigate('/about')
```

### Resource Loading

Handle async data loading with built-in loading and error states:

```typescript
import { html, render } from '@tempots/dom'
import { Resource } from '@tempots/ui'

// Load data from an API
const userResource = Resource({
  load: () => fetch('/api/user').then(r => r.json()),
  loading: () => html.div('Loading user...'),
  error: (err) => html.div('Error loading user: ', err.message),
  success: (user) => html.div(
    html.h2(user.name),
    html.p(user.email)
  )
})

render(userResource, document.body)
```

### PopOver with Arrow Support

Create floating popover elements with optional arrow indicators:

```typescript
import { html, render, prop, on, attr } from '@tempots/dom'
import { PopOver } from '@tempots/ui'

function TooltipExample() {
  const showTooltip = prop(false)

  return html.div(
    html.button(
      on.mouseenter(() => showTooltip.value = true),
      on.mouseleave(() => showTooltip.value = false),
      'Hover me',
      PopOver({
        open: showTooltip,
        placement: 'top',
        content: () => html.div(
          { style: 'padding: 8px; background: white; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);' },
          'This is a tooltip with an arrow!'
        ),
        arrow: {
          padding: 4,
          content: html.div(
            attr.class('tooltip-arrow'),
            attr.style('background: white; border: 1px solid #ccc; transform: rotate(45deg); width: 8px; height: 8px;')
          )
        }
      })
    )
  )
}
```

### Form Helpers

Simplify form input handling:

```typescript
import { html, render, prop } from '@tempots/dom'
import { SelectOnFocus, AutoSelect } from '@tempots/ui'

function LoginForm() {
  const username = prop('')
  const password = prop('')

  return html.form(
    html.div(
      html.label('Username'),
      html.input(
        AutoFocus(),
        SelectOnFocus(),
        attr.value(username),
        on.input(e => username.set(e.target.value))
      )
    ),
    html.div(
      html.label('Password'),
      html.input(
        attr.type('password'),
        attr.value(password),
        on.input(e => password.set(e.target.value))
      )
    ),
    html.button('Login')
  )
}
```

## Available Components

The library includes the following components and utilities:

- `AutoFocus` - Automatically focus an element
- `AutoSelect` - Automatically select text in an input
- `SelectOnFocus` - Select all text when an input is focused
- `InViewport` - Detect when an element is in the viewport
- `Router` - Simple client-side routing
- `Location` - Navigation and location utilities
- `Resource` - Async data loading with loading/error states
- `AsyncResultView` - Display async operation results
- `ResultView` - Display success/failure results
- `PopOver` - Create popup/popover elements
- And more...

## Documentation

For comprehensive documentation, visit the [Tempo Documentation Site](https://tempo-ts.com/library/tempots-ui.html).

## License

This package is licensed under the Apache License 2.0.
