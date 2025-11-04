# Automatic Signal Disposal - Technical Specification

## Overview

This document specifies the design and implementation of automatic signal disposal in Tempo using scope tracking. This feature eliminates the need for manual `OnDispose()` calls by automatically tracking signals created within renderables and disposing them when the renderable is cleared.

## Motivation

**Current Problem:**

```typescript
// ❌ Current: Manual disposal required
const MyComponent: Renderable = (ctx) => {
  const count = prop(0);
  const doubled = count.map((x) => x * 2);

  return Fragment(
    OnDispose(count.dispose), // Easy to forget!
    html.div(doubled)
  );
};
```

**Proposed Solution:**

```typescript
// ✅ New: Automatic disposal
const MyComponent: Renderable = (ctx) => {
  const count = prop(0);
  const doubled = count.map((x) => x * 2);

  return html.div(doubled);
  // Signals automatically disposed when component unmounts
};
```

## Quick Start

### 90% Use Case: Just Use Global Functions

In most cases, you don't need to think about scopes at all:

```typescript
const MyComponent: Renderable = (ctx) => {
  // ✅ Just use global functions - automatic tracking!
  const state = prop(0);
  const derived = state.map((x) => x * 2);
  const computed = computedOf(state, derived)((s, d) => s + d);

  effect(() => console.log(state.value), [state]);

  return html.div(state, derived, computed);
  // All signals automatically disposed when component unmounts
};
```

### 10% Use Case: Async Contexts Need Scope Methods

Only use `scope.*()` methods when creating signals in async contexts:

```typescript
const AsyncComponent: Renderable = WithScope((scope) => (ctx) => {
  const syncState = prop(0); // ✅ Global function in sync context

  setTimeout(() => {
    // ⚠️ Async context - use scope methods
    const asyncState = scope.prop(1);
    const derived = scope.computedOf(syncState, asyncState)((s, a) => s + a);
  }, 1000);

  return html.div(syncState);
});
```

**When to use what:**

- ✅ **Sync context** (directly in renderable body): Use global functions (`prop()`, `computed()`, `computedOf()`, etc.)
- ⚠️ **Async context** (setTimeout, fetch callbacks, event handlers): Use scope methods (`scope.prop()`, `scope.computedOf()`, etc.)
- 🔧 **Outlive component** (global state): Use `untracked(() => prop(...))` and dispose manually

## Core Concepts

### DisposalScope

A `DisposalScope` tracks signals created during its lifetime and disposes them when the scope ends.

````typescript
import type {
  Value,
  ValueTypes,
  ListenerOptions,
  AnySignal,
  Computed,
} from "@tempots/dom";

class DisposalScope {
  private _signals: Set<Signal<unknown>> = new Set();
  private _disposed: boolean = false;

  /**
   * Register a signal with this scope for automatic disposal.
   */
  track(signal: Signal<unknown>): void {
    if (this._disposed) {
      throw new Error("Cannot track signal in disposed scope");
    }
    if (signal.isDisposed()) {
      return; // Already disposed, nothing to do
    }
    this._signals.add(signal);
  }

  /**
   * Unregister a signal from this scope.
   */
  untrack(signal: Signal<unknown>): void {
    this._signals.delete(signal);
  }

  /**
   * Dispose all tracked signals and clear the scope.
   */
  dispose(): void {
    if (this._disposed) return;
    this._disposed = true;

    for (const signal of this._signals) {
      signal.dispose();
    }
    this._signals.clear();
  }

  /**
   * Check if this scope has been disposed.
   */
  get disposed(): boolean {
    return this._disposed;
  }

  /**
   * Create a prop signal and automatically track it in this scope.
   * Useful for creating signals in async contexts where the global scope might have changed.
   *
   * @param value - Initial value
   * @param equals - Equality function (optional)
   * @returns A new Prop signal tracked in this scope
   */
  prop<T>(value: T, equals?: (a: T, b: T) => boolean): Prop<T> {
    const signal = untracked(() => prop(value, equals));
    this.track(signal);
    return signal;
  }

  /**
   * Create a computed signal and automatically track it in this scope.
   * Follows the same signature as the global computed function.
   * Useful for creating computed signals in async contexts where the global scope might have changed.
   *
   * @param fn - Computation function
   * @param dependencies - Array of signals that the computed value depends on
   * @param equals - Equality function (optional)
   * @returns A new computed signal tracked in this scope
   */
  computed<T>(
    fn: () => T,
    dependencies: Array<AnySignal>,
    equals?: (a: T, b: T) => boolean
  ): Computed<T> {
    const signal = untracked(() => computed(fn, dependencies, equals));
    this.track(signal);
    return signal;
  }

  /**
   * Create an effect and automatically track it in this scope.
   * Follows the same signature as the global effect function.
   * Useful for creating effects in async contexts where the global scope might have changed.
   *
   * @param fn - Effect function
   * @param signals - Array of signals to watch for changes
   * @param options - Listener options (optional)
   * @returns Dispose function
   */
  effect(
    fn: () => void,
    signals: Array<AnySignal>,
    options?: ListenerOptions
  ): () => void {
    const dispose = untracked(() => effect(fn, signals, options));
    // Effects don't have a signal to track, but we can track the dispose function
    // by wrapping it in a disposable object
    const disposable = {
      dispose,
    } as Signal<unknown>;
    this.track(disposable);
    return dispose;
  }

