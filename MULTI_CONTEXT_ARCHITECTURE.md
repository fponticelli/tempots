# Multi-Context Rendering Architecture for Tempo

## Executive Summary

This document proposes a generalized architecture for Tempo that supports multiple rendering contexts (DOM, ThreeJS, Konva, PixiJS, etc.) while preserving the core programming model and ensuring type safety across context boundaries.

**Key Decisions:**

- ✅ **No backward compatibility** - Clean break for better architecture
- ✅ **Symbol-branded types** - Compile-time prevention of context mixing via type parameters
- ✅ **Object-based renderables** - `render(ctx): Clear` method instead of function
- ✅ **Options objects with individually reactive properties** - Consistent API across all contexts
- ✅ **Properties vs children** - Materials, lights, filters as children (not properties)
- ✅ **Shared core** - `@tempots/core` for disposal, signals, and base interfaces
- ✅ **Type-safe bridges** - Explicit cross-context composition
- ✅ **Breaking change** - `@tempots/dom@2.0.0` with new type system

**Migration Impact:**

- **Low to medium effort** - Type changes + API updates (15 min to 2 hours)
- **Minimal runtime changes** - Element creation, signals, rendering APIs mostly unchanged
- **Better DX** - Cleaner types, better IDE support, no intersection types

---

## Table of Contents

