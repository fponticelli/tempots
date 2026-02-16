Native iOS and Android rendering for the Tempo framework. Build cross-platform mobile apps using Tempo's declarative, signal-based rendering model with direct native view manipulation via a JSI bridge.

## Installation

```bash
npm install @tempots/native
```

## Overview

`@tempots/native` bridges the Tempo rendering model to native iOS and Android views through a JSI (JavaScript Interface) bridge. Instead of manipulating the DOM, it creates and manages native views (UIView on iOS, View on Android) while keeping the same declarative, signal-driven API that Tempo provides for the web.

### Architecture

```
TypeScript (Tempo)  <-->  JSI Bridge  <-->  Native Views (iOS/Android)
```

## Quick Start

```typescript
import { renderNative, view, nativeStyle, nativeOn, prop } from '@tempots/native'

function Counter() {
  const count = prop(0)

  return view.View(
    view.Text(
      count.map(n => `Count: ${n}`),
      nativeStyle.style({ fontSize: 48, textAlign: 'center', color: '#333' })
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

## Native Views

Create native views using the `view` proxy object:

```typescript
import { view } from '@tempots/native'

view.View(...)              // Container view
view.Text('Hello')          // Text display
view.Image(...)             // Image display
view.ScrollView(...)        // Scrollable container
view.TextInput(...)         // Text input field
view.SafeAreaView(...)      // Safe area container
view.FlatList(...)          // Optimized list
view.Modal(...)             // Modal overlay
view.Switch(...)            // Toggle switch
view.MyCustomView(...)      // Any custom native view type
```

## Styles

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

## Events

Handle native touch and input events:

```typescript
import { nativeOn } from '@tempots/native'

view.View(
  nativeOn.press((e) => console.log('Pressed at', e.pageX, e.pageY)),
  nativeOn.longPress((e) => console.log('Long pressed')),
)

view.TextInput(
  nativeOn.changeText((e) => console.log('Text:', e.text)),
  nativeOn.submitEditing((e) => console.log('Submitted:', e.text)),
)
```

## Shared Renderables

All standard Tempo renderables work with native contexts:

- `When` / `Unless` - Conditional rendering
- `ForEach` - List rendering from reactive arrays
- `Repeat` - Render N items
- `OneOf` / `OneOfValue` - Pattern matching
- `Task` / `Async` - Async data loading
- `Provide` / `Use` - Dependency injection

## Navigation

In-memory navigation with a history stack:

```typescript
import { createNavigator } from '@tempots/native'

type Route = 'home' | 'about' | 'settings'
const nav = createNavigator<Route>('home')

nav.navigate('about')   // push "about" onto the stack
nav.back()              // pop back to "home"
```

## Lifecycle Signals

Track app-level state changes:

```typescript
import { createAppStateSignal, createDimensionsSignal, createKeyboardSignal } from '@tempots/native'

const appState = createAppStateSignal(bridge)    // "active" | "background" | "inactive"
const dims = createDimensionsSignal(bridge)       // { width, height, scale, fontScale }
const keyboard = createKeyboardSignal(bridge)     // { visible: boolean, height: number }
```

For more information, see the [Tempo documentation](/).