  /**
   * Create a computed signal from multiple signals/values.
   * Follows the same curried signature as the global computedOf function.
   * Useful for combining signals in async contexts where the global scope might have changed.
   *
   * @param args - Signals or literal values to combine
   * @returns A function that takes the computation function and returns a computed signal
   *
   * @example
   * ```typescript
   * setTimeout(() => {
   *   const sum = scope.computedOf(a, b)((a, b) => a + b);
   * }, 1000);
   * ```
   */
  computedOf<T extends Value<unknown>[]>(...args: T) {
    return <O>(
      fn: (...args: ValueTypes<T>) => O,
      equals?: (a: O, b: O) => boolean
    ): Signal<O> => {
      const signal = untracked(() => computedOf(...args)(fn, equals));
      this.track(signal);
      return signal;
    };
  }

  /**
   * Create an effect from multiple signals/values.
   * Follows the same curried signature as the global effectOf function.
   * Useful for creating effects in async contexts where the global scope might have changed.
   *
   * @param args - Signals or literal values to observe
   * @returns A function that takes the effect function and returns a dispose function
   *
   * @example
   * ```typescript
   * setTimeout(() => {
   *   scope.effectOf(a, b)((a, b) => {
   *     console.log('Values:', a, b);
   *   });
   * }, 1000);
   * ```
   */
  effectOf<T extends Value<unknown>[]>(...args: T) {
    return (
      fn: (...args: ValueTypes<T>) => void,
      options?: ListenerOptions
    ): (() => void) => {
      const dispose = untracked(() => effectOf(...args)(fn, options));
      const disposable = {
        dispose,
      } as Signal<unknown>;
      this.track(dispose);
      return dispose;
    };
  }
}
````

### Global Scope Tracking

A module-level stack tracks the currently active scopes:

````typescript
// In packages/tempots-dom/src/std/scope.ts

/**
 * Stack of active disposal scopes.
 * The last element is the current scope.
 * @internal
 */
let scopeStack: DisposalScope[] = [];

/**
 * Get the currently active disposal scope, if any.
 * @returns The current scope or null if no scope is active.
 * @public
 */
export const getCurrentScope = (): DisposalScope | null => {
  return scopeStack[scopeStack.length - 1] ?? null;
};

/**
 * Push a scope onto the stack (internal use only).
 * @internal
 */
const pushScope = (scope: DisposalScope): void => {
  scopeStack.push(scope);
};

/**
 * Pop a scope from the stack (internal use only).
 * @internal
 */
const popScope = (): void => {
  scopeStack.pop();
};

/**
 * Execute a function within a scope context.
 * Automatically manages push/pop with proper error handling.
 *
 * The scope is pushed before executing the function and popped after,
 * but NOT disposed. The caller is responsible for disposing the scope
 * when appropriate.
 *
 * @param scope - The scope to activate
 * @param fn - Function to execute within the scope
 * @returns The result of the function
 * @internal
 */
export const withScope = <T>(scope: DisposalScope, fn: () => T): T => {
  pushScope(scope);
  try {
    return fn();
  } finally {
    popScope();
  }
};

/**
 * Execute a function within a new scope that is automatically disposed.
 *
 * Creates a new scope, executes the function, and disposes the scope
 * when the function completes (or throws). Use this for scopes that
 * don't need to outlive the function execution.
 *
 * @param fn - Function to execute, receives the scope as parameter
 * @returns The result of the function
 * @public
 */
export const scoped = <T>(fn: (scope: DisposalScope) => T): T => {
  const scope = new DisposalScope();
  pushScope(scope);
  try {
    return fn(scope);
  } finally {
    popScope();
    scope.dispose();
  }
};

/**
 * Helper Comparison:
 *
 * - `withScope(scope, fn)` - Use when the scope needs to outlive the function.
 *   The caller creates and disposes the scope. Used internally by renderables.
 *
 * - `scoped(fn)` - Use when the scope should be disposed immediately after
 *   the function completes. Convenient for one-off scoped operations.
 *
 * - `scope.prop()`, `scope.computed()`, `scope.computedOf()`, `scope.effect()`,
 *   `scope.effectOf()` - Use in async contexts (setTimeout, fetch callbacks, event
 *   handlers) where the global currentScope might have changed. In sync contexts,
 *   prefer the global functions or signal methods for simplicity.
 *
 * Example:
 * ```typescript
 * // withScope - scope outlives the function
 * const scope = new DisposalScope();
 * const result = withScope(scope, () => {
 *   const signal = prop(0);  // Tracked in scope
 *   return signal;
 * });
 * // scope is still alive, dispose it later
 * scope.dispose();
 *
 * // scoped - scope disposed immediately
 * const result = scoped((scope) => {
 *   const signal = prop(0);  // Tracked in scope
 *   return signal.value;
 * });
 * // scope is already disposed here
 *
 * // Scope methods - for async contexts
 * WithScope((scope) => (ctx) => {
 *   const count = prop(0);  // ✅ Use global prop() in sync context
 *   const doubled = count.map(x => x * 2);  // ✅ Use signal.map() in sync context
 *
 *   setTimeout(() => {
 *     const async = scope.prop(1);  // ✅ Use scope.prop() in async context
 *     const derived = scope.computedOf(count, async)((c, a) => c * a);  // ✅ Curried signature
 *
 *     scope.effectOf(count, async)((c, a) => {  // ✅ Curried signature
 *       console.log('Count:', c, 'Async:', a);
 *     });
 *   }, 1000);
 *
 *   return html.div(count, doubled, async);
 * });
 * ```
 */

