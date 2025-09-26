# Tempo Architecture

This document provides an overview of the Tempo framework architecture, explaining the core concepts, design patterns, and how the different packages interact with each other.

## Core Concepts

### Renderables

At the heart of Tempo is the concept of a **Renderable**. A Renderable is a function that:

1. Takes a context (typically a DOM context)
2. Performs operations on that context (like creating DOM elements)
3. Returns a cleanup function that can be called to remove the rendered content

```typescript
type Renderable<C = DOMContext> = (ctx: C) => (removeTree: boolean) => void
```

This simple functional approach allows for composable UI components without the need for a virtual DOM or complex class hierarchies.

### Signals

Tempo uses a reactive programming model based on **Signals**. A Signal is an observable value that can notify listeners when it changes.

There are three main types of signals:

1. **Signal** - A read-only observable value
2. **Prop** - A writable signal that can be updated
3. **Computed** - A derived signal that depends on other signals

Signals automatically track dependencies and only update the UI when necessary, providing efficient fine-grained reactivity.

### Direct DOM Manipulation

Unlike many modern frameworks, Tempo directly manipulates the DOM rather than using a virtual DOM. This approach:

- Reduces memory usage and computational overhead
- Provides more predictable rendering behavior
- Allows for fine-grained control when needed

## System Architecture

### Package Structure

Tempo is organized into three main packages:

```
tempots/
├── packages/
│   ├── tempots-dom/    # Core UI framework
│   ├── tempots-std/    # Standard library utilities
│   └── tempots-ui/     # Higher-level UI components
└── demo/               # Example applications
```

### Data Flow

The data flow in a Tempo application follows these principles:

1. **Unidirectional Data Flow**: Data flows from signals to the UI
2. **Reactive Updates**: When a signal changes, only the affected parts of the UI update
3. **Automatic Dependency Tracking**: Signals automatically track their dependencies

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│             │       │             │       │             │
│    Props    │──────▶│  Computed   │──────▶│ Renderables │
│  (Writable) │       │  (Derived)  │       │   (View)    │
│             │       │             │       │             │
└─────────────┘       └─────────────┘       └─────────────┘
       ▲                                           │
       │                                           │
       │                                           │
       │                                           ▼
       │                                    ┌─────────────┐
       │                                    │             │
       └────────────────────────────────────│   Events    │
                                            │             │
                                            └─────────────┘
```

## Package Details

### @tempots/dom

The core UI framework that provides:

- **Renderable API**: The foundation for creating UI elements
- **Signal System**: Reactive state management
- **DOM Manipulation**: Direct DOM updates
- **Event Handling**: Declarative event binding
- **HTML/SVG/MathML Support**: Type-safe element creation

#### Key Components:

- `html`: Factory for creating HTML elements
- `render`: Function to render a Renderable to the DOM
- `prop`: Creates a writable signal
- `computed`: Creates a derived signal
- `attr`: Adds attributes to elements
- `on`: Adds event handlers to elements
- `When`, `ForEach`, etc.: Control flow renderables

### @tempots/std

A standard library of utility functions:

- **Array Utilities**: Functions for working with arrays
- **String Utilities**: String manipulation functions
- **Result Type**: Error handling with Result pattern
- **Async Utilities**: Async helpers and deferred promises
- **Validation**: Data validation utilities

### @tempots/ui

Higher-level UI components built on top of @tempots/dom:

- **UI Components**: Reusable UI elements
- **Routing**: Client-side routing system
- **Query Loading**: Async data loading with loading/error states
- **Form Helpers**: Input focus and selection utilities

## Design Patterns

### Functional Programming

Tempo embraces functional programming principles:

- **Pure Functions**: UI components are pure functions
- **Immutability**: State changes create new values
- **Composition**: Components compose together easily
- **Higher-Order Functions**: Functions that take or return functions

### Reactive Programming

The signal system implements reactive programming concepts:

- **Observable Values**: Signals can be observed for changes
- **Automatic Dependency Tracking**: Dependencies are tracked automatically
- **Push-Based Updates**: Changes propagate through the system

### Composition over Inheritance

Tempo favors composition over inheritance:

- UI components are composed from smaller functions
- No class hierarchies or inheritance chains
- Behavior is added through function composition

## Technical Decisions and Trade-offs

### Direct DOM Manipulation vs. Virtual DOM

**Decision**: Use direct DOM manipulation instead of a virtual DOM.

**Trade-offs**:
- **Pros**: Better performance for many use cases, smaller bundle size, more predictable behavior
- **Cons**: Less batching of updates, requires more careful handling of DOM operations

### Functional Approach vs. Class-Based Components

**Decision**: Use a functional approach with pure functions.

**Trade-offs**:
- **Pros**: Simpler mental model, better composition, easier testing
- **Cons**: Less familiar to developers used to class-based frameworks

### Fine-Grained Reactivity vs. Component-Based Reactivity

**Decision**: Use fine-grained reactivity with signals.

**Trade-offs**:
- **Pros**: More efficient updates, less unnecessary re-rendering
- **Cons**: Requires understanding of reactive programming concepts

## Integration Points

### Between @tempots/dom and @tempots/std

- @tempots/dom uses utility functions from @tempots/std
- Both packages share common types and interfaces

### Between @tempots/dom and @tempots/ui

- @tempots/ui builds higher-level components using @tempots/dom primitives
- @tempots/ui components follow the same Renderable pattern as @tempots/dom

## Conclusion

Tempo's architecture is designed around simplicity, performance, and type safety. By using a functional approach with direct DOM manipulation and fine-grained reactivity, it provides a lightweight yet powerful framework for building web applications.

The separation into three packages (@tempots/dom, @tempots/std, and @tempots/ui) allows developers to use only what they need, while still providing a cohesive development experience.