1. [Core Principles](#core-principles)
2. [Package Structure](#package-structure)
3. [Core Type Definitions](#core-type-definitions)
4. [Design Decisions](#design-decisions)
5. [Implementation Examples](#implementation-examples)
6. [Type-Safe Bridge Patterns](#type-safe-bridge-patterns)
7. [Context Interoperability Patterns](#context-interoperability-patterns)
8. [Type Safety Enforcement](#type-safety-enforcement)
9. [Implementation Roadmap](#implementation-roadmap)
10. [Breaking Changes for Existing Users](#breaking-changes-for-existing-users)
11. [Simplified Type System](#simplified-type-system-no-backward-compatibility)
12. [Benefits Summary](#benefits-summary)
13. [Open Questions](#open-questions)
14. [Next Steps](#next-steps)

---

## Core Principles

1. **Preserve the Renderable Pattern**: Objects with `render(ctx: Context): Clear` method
2. **Automatic Disposal**: Signals and resources are automatically tracked and disposed
3. **Type Safety**: Symbol-branded types prevent context mixing at compile time
4. **Clean Architecture**: No legacy code or backward compatibility concerns
5. **Shared Core**: Common abstractions live in `@tempots/core`

---

## Package Structure

```
packages/
├── tempots-core/              # Context-agnostic core (NEW)
│   ├── src/
│   │   ├── types/
│   │   │   ├── context.ts     # Generic Context interface
│   │   │   ├── renderable.ts  # Generic Renderable types
│   │   │   └── provider.ts    # Provider system
│   │   ├── disposal/
│   │   │   ├── disposal-scope.ts
│   │   │   └── scope-stack.ts
│   │   └── signal/            # Move from tempots-std
│   │       ├── signal.ts
│   │       ├── signal-utils.ts
│   │       └── value.ts
│
├── tempots-std/               # Utility functions (UNCHANGED)
│   └── src/
│       ├── array/
│       ├── object/
│       └── ...
│
├── tempots-dom/               # DOM-specific implementation (REFACTORED)
│   ├── src/
│   │   ├── types/
│   │   │   ├── dom-context.ts      # DOMContext interface
│   │   │   ├── dom-renderable.ts   # DOM-specific Renderable
│   │   │   └── ...
│   │   ├── context/
│   │   │   ├── browser-context.ts
│   │   │   └── headless-context.ts
│   │   ├── renderable/
│   │   │   ├── element.ts          # html, svg, math
│   │   │   ├── attribute.ts
│   │   │   └── ...
│   │   └── bridge/
│   │       ├── three-bridge.ts     # DOM ↔ ThreeJS bridge
│   │       └── canvas-bridge.ts    # DOM ↔ Canvas bridge
│
├── tempots-three/             # ThreeJS implementation (NEW)
│   ├── src/
│   │   ├── types/
│   │   │   ├── three-context.ts
│   │   │   └── three-renderable.ts
│   │   ├── context/
│   │   │   └── three-context.ts
│   │   ├── renderable/
│   │   │   ├── mesh.ts             # mesh.box(), mesh.sphere()
│   │   │   ├── light.ts            # light.point(), light.directional()
│   │   │   ├── material.ts         # material.standard(), material.basic()
│   │   │   └── ...
│   │   └── bridge/
│   │       └── dom-bridge.ts       # ThreeJS ↔ DOM bridge
│
├── tempots-konva/             # Konva implementation (NEW)
│   └── ...
│
└── tempots-pixi/              # PixiJS implementation (NEW)
    └── ...
```

---

## Core Type Definitions

### 1. Generic Context Interface (`@tempots/core`)

````typescript
// packages/tempots-core/src/types/context.ts

/**
 * Base interface that all rendering contexts must implement.
 * This defines the minimal contract for any rendering context.
 *
 * Note: No type parameters - context-specific implementations can add
 * their own properties as needed.
 */
export interface RenderContext {
  /**
   * Provider system for dependency injection
   */
  getProvider<T>(mark: ProviderMark<T>): { value: T; onUse?: () => void };
  setProvider<T>(
    mark: ProviderMark<T>,
    value: T,
    onUse: undefined | (() => void)
  ): this;

  /**
   * Cleanup method called when the context is disposed
   */
  clear(removeTree: boolean): void;

  /**
   * Type discriminator for runtime context detection
   */
  readonly contextType: string;
}

/**
 * Extended context interface for contexts with ordered children.
 *
 * Most rendering contexts maintain an ordered list of children where position matters:
 * - DOM: Parent element's children array (affects layout)
 * - ThreeJS: Object3D.children array (affects scene graph traversal)
 * - Konva: Layer/Group children (affects z-order/rendering order)
 * - PixiJS: Container.children array (affects z-index/rendering order)
 *
 * When conditionally rendering or dynamically swapping children, we need to preserve
 * exact insertion points. This interface provides two mechanisms:
 *
 * 1. **Reference markers**: Invisible placeholders that mark positions
 * 2. **Portals**: Render content in a different location in the tree
 */
export interface HierarchicalContext extends RenderContext {
  /**
   * Create a reference marker for precise insertion positioning.
   *
   * This creates an invisible placeholder that marks an exact position in the
   * children list without affecting rendering. Essential for:
   * - Conditional rendering (When/Match) - preserve position when toggling
   * - Dynamic lists (For) - maintain positions when items change
   * - Portals - mark the "exit point" in the original tree
   *
   * Implementation varies by context:
   * - DOM: Comment node (<!-- ref -->)
   * - ThreeJS: Empty Object3D with visible=false
   * - Konva: Invisible Group with listening=false
   * - PixiJS: Empty Container with renderable=false
   *
   * Example problem this solves:
   * ```typescript
   * Container([
   *   Child1(),
   *   When(condition, () => Child2()),  // Position must be preserved!
   *   Child3(),
   * ])
   * ```
   * When `condition` toggles, Child2 must always appear between Child1 and Child3.
   * Without a reference marker, we'd lose the position when Child2 is removed.
   */
  makeRef(): this;

  /**
   * Create a portal to render in a different location.
   *
   * The target type is intentionally `unknown` to allow context-specific
   * implementations (e.g., DOM selector string, ThreeJS Object3D, etc.)
   */
  makePortal(target: unknown): this;
}
````

### 2. Generic Renderable Types (`@tempots/core`)

```typescript
// packages/tempots-core/src/types/renderable.ts

/**
 * Clear function returned by renderables
 */
export type Clear = (removeTree: boolean) => void;

/**
 * Renderable object that can be rendered in a specific context.
 *
 * This is an object (not a function) to allow for clean type branding.
 * The type parameter TType provides compile-time type safety to prevent
 * mixing renderables from different contexts.
 *
 * @template CTX - The specific context type this renderable works with
 * @template TType - Symbol type for branding (prevents context mixing)
 */
export interface Renderable<
  CTX extends RenderContext = RenderContext,
  TType extends symbol = symbol,
> {
  /**
   * Render this renderable in the given context
   */
  render(ctx: CTX): Clear;

  /**
   * Type discriminator using a symbol to prevent mixing renderables
   * from different contexts at compile time.
   */
  readonly type: TType;
}

/**
 * Generic content node type
 * @template CTX - The specific context type
 * @template TType - Symbol type for branding
 */
export type TNode<
  CTX extends RenderContext = RenderContext,
  TType extends symbol = symbol,
> =
  | Renderable<CTX, TType>
  | Value<string>
  | undefined
  | null
  | Renderable<CTX, TType>[];

/**
 * Helper to create a renderable object from a render function
 */
export function createRenderable<
  CTX extends RenderContext,
  TType extends symbol,
>(type: TType, renderFn: (ctx: CTX) => Clear): Renderable<CTX, TType>;
```

### 3. DOM-Specific Types (`@tempots/dom`)

```typescript
// packages/tempots-dom/src/types/dom-renderable.ts

import { Renderable, TNode, createRenderable, Clear } from "@tempots/core";
import { DOMContext } from "./dom-context";

/**
 * Symbol to brand DOM renderables and prevent mixing with other contexts
 */
export const DOM_RENDERABLE_TYPE = Symbol("DOM_RENDERABLE");

/**
 * DOM-specific renderable type.
 * Uses the symbol type parameter for compile-time type safety.
 */
export type DOMRenderable = Renderable<DOMContext, typeof DOM_RENDERABLE_TYPE>;

/**
 * DOM-specific content node
 */
export type DOMNode = TNode<DOMContext, typeof DOM_RENDERABLE_TYPE>;

/**
 * Helper to create DOM renderables (internal use)
 */
export function domRenderable(
  renderFn: (ctx: DOMContext) => Clear
): DOMRenderable;
```

```typescript
// packages/tempots-dom/src/types/dom-context.ts

import { HierarchicalContext } from "@tempots/core";

/**
 * DOM-specific context interface
 */
export interface DOMContext extends HierarchicalContext<HTMLElement, Node> {
  readonly contextType: "DOM";

  // DOM-specific methods
  makeChildElement(tagName: string, namespace: string | undefined): DOMContext;
  makeChildText(text: string): DOMContext;
  setText(text: string): void;
  getText(): string;

  // Event handling
  on<E>(
    event: string,
    listener: (event: E, ctx: DOMContext) => void,
    options?: HandlerOptions
  ): Clear;

  // Styling
  addClasses(tokens: string[]): void;
  removeClasses(tokens: string[]): void;
  getClasses(): string[];
  setStyle(name: string, value: string): void;
  getStyle(name: string): string;

  // Attributes
  makeAccessors(name: string): {
    get(): unknown;
    set(value: unknown): void;
  };

  // Type guards
  isBrowser(): this is BrowserContext;
  isHeadless(): this is HeadlessContext;
}
```

### 4. ThreeJS-Specific Types (`@tempots/three`)

```typescript
// packages/tempots-three/src/types/three-renderable.ts

import { Renderable, TNode, createRenderable, Clear } from "@tempots/core";
import { ThreeContext } from "./three-context";

/**
 * Symbol to brand ThreeJS renderables and prevent mixing with other contexts
 */
export const THREE_RENDERABLE_TYPE = Symbol("THREE_RENDERABLE");

/**
 * ThreeJS-specific renderable type.
 * Uses the symbol type parameter for compile-time type safety.
 */
export type ThreeRenderable = Renderable<
  ThreeContext,
  typeof THREE_RENDERABLE_TYPE
>;

/**
 * ThreeJS-specific content node
 */
export type ThreeNode = TNode<ThreeContext, typeof THREE_RENDERABLE_TYPE>;

/**
 * Helper to create ThreeJS renderables (internal use)
 */
export function threeRenderable(
  renderFn: (ctx: ThreeContext) => Clear
): ThreeRenderable;
```

```typescript
// packages/tempots-three/src/types/three-context.ts

import { HierarchicalContext } from "@tempots/core";
import * as THREE from "three";

/**
 * ThreeJS-specific context interface.
 *
 * Extends HierarchicalContext because ThreeJS has ordered children
 * (Object3D.children array) where position matters for scene graph traversal.
 * Reference markers use empty Object3D instances with visible=false.
 */
export interface ThreeContext extends HierarchicalContext {
  readonly contextType: "THREE";

  // ThreeJS-specific methods
  readonly scene: THREE.Scene;
  readonly camera: THREE.Camera;
  readonly renderer: THREE.WebGLRenderer;

  /**
   * Add a child object to the current object
   */
  addChild(object: THREE.Object3D): ThreeContext;

  /**
   * Create a new context focused on a child object
   */
  withObject(object: THREE.Object3D): ThreeContext;

  /**
   * Set position of the current object
   */
  setPosition(x: number, y: number, z: number): void;

  /**
   * Set rotation of the current object
   */
  setRotation(x: number, y: number, z: number): void;

  /**
   * Set scale of the current object
   */
  setScale(x: number, y: number, z: number): void;

  /**
   * Animate the scene
   */
  onFrame(callback: (delta: number) => void): Clear;
}
```

---

## Design Decisions

### 1. RenderContext Without Type Parameters

`RenderContext` has no type parameters because the base interface doesn't use element or reference types in its method signatures. Context-specific implementations add their own properties as needed.

```typescript
export interface RenderContext {
  getProvider<T>(mark: ProviderMark<T>): { value: T; onUse?: () => void };
  setProvider<T>(
    mark: ProviderMark<T>,
    value: T,
    onUse: undefined | (() => void)
  ): this;
  clear(removeTree: boolean): void;
  readonly contextType: string;
}

// Context-specific implementations add what they need
export interface DOMContext extends HierarchicalContext {
  readonly element: HTMLElement;
  makeChildElement(
    tagName: string,
    attributes?: Record<string, string>
  ): DOMContext;
  // ... other DOM-specific methods
}
```

### 2. HierarchicalContext for Ordered Children

Most rendering contexts maintain an ordered list of children where position matters (DOM, ThreeJS, Konva, PixiJS). When conditionally rendering or swapping children, reference markers preserve exact positions.

**The Problem**:

```typescript
Container([
  Child1(),
  When(condition, () => Child2()), // Position must be preserved when toggled
  Child3(),
]);
```

**The Solution** - Reference markers (invisible placeholders):

- **DOM**: Comment nodes (`<!-- ref -->`)
- **ThreeJS**: Empty `Object3D` with `visible=false`
- **Konva**: Invisible `Group` with `listening=false`
- **PixiJS**: Empty `Container` with `renderable=false`

**Usage**:

```typescript
// Most contexts extend HierarchicalContext
export interface DOMContext extends HierarchicalContext {}
export interface ThreeContext extends HierarchicalContext {}
export interface KonvaContext extends HierarchicalContext {}

// Only skip if no ordered children (e.g., immediate mode rendering)
export interface CanvasContext extends RenderContext {}
```

### 3. Object-Based Renderables with Symbol Type Parameter

Renderables are objects (not functions) with a `render()` method and a `type` symbol as a type parameter. This provides compile-time and runtime type safety without intersection types or interface extension.

**Type Definition**:

```typescript
export interface Renderable<CTX extends RenderContext, TType extends symbol> {
  render(ctx: CTX): Clear;
  readonly type: TType;
}

// Context-specific types use the symbol type parameter
export const DOM_RENDERABLE_TYPE = Symbol("DOM_RENDERABLE");
export type DOMRenderable = Renderable<DOMContext, typeof DOM_RENDERABLE_TYPE>;

export const THREE_RENDERABLE_TYPE = Symbol("THREE_RENDERABLE");
export type ThreeRenderable = Renderable<
  ThreeContext,
  typeof THREE_RENDERABLE_TYPE
>;
```

**Type Safety**:

```typescript
// ✅ Compile-time: TypeScript prevents mixing contexts
function takesDOM(r: DOMRenderable) { }
takesDOM(threeRenderable(...))  // ❌ Compile error

// ✅ Runtime: Symbol checking works
if (renderable.type === DOM_RENDERABLE_TYPE) {
  // TypeScript narrows to DOMRenderable
}
```

### 4. Symbol Branding Over String Branding

Symbols are used instead of strings for type branding because they are guaranteed unique and cannot be accidentally duplicated.

```typescript
// ✅ Each symbol is unique
export const DOM_RENDERABLE_TYPE = Symbol("DOM_RENDERABLE");
export const THREE_RENDERABLE_TYPE = Symbol("THREE_RENDERABLE");

// Cannot collide, even with same description
DOM_RENDERABLE_TYPE === THREE_RENDERABLE_TYPE; // false

// Runtime type checking
if (renderable.type === DOM_RENDERABLE_TYPE) {
  // Guaranteed to be a DOM renderable
}
```

### 5. Options Objects with Individually Reactive Properties

Component factories accept options objects where each property can be reactive (`Value<T>`), rather than making the entire options object reactive or using positional parameters.

**Rationale**:

- **Fits component model**: Options objects are easier to extend and document
- **Proxy-friendly**: Enables generic proxy-based factories without defining specific methods
- **Granular reactivity**: Each property can be independently reactive
- **Optional properties**: Easy to provide defaults
- **Better DX**: Named parameters are self-documenting

**Pattern**:

```typescript
// ✅ Options object with individually reactive properties
mesh.box(
  {
    width: prop(1), // Reactive
    height: 2, // Static
    depth: prop(3), // Reactive
    position: {
      x: prop(0), // Nested reactive properties
      y: 1,
      z: 0,
    },
  },
  ...children
);

// ❌ NOT: Positional parameters
mesh.box(1, 2, 3, material, ...children);

// ❌ NOT: Whole object reactive
mesh.box(prop({ width: 1, height: 2, depth: 3 }), ...children);
```

**Nested objects**: For complex properties like `position` or `rotation`, use nested objects with individually reactive properties rather than `Value<{ x, y, z }>`.

### 6. Properties vs Children

Some context-specific objects (materials, lights, textures) are treated as **children** rather than properties, allowing them to be reactive renderables.

**Materials as Children**:

```typescript
// ✅ Material is a child node
mesh.sphere(
  { radius: 1 },
  material.standard({
    color: prop(0xff0000),
    metalness: 0.5,
  })
);

// Multiple materials: last one wins (or error)
mesh.sphere(
  { radius: 1 },
  material.standard({ color: 0xff0000 }),
  material.basic({ color: 0x00ff00 }) // This one is used
);
```

**Rationale**:

- Materials can be reactive (change over time)
- Materials can be conditional (`When(condition, () => material.standard(...))`)
- Materials can be shared/composed
- Consistent with the renderable pattern

**Applies to**:

- **ThreeJS**: Materials, lights, textures, helpers
- **Konva**: Fills, strokes, filters
- **PixiJS**: Textures, filters, blend modes
- **DOM**: Styles, attributes, event handlers (already children)

### 7. Cross-Context Pattern Consistency

The options-object-with-individually-reactive-properties pattern applies consistently across all contexts:

**DOM** (already follows this pattern):

```typescript
html.div(
  attr.class("container"),
  style.width(prop("100px")), // Reactive
  style.height("200px"), // Static
  on.click(() => console.log("clicked"))
);
```

**ThreeJS**:

```typescript
mesh.box(
  {
    width: prop(1), // Reactive
    height: 2, // Static
    position: { x: prop(0), y: 1, z: 0 },
  },
  material.standard({ color: prop(0xff0000) }),
  light.point({ intensity: prop(1.5) })
);
```

**Konva**:

```typescript
shape.rect(
  {
    x: prop(10), // Reactive
    y: 20, // Static
    width: prop(100),
    height: 50,
    rotation: prop(0),
  },
  fill.solid({ color: prop("red") }),
  stroke.solid({ color: "black", width: 2 })
);
```

**PixiJS**:

```typescript
sprite.create(
  {
    x: prop(100), // Reactive
    y: 200, // Static
    width: prop(64),
    height: 64,
    rotation: prop(0),
  },
  texture.fromURL("/image.png"),
  filter.blur({ strength: prop(5) })
);
```

**Key Consistency**:

- Options object as first parameter
- Each property individually reactive (`Value<T>`)
- Nested objects for complex properties (position, rotation, etc.)
- Special nodes (materials, fills, textures, filters) as children
- Children as rest parameters (`...children`)

---

## Implementation Examples

### 1. DOM Implementation (Refactored)

```typescript
// packages/tempots-dom/src/renderable/element.ts

import { domRenderable, DOMRenderable, DOMNode } from "../types/dom-renderable";
import { DOMContext } from "../types/dom-context";

/**
 * Creates a DOM element renderable
 */
export function El(tagName: string, ...children: DOMNode[]): DOMRenderable;

/**
 * Proxy for creating HTML elements
 */
export const html: {
  [H in keyof HTMLTags]: (...children: DOMNode[]) => DOMRenderable;
};
```

### 2. ThreeJS Implementation

```typescript
// packages/tempots-three/src/renderable/mesh.ts

import {
  threeRenderable,
  ThreeRenderable,
  ThreeNode,
} from "../types/three-renderable";
import { ThreeContext } from "../types/three-context";
import * as THREE from "three";

/**
 * Creates a mesh renderable
 */
export function Mesh(
  geometry: THREE.BufferGeometry,
  material: THREE.Material,
  ...children: ThreeNode[]
): ThreeRenderable;

/**
 * Proxy for creating common mesh types
 *
 * Properties are individually reactive (not the whole options object).
 * Material is a child node, not a property.
 */
export const mesh: {
  box(
    options: {
      width?: Value<number>;
      height?: Value<number>;
      depth?: Value<number>;
      position?: {
        x?: Value<number>;
        y?: Value<number>;
        z?: Value<number>;
      };
      rotation?: {
        x?: Value<number>;
        y?: Value<number>;
        z?: Value<number>;
      };
    },
    ...children: ThreeNode[]
  ): ThreeRenderable;

  sphere(
    options: {
      radius?: Value<number>;
      widthSegments?: Value<number>;
      heightSegments?: Value<number>;
      position?: {
        x?: Value<number>;
        y?: Value<number>;
        z?: Value<number>;
      };
      rotation?: {
        x?: Value<number>;
        y?: Value<number>;
        z?: Value<number>;
      };
    },
    ...children: ThreeNode[]
  ): ThreeRenderable;

  // ... more mesh types
};

/**
 * Material factories - materials are ThreeJS children, not properties
 *
 * Properties are individually reactive.
 * Multiple materials in children: last one wins (or could be an error).
 */
export const material: {
  standard(options: {
    color?: Value<number | string>;
    metalness?: Value<number>;
    roughness?: Value<number>;
    emissive?: Value<number | string>;
    emissiveIntensity?: Value<number>;
    opacity?: Value<number>;
    transparent?: Value<boolean>;
  }): ThreeRenderable;

  basic(options: {
    color?: Value<number | string>;
    opacity?: Value<number>;
    transparent?: Value<boolean>;
    wireframe?: Value<boolean>;
  }): ThreeRenderable;

  phong(options: {
    color?: Value<number | string>;
    specular?: Value<number | string>;
    shininess?: Value<number>;
    opacity?: Value<number>;
    transparent?: Value<boolean>;
  }): ThreeRenderable;

  // ... more material types
};

/**
 * Light factories - lights are also ThreeJS children
 */
export const light: {
  directional(options: {
    color?: Value<number | string>;
    intensity?: Value<number>;
    position?: {
      x?: Value<number>;
      y?: Value<number>;
      z?: Value<number>;
    };
  }): ThreeRenderable;

  point(options: {
    color?: Value<number | string>;
    intensity?: Value<number>;
    distance?: Value<number>;
    decay?: Value<number>;
    position?: {
      x?: Value<number>;
      y?: Value<number>;
      z?: Value<number>;
    };
  }): ThreeRenderable;

  ambient(options: {
    color?: Value<number | string>;
    intensity?: Value<number>;
  }): ThreeRenderable;

  // ... more light types
};
```

---

## Type-Safe Bridge Patterns

### 1. DOM → ThreeJS Bridge

````typescript
// packages/tempots-dom/src/bridge/three-bridge.ts

import { DOMRenderable, DOMNode } from "../types/dom-renderable";
import { ThreeRenderable } from "@tempots/three";
import { domRenderable } from "../types/dom-renderable";
import { DOMContext } from "../types/dom-context";
import { renderWithContext } from "../renderable/render";
import * as THREE from "three";

/**
 * Embeds a ThreeJS scene within a DOM canvas element
 *
 * @example
 * ```typescript
 * html.div(
 *   ThreeCanvas(
 *     { width: 800, height: 600 },
 *     mesh.box(1, 1, 1, material.standard({ color: 0xff0000 }))
 *   )
 * )
 * ```
 */
export function ThreeCanvas(
  options: {
    width: number;
    height: number;
    antialias?: boolean;
    alpha?: boolean;
  },
  ...children: ThreeRenderable[]
): DOMRenderable;

/**
 * Reactive ThreeJS canvas that updates when signals change
 */
export function ReactiveThreeCanvas(
  options: {
    width: Value<number>;
    height: Value<number>;
    antialias?: boolean;
    alpha?: boolean;
  },
  fn: (ctx: ThreeContext) => ThreeNode
): DOMRenderable;
````

### 2. ThreeJS → DOM Bridge

````typescript
// packages/tempots-three/src/bridge/dom-bridge.ts

import { ThreeRenderable, ThreeNode } from "../types/three-renderable";
import { DOMRenderable } from "@tempots/dom";
import { threeRenderable } from "../types/three-renderable";
import { ThreeContext } from "../types/three-context";
import * as THREE from "three";
import { CSS3DObject } from "three/examples/jsm/renderers/CSS3DRenderer";

/**
 * Embeds DOM content as a texture in ThreeJS
 *
 * @example
 * ```typescript
 * mesh.plane(
 *   2, 2,
 *   material.basic({ map: DOMTexture(html.div('Hello from DOM!')) })
 * )
 * ```
 */
export function DOMTexture(
  content: DOMRenderable,
  options?: {
    width?: number;
    height?: number;
  }
): THREE.Texture;

/**
 * Embeds DOM content as a 3D object using CSS3DRenderer
 *
 * @example
 * ```typescript
 * scene.add(
 *   DOMObject3D(
 *     html.div(
 *       attr.class('info-panel'),
 *       html.h1('3D UI Panel')
 *     )
 *   )
 * )
 * ```
 */
export function DOMObject3D(
  content: DOMRenderable,
  options?: {
    width?: number;
    height?: number;
  }
): ThreeRenderable;
````

---

## Context Interoperability Patterns

### 1. Portal Pattern (Same Context)

```typescript
// Works within the same context type
const MyComponent = (): DOMRenderable => {
  return html.div(
    html.button("Open Modal"),
    Portal("#modal-root", html.div(attr.class("modal"), "Modal content"))
  );
};
```

### 2. Bridge Pattern (Cross-Context)

```typescript
// Bridges between different contexts
const My3DApp = (): DOMRenderable => {
  return html.div(
    html.h1("3D Viewer"),
    ThreeCanvas(
      { width: 800, height: 600 },
      // ThreeJS content
      mesh.box(
        { width: 1, height: 1, depth: 1 },
        material.standard({ color: 0xff0000 })
      ),
      light.directional({ intensity: 1, position: { x: 5, y: 5, z: 5 } })
    )
  );
};
```

### 3. Bidirectional Bridge Pattern

```typescript
// DOM → ThreeJS → DOM
const ComplexApp = (): DOMRenderable => {
  return html.div(
    ThreeCanvas(
      { width: 800, height: 600 },
      mesh.sphere(
        { radius: 1 },
        material.basic({
          color: 0xffffff,
          // Texture from DOM content
          map: DOMTexture(html.div("Texture from DOM!")),
        })
      ),
      DOMObject3D(
        html.div(attr.class("floating-ui"), html.button("Click me in 3D!"))
      )
    )
  );
};
```

### 4. Multi-Context Composition

```typescript
// Multiple contexts in one app
const Dashboard = (): DOMRenderable => {
  const rotation = prop(0);

  return html.div(
    attr.class("dashboard"),

    // 3D visualization
    html.div(
      attr.class("visualization"),
      ThreeCanvas(
        { width: 600, height: 400 },
        mesh.box(
          {
            width: 1,
            height: 1,
            depth: 1,
            rotation: { y: rotation }, // Reactive rotation
          },
          material.standard({ color: 0x00ff00 })
        )
      )
    ),

    // 2D chart
    html.div(
      attr.class("chart"),
      KonvaStage(
        { width: 600, height: 400 },
        shape.rect({
          x: 10,
          y: 10,
          width: 100,
          height: 50,
          fill: "red",
        })
      )
    ),

    // Regular DOM controls
    html.div(
      attr.class("controls"),
      html.button(
        on.click(() => rotation.update((r) => r + 0.1)),
        "Rotate"
      ),
      html.button("Export")
    )
  );
};
```

---

## Type Safety Enforcement

### 1. Compile-Time Type Checking

```typescript
// ✅ VALID: DOM renderable in DOM context
html.div(html.span("Hello"));

// ❌ INVALID: ThreeJS renderable in DOM context
html.div(
  mesh.box(
    { width: 1, height: 1, depth: 1 },
    material.standard({ color: 0xff0000 })
  )
  // Type error: ThreeRenderable is not assignable to DOMNode
);

// ✅ VALID: Using bridge
html.div(
  ThreeCanvas(
    { width: 800, height: 600 },
    mesh.box(
      { width: 1, height: 1, depth: 1 },
      material.standard({ color: 0xff0000 })
    )
  )
);

// ❌ INVALID: DOM renderable in ThreeJS context
ThreeCanvas(
  { width: 800, height: 600 },
  html.div("Hello")
  // Type error: DOMRenderable is not assignable to ThreeNode
);
```

### 2. Runtime Type Guards

```typescript
// Runtime context detection
export function isThreeContext(ctx: RenderContext): ctx is ThreeContext;
export function isDOMContext(ctx: RenderContext): ctx is DOMContext;

// Usage example
const AdaptiveComponent = (): Renderable => {
  return {
    type: ADAPTIVE_TYPE,
    render: (ctx: RenderContext) => {
      if (isDOMContext(ctx)) {
        return html.div("DOM context").render(ctx);
      } else if (isThreeContext(ctx)) {
        return mesh
          .box(
            { width: 1, height: 1, depth: 1 },
            material.standard({ color: 0xff0000 })
          )
          .render(ctx);
      } else {
        throw new Error(`Unsupported context: ${ctx.contextType}`);
      }
    },
  };
};
```

---

## Implementation Roadmap

### Phase 1: Create Core Package

**Goal**: Establish the foundation with `@tempots/core`

1. **Extract context-agnostic code**
   - Move `DisposalScope` and `ScopeStack` from `@tempots/dom`
   - Move signal primitives to `@tempots/core` (or reference from `@tempots/std`)
   - Define generic `RenderContext` and `Renderable` interfaces
   - Implement `renderWithContext()` utility

2. **Define type system**
   - Create `BrandedRenderable<CTX, Brand>` type
   - Implement provider system types
   - Add runtime type guards

3. **Release**
   - `@tempots/core@1.0.0`

### Phase 2: Refactor DOM Package

**Goal**: Rebuild `@tempots/dom` using the new architecture (breaking change)

1. **Implement branded types**
   - Replace all uses of generic `Renderable` with `DOMRenderable`
   - Update all element factories to return `DOMRenderable`
   - Update `DOMContext` to extend `HierarchicalContext`
   - Remove all old type exports

2. **Update implementations**
   - Refactor `BrowserContext` and `HeadlessContext` to use `@tempots/core`
   - Update all renderables to use branded types
   - Clean up internal APIs
   - Update all tests

3. **Update package exports**
   - Export only new types (`DOMRenderable`, `DOMNode`, `DOMContext`)
   - Remove any deprecated exports
   - Clean package.json dependencies

4. **Release**
   - `@tempots/dom@2.0.0` (major version - breaking changes)
   - Update all demos to use new API
   - Publish migration guide for users

### Phase 3: Create New Context Packages

**Goal**: Add support for other rendering contexts

1. **Implement `@tempots/three`**
   - Create `ThreeContext` implementation
   - Build mesh, light, and material factories
   - Implement DOM ↔ ThreeJS bridges
   - Add examples and documentation

2. **Implement `@tempots/konva`**
   - Create `KonvaContext` implementation
   - Build shape and layer factories
   - Implement DOM ↔ Konva bridges
   - Add examples and documentation

3. **Implement `@tempots/pixi`**
   - Create `PixiContext` implementation
   - Build sprite and container factories
   - Implement DOM ↔ PixiJS bridges
   - Add examples and documentation

4. **Release**
   - `@tempots/three@1.0.0`
   - `@tempots/konva@1.0.0`
   - `@tempots/pixi@1.0.0`

### Phase 4: Build Examples and Documentation

**Goal**: Demonstrate the architecture with real-world examples

1. **Create example applications**
   - Multi-context dashboard
   - 3D visualization with DOM controls
   - Canvas-based game with DOM UI
   - Data visualization mixing DOM, SVG, and Canvas

2. **Write comprehensive documentation**
   - Architecture overview
   - Context-specific guides
   - Bridge pattern cookbook
   - Migration guide from old `@tempots/dom`

3. **Create tutorials**
   - Getting started with each context
   - Building cross-context applications
   - Performance optimization
   - Testing strategies

---

## Breaking Changes for Existing Users

### What Changes

1. **Type Imports**

   ```typescript
   // ❌ OLD (will not work)
   import { Renderable, TNode } from "@tempots/dom";

   // ✅ NEW (required)
   import { DOMRenderable, DOMNode } from "@tempots/dom";
   ```

2. **Function Signatures**

   ```typescript
   // ❌ OLD
   const MyComponent = (): Renderable => {
     return html.div("Hello");
   };

   // ✅ NEW
   const MyComponent = (): DOMRenderable => {
     return html.div("Hello");
   };
   ```

3. **Renderable Pattern**

   ```typescript
   // ❌ OLD: Renderables were functions
   const MyComponent = (): Renderable => {
     return (ctx: DOMContext) => {
       // render logic
       return (removeTree) => {
         // cleanup
       };
     };
   };

   // ✅ NEW: Renderables are objects (but you rarely create them manually)
   const MyComponent = (): DOMRenderable => {
     return domRenderable((ctx: DOMContext) => {
       // render logic
       return (removeTree) => {
         // cleanup
       };
     });
   };

   // ✅ BETTER: Use element factories (no change from user perspective)
   const MyComponent = (): DOMRenderable => {
     return html.div("Hello"); // Same as before!
   };
   ```

4. **Calling Renderables**

   ```typescript
   // ❌ OLD: Call renderable as a function
   const clear = myRenderable(ctx);

   // ✅ NEW: Call the render method
   const clear = myRenderable.render(ctx);
   ```

   **Note**: This only affects code that manually calls renderables. Element factories and the `render()` function handle this automatically.

5. **Package Dependencies**
   ```json
   // package.json
   {
     "dependencies": {
       "@tempots/core": "^1.0.0", // NEW - required
       "@tempots/dom": "^2.0.0", // UPDATED - breaking changes
       "@tempots/std": "^1.0.0" // UNCHANGED
     }
   }
   ```

### What Stays the Same

1. **Element Creation API**

   ```typescript
   // ✅ No changes needed
   html.div(html.h1("Title"), html.p("Content"));
   ```

2. **Signal Usage**

   ```typescript
   // ✅ No changes needed
   const count = prop(0);
   html.div(count.map((n) => `Count: ${n}`));
   ```

3. **Event Handling**

   ```typescript
   // ✅ No changes needed
   html.button(
     "Click me",
     on.click(() => console.log("clicked"))
   );
   ```

4. **Rendering**
   ```typescript
   // ✅ No changes needed
   render(MyComponent(), document.getElementById("app"));
   ```

### Migration Effort

**Low to Medium effort** - Mostly type changes with some API updates:

**Type-only changes** (find/replace):

- Update type imports: `Renderable` → `DOMRenderable`, `TNode` → `DOMNode`
- Update function return types
- Add `@tempots/core` dependency

**API changes** (if you manually call renderables):

- Change `renderable(ctx)` to `renderable.render(ctx)`
- This is rare - most code uses element factories which handle this automatically

**No changes needed**:

- Element creation (`html.div()`, `svg.circle()`, etc.)
- Signal usage (`prop()`, `computed()`, etc.)
- Event handling (`on.click()`, etc.)
- Rendering (`render()` function)

**Estimated time**:

- **15-30 minutes** if you only use element factories (most apps)
- **1-2 hours** if you have custom renderables that are called manually

---

## Simplified Type System (No Backward Compatibility)

### Package Exports

Each context package exports only its specific types with no legacy aliases:

```typescript
// packages/tempots-dom/src/index.ts

// Types
export type { DOMRenderable, DOMNode, DOMContext } from "./types";
export type { Clear } from "@tempots/core";

// Element factories
export { html, svg, math } from "./renderable/element";
export { attr } from "./renderable/attribute";
export { on } from "./renderable/event";
export { style } from "./renderable/style";

// Utilities
export { render, renderWithContext } from "./renderable/render";
export { Portal } from "./renderable/portal";

// Context implementations
export { BrowserContext, HeadlessContext } from "./context";

// Bridges
export { ThreeCanvas } from "./bridge/three-bridge";
export { KonvaStage } from "./bridge/konva-bridge";
```

### Key Simplifications

1. **Single Renderable Type per Context**
   - `DOMRenderable` - only type exported from `@tempots/dom`
   - `ThreeRenderable` - only type exported from `@tempots/three`
   - `KonvaRenderable` - only type exported from `@tempots/konva`

2. **No Type Aliases for Compatibility**
   - No `@deprecated` markers
   - No dual exports of old/new types
   - Clean, single source of truth

3. **Branded Types from Day One**
   - All renderables are symbol-branded
   - TypeScript enforces boundaries immediately

4. **Smaller Bundle Size**
   - No compatibility layers
   - No runtime checks for old patterns
   - Tree-shaking works better

---

## Benefits Summary

### 1. **Type Safety**

- Compile-time prevention of context mixing via symbol branding
- Clear error messages when using wrong context
- Full IntelliSense support for context-specific APIs

### 2. **Code Reuse**

- Shared disposal and signal logic in `@tempots/core`
- Common patterns across all rendering contexts
- Consistent programming model

### 3. **Flexibility**

- Easy to add new rendering contexts
- Type-safe bridge patterns for cross-context composition
- Clean architecture without legacy constraints

### 4. **Performance**

- Zero runtime overhead for type branding (compile-time only)
- Efficient disposal tracking
- Context-specific optimizations

### 5. **Developer Experience**

- Familiar patterns across all contexts
- Clean, unambiguous type system
- Single source of truth for each type

---

## Open Questions

1. **Should signals live in `@tempots/core` or `@tempots/std`?**
   - Pro core: Signals are fundamental to the reactive model
   - Pro std: Keeps core minimal, signals are utilities

2. **How to handle context-specific events?**
   - DOM has `on.click()`, ThreeJS has `onFrame()`
   - Should there be a generic event system?

3. **Provider system scope**
   - Should providers work across context boundaries?
   - How to handle context-specific provider types?

4. **Testing strategy**
   - How to test cross-context bridges?
   - Mock contexts for unit testing?

5. **Bundle size concerns**
   - Should bridges be separate packages?
   - Tree-shaking strategy for multi-context apps?

---

## Next Steps

1. **Prototype `@tempots/core`**
   - Extract disposal and scope tracking
   - Define generic interfaces
   - Validate with existing `@tempots/dom` code

2. **Create `@tempots/three` proof of concept**
   - Implement basic ThreeJS context
   - Create mesh and material factories
   - Build DOM ↔ ThreeJS bridge

3. **Build example application**
   - Multi-context dashboard
   - Demonstrate type safety
   - Show bridge patterns in action

4. **Gather feedback**
   - Review with maintainers
   - Test with real-world use cases
   - Iterate on design

5. **Document migration guide**
   - Step-by-step instructions
   - Code examples
   - Common pitfalls and solutions