/**
 * Get the full scope stack.
 * Useful for debugging scope hierarchy.
 *
 * @advanced Most users don't need this. Use getCurrentScope() instead.
 * @returns Read-only array of active scopes
 * @public
 */
export const getScopeStack = (): readonly DisposalScope[] => {
  return scopeStack;
};

/**
 * Get the parent scope of the current scope.
 *
 * @advanced Most users don't need this. Accessing parent scopes can lead to
 * unexpected behavior. Only use this for debugging or advanced use cases.
 * @returns The parent scope or null if no parent exists
 * @public
 */
export const getParentScope = (): DisposalScope | null => {
  return scopeStack[scopeStack.length - 2] ?? null;
};
````

### Why an Explicit Stack?

The explicit stack approach (vs. a single `currentScope` variable) provides several benefits:

**1. Better Debugging**

```typescript
// Inspect the full scope hierarchy
const stack = getScopeStack();
console.log(`Scope depth: ${stack.length}`);

// Access parent scope for advanced debugging
const parent = getParentScope();
```

**2. Safer Error Handling**
The `withScope()` helper ensures push/pop are always matched via try/finally, preventing scope leaks:

```typescript
// ❌ Manual approach - easy to forget popScope() on error
pushScope(scope);
doWork(); // If this throws, popScope() is never called!
popScope();

// ✅ withScope() - automatic cleanup even on error
withScope(scope, () => doWork());
```

**3. Cleaner Code**
No need to manually save/restore scope:

```typescript
// ❌ Manual approach
const previousScope = getCurrentScope();
setCurrentScope(scope);
try {
  // work
} finally {
  setCurrentScope(previousScope);
}

// ✅ withScope() approach
withScope(scope, () => {
  // work
});
```

**4. Future Extensibility**

- Access parent scopes for advanced use cases
- Scope transfer capabilities
- Depth warnings for infinite recursion detection

## API Design

### Modified Signal Creation Functions

All signal creation functions (`prop`, `computed`, `effect`, etc.) automatically register with the current scope:

```typescript
// In packages/tempots-dom/src/std/signal.ts

export const prop = <T>(
  value: T,
  equals: (a: T, b: T) => boolean = (a, b) => a === b
): Prop<T> => {
  const signal = new Prop(value, equals);

  // Auto-register with current scope
  const scope = getCurrentScope();
  if (scope !== null) {
    scope.track(signal);
  }

  return signal;
};

export const computed = <T>(
  fn: () => T,
  equals?: (a: T, b: T) => boolean
): Computed<T> => {
  const signal = new Computed(fn, equals);

  // Auto-register with current scope
  const scope = getCurrentScope();
  if (scope !== null) {
    scope.track(signal);
  }

  return signal;
};

// Similar changes for effect(), derivedProp(), etc.
```

### WithScope Helper

Creates a new disposal scope for a renderable, providing both implicit and explicit scope access:

````typescript
/**
 * Creates a renderable with its own disposal scope.
 *
 * Signals created within the function are automatically tracked and disposed
 * when the renderable is cleared. The scope is also passed as a parameter
 * for explicit tracking of async signals.
 *
 * @example
 * ```typescript
 * WithScope((scope) => (ctx) => {
 *   const count = prop(0)  // Auto-tracked (sync context)
 *
 *   setTimeout(() => {
 *     // Use scope.prop() in async contexts where currentScope might have changed
 *     const delayed = scope.prop(1)  // Automatically tracked in scope
 *   }, 1000)
 *
 *   return html.div(count, delayed)
 * })
 * ```
 *
 * @param fn - Function that receives the scope and returns a renderable
 * @returns A renderable with automatic disposal
 * @public
 */
export const WithScope = <T extends DOMContext>(
  fn: (scope: DisposalScope) => Renderable<T>
): Renderable<T> => {
  return (ctx: T) => {
    const scope = new DisposalScope();

    const clear = withScope(scope, () => {
      const renderable = fn(scope);
      return renderable(ctx);
    });

    return (removeTree: boolean) => {
      clear(removeTree);
      scope.dispose();
    };
  };
};
````

### untracked Function

Executes a function without scope tracking, for signals that should outlive the current scope:

````typescript
/**
 * Executes a function without automatic scope tracking.
 *
 * Signals created within this function will NOT be automatically disposed.
 * Use this for signals that need to outlive the current scope, but remember
 * to dispose them manually.
 *
 * @example
 * ```typescript
 * const MyComponent: Renderable = (ctx) => {
 *   const tracked = prop(0)  // Auto-disposed
 *
 *   const global = untracked(() => {
 *     return prop(1)  // NOT auto-disposed
 *   })
 *
 *   // Must dispose global manually later
 *   return Fragment(
 *     OnDispose(global),
 *     html.div(tracked, global)
 *   )
 * }
 * ```
 *
 * @param fn - Function to execute without tracking
 * @returns The result of the function
 * @public
 */
