---
title: Examples & Patterns
order: 90
description: Common patterns and examples for building applications with Tempo.
---
# Examples & Patterns

This page provides practical examples and patterns for common scenarios when building applications with Tempo.

## Form Handling

### Complete Form with Validation

```typescript
import { html, prop, computedOf, render, Ensure, attr, on, emitValue } from '@tempots/dom'
import type { Prop, Signal } from '@tempots/dom'
import { Validation } from '@tempots/std'

// Validation functions
const validateEmail = (value: string): Validation<string> => {
  if (!value) return Validation.valid // Don't show error when empty
  if (!value.includes('@')) return Validation.invalid('Invalid email format')
  return Validation.valid
}

const validatePassword = (value: string): Validation<string> => {
  if (!value) return Validation.valid // Don't show error when empty
  if (value.length < 8) return Validation.invalid('At least 8 characters')
  if (!/[A-Z]/.test(value)) return Validation.invalid('Needs uppercase letter')
  if (!/[0-9]/.test(value)) return Validation.invalid('Needs a number')
  return Validation.valid
}

// Form component with real-time validation
const RegistrationForm = () => {
  const name = prop('')
  const email = prop('')
  const password = prop('')

  // Real-time validation errors (derived from field values)
  const emailError = email.map(v => {
    const result = validateEmail(v)
    return Validation.isInvalid(result) ? result.error : null
  })

  const passwordError = password.map(v => {
    const result = validatePassword(v)
    return Validation.isInvalid(result) ? result.error : null
  })

  // Check if form can be submitted
  const canSubmit = computedOf(name, email, password)((n, e, p) =>
    n.trim().length > 0 &&
    Validation.isValid(validateEmail(e)) &&
    Validation.isValid(validatePassword(p))
  )

  const handleSubmit = () => {
    console.log('Form submitted:', {
      name: name.value,
      email: email.value
    })
  }

  return html.form(
    on.submit(e => { e.preventDefault(); handleSubmit() }),

    FormField('Name', name),
    FormField('Email', email, emailError, 'email'),
    FormField('Password', password, passwordError, 'password'),

    html.button(
      attr.type('submit'),
      attr.disabled(canSubmit.map(v => !v)),
      'Register'
    )
  )
}

// Reusable form field component
const FormField = (
  label: string,
  value: Prop<string>,
  error?: Signal<string | null>,
  type: string = 'text'
) => html.div(
  attr.class('form-field'),
  html.label(label),
  html.input(
    attr.type(type),
    attr.value(value),
    on.input(emitValue(value.set)),
    error ? attr.class(error.map(e => e ? 'error' : '')) : null
  ),
  error ? Ensure(error, err => html.span(attr.class('error-message'), err)) : null
)
```

## Data Fetching with Query

### Basic Query Usage

```typescript
import { html, prop, render, attr, on, emitValue, Ensure } from '@tempots/dom'
import { Query } from '@tempots/ui'

interface User {
  id: number
  name: string
  email: string
}

const UserProfile = () => {
  const userId = prop(1)

  return html.div(
    // User selector
    html.select(
      on.change(emitValue(v => userId.value = parseInt(v))),
      html.option(attr.value('1'), 'User 1'),
      html.option(attr.value('2'), 'User 2'),
      html.option(attr.value('3'), 'User 3')
    ),

    // Query with loading/error states
    Query<User, string>({
      request: userId,
      load: async ({ request, abortSignal }) => {
        const res = await fetch(`/api/users/${request}`, { signal: abortSignal })
        if (!res.ok) throw new Error('Failed to load user')
        return res.json()
      },
      convertError: e => e instanceof Error ? e.message : 'Unknown error',
      pending: ({ previous }) => html.div(
        'Loading...',
        // Show previous data while loading
        Ensure(previous, user => html.div(
          attr.class('stale'),
          'Previous: ', user.$.name
        ))
      ),
      failure: ({ error, reload }) => html.div(
        html.p('Error: ', error),
        html.button(on.click(reload), 'Retry')
      ),
      success: ({ value, reload }) => html.div(
        html.h2(value.$.name),
        html.p(value.$.email),
        html.button(on.click(reload), 'Refresh')
      )
    })
  )
}
```

### Mutation for POST/PUT Operations

