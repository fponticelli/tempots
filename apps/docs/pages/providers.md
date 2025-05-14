---
title: Providers
order: 65
description: Providers in Tempo allow for dependency injection and context sharing between components without prop drilling.
---
# Providers

Providers in Tempo offer a powerful dependency injection system that allows you to share state, services, and functionality across your application without prop drilling. This pattern is similar to React's Context API or Angular's dependency injection system, but with Tempo's functional approach.

## Core Concepts

The provider system in Tempo consists of several key components:

1. **Provider Mark**: A unique identifier for a provider
2. **Provider**: An object that knows how to create and dispose of a value
3. **Provide**: A renderable that makes a provider available to its children
4. **Use**: A renderable that consumes a provider's value
5. **WithProvider**: A more flexible API for working with multiple providers

## Creating a Provider

A provider is an object with two properties:

- `mark`: A unique identifier created with `makeProviderMark`
- `create`: A function that creates the provider's value and returns an object with:
  - `value`: The actual value to be provided
  - `dispose`: A cleanup function called when the provider is no longer needed
  - `onUse` (optional): A function called when the provider is used

Here's how to create a simple provider:

```typescript
import { makeProviderMark, signal, Signal, Provider } from '@tempots/dom'

// Define the type for our preferences
interface Preferences {
  theme: 'light' | 'dark'
  fontSize: number
}

// Create a provider for preferences
const PreferencesProvider: Provider<Signal<Preferences>> = {
  // Create a unique mark with the correct type
  mark: makeProviderMark<Signal<Preferences>>('Preferences'),

  // Create function returns the value and cleanup
  create: () => {
    // Create a signal to hold the preferences
    const preferences = signal<Preferences>({
      theme: 'light',
      fontSize: 16
    })

    // Return the value and cleanup function
    return {
      value: preferences,
      dispose: () => preferences.dispose()
    }
  }
}
```

## Providing Values

Once you have a provider, you can make it available to child components using the `Provide` renderable:

```typescript
import { html, Provide } from '@tempots/dom'

// Make the preferences available to all children
const App = () =>
  Provide(
    PreferencesProvider,  // The provider to use
    {},                   // Options (if any)
    () => html.div(       // Child components that can access the provider
      html.h1('My App'),
      SettingsPanel(),
      MainContent()
    )
  )
```

The `Provide` function takes three arguments:
1. The provider object
2. Options to pass to the provider's `create` function (can be empty `{}`)
3. A function that returns the child components

## Consuming Provider Values

To use a provider's value, use the `Use` renderable:

```typescript
import { html, Use } from '@tempots/dom'

const ThemeToggle = () =>
  Use(
    PreferencesProvider,          // The provider to use
    preferences => html.div(      // Function that receives the provider value
      html.button(
        on.click(() => {
          // Toggle the theme
          preferences.update(prefs => ({
            ...prefs,
            theme: prefs.theme === 'light' ? 'dark' : 'light'
          }))
        }),
        'Toggle Theme: ',
        preferences.$.theme        // Access theme property using $ shorthand
      )
    )
  )
```

The `Use` function takes two arguments:
1. The provider to consume
2. A function that receives the provider's value and returns a renderable

## Using Multiple Providers

If you need to use multiple providers, you can use `UseMany`:

```typescript
import { html, UseMany } from '@tempots/dom'

const SettingsPanel = () =>
  UseMany(
    PreferencesProvider,
    UserProvider
  )(
    (preferences, user) => html.div(
      html.h2('Settings for ', user.$.name),
      html.div('Theme: ', preferences.$.theme),
      html.div('Font Size: ', preferences.$.fontSize.map(String))
    )
  )
```

## Advanced Usage with WithProvider

For more complex scenarios, you can use `WithProvider` which gives you direct access to both `set` and `use` functions:

```typescript
import { html, WithProvider } from '@tempots/dom'

const AdvancedComponent = () =>
  WithProvider(({ set, use }) => {
    // Set up multiple providers
    set(PreferencesProvider, {})
    set(UserProvider, { userId: 123 })

    // Use the providers
    const preferences = use(PreferencesProvider)
    const user = use(UserProvider)

    // Return a renderable using the providers
    return html.div(
      html.h2(`Hello, ${user.$.name}`),
      html.div(`Your theme is: ${preferences.$.theme}`)
    )
  })
```

## Provider with Options

Providers can accept options when they're created:

```typescript
// Provider that accepts options
const ThemeProvider: Provider<Signal<string>, { initialTheme: string }> = {
  mark: makeProviderMark<Signal<string>>('Theme'),
  create: (options = { initialTheme: 'light' }) => {
    const theme = signal(options.initialTheme)
    return {
      value: theme,
      dispose: () => theme.dispose()
    }
  }
}

// Using the provider with options
const App = () =>
  Provide(
    ThemeProvider,
    { initialTheme: 'dark' },  // Pass options here
    () => html.div(
      // ...
    )
  )
```

## Real-World Example: Theme Provider

Here's a complete example of a theme provider that detects the user's system preferences:

```typescript
import {
  makeProviderMark,
  signal,
  Signal,
  Provider,
  html,
  Provide,
  Use,
  attr,
  on
} from '@tempots/dom'

// Define theme types
type Theme = 'light' | 'dark'

// Create the theme provider
const ThemeProvider: Provider<Signal<Theme>> = {
  mark: makeProviderMark<Signal<Theme>>('Theme'),
  create: () => {
    // Detect system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)')
    const theme = signal<Theme>(prefersDark.matches ? 'dark' : 'light')

    // Listen for system preference changes
    const handler = (e: MediaQueryListEvent) => {
      theme.value = e.matches ? 'dark' : 'light'
    }
    prefersDark.addEventListener('change', handler)

    return {
      value: theme,
      dispose: () => {
        prefersDark.removeEventListener('change', handler)
        theme.dispose()
      }
    }
  }
}

// App component that provides the theme
const App = () =>
  Provide(
    ThemeProvider,
    {},
    () => html.div(
      // Apply theme class to body
      Use(
        ThemeProvider,
        theme => html.body(
          attr.class(theme.map(t => `theme-${t}`)),
          html.h1('Themed App'),
          ThemeToggle(),
          Content()
        )
      )
    )
  )

// Theme toggle button
const ThemeToggle = () =>
  Use(
    ThemeProvider,
    theme => html.button(
      on.click(() => {
        theme.value = theme.value === 'light' ? 'dark' : 'light'
      }),
      'Toggle Theme: ',
      theme.map(t => t === 'light' ? '🌞' : '🌙')
    )
  )

// Content that uses the theme
const Content = () =>
  Use(
    ThemeProvider,
    theme => html.div(
      attr.class('content'),
      html.p(`Current theme: ${theme.value}`)
    )
  )
```

## Next Steps

- [Learn more about Building your own Renderables](/page/components.html)
- [Explore Examples & Best Practices](/page/examples.html)
- [Learn more about render](/page/render.html)