export const untracked = <T>(fn: () => T): T => {
  // Save the entire stack and clear it
  const savedStack = scopeStack;
  scopeStack = [];

  try {
    return fn();
  } finally {
    // Restore the stack
    scopeStack = savedStack;
  }
};
````

## Implementation Points

### 1. Top-Level Render

Modify `renderWithContext` to create a scope:

```typescript
// In packages/tempots-dom/src/renderable/render.ts

export const renderWithContext = (renderable: Renderable, ctx: DOMContext) => {
  const scope = new DisposalScope();

  const clear = withScope(scope, () => renderable(ctx));

  return (removeTree: boolean = true) => {
    clear(removeTree);
    scope.dispose();
  };
};
```

### 2. Reactive Renderables (When/Unless)

Modify `createReactiveRenderable` to create a scope for each branch:

```typescript
// In packages/tempots-dom/src/renderable/utils.ts

export const createReactiveRenderable = <T>(
  ctx: DOMContext,
  signal: Signal<T>,
  render: (value: T) => TNode
): Clear => {
  const newCtx = ctx.makeRef();
  let clear: Clear = () => {};
  let scope: DisposalScope | null = null;

  const disposeHandler = signal.on((value) => {
    // Dispose old scope
    clear(true);
    if (scope !== null) {
      scope.dispose();
    }

    // Create new scope for new branch
    scope = new DisposalScope();
    clear = withScope(scope, () => renderableOfTNode(render(value))(newCtx));
  });

  return (removeTree: boolean) => {
    clear(removeTree);
    if (scope !== null) {
      scope.dispose();
    }
    disposeHandler();
    newCtx.clear(removeTree);
  };
};
```

### 3. Repeat Iterations

Modify `Repeat` to create a scope for each iteration:

```typescript
// In packages/tempots-dom/src/renderable/repeat.ts

export const Repeat = (
  times: Value<number>,
  element: (index: ElementPosition) => TNode,
  separator?: (pos: ElementPosition) => TNode
): Renderable => {
  // Handle separator case...

  return (ctx: DOMContext) => {
    const length = times.derive();
    const newCtx = ctx.makeRef();
    const clears: Clear[] = [];
    const scopes: DisposalScope[] = [];

    length.on((newLength) => {
      // Remove excess iterations
      const toRemove = clears.splice(newLength);
      const scopesToRemove = scopes.splice(newLength);

      for (let i = 0; i < toRemove.length; i++) {
        toRemove[i](true);
        scopesToRemove[i].dispose();
      }

      // Add new iterations
      for (let i = clears.length; i < newLength; i++) {
        const pos = new ElementPosition(i, length);
        const scope = new DisposalScope();

        const clear = withScope(scope, () =>
          Fragment(
            OnDispose(pos.dispose),
            renderableOfTNode(element(pos))
          )(newCtx)
        );

        clears.push(clear);
        scopes.push(scope);
      }
    });

    return (removeTree: boolean) => {
      length.dispose();
      for (let i = 0; i < clears.length; i++) {
        clears[i](removeTree);
        scopes[i].dispose();
      }
      clears.length = 0;
      scopes.length = 0;
      newCtx.clear(removeTree);
    };
  };
};
```

### 4. ForEach Simplification

With automatic scoping, `ForEach` can be simplified by removing manual disposal:

```typescript
// In packages/tempots-dom/src/renderable/foreach.ts

export const ForEach = <T>(
  value: Value<T[]>,
  item: (value: Signal<T>, position: ElementPosition) => TNode,
  separator?: (pos: ElementPosition) => TNode
): Renderable => {
  const times = Value.map(value, (arr) => arr.length);
  const arr = Value.toSignal(value);
  return Repeat(
    times,
    (pos) => {
      const signal = arr.map((v) => v[pos.index]);
      // OnDispose removed - signal automatically disposed by Repeat's scope!
      return renderableOfTNode(item(signal, pos));
    },
    separator
  );
};
```

## Scope Hierarchy Examples

### Example 0: Automatic Tracking (Most Common Case)

In most cases, you don't need to think about scopes at all. Just create signals using the global functions and they're automatically tracked and disposed:

```typescript
const Counter: Renderable = (ctx) => {
  // All signals created here are automatically tracked
  const count = prop(0);
  const doubled = count.map((x) => x * 2);
  const tripled = computed(() => count.value * 3, [count]);

  // Effects are also automatically tracked
  effect(() => {
    console.log("Count changed:", count.value);
  }, [count]);

  return html.div(
    html.button(
      on.click(() => count.value++),
      "Increment"
    ),
    html.div("Count: ", count),
    html.div("Doubled: ", doubled),
    html.div("Tripled: ", tripled)
  );
  // All signals automatically disposed when component unmounts
};

const TodoItem: Renderable = (ctx) => {
  // Each component instance gets its own scope
  const completed = prop(false);
  const editing = prop(false);
  const text = prop("New todo");

  // Derived signals are also auto-tracked
  const displayText = computedOf(
    text,
    editing
  )((t, e) => (e ? `Editing: ${t}` : t));

  return html.div(
    html.input(attr.type("checkbox"), attr.checked(completed)),
    html.span(displayText),
    html.button(
      on.click(() => (editing.value = !editing.value)),
      "Edit"
    )
  );
  // All signals disposed when this todo is removed
};
```