```typescript
import { html, prop, attr, on, emitValue } from '@tempots/dom'
import { Mutation } from '@tempots/ui'

interface User {
  id: number
  name: string
  email: string
}

const CreateUserForm = () => {
  const name = prop('')
  const email = prop('')

  return html.div(
    Mutation<{ name: string; email: string }, User, string>({
      mutate: async ({ request, abortSignal }) => {
        const res = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(request),
          signal: abortSignal
        })
        if (!res.ok) throw new Error('Failed to create user')
        return res.json()
      },
      convertError: e => e instanceof Error ? e.message : 'Unknown error',
      idle: ({ trigger }) => html.form(
        on.submit(e => {
          e.preventDefault()
          trigger({ name: name.value, email: email.value })
        }),
        html.input(
          attr.placeholder('Name'),
          attr.value(name),
          on.input(emitValue(name.set))
        ),
        html.input(
          attr.type('email'),
          attr.placeholder('Email'),
          attr.value(email),
          on.input(emitValue(email.set))
        ),
        html.button(attr.type('submit'), 'Create User')
      ),
      pending: () => html.div('Creating user...'),
      failure: ({ error, reset }) => html.div(
        html.p('Error: ', error),
        html.button(on.click(reset), 'Try Again')
      ),
      success: ({ value, reset }) => html.div(
        html.p('User created: ', value.$.name),
        html.button(on.click(reset), 'Create Another')
      )
    })
  )
}
```

## Router with Authentication

### Protected Routes

```typescript
import { html, prop, Provide, Use, makeProviderMark, When, Fragment, attr, on, emitValue } from '@tempots/dom'
import type { Signal, TNode } from '@tempots/dom'
import { RootRouter, ChildRouter, Location, NavigationService, Anchor } from '@tempots/ui'

interface User {
  id: number
  name: string
  email: string
}

// Auth provider
const Auth = {
  mark: makeProviderMark<Signal<User | null>>('Auth'),
  create: () => {
    const user = prop<User | null>(null)
    return { value: user, dispose: user.dispose }
  }
}

// Protected route wrapper
const ProtectedRoute = (content: () => TNode) =>
  Use(Auth, user =>
    When(
      user.map(u => u !== null),
      content,
      () => {
        // Redirect to login
        NavigationService.navigate('/login')
        return html.div('Redirecting to login...')
      }
    )
  )

// App with routing
const App = () => Provide(Auth, {}, () =>
  Provide(Location, {}, () =>
    html.div(
      Navigation(),
      RootRouter({
        '/': () => html.div('Home - Public'),
        '/login': () => LoginPage(),
        '/dashboard': () => ProtectedRoute(() => Dashboard()),
        '/dashboard/*': () => ProtectedRoute(() => DashboardRoutes()),
        '*': () => html.div('404 - Not Found')
      })
    )
  )
)

// Nested dashboard routes
const DashboardRoutes = () => ChildRouter({
  '/profile': () => html.div('Profile Page'),
  '/settings': () => html.div('Settings Page'),
  '*': () => html.div('Dashboard Home')
})

// Navigation component
const Navigation = () => Use(Auth, user =>
  html.nav(
    Anchor('/', 'Home'),
    When(
      user.map(u => u === null),
      () => Anchor('/login', 'Login'),
      () => Fragment(
        Anchor('/dashboard', 'Dashboard'),
        html.button(
          on.click(() => user.value = null),
          'Logout'
        )
      )
    )
  )
)

// Login page
const LoginPage = () => Use(Auth, user => {
  const email = prop('')
  const password = prop('')

  const handleLogin = async () => {
    // Simulate login
    user.value = { id: 1, name: 'John', email: email.value }
    NavigationService.navigate('/dashboard')
  }

  return html.form(
    on.submit(e => { e.preventDefault(); handleLogin() }),
    html.h1('Login'),
    html.input(
      attr.type('email'),
      attr.placeholder('Email'),
      on.input(emitValue(email.set))
    ),
    html.input(
      attr.type('password'),
      attr.placeholder('Password'),
      on.input(emitValue(password.set))
    ),
    html.button(attr.type('submit'), 'Login')
  )
})
```

## Keyboard Shortcuts

### Global Keyboard Handler

