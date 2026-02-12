# Tempo Native (@tempots/native)

Native iOS and Android rendering for the Tempo framework. Build cross-platform mobile apps using Tempo's declarative, signal-based rendering model with direct native view manipulation via a JSI bridge.

[![npm version](https://img.shields.io/npm/v/@tempots/native.svg)](https://www.npmjs.com/package/@tempots/native)
[![license](https://img.shields.io/npm/l/@tempots/native.svg)](https://github.com/fponticelli/tempots/blob/main/LICENSE)
[![codecov](https://codecov.io/gh/fponticelli/tempots/branch/main/graph/badge.svg)](https://codecov.io/gh/fponticelli/tempots)
[![CI](https://github.com/fponticelli/tempots/workflows/CI/badge.svg)](https://github.com/fponticelli/tempots/actions)

## Installation

```bash
# npm
npm install @tempots/native

# yarn
yarn add @tempots/native

# pnpm
pnpm add @tempots/native
```

## Overview

`@tempots/native` bridges the Tempo rendering model to native iOS and Android views through a JSI (JavaScript Interface) bridge. Instead of manipulating the DOM, it creates and manages native views (UIView on iOS, View on Android) while keeping the same declarative, signal-driven API that Tempo provides for the web.

### Architecture

```
TypeScript (Tempo)  <-->  JSI Bridge  <-->  Native Views (iOS/Android)
```

- **TypeScript side**: Renderables, signals, events, styles
- **JSI Bridge**: Synchronous interface between JS and native code
- **Native side**: Platform-specific view creation and management (separate native project)

## Quick Start

```typescript
import { renderNative, view, nativeStyle, nativeOn, prop } from '@tempots/native'

function Counter() {
  const count = prop(0)

  return view.View(
    view.Text(
      count.map(n => `Count: ${n}`),
      nativeStyle.style({
        fontSize: 48,
        textAlign: 'center',
        color: '#333',
      })
    ),
    view.View(
      view.View(
        nativeOn.press(() => count.set(count.value - 1)),
        view.Text('-'),
        nativeStyle.style({ padding: 20, backgroundColor: '#ff6b6b' })
      ),
      view.View(
        nativeOn.press(() => count.set(count.value + 1)),
        view.Text('+'),
        nativeStyle.style({ padding: 20, backgroundColor: '#51cf66' })
      ),
      nativeStyle.style({ flexDirection: 'row', justifyContent: 'center', gap: 20 })
    ),
    nativeStyle.style({ flex: 1, justifyContent: 'center', alignItems: 'center' })
  )
}

renderNative(Counter())
```

## Key Concepts

### Native Views

Create native views using the `view` proxy object. It supports all common native view types:

```typescript
import { view } from '@tempots/native'

// Common view types
view.View(...)              // Container view
view.Text('Hello')          // Text display
view.Image(...)             // Image display
view.ScrollView(...)        // Scrollable container
view.TextInput(...)         // Text input field
view.SafeAreaView(...)      // Safe area container
view.FlatList(...)          // Optimized list
view.Modal(...)             // Modal overlay
view.ActivityIndicator(...) // Loading spinner
view.Switch(...)            // Toggle switch
view.KeyboardAvoidingView(...)  // Keyboard-aware container

// Any custom native view type
view.MyCustomView(...)
```

### Signals and Reactivity

Signals from `@tempots/core` drive all reactive updates:

```typescript
import { prop } from '@tempots/core'
import { view, nativeStyle, When } from '@tempots/native'

const isLoggedIn = prop(false)
const username = prop('')

const greeting = view.View(
  When(
    isLoggedIn,
    () => view.Text(username.map(name => `Welcome, ${name}!`)),
    () => view.Text('Please log in')
  )
)
```

### Styles

Apply styles statically or reactively:

```typescript
import { nativeStyle, applyStyle } from '@tempots/native'
import { prop } from '@tempots/core'

// Static styles
view.View(
  nativeStyle.style({
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    padding: 16,
    borderRadius: 8,
  })
)

// Reactive styles
const bg = prop('#f0f0f0')
view.View(
  applyStyle(bg.map(color => ({ backgroundColor: color })))
)
```

### Events

Handle native touch and input events:

```typescript
import { nativeOn } from '@tempots/native'

view.View(
  nativeOn.press((e) => console.log('Pressed at', e.pageX, e.pageY)),
  nativeOn.longPress((e) => console.log('Long pressed for', e.duration, 'ms')),
)

view.TextInput(
  nativeOn.changeText((e) => console.log('Text:', e.text)),
  nativeOn.submitEditing((e) => console.log('Submitted:', e.text)),
  nativeOn.focus(() => console.log('Focused')),
  nativeOn.blur(() => console.log('Blurred')),
)

view.ScrollView(
  nativeOn.scroll((e) => console.log('Offset:', e.contentOffset)),
)
```

### Pressable

A convenience component with press feedback:

```typescript
import { Pressable } from '@tempots/native'

Pressable(
  (e) => console.log('Pressed!'),
  { activeOpacity: 0.7 },
  view.Text('Tap me')
)
```

### Navigation

In-memory navigation with a history stack:

```typescript
import { createNavigator, When } from '@tempots/native'

type Route = 'home' | 'about' | 'settings'

const nav = createNavigator<Route>('home')

const App = view.View(
  When(nav.canGoBack, () =>
    view.View(
      nativeOn.press(() => nav.back()),
      view.Text('Back')
    )
  ),
  // Route-based rendering using OneOfValue or When
)

nav.navigate('about')   // push "about" onto the stack
nav.back()              // pop back to "home"
```

### Lifecycle Signals

Track app-level state changes:

```typescript
import { createAppStateSignal, createDimensionsSignal, createKeyboardSignal } from '@tempots/native'

// App foreground/background state
const appState = createAppStateSignal(bridge)
// appState.value: "active" | "background" | "inactive"

// Screen dimensions (handles rotation)
const dims = createDimensionsSignal(bridge)
// dims.value: { width, height, scale, fontScale }

// Keyboard visibility
const keyboard = createKeyboardSignal(bridge)
// keyboard.value: { visible: boolean, height: number }
```

### Properties

Apply view properties statically or reactively:

```typescript
import { nativeStyle } from '@tempots/native'

view.TextInput(
  nativeStyle.placeholder('Enter your name'),
  nativeStyle.keyboardType('email-address'),
  nativeStyle.secureTextEntry(false),
  nativeStyle.editable(true),
  nativeStyle.value(textSignal),      // reactive
  nativeStyle.testID('name-input'),
  nativeStyle.accessibilityLabel('Name input field'),
)

view.Image(
  nativeStyle.source({ uri: 'https://example.com/photo.jpg' }),
)

view.Text(
  nativeStyle.numberOfLines(2),
)
```

## Shared Renderables

All standard Tempo renderables work with native contexts:

- `When` / `Unless` - Conditional rendering
- `ForEach` - List rendering from reactive arrays
- `Repeat` - Render N items
- `MapSignal` - Map a signal to a renderable
- `Ensure` / `EnsureAll` / `NotEmpty` - Null/empty guards
- `OneOf` / `OneOfValue` / `OneOfField` - Pattern matching
- `Task` / `Async` - Async data loading with pending states
- `Fragment` / `Empty` - Composition utilities
- `Provide` / `Use` - Dependency injection

## JSI Bridge

The native side must provide a `JSIBridge` implementation. For testing, use the included `MockBridge`:

```typescript
import { MockBridge, renderNative, view } from '@tempots/native'

// In tests
const bridge = new MockBridge()
const clear = renderNative(
  view.View(view.Text('Hello')),
  { bridge }
)

// Inspect the rendered tree
console.log(bridge.collectText()) // "Hello"

// Dispatch events
bridge.dispatchEvent(handle, 'press', { locationX: 0, locationY: 0, ... })

// Cleanup
clear(true)
```

In production, the bridge is provided by the native host app at `globalThis.__TEMPO_JSI_BRIDGE`.

## Platform Support

| Feature | iOS | Android |
|---------|-----|---------|
| View rendering | Yes | Yes |
| Flexbox layout | Yes | Yes |
| Touch events | Yes | Yes |
| Text input | Yes | Yes |
| Scroll views | Yes | Yes |
| Modals | Yes | Yes |
| Keyboard tracking | Yes | Yes |
| Dimensions tracking | Yes | Yes |
| App state tracking | Yes | Yes |
| Shadows | Yes | elevation |

## Documentation

For comprehensive documentation, visit the [Tempo Documentation Site](https://tempo-ts.com/).

## Examples

- [iOS Demo App](https://github.com/fponticelli/tempots/tree/main/apps/ios-demo) - Simple counter
- [iOS HNPWA](https://github.com/fponticelli/tempots/tree/main/apps/ios-hnpwa) - Hacker News reader

## License

This package is licensed under the Apache License 2.0.