**Key Points:**

- ✅ Use global functions: `prop()`, `computed()`, `computedOf()`, `effect()`, `effectOf()`
- ✅ No manual disposal needed
- ✅ No `OnDispose()` calls
- ✅ No `scope.*()` methods needed (unless in async contexts)
- ✅ Signals automatically disposed when component unmounts

### Example 1: Simple Component

```typescript
const Counter: Renderable = (ctx) => {
  const count = prop(0); // Tracked in top-level scope

  return html.div(
    html.button(
      on.click(() => count.value++),
      "Increment"
    ),
    html.span(count)
  );
};

render(Counter, document.body);
```

**Scope hierarchy:**

```
renderWithContext
  └─ scope1 (top-level)
      └─ count signal ✅
```

### Example 2: Conditional Rendering

```typescript
const Conditional: Renderable = (ctx) => {
  const show = prop(true);

  return html.div(
    html.button(
      on.click(() => (show.value = !show.value)),
      "Toggle"
    ),
    When(
      show,
      () => {
        const message = prop("Hello"); // Tracked in branch scope
        return html.div(message);
      },
      () => {
        const alt = prop("Goodbye"); // Tracked in different branch scope
        return html.div(alt);
      }
    )
  );
};
```

**Scope hierarchy:**

```
renderWithContext
  └─ scope1 (top-level)
      ├─ show signal ✅
      └─ When
          └─ createReactiveRenderable
              ├─ scope2 (then branch - when show is true)
              │   └─ message signal ✅
              └─ scope3 (else branch - when show is false)
                  └─ alt signal ✅
```

When `show` changes, the old branch's scope is disposed (disposing its signals), and a new scope is created for the new branch.

### Example 3: Dynamic List

```typescript
const TodoList: Renderable = (ctx) => {
  const todos = prop([
    { id: 1, text: "Learn Tempo" },
    { id: 2, text: "Build app" },
  ]);

  return ForEach(todos, (todo, pos) => {
    const completed = prop(false); // Tracked in item scope
    return html.div(
      html.input(attr.type("checkbox"), attr.checked(completed)),
      html.span(todo.map((t) => t.text))
    );
  });
};
```

**Scope hierarchy:**

```
renderWithContext
  └─ scope1 (top-level)
      ├─ todos signal ✅
      └─ ForEach → Repeat
          ├─ scope2 (item 0)
          │   ├─ completed signal ✅
          │   └─ todo.map(...) signal ✅
          └─ scope3 (item 1)
              ├─ completed signal ✅
              └─ todo.map(...) signal ✅
```

When an item is removed from the array, its scope is disposed (disposing all signals created for that item).

### Example 4: Async Signals with Scope Methods

```typescript
const AsyncComponent: Renderable = WithScope((scope) => (ctx) => {
  const syncData = prop("initial"); // Auto-tracked (sync context)
  const asyncData = prop<string | null>(null); // Auto-tracked (sync context)

  // Fetch data asynchronously
  fetch("/api/data")
    .then((res) => res.text())
    .then((data) => {
      // Use scope methods in async context where currentScope might have changed
      const delayed = scope.prop(data);
      const length = scope.prop(data.length);

      // Combine multiple signals using curried signature
      const processed = scope.computedOf(
        delayed,
        length
      )((d, len) => `${d.toUpperCase()} (${len} chars)`);

      scope.effectOf(processed)((value) => {
        console.log("Processed data:", value);
      });

      asyncData.value = data;
    });

  // Event handler - also an async context
  const handleClick = () => {
    setTimeout(() => {
      const timestamp = scope.prop(Date.now());
      const count = scope.prop(0);

      // Using scope.computed() with explicit dependencies
      const formatted = scope.computed(
        () =>
          `${new Date(timestamp.value).toISOString()} - Count: ${count.value}`,
        [timestamp, count]
      );

      // Using scope.effect() with explicit signals
      scope.effect(() => {
        console.log("Formatted:", formatted.value);
      }, [formatted]);

      console.log("Clicked at:", formatted.value);
    }, 100);
  };

  return html.div(
    syncData,
    asyncData,
    html.button(on.click(handleClick), "Click me")
  );
});
```

**Note:** In async contexts (setTimeout, fetch callbacks, event handlers), use scope methods instead of global functions:

- `scope.prop(value)` instead of `prop(value)`
- `scope.computed(fn, deps)` instead of `computed(fn, deps)`
- `scope.computedOf(a, b)((a, b) => ...)` instead of `computedOf(a, b)((a, b) => ...)`
- `scope.effect(fn, signals)` instead of `effect(fn, signals)`
- `scope.effectOf(a, b)((a, b) => ...)` instead of `effectOf(a, b)((a, b) => ...)`

This is necessary because the global `currentScope` may have changed by the time the async callback executes.

### Example 5: Untracked Signals