```typescript
import { html, prop, attr, on, emitValue, When } from '@tempots/dom'
import { OnKeyPressed, OnEnterKey, OnEscapeKey } from '@tempots/ui'

const KeyboardShortcutsDemo = () => {
  const isModalOpen = prop(false)
  const searchQuery = prop('')

  return html.div(
    // Global keyboard shortcuts
    OnKeyPressed({
      key: 'k',
      ctrl: true,
      handler: () => {
        // Ctrl+K to open search
        document.querySelector<HTMLInputElement>('#search')?.focus()
      }
    }),

    OnKeyPressed({
      key: 's',
      ctrl: true,
      handler: (e) => {
        e.preventDefault()
        console.log('Save triggered!')
      }
    }),

    // Search input with keyboard handling
    html.div(
      html.input(
        attr.id('search'),
        attr.placeholder('Search... (Ctrl+K)'),
        attr.value(searchQuery),
        on.input(emitValue(searchQuery.set)),
        OnEnterKey(() => {
          console.log('Searching for:', searchQuery.value)
        }),
        OnEscapeKey(() => {
          searchQuery.value = ''
          document.querySelector<HTMLInputElement>('#search')?.blur()
        })
      )
    ),

    // Modal with escape to close
    html.button(
      on.click(() => isModalOpen.value = true),
      'Open Modal (Esc to close)'
    ),

    When(isModalOpen, () =>
      html.div(
        attr.class('modal'),
        OnEscapeKey(() => isModalOpen.value = false),
        html.div(
          attr.class('modal-content'),
          html.h2('Modal Title'),
          html.p('Press Escape to close this modal'),
          html.button(
            on.click(() => isModalOpen.value = false),
            'Close'
          )
        )
      )
    )
  )
}
```

### Input with Key Modifiers

```typescript
const TextEditor = () => {
  const text = prop('')
  const history = prop<string[]>([])

  const saveToHistory = () => {
    history.update(h => [...h, text.value])
  }

  const undo = () => {
    history.update(h => {
      if (h.length === 0) return h
      const prev = h[h.length - 1]
      text.value = prev ?? ''
      return h.slice(0, -1)
    })
  }

  return html.div(
    html.textarea(
      attr.value(text),
      on.input(emitValue(text.set)),

      // Ctrl+S to save
      OnKeyPressed({
        key: 's',
        ctrl: true,
        handler: e => {
          e.preventDefault()
          saveToHistory()
          console.log('Saved!')
        }
      }),

      // Ctrl+Z to undo
      OnKeyPressed({
        key: 'z',
        ctrl: true,
        handler: e => {
          e.preventDefault()
          undo()
        }
      })
    ),

    html.div(
      'History: ',
      history.map(h => h.length.toString()),
      ' saves'
    )
  )
}
```

## Click Outside Detection

```typescript
import { html, prop, attr, on, When } from '@tempots/dom'
import { OnClickOutside } from '@tempots/ui'

const Dropdown = () => {
  const isOpen = prop(false)

  return html.div(
    attr.class('dropdown'),

    html.button(
      on.click(() => isOpen.update(v => !v)),
      'Toggle Dropdown'
    ),

    When(isOpen, () =>
      html.div(
        attr.class('dropdown-menu'),
        OnClickOutside(() => isOpen.value = false),
        html.ul(
          html.li('Option 1'),
          html.li('Option 2'),
          html.li('Option 3')
        )
      )
    )
  )
}
```

## Viewport Detection

```typescript
import { html, attr, When } from '@tempots/dom'
import { InViewport, WhenInViewport } from '@tempots/ui'

const LazyLoadedSection = () => html.div(
  // Load content when element comes into view
  InViewport(
    { mode: 'partial', once: true },
    isVisible => When(isVisible,
      () => html.div(
        attr.class('loaded'),
        'Content loaded when scrolled into view!'
      ),
      () => html.div(
        attr.class('placeholder'),
        'Scroll to load...'
      )
    )
  )
)

// Or use the convenience wrapper
const AnimatedOnScroll = () => html.div(
  WhenInViewport(
    { mode: 'full' },
    () => html.div(
      attr.class('animate-in'),
      'This animates when fully visible'
    )
  )
)
```

## Next Steps

- [Learn about Signals](/page/signals.html)
- [Explore UI Components](/page/ui-components.html)
- [Server-Side Rendering](/page/ssr-headless.html)
- [Troubleshooting](/page/troubleshooting.html)
