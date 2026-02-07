# @tempots/native Architecture Proposals

## Context

`@tempots/core` is already platform-agnostic. Its key abstractions — `Renderable<CTX, TType>`, `RenderContext`, `HierarchicalContext`, `Signal`, `Computed`, `Prop`, `DisposalScope` — carry no DOM dependency. The `@tempots/dom` package is one specialization of these abstractions for browser rendering.

This document proposes multiple strategies for building `@tempots/native`, a package that targets native mobile platforms (iOS/Android) using the same core reactive model. Each proposal has different trade-offs in complexity, performance, portability, and developer ergonomics.

---

## Proposal A: Native Context via JSI Bridge (Direct Binding)

### Summary

Implement a `NativeContext` that satisfies `HierarchicalContext` and communicates directly with native view hierarchies through a thin JavaScript-to-native bridge (JSI on React Native's Hermes runtime, or Bun/Deno FFI for desktop).

### Architecture

```
@tempots/core (unchanged)
       |
@tempots/native
       |
  NativeContext implements HierarchicalContext
       |
  JSI / C++ Bridge Layer
       |
  ┌────┴────┐
  iOS UIKit  Android Views
```

### How It Works

1. **NativeContext** mirrors `BrowserContext` but instead of calling `document.createElement`, it sends synchronous commands through JSI to create native views:

```typescript
// Analogous to BrowserContext but targeting native views
export class NativeContext implements HierarchicalContext {
  constructor(
    private readonly bridge: NativeBridge,
    private readonly viewId: number,
    private readonly refId: number | undefined,
    private readonly providers: Providers
  ) {}

  makeChildElement(type: string, props?: Record<string, unknown>): NativeContext {
    const childId = this.bridge.createView(type, this.viewId, this.refId, props)
    return new NativeContext(this.bridge, childId, undefined, this.providers)
  }

  makeChildText(text: string): NativeContext {
    const textId = this.bridge.createText(text, this.viewId, this.refId)
    return new NativeContext(this.bridge, textId, undefined, this.providers)
  }

  setText(text: string): void {
    this.bridge.updateText(this.viewId, text)
  }

  makeRef(): NativeContext {
    const refId = this.bridge.createRef(this.viewId)
    return new NativeContext(this.bridge, this.viewId, refId, this.providers)
  }

  clear(removeTree: boolean): void {
    if (removeTree) this.bridge.removeView(this.viewId)
  }

  on<E>(event: string, listener: (event: E) => void): Clear {
    return this.bridge.addEventListener(this.viewId, event, listener)
  }

  setProperty(name: string, value: unknown): void {
    this.bridge.setViewProperty(this.viewId, name, value)
  }
}
```

2. **NativeBridge** is the JSI/FFI interface. On the native side, each platform implements a ViewRegistry that maps integer IDs to actual native views:

```
JS: bridge.createView("View", parentId, refId, {flex: 1})
  → C++ JSI: ViewRegistry::createView("View", parentId, ...)
    → iOS: [[UIView alloc] init] + insertSubview:atIndex:
    → Android: new View(context) + addView(child, index)
```

3. **Signal reactivity is preserved unchanged.** A signal listener calling `ctx.setProperty('opacity', v)` translates to a direct JSI call that updates the native view property — the same direct-mutation model tempots uses for DOM, just targeting native views instead.

4. **Component primitives** map to native views:

```typescript
// @tempots/native/elements
export const View = (...children: TNode<NativeContext>[]) =>
  nativeRenderable(ctx => { ... })
export const Text = (text: Value<string>) =>
  nativeRenderable(ctx => { ... })
export const Image = (source: Value<ImageSource>) =>
  nativeRenderable(ctx => { ... })
export const ScrollView = (...children: TNode<NativeContext>[]) =>
  nativeRenderable(ctx => { ... })
export const TextInput = (props: TextInputProps) =>
  nativeRenderable(ctx => { ... })
```

5. **Layout** uses Yoga (via a WASM or native binding) invoked during the commit phase. Style objects are Flexbox-only, applied as view properties.

### Advantages

- Closest to tempots' existing architecture — `NativeContext` is a near-1:1 mirror of `BrowserContext`
- Synchronous JSI calls avoid the async serialization overhead of React Native's old bridge
- Signal-driven direct mutations are a natural fit: `signal.on(v => ctx.setProperty(...))` has the same shape as `signal.on(ctx.setText)`
- No virtual DOM or reconciliation needed — tempots' reactive model already avoids this
- Control flow renderables (`When`, `ForEach`, `Ensure`) work with zero changes if they accept generic `HierarchicalContext`

### Challenges

- Requires a native runtime (Hermes, JSC, or V8 embedded in a native app shell)
- Must implement platform-specific ViewRegistries for iOS and Android
- Yoga integration for layout calculation
- Event system must bridge native touch/gesture events back to JS

### Estimated Scope

- `@tempots/native` — NativeContext, element factories, style system, event mapping
- `@tempots/native-ios` — iOS ViewRegistry (Swift/ObjC)
- `@tempots/native-android` — Android ViewRegistry (Kotlin/Java)
- `@tempots/native-yoga` — Yoga layout bindings

---

## Proposal B: Intermediate Representation with Platform Renderers

### Summary

Introduce a lightweight intermediate representation (IR) — a "shadow tree" — between the reactive signal layer and native views. The IR is platform-agnostic. Platform-specific renderers consume the IR and translate it to native views. This is closer to React Native's Fabric architecture.

### Architecture

```
@tempots/core (unchanged)
       |
@tempots/native-ir
       |
  IRContext implements HierarchicalContext
       |
  Shadow Tree (platform-agnostic IR nodes)
       |
  ┌────┼────────────┐
  iOS   Android    Desktop (optional)
  Renderer  Renderer   Renderer
```

### How It Works

1. **Shadow Nodes** are lightweight TypeScript objects representing the view hierarchy:

```typescript
interface ShadowNode {
  id: number
  type: string                     // "View", "Text", "Image", etc.
  props: Record<string, unknown>
  children: ShadowNode[]
  parent: ShadowNode | null
  refIndex: number | undefined     // insertion point for HierarchicalContext refs
}

interface ShadowTextNode extends ShadowNode {
  type: 'RawText'
  text: string
}
```

2. **IRContext** builds and mutates the shadow tree in response to renderable operations:

```typescript
export class IRContext implements HierarchicalContext {
  constructor(
    private readonly tree: ShadowTree,
    private readonly node: ShadowNode,
    private readonly refIndex: number | undefined,
    private readonly providers: Providers
  ) {}

  makeChildElement(type: string): IRContext {
    const child = this.tree.createNode(type)
    this.tree.insertChild(this.node, child, this.refIndex)
    return new IRContext(this.tree, child, undefined, this.providers)
  }

  setText(text: string): void {
    this.tree.updateText(this.node as ShadowTextNode, text)
  }

  makeRef(): IRContext {
    const refIndex = this.node.children.length
    return new IRContext(this.tree, this.node, refIndex, this.providers)
  }

  clear(removeTree: boolean): void {
    if (removeTree) this.tree.removeNode(this.node)
  }
}
```

3. **ShadowTree** emits a stream of mutations as operations happen:

```typescript
type Mutation =
  | { type: 'CREATE'; nodeId: number; viewType: string; props: Record<string, unknown> }
  | { type: 'INSERT'; parentId: number; childId: number; index: number }
  | { type: 'REMOVE'; nodeId: number }
  | { type: 'UPDATE_PROP'; nodeId: number; key: string; value: unknown }
  | { type: 'UPDATE_TEXT'; nodeId: number; text: string }

class ShadowTree {
  private mutations: Mutation[] = []
  private batchScheduled = false

  createNode(type: string): ShadowNode { ... }
  insertChild(parent: ShadowNode, child: ShadowNode, index?: number) { ... }
  updateText(node: ShadowTextNode, text: string) { ... }

  // Batch mutations within a microtask, then flush to the platform renderer
  private scheduleBatch() {
    if (!this.batchScheduled) {
      this.batchScheduled = true
      queueMicrotask(() => {
        this.renderer.applyMutations(this.mutations)
        this.mutations = []
        this.batchScheduled = false
      })
    }
  }
}
```

4. **Platform Renderers** consume the mutation stream:

```typescript
interface PlatformRenderer {
  applyMutations(mutations: Mutation[]): void
}

// iOS renderer (communicates via JSI to UIKit)
class IOSRenderer implements PlatformRenderer {
  applyMutations(mutations: Mutation[]) {
    for (const m of mutations) {
      switch (m.type) {
        case 'CREATE': this.bridge.createUIView(m.nodeId, m.viewType, m.props); break
        case 'INSERT': this.bridge.insertSubview(m.parentId, m.childId, m.index); break
        case 'UPDATE_PROP': this.bridge.setProperty(m.nodeId, m.key, m.value); break
        // ...
      }
    }
  }
}
```

5. **Yoga layout** runs on the shadow tree before flushing mutations to native. Each shadow node carries layout style props, and Yoga computes absolute positions. The computed layout is sent as part of the mutation payload.

### Advantages

- Shadow tree enables **mutation batching** — multiple signal updates within the same microtask are coalesced into a single native flush, reducing bridge crossings
- Platform renderers are thin and replaceable — easy to add desktop (macOS/Windows) or embedded targets
- Shadow tree can be diffed or serialized for debugging, hot-reload, or testing
- Yoga layout runs on the IR before native commit, enabling layout-aware optimizations like **view flattening** (removing intermediate wrappers that exist only for composition)
- Shadow tree can be snapshotted for testing without any native runtime

### Challenges

- Additional memory for the shadow tree (though nodes are lightweight)
- Slight latency from batching (one microtask delay) — but this matches how `Computed` already schedules via `queueMicrotask`
- More complex than Proposal A due to the IR + renderer separation

### Estimated Scope

- `@tempots/native-ir` — ShadowTree, ShadowNode, IRContext, Mutation types
- `@tempots/native-yoga` — Yoga bindings, layout calculation on shadow tree
- `@tempots/native-ios` — iOS PlatformRenderer
- `@tempots/native-android` — Android PlatformRenderer
- `@tempots/native` — Element factories, style system, re-exports

---

## Proposal C: Shared Rendering Abstraction Layer (Lift @tempots/dom Patterns)

### Summary

Rather than building native-specific infrastructure from scratch, extract the rendering patterns shared between DOM and native into a new `@tempots/render` package. This becomes the common layer that both `@tempots/dom` and `@tempots/native` build upon.

### Architecture

```
@tempots/core (unchanged)
       |
@tempots/render (NEW - shared rendering patterns)
       |       \
@tempots/dom    @tempots/native
(browser)       (mobile)
```

### How It Works

1. **Extract shared patterns** from `@tempots/dom` into `@tempots/render`. Many renderables in `@tempots/dom` are not actually DOM-specific — they work on any `HierarchicalContext`:

```typescript
// @tempots/render — context-generic control flow

export const When = <CTX extends HierarchicalContext>(
  condition: Signal<boolean>,
  then: () => TNode<CTX>,
  otherwise?: () => TNode<CTX>
): Renderable<CTX> =>
  createRenderable(RENDER_TYPE, (ctx: CTX) =>
    createReactiveRenderable(ctx, condition, value =>
      value ? then() : otherwise?.() ?? null
    )
  )

export const ForEach = <CTX extends HierarchicalContext, T>(
  items: Signal<T[]>,
  render: (item: Signal<T>, index: number) => TNode<CTX>,
  options?: { separator?: () => TNode<CTX> }
): Renderable<CTX> => ...

export const Ensure = <CTX extends HierarchicalContext, T>(
  value: Signal<T | null | undefined>,
  render: (value: Signal<T>) => TNode<CTX>
): Renderable<CTX> => ...

export const OneOf = ...
export const Fragment = ...
export const MapSignal = ...
```

2. **Define a `HostConfig` interface** that both DOM and native implement:

```typescript
// @tempots/render
export interface HostConfig<CTX extends HierarchicalContext> {
  createElementContext(ctx: CTX, type: string, namespace?: string): CTX
  createTextContext(ctx: CTX, text: string): CTX
  setText(ctx: CTX, text: string): void
  getText(ctx: CTX): string
  setProperty(ctx: CTX, name: string, value: unknown): void
  getProperty(ctx: CTX, name: string): unknown
  addEventListener<E>(ctx: CTX, event: string, handler: (e: E) => void): Clear
  setStyle(ctx: CTX, name: string, value: string): void
}
```

3. **Generic element factory** parameterized by host config:

```typescript
// @tempots/render
export const makeElementFactory = <CTX extends HierarchicalContext>(
  config: HostConfig<CTX>,
  type: symbol
) => {
  const El = (tagName: string, ...children: TNode<CTX>[]): Renderable<CTX> =>
    createRenderable(type, (ctx: CTX) => {
      const childCtx = config.createElementContext(ctx, tagName)
      const clears = children.map(c => renderableOfTNode(c, config).render(childCtx))
      return (removeTree) => {
        clears.forEach(c => c(false))
        childCtx.clear(removeTree)
      }
    })

  return { El }
}
```

4. **@tempots/dom** becomes a thin wrapper:

```typescript
// @tempots/dom (simplified — delegates to @tempots/render)
const domConfig: HostConfig<DOMContext> = {
  createElementContext: (ctx, type, ns) => ctx.makeChildElement(type, ns),
  createTextContext: (ctx, text) => ctx.makeChildText(text),
  setText: (ctx, text) => ctx.setText(text),
  setProperty: (ctx, name, value) => ctx.makeAccessors(name).set(value),
  addEventListener: (ctx, event, handler) => ctx.on(event, handler),
  setStyle: (ctx, name, value) => ctx.setStyle(name, value),
}

export const { El } = makeElementFactory(domConfig, DOM_RENDERABLE_TYPE)
```

5. **@tempots/native** implements the same interface:

```typescript
const nativeConfig: HostConfig<NativeContext> = {
  createElementContext: (ctx, type) => ctx.makeChildView(type),
  createTextContext: (ctx, text) => ctx.makeChildText(text),
  setText: (ctx, text) => ctx.bridge.updateText(ctx.viewId, text),
  setProperty: (ctx, name, value) => ctx.bridge.setViewProperty(ctx.viewId, name, value),
  addEventListener: (ctx, event, handler) => ctx.bridge.addEventListener(ctx.viewId, event, handler),
  setStyle: (ctx, name, value) => ctx.bridge.setViewStyle(ctx.viewId, name, value),
}

export const { El } = makeElementFactory(nativeConfig, NATIVE_RENDERABLE_TYPE)

// Native-specific element shortcuts
export const View = (...children: NativeTNode[]) => El('View', ...children)
export const Text = (text: Value<string>) => El('Text', text)
export const Image = (source: Value<ImageSource>) => El('Image', attr.source(source))
```

### Advantages

- Maximizes code reuse between DOM and native — control flow, reactive rendering, providers, disposal all shared
- DOM package gets thinner and more focused
- Adding new targets (canvas, terminal, PDF) follows the same pattern: implement `HostConfig`
- Existing `@tempots/dom` tests validate the shared layer
- Incremental adoption path — extract to `@tempots/render` without breaking the DOM API

### Challenges

- Refactoring `@tempots/dom` to delegate to `@tempots/render` is a large change with potential breakage
- The `HostConfig` interface must be general enough for all targets but specific enough to be useful
- Some DOM-specific features (portals, CSS classes, attribute accessor heuristics) don't generalize

### Estimated Scope

- `@tempots/render` — HostConfig interface, generic element factory, shared control flow renderables, shared utilities
- `@tempots/dom` — Refactored to use `@tempots/render` + DOM-specific features
- `@tempots/native` — NativeContext + native HostConfig + native element factories

---

## Proposal D: WebView Hybrid with Native Escape Hatches

### Summary

Run the full tempots/dom stack inside a native WebView, but provide a bridge for specific components to "escape" into truly native views when performance or platform integration demands it. This is the lowest-effort path to shipping.

### Architecture

```
@tempots/core + @tempots/dom (unchanged, runs in WebView)
       |
  WebView (WKWebView / Android WebView)
       |
  NativeBridge (for escape-hatch components)
       |
  ┌────┴────┐
  iOS UIKit  Android Views
```

### How It Works

1. The application runs as a standard tempots/dom app inside a WebView. All existing code, components, and patterns work unchanged.

2. A `NativeEscape` renderable allows specific subtrees to delegate to native views:

```typescript
export const NativeEscape = (
  nativeType: string,
  props: Value<Record<string, unknown>>,
  ...children: TNode[]
): Renderable =>
  domRenderable((ctx: DOMContext) => {
    // Create a placeholder div in the DOM
    const placeholder = ctx.makeChildElement('div', undefined)

    // Tell the native side to overlay a native view at this DOM position
    const viewId = nativeBridge.createOverlay(nativeType, props)

    // Use IntersectionObserver + ResizeObserver to keep native view aligned
    const sync = syncPositionWithDOM(placeholder, viewId)

    return (removeTree) => {
      sync.disconnect()
      nativeBridge.removeOverlay(viewId)
      placeholder.clear(removeTree)
    }
  })

// Usage
const MyScreen = () =>
  html.div(
    html.h1('My App'),
    NativeEscape('MapView', prop({ region: { lat: 37.7, lng: -122.4 } })),
    NativeEscape('Camera', prop({ facing: 'back' })),
    html.button(on.click(handleSave), 'Save')
  )
```

3. The native shell (Capacitor, Tauri, or custom) hosts the WebView and exposes a `nativeBridge` object for creating and managing native overlay views.

4. For platform APIs (camera, geolocation, push notifications), use the bridge directly or through a provider:

```typescript
const CAMERA = makeProviderMark<CameraService>('camera')

const CaptureButton = () => {
  const camera = useProvider(CAMERA)
  return html.button(
    on.click(async () => {
      const photo = await camera.takePhoto()
      // ...
    }),
    'Take Photo'
  )
}
```

### Advantages

- Lowest implementation effort — existing tempots/dom code works immediately
- All web ecosystem tooling (devtools, CSS, existing component libraries) available
- Incremental native adoption — start web-only, add native escape hatches where needed
- Single codebase serves web, mobile-web, and hybrid-native
- Familiar to developers coming from Capacitor/Ionic/Cordova

### Challenges

- WebView rendering performance is inherently slower than native for complex UIs
- "Uncanny valley" — mixing web and native UI can feel inconsistent
- Native overlay positioning is fragile during scroll/animation
- Does not achieve true native look-and-feel across the entire app
- Memory overhead of running a full browser engine

### Best For

- Teams that want mobile deployment with minimal native investment
- Apps that are primarily content/form-based (not gesture-heavy or animation-rich)
- Prototyping and MVPs before committing to a full native architecture

### Estimated Scope

- `@tempots/native-shell` — Native app shell with WebView + overlay bridge
- `@tempots/native-escape` — NativeEscape renderable, position sync, bridge protocol
- Platform-specific shell projects (Xcode / Android Studio)

---

## Proposal E: Compiled Native Output (Ahead-of-Time)

### Summary

Instead of running JavaScript at runtime on mobile, compile tempots component trees into native code ahead of time. The signal/reactive runtime is compiled to native (via a lightweight JS-to-native compiler or by reimplementing the signal system in Swift/Kotlin), and the component tree is statically analyzed and compiled to native view construction code.

### Architecture

```
@tempots/core + @tempots/native (TypeScript source)
       |
  tempots-compiler (build step)
       |
  ┌────┴────────────┐
  Swift/SwiftUI     Kotlin/Jetpack Compose
  (iOS output)      (Android output)
```

### How It Works

1. **Static analysis** of the component tree at build time. A compiler plugin walks the renderable tree and emits equivalent native code:

```typescript
// Input (TypeScript)
const Counter = () => {
  const count = prop(0)
  return View(
    Text(count.map(v => `Count: ${v}`)),
    Button('Increment', { onPress: () => count.update(v => v + 1) })
  )
}
```

```swift
// Output (Swift / SwiftUI)
struct Counter: View {
    @State private var count = 0
    var body: some View {
        VStack {
            Text("Count: \(count)")
            Button("Increment") { count += 1 }
        }
    }
}
```

```kotlin
// Output (Kotlin / Jetpack Compose)
@Composable
fun Counter() {
    var count by remember { mutableStateOf(0) }
    Column {
        Text("Count: $count")
        Button(onClick = { count++ }) { Text("Increment") }
    }
}
```

2. **Signal system mapping:**
   - `prop(initialValue)` → `@State` (SwiftUI) / `mutableStateOf` (Compose)
   - `computed(() => ...)` → Derived state / `derivedStateOf`
   - `signal.map(fn)` → Computed property
   - `signal.on(listener)` → `onChange` modifier / `LaunchedEffect`

3. **Control flow mapping:**
   - `When(cond, then, else)` → `if/else` in SwiftUI body / Compose `if`
   - `ForEach(items, render)` → `ForEach` (SwiftUI) / `items()` (Compose)
   - `Ensure(signal, render)` → Optional unwrapping with `if let`

4. **Dynamic escape hatch** for code that can't be statically compiled: embed a lightweight tempots runtime interpreter for complex dynamic components, falling back to JSI-based rendering (Proposal A) for those subtrees.

### Advantages

- Maximum native performance — no JavaScript runtime overhead
- Fully native UI — uses SwiftUI/Compose directly, inherits all platform animations, accessibility, and design language
- Smallest possible app binary (no JS engine)
- Platform-idiomatic output — can be inspected and modified by native developers
- Best possible battery life and memory usage

### Challenges

- Most complex to implement — requires a sophisticated compiler
- Not all TypeScript patterns can be statically compiled (dynamic component creation, higher-order renderables with closures)
- Two compilation targets (Swift + Kotlin) to maintain
- Debugging maps back to TypeScript source (source map equivalent needed)
- Dynamic features (code splitting, lazy loading, eval) are not supported
- Risk of semantic drift between compiled output and original behavior

### Best For

- Performance-critical applications
- Teams willing to accept compilation constraints for maximum native quality
- Long-term vision for the framework (high upfront investment, high payoff)

### Estimated Scope

- `@tempots/compiler` — AST analysis, IR generation, platform code emitters
- `@tempots/compiler-swiftui` — Swift/SwiftUI code generation
- `@tempots/compiler-compose` — Kotlin/Compose code generation
- `@tempots/native-runtime` — Lightweight fallback runtime for dynamic subtrees

---

## Comparison Matrix

| Criterion | A: JSI Direct | B: Shadow Tree IR | C: Shared Render | D: WebView Hybrid | E: AOT Compiled |
|---|---|---|---|---|---|
| **Implementation effort** | Medium | Medium-High | Medium | Low | Very High |
| **Runtime performance** | High | High | High | Low-Medium | Highest |
| **Code reuse with DOM** | Low | Low | Highest | Highest | Medium |
| **Native look & feel** | High | High | High | Low | Highest |
| **Debugging experience** | Medium | High (IR inspection) | Medium | High (web devtools) | Low-Medium |
| **New platform effort** | High (per platform) | Low (new renderer only) | Low (new HostConfig) | Low (WebView) | Very High (new emitter) |
| **Bundle size** | Medium | Medium | Medium | Large (WebView) | Smallest |
| **Animation support** | High | High (batched) | High | Low | Highest (native) |
| **Incremental adoption** | No | No | Yes | Yes | No |

---

## Recommendation

**Start with Proposal C (Shared Rendering Abstraction), then build Proposal B (Shadow Tree IR) on top of it.**

### Rationale

1. **Proposal C is the foundational refactor.** Extracting `@tempots/render` from `@tempots/dom` is valuable regardless of whether native is pursued. It cleans up the architecture, makes `@tempots/dom` thinner, and opens the door for any rendering target (native, canvas, terminal, Three.js).

2. **Proposal B's shadow tree pairs naturally with C's HostConfig.** The native `HostConfig` implementation creates shadow nodes instead of DOM nodes. The shadow tree enables mutation batching and Yoga layout — both critical for native performance. The shadow tree's mutation stream is the natural interface for platform-specific renderers.

3. **The combination C+B gives the best balance** of code reuse (shared control flow, disposal, providers), native performance (batched mutations, layout on IR), and extensibility (new platforms = new renderer).

4. **Proposal D can be an interim step** — ship a WebView-based app immediately while C+B is being developed, then migrate components to native rendering progressively.

### Phased Roadmap

```
Phase 1: Extract @tempots/render from @tempots/dom
         - HostConfig interface
         - Generic control flow (When, ForEach, Ensure, etc.)
         - Generic element factory
         - Refactor @tempots/dom to use @tempots/render

Phase 2: Build @tempots/native-ir
         - ShadowTree + ShadowNode
         - IRContext implementing HostConfig
         - Mutation batching
         - Yoga layout integration

Phase 3: Platform renderers
         - iOS renderer (JSI → UIKit)
         - Android renderer (JSI → Android Views)
         - Native element factories (View, Text, Image, etc.)

Phase 4: Developer experience
         - Hot reload support
         - DevTools (shadow tree inspector)
         - Native-specific testing utilities
```