```typescript
// Global signal that outlives components
const globalTheme = untracked(() => prop<"light" | "dark">("light"));

const ThemedComponent: Renderable = (ctx) => {
  const localState = prop(0); // Auto-tracked, disposed with component

  return html.div(
    attr.class(globalTheme.map((t) => `theme-${t}`)),
    html.span(localState)
  );
};

// globalTheme must be disposed manually when no longer needed
// globalTheme.dispose()
```

## Breaking Changes

### Removed/Deprecated APIs

1. **`OnDispose()` is deprecated** - signals are now automatically disposed
2. **Manual `.dispose()` calls are discouraged** - let scopes handle disposal

**Note:** `OnDispose(signal.dispose)` and `OnDispose(signal)` are equivalent and both valid. The latter is preferred as it's more concise.

### Migration Guide

**Before:**

```typescript
const MyComponent: Renderable = (ctx) => {
  const signal1 = prop(0);
  const signal2 = signal1.map((v) => v * 2);

  return Fragment(
    OnDispose(signal1, signal2), // or OnDispose(signal1.dispose, signal2.dispose)
    html.div(signal2)
  );
};
```

**After:**

```typescript
const MyComponent: Renderable = (ctx) => {
  const signal1 = prop(0);
  const signal2 = signal1.map((v) => v * 2);

  return html.div(signal2);
  // Signals automatically disposed when component unmounts
};
```

**Special Cases:**

If you need a signal to outlive the component, use `untracked()`:

```typescript
const MyComponent: Renderable = (ctx) => {
  const persistent = untracked(() => prop(0));

  // Must dispose manually later
  return Fragment(OnDispose(persistent), html.div(persistent));
};
```

## Edge Cases and Considerations

### 1. Signals Created at Module Level

Signals created outside any renderable are NOT tracked:

```typescript
// ❌ Not tracked - created at module level
const globalCounter = prop(0);

const MyComponent: Renderable = (ctx) => {
  // ✅ Tracked - created inside renderable
  const localCounter = prop(0);

  return html.div(globalCounter, localCounter);
};

// globalCounter must be disposed manually
```

### 2. Signals Created in Async Callbacks

Signals created in async callbacks (setTimeout, fetch, etc.) are NOT automatically tracked because they execute outside the scope context:

```typescript
const MyComponent: Renderable = WithScope((scope) => (ctx) => {
  const immediate = prop(0); // ✅ Auto-tracked

  setTimeout(() => {
    const delayed = prop(1); // ❌ NOT auto-tracked (created outside scope)
    scope.track(delayed); // ✅ Explicitly track
  }, 1000);

  return html.div(immediate, delayed);
});
```

### 3. Derived Signals

Derived signals (created via `.map()`, `.filter()`, etc.) are automatically disposed when their parent is disposed via the existing `setDerivative()` mechanism. They are ALSO tracked in the current scope:

```typescript
const MyComponent: Renderable = (ctx) => {
  const count = prop(0);
  const doubled = count.map((x) => x * 2);

  // Both count and doubled are tracked in the scope
  // When scope is disposed:
  //   1. count.dispose() is called (by scope)
  //   2. This triggers doubled.dispose() (via setDerivative)
  // So doubled is disposed twice, but that's safe (dispose is idempotent)

  return html.div(doubled);
};
```

**Optimization consideration:** We could skip tracking derived signals in the scope since they're already disposed via `setDerivative()`. However, this adds complexity and the double-disposal is harmless.

### 4. Scope Nesting

Scopes can be nested. A signal is only tracked in the innermost active scope:

```typescript
const Outer: Renderable = (ctx) => {
  const outer = prop(0); // Tracked in outer scope

  return WithScope((innerScope) => (ctx) => {
    const inner = prop(1); // Tracked in inner scope

    return html.div(outer, inner);
  })(ctx);
};
```

When the inner scope is disposed, only `inner` is disposed. When the outer scope is disposed, `outer` is disposed.

## ESLint Plugin Considerations

### Option 1: Keep and Update the Plugin

**Rationale:** The plugin is still useful for detecting edge cases and enforcing best practices.

**Required Changes:**

1. **Remove warnings for signals in renderables** - they're now auto-tracked
2. **Add warning for `OnDispose()` usage** - it's deprecated
3. **Add warning for signals at module level** - they're not auto-tracked
4. **Add warning for signals in `untracked()`** - they need manual disposal
5. **Add warning for async signal creation** - suggest using `WithScope` with explicit tracking

**New Rules:**

