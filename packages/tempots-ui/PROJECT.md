# Tempo UI (@tempots/ui)

A collection of reusable UI components and renderables built on top of @tempots/dom to accelerate development with Tempo. This package provides higher-level abstractions for common UI patterns and components.

## Overview

Tempo UI bridges the gap between the low-level DOM manipulation of @tempots/dom and the high-level components needed for real applications. It provides a curated set of components, utilities, and patterns that solve common UI development challenges.

## Key Features

- **Component Library**: Pre-built components for common UI patterns
- **Routing System**: Client-side routing with URL synchronization
- **Query Management**: Async data loading with loading/error states
- **Form Utilities**: Enhanced form controls and input handling
- **Accessibility**: Built-in accessibility features and ARIA support
- **Performance**: Optimized components with minimal overhead
- **Type Safety**: Full TypeScript support with comprehensive types

## Component Categories

### Input Enhancement
- **AutoFocus**: Automatically focus elements when rendered
- **AutoSelect**: Automatically select text in inputs
- **SelectOnFocus**: Select text when input receives focus

### Layout & Visibility
- **InViewport**: Detect when elements enter/exit the viewport
- **HiddenWhenEmpty**: Hide elements when they have no content
- **PopOver**: Create popup and popover elements
- **Size**: Responsive size utilities

### Navigation & Routing
- **Router**: Client-side routing system
- **Location**: Navigation and location utilities
- **Anchor**: Enhanced anchor link handling

### Data Loading
- **Query**: Async data loading with loading/error states
- **AsyncResultView**: Display async operation results
- **ResultView**: Display success/failure results

### Utilities
- **HTMLTitle**: Dynamic document title management
- **Appearance**: Theme and appearance utilities
- **Ticker**: Time-based updates and animations

## Design Philosophy

### Composition Over Configuration
Components are designed to be composed together rather than configured with many options:

```typescript
// Compose multiple behaviors
html.input(
  AutoFocus(),
  AutoSelect(),
  SelectOnFocus(),
  attr.placeholder('Enter text...')
)
```

### Minimal API Surface
Each component has a focused, minimal API that does one thing well:

```typescript
// Simple, focused APIs
const AutoFocus = (delay: number = 10): Renderable
const InViewport = (options: IntersectionObserverInit, render: (isVisible: Signal<boolean>) => TNode): Renderable
```

### Framework Integration
Components integrate seamlessly with Tempo's reactive system:

```typescript
// Reactive integration
const isVisible = prop(false)
InViewport({}, visible => {
  isVisible.set(visible.value)
  return html.div('Content is visible!')
})
```

## Routing System

### Basic Routing
```typescript
import { Router, Location } from '@tempots/ui'

const AppRouter = Router({
  '/': () => html.div('Home Page'),
  '/about': () => html.div('About Page'),
  '/users/:id': (info) => {
    const userId = info.$.params.$.id
    return html.div('User Profile: ', userId)
  },
  '*': () => html.div('404 - Not Found')
})

render(AppRouter, document.body)
```

### Programmatic Navigation
```typescript
// Navigate to different routes
Location.navigate('/about')
Location.navigate('/users/123')

// Access current location
Use(Location, location => {
  return html.div('Current path: ', location.$.pathname)
})
```

### Route Parameters
```typescript
// Extract route parameters
'/users/:id/posts/:postId': (info) => {
  const userId = info.$.params.$.id
  const postId = info.$.params.$.postId
  return UserPost({ userId, postId })
}
```

## Query Management

### Basic Query Loading
```typescript
import { Query } from '@tempots/ui'

const userQuery = Query({
  load: () => fetch('/api/user').then(r => r.json()),
  loading: () => html.div('Loading user...'),
  error: (err) => html.div('Error: ', err.message),
  success: (user) => html.div(
    html.h2(user.name),
    html.p(user.email)
  )
})
```

### Advanced Query Patterns
```typescript
// Query with dependencies
const userPosts = Query({
  load: async () => {
    const user = await fetchUser()
    const posts = await fetchUserPosts(user.id)
    return { user, posts }
  },
  loading: () => SkeletonLoader(),
  error: (err) => ErrorMessage({ error: err }),
  success: ({ user, posts }) => UserPostsList({ user, posts })
})
```

## Form Enhancement

### Input Focus Management
```typescript
import { AutoFocus, AutoSelect, SelectOnFocus } from '@tempots/ui'

function LoginForm() {
  const username = prop('')
  const password = prop('')

  return html.form(
    html.input(
      AutoFocus(),           // Focus on render
      SelectOnFocus(),       // Select text on focus
      attr.placeholder('Username'),
      attr.value(username),
      on.input(e => username.set(e.target.value))
    ),
    html.input(
      attr.type('password'),
      attr.placeholder('Password'),
      attr.value(password),
      on.input(e => password.set(e.target.value))
    )
  )
}
```

### Form Validation
```typescript
// Combine with @tempots/std for validation
import { Result, success, failure } from '@tempots/std'

const validateEmail = (email: string): Result<string, string> => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
    ? success(email)
    : failure('Invalid email format')
}

const emailInput = prop('')
const emailValidation = emailInput.map(validateEmail)
```

## Viewport Detection

### Lazy Loading
```typescript
import { InViewport } from '@tempots/ui'

const LazyImage = ({ src, alt }: { src: string, alt: string }) =>
  InViewport(
    { threshold: 0.1 },
    isVisible => isVisible.value
      ? html.img(attr.src(src), attr.alt(alt))
      : html.div(attr.class('placeholder'), 'Loading...')
  )
```

### Infinite Scrolling
```typescript
const InfiniteList = ({ items, loadMore }: { items: Signal<Item[]>, loadMore: () => void }) =>
  html.div(
    ForEach(items, item => ItemComponent(item)),
    InViewport(
      { threshold: 1.0 },
      isVisible => {
        if (isVisible.value) loadMore()
        return html.div('Loading more...')
      }
    )
  )
```

## Performance Considerations

- **Lazy Loading**: Components only render when needed
- **Event Cleanup**: Automatic cleanup of event listeners and observers
- **Memory Management**: Proper disposal of resources and subscriptions
- **Bundle Size**: Tree-shakeable components for optimal bundle size

## Integration Patterns

### With @tempots/dom
```typescript
// Enhance basic DOM elements
html.input(
  AutoFocus(),
  attr.value(signal),
  on.input(handler)
)
```

### With @tempots/std
```typescript
// Use std utilities for data processing
import { mapArray, filterArray } from '@tempots/std'

const processedItems = computed(() =>
  mapArray(
    filterArray(items.value, item => item.visible),
    item => ({ ...item, processed: true })
  )
)
```

## Best Practices

1. **Compose Components**: Build complex UI by composing simple components
2. **Use Signals**: Leverage reactive signals for dynamic behavior
3. **Handle Errors**: Always provide error states for async operations
4. **Accessibility**: Use semantic HTML and ARIA attributes
5. **Performance**: Use lazy loading and viewport detection for large lists

## Contributing

See the main [CONTRIBUTING.md](../../CONTRIBUTING.md) for development setup and guidelines.

## Documentation

For detailed API documentation, see the [Tempo Documentation Site](https://tempo-ts.com/library/tempots-ui.html).