```javascript
// ✅ No warning - auto-tracked
const MyComponent: Renderable = (ctx) => {
  const signal = prop(0)
  return html.div(signal)
}

// ⚠️ Warning: OnDispose is deprecated
const MyComponent: Renderable = (ctx) => {
  const signal = prop(0)
  return Fragment(
    OnDispose(signal),  // ← Warn here (both OnDispose(signal) and OnDispose(signal.dispose) are valid)
    html.div(signal)
  )
}

// ⚠️ Warning: Signal created at module level
const globalSignal = prop(0)  // ← Warn here

// ⚠️ Warning: Signal in untracked() needs manual disposal
const MyComponent: Renderable = (ctx) => {
  const signal = untracked(() => prop(0))  // ← Warn here
  return html.div(signal)  // Missing OnDispose
}

// ✅ No warning - explicitly disposed
const MyComponent: Renderable = (ctx) => {
  const signal = untracked(() => prop(0))
  return Fragment(
    OnDispose(signal),  // Both OnDispose(signal) and OnDispose(signal.dispose) work
    html.div(signal)
  )
}

// ⚠️ Warning: Use scope.prop() in async context
const AsyncComponent: Renderable = WithScope((scope) => (ctx) => {
  setTimeout(() => {
    const delayed = prop(1)  // ← Warn: suggest scope.prop(1)
  }, 1000)
  return html.div()
})

// ✅ No warning - using scope.prop() in async context
const AsyncComponent: Renderable = WithScope((scope) => (ctx) => {
  setTimeout(() => {
    const delayed = scope.prop(1)  // ← Correct
  }, 1000)
  return html.div()
})

// ⚠️ Warning: Use prop() instead of scope.prop() in sync context
const SyncComponent: Renderable = WithScope((scope) => (ctx) => {
  const signal = scope.prop(0)  // ← Warn: suggest prop(0) for simplicity
  return html.div(signal)
})

// ✅ No warning - using prop() in sync context
const SyncComponent: Renderable = (ctx) => {
  const signal = prop(0)  // ← Correct (simpler)
  return html.div(signal)
}
```

### Option 2: Deprecate the Plugin

**Rationale:** With automatic disposal, most manual disposal issues are eliminated.

**Considerations:**

- Edge cases (module-level signals, untracked signals) would not be caught
- Users might create memory leaks without realizing it
- Loss of enforcement for best practices

### Recommendation

**Keep and update the plugin** with the following priorities:

1. **High Priority:**
   - Warn on `OnDispose()` usage (suggest removal)
   - Warn on module-level signal creation (suggest moving into renderable or using `untracked()` with manual disposal)
   - Warn on `prop()` in async contexts (suggest `scope.prop()` instead)
   - Warn on `computed(fn, deps)` in async contexts (suggest `scope.computed(fn, deps)` instead)
   - Warn on `effect(fn, signals)` in async contexts (suggest `scope.effect(fn, signals)` instead)
   - Warn on `computedOf(...)` in async contexts (suggest `scope.computedOf(...)` instead)
   - Warn on `effectOf(...)` in async contexts (suggest `scope.effectOf(...)` instead)
   - Warn on `scope.*()` methods in sync contexts (suggest global functions for simplicity)

2. **Medium Priority:**
   - Warn on signals in `untracked()` without corresponding disposal
   - Suggest `WithScope` for components with async signal creation

3. **Low Priority:**
   - Detect complex patterns where automatic disposal might not work as expected

**Async vs Sync Context Detection:**

The plugin should detect async contexts such as:

- `setTimeout`, `setInterval` callbacks
- `fetch().then()`, `Promise.then()` callbacks
- Event handler callbacks (`addEventListener`, `onClick`, etc.)
- `requestAnimationFrame` callbacks

In these contexts:

- ⚠️ `prop(value)` → suggest `scope.prop(value)`
- ⚠️ `computed(fn, deps)` → suggest `scope.computed(fn, deps)`
- ⚠️ `effect(fn, signals)` → suggest `scope.effect(fn, signals)`
- ⚠️ `computedOf(a, b)((a, b) => ...)` → suggest `scope.computedOf(a, b)((a, b) => ...)`
- ⚠️ `effectOf(a, b)((a, b) => ...)` → suggest `scope.effectOf(a, b)((a, b) => ...)`
- ✅ All `scope.*()` methods → correct

In sync contexts (directly in renderable body):

- ✅ `prop(value)`, `computed(fn, deps)`, `effect(fn, signals)`, `computedOf(...)`, `effectOf(...)` → correct (simpler)
- ⚠️ `scope.*()` methods → suggest using global functions (unnecessary complexity)

## Testing Strategy

### Unit Tests

1. **Scope creation and disposal:**
   - Test that scopes are created at lifecycle boundaries
   - Test that signals are tracked in the correct scope
   - Test that signals are disposed when scope is disposed

2. **Nested scopes:**
   - Test that inner scopes don't affect outer scopes
   - Test that signals are tracked in the innermost scope

3. **Edge cases:**
   - Test signals created at module level (not tracked)
   - Test signals in `untracked()` (not tracked)
   - Test async signal creation with explicit tracking
   - Test derived signals (double disposal is safe)

### Integration Tests

1. **Component lifecycle:**
   - Test that signals are disposed when component unmounts
   - Test that signals in `When` branches are disposed when branch changes
   - Test that signals in `ForEach` items are disposed when items are removed

2. **Memory leak detection:**
   - Use browser dev tools to verify no memory leaks
   - Test with large lists and frequent updates

### Demo Updates

Update all demos to remove `OnDispose()` calls and verify they still work correctly:

1. Counter demo
2. TodoMVC demo
3. 7GUIs demos
4. HNPWA demo

## Implementation Checklist

### Core Scope Infrastructure

- [ ] Create `DisposalScope` class in `packages/tempots-dom/src/std/scope.ts`
  - [ ] Implement `track(signal)` method
  - [ ] Implement `untrack(signal)` method
  - [ ] Implement `dispose()` method
  - [ ] Implement `scope.prop(value, equals?)` helper method
  - [ ] Implement `scope.computed(fn, equals?)` helper method
  - [ ] Implement `scope.computedOf(signal, fn, equals?)` helper method
  - [ ] Implement `scope.effect(fn)` helper method
  - [ ] Implement `scope.effectOf(signal, fn)` helper method
- [ ] Add global scope stack (`scopeStack: DisposalScope[]`)
- [ ] Implement `getCurrentScope()` - returns top of stack
- [ ] Implement `pushScope()` and `popScope()` (internal)
- [ ] Implement `withScope(scope, fn)` - manages push/pop with try/finally
- [ ] Implement `scoped(fn)` - creates, pushes, executes, pops, and disposes
- [ ] Implement `getScopeStack()` - returns full stack for debugging
- [ ] Implement `getParentScope()` - returns parent scope for advanced use cases

### Signal Auto-Registration

- [ ] Modify `prop()` to auto-register with current scope
- [ ] Modify `computed()` to auto-register with current scope
- [ ] Modify `effect()` to auto-register with current scope
- [ ] Modify `derivedProp()` to auto-register with current scope
- [ ] Modify any other signal creation functions

### Renderable Updates

- [ ] Modify `renderWithContext()` to use `withScope()`
- [ ] Modify `createReactiveRenderable()` to use `withScope()` per branch
- [ ] Modify `Repeat()` to use `withScope()` per iteration
- [ ] Simplify `ForEach()` by removing manual `OnDispose(signal.dispose)`

### Public API

- [ ] Implement `WithScope()` helper using `withScope()`
- [ ] Implement `untracked()` helper (saves/restores stack)
- [ ] Export public APIs from main package

### Testing

- [ ] Write unit tests for `DisposalScope` class
  - [ ] Test `track()` and `untrack()` methods
  - [ ] Test `dispose()` disposes all tracked signals
  - [ ] Test `scope.prop()` creates and tracks signal
  - [ ] Test `scope.computed()` creates and tracks signal
  - [ ] Test `scope.computedOf()` creates and tracks derived signal
  - [ ] Test `scope.effect()` creates and tracks effect
  - [ ] Test `scope.effectOf()` creates and tracks signal listener
- [ ] Write unit tests for scope stack operations
- [ ] Write unit tests for `withScope()` and `scoped()`
- [ ] Write unit tests for signal auto-registration
- [ ] Write unit tests for nested scopes
- [ ] Write unit tests for `untracked()`
- [ ] Write unit tests for async signal creation with `scope.prop()`
- [ ] Write integration tests for component lifecycle
- [ ] Write integration tests for When/Unless branches
- [ ] Write integration tests for ForEach/Repeat
- [ ] Verify no memory leaks with browser dev tools

### Documentation & Tooling

- [ ] Update all demos to remove `OnDispose()` calls
- [ ] Update README with automatic disposal examples
- [ ] Update API documentation
- [ ] Update migration guide
- [ ] Update ESLint plugin rules
  - [ ] Warn on `OnDispose()` usage
  - [ ] Warn on module-level signal creation
  - [ ] Warn on `prop()` in async contexts (suggest `scope.prop()`)
  - [ ] Warn on `scope.prop()` in sync contexts (suggest `prop()`)
- [ ] Update CHANGELOG.md with breaking changes

### Release

- [ ] Verify all tests pass
- [ ] Verify no memory leaks in demos
- [ ] Publish new major version

## Timeline Estimate

- **Phase 1: Core Implementation** (2-3 days)
  - DisposalScope class
  - Global scope stack (scopeStack array)
  - Stack operations (pushScope, popScope, getCurrentScope)
  - Helper functions (withScope, scoped, untracked)
  - Debugging helpers (getScopeStack, getParentScope)
  - Signal auto-registration

- **Phase 2: Renderable Updates** (2-3 days)
  - Modify renderWithContext to use withScope
  - Modify createReactiveRenderable to use withScope
  - Modify Repeat to use withScope
  - Simplify ForEach by removing manual disposal
  - Update WithScope to use withScope helper

- **Phase 3: Testing** (3-4 days)
  - Unit tests for DisposalScope
  - Unit tests for scope stack operations
  - Unit tests for withScope/scoped/untracked
  - Unit tests for signal auto-registration
  - Unit tests for nested scopes
  - Integration tests for component lifecycle
  - Integration tests for When/Unless/ForEach/Repeat
  - Demo updates (remove OnDispose calls)
  - Memory leak verification with browser dev tools

- **Phase 4: Documentation & Tooling** (1-2 days)
  - Update README and guides
  - Update API documentation
  - Update migration guide
  - Update ESLint plugin rules
  - Update CHANGELOG

**Total: 8-12 days**

## Open Questions

1. Should we optimize to skip tracking derived signals since they're already disposed via `setDerivative()`?
2. Should we add dev-mode warnings when signals are created outside a scope?
3. Should we provide a way to "transfer" a signal from one scope to another?
4. Should `WithScope` be the recommended pattern for all components, or only for those with async signals?
5. Should we add a `createRoot()` function (like Solid.js) for creating top-level scopes outside of renderables?
