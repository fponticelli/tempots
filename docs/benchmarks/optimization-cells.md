# Optimization: Cell Primitive

## Problem

Tempo's `Signal` is a full-featured reactive primitive with equality checking, computed derivatives, disposal tracking, and scope integration. This generality costs **~72-96 bytes per instance** plus lazily allocated arrays.

For many use cases — particularly in render loops — a much simpler reactive value would suffice: one that holds a value, notifies listeners on change, and nothing else. No equality checking, no computed chains, no disposal lifecycle, no scope tracking.

The benchmark's `valueProp` (row data) and many internal framework signals fit this pattern. They're created, subscribed to, updated, and eventually disposed externally by their owning scope. They never need custom equality, and their disposal is always managed by the `KeyedForEach` entry — not by the signal itself.

## Concept

A `Cell<T>` is a minimal reactive container:

```typescript
class Cell<T> {
  _value: T
  _listeners: Array<(value: T) => void> | null

  get(): T
  set(value: T): void
  listen(fn: (value: T) => void): () => void
  dispose(): void
}
```

That's it. No `equals`, no `_derivatives`, no `_onDisposeListeners`, no type brands, no auto-scope registration. The owning code is responsible for creating, subscribing, and disposing it explicitly.

### Cell vs Signal comparison

| Feature | Cell | Signal | Prop | Computed |
|---------|------|--------|------|----------|
| Hold a value | Yes | Yes | Yes | Yes |
| `.get()` / `.set()` | Yes | get only | Yes | get only |
| Notify on change | Yes | Yes | Yes | Yes |
| Equality check | **No** — always notifies | Yes | Yes | Yes |
| Computed dependencies | **No** | Yes | Yes | Yes (auto) |
| `.onDispose()` | **No** | Yes | Yes | Yes |
| Auto scope tracking | **No** | Yes (Computed) | No | Yes |
| `.map()` / `.filter()` / etc. | **No** | Yes | Yes | Yes |
| `.dispose()` cleanup | Nulls listeners | Full lifecycle | Full lifecycle | Full lifecycle |
| Instance size (est.) | **~40 bytes** | ~72 bytes | ~80 bytes | ~96 bytes |

## API Design

```typescript
// Factory function (mirrors prop() / signal() pattern)
function cell<T>(initialValue: T): Cell<T>

// Class
class Cell<T> {
  constructor(value: T)

  /** Read the current value */
  get(): T

  /** Write a new value and notify all listeners (no equality check) */
  set(value: T): void

  /** Update value using a transform function */
  update(fn: (current: T) => T): void

  /** Subscribe to value changes. Returns unsubscribe function. */
  listen(fn: (value: T) => void): () => void

  /** Subscribe but skip the initial call (like Signal.onChange) */
  onChange(fn: (value: T) => void): () => void

  /** Read value as a property (for ergonomics) */
  get value(): T
  set value(v: T)

  /** Dispose: null out listeners to prevent leaks */
  dispose(): void
}
```

### Interop with Signal

Cell is NOT a Signal. It doesn't extend Signal, doesn't participate in computed chains, and can't be passed to `.map()`. This is intentional — it's a lower-level primitive for framework internals and performance-critical paths.

For interop, provide conversion utilities:

```typescript
/** Create a Signal that mirrors a Cell's value */
function cellToSignal<T>(cell: Cell<T>): Signal<T>

/** Create a Cell that mirrors a Signal's value */
function signalToCell<T>(signal: Signal<T>): Cell<T>
```

## Usage in Framework Internals

### KeyedForEach valueProp

Currently each keyed entry creates a `Prop<T>` to hold the row data:

```typescript
// Current (render-kit.ts:564)
const valueProp = prop(value)

// Proposed
const valueCell = cell(value)
```

The `valueProp` is used in two ways:
1. Passed to the user's item function: `item(valueProp, position)`
2. Updated when the key maps to a new value: `entry.valueProp.set(newValue)`

**Challenge**: The user's item function expects a `Signal<T>`, not a `Cell<T>`. Options:
- Change the `KeyedForEach` item callback to accept `Cell<T> | Signal<T>`
- Wrap Cell in a lightweight Signal adapter
- Keep `Prop<T>` for the public API but use Cell internally where possible

### KeyedForEach totalProp

The `totalProp` (shared across all entries) is a `Prop<number>` used only by `KeyedPosition.isLast`:

```typescript
// Current
const totalProp = prop(0)

// Proposed — Cell is sufficient, isLast can listen directly
const totalCell = cell(0)
```

### MapText subscriptions

MapText subscribes to a source signal with `.onChange()`. If the source were a Cell:

```typescript
// Current
const dispose = source.onChange((v: T) => newCtx.setText(fn(v)))

// With Cell
const dispose = source.onChange((v: T) => newCtx.setText(fn(v)))
// Same API — Cell.onChange works identically
```

### Internal framework signals

Many internal signals are framework-managed and never exposed to users:
- `totalProp` in KeyedForEach/ForEach/Repeat
- `indexProp` in KeyedPosition (lazy)
- Intermediate state in When/OneOf

These could all be Cells since the framework controls their full lifecycle.

## Implementation Strategy

### Phase 1: Cell class (internal only)

Create `Cell<T>` in `@tempots/core`. Use it only in framework internals where the full Signal API is not needed. No public API changes.

```typescript
// packages/tempots-core/src/cell.ts

export class Cell<T> {
  private _value: T
  private _listeners: Array<(value: T) => void> | null = null

  constructor(value: T) {
    this._value = value
  }

  get(): T {
    return this._value
  }

  get value(): T {
    return this._value
  }

  set value(v: T) {
    this.set(v)
  }

  set(value: T): void {
    this._value = value
    const listeners = this._listeners
    if (listeners !== null) {
      for (let i = 0; i < listeners.length; i++) {
        listeners[i](value)
      }
    }
  }

  update(fn: (current: T) => T): void {
    this.set(fn(this._value))
  }

  listen(fn: (value: T) => void): () => void {
    if (this._listeners === null) this._listeners = []
    this._listeners.push(fn)
    fn(this._value) // Initial call (like Signal.on)
    return () => {
      if (this._listeners === null) return
      const idx = this._listeners.indexOf(fn)
      if (idx >= 0) this._listeners.splice(idx, 1)
    }
  }

  onChange(fn: (value: T) => void): () => void {
    if (this._listeners === null) this._listeners = []
    this._listeners.push(fn)
    return () => {
      if (this._listeners === null) return
      const idx = this._listeners.indexOf(fn)
      if (idx >= 0) this._listeners.splice(idx, 1)
    }
  }

  dispose(): void {
    this._listeners = null
  }
}

export function cell<T>(value: T): Cell<T> {
  return new Cell(value)
}
```

**Instance fields**: `_value`, `_listeners` → **2 fields + header ≈ 40 bytes**

### Phase 2: Replace internal Props with Cells

Identify all internal `prop()` / `Prop` usages that don't need Signal features:

| Location | Current | Can use Cell? | Why |
|----------|---------|---------------|-----|
| `render-kit.ts:509` totalProp | `prop(0)` | Yes | Only `.set()` and listened by KeyedPosition |
| `render-kit.ts:564` valueProp | `prop(value)` | **Partial** | Passed to user callback as `Signal<T>` |
| `keyed-position.ts:60` indexProp | `prop(index)` | Yes | Internal, lazy, only used by `.map()` |
| ForEach totalProp | `prop(0)` | Yes | Same pattern as KeyedForEach |
| Repeat countSignal | `prop(0)` | Yes | Internal counter |

### Phase 3: Public API (optional)

If Cell proves useful for framework internals, expose it as a public API for users who want maximum performance in hot paths:

```typescript
import { cell } from '@tempots/dom'

const counter = cell(0)
// Use in tight loops, manual lifecycle management
```

## Expected Impact

### Memory (per 1000 rows)

Replacing `valueProp` (Prop) and `totalProp` (Prop) with Cells:

| Component | Current (Prop) | With Cell | Savings per instance |
|-----------|---------------|-----------|---------------------|
| Instance size | ~80 bytes | ~40 bytes | **40 bytes** |
| `_onValueListeners` array | ~48 bytes | ~48 bytes (as `_listeners`) | 0 |
| `_derivatives` array | ~48 bytes (if used) | N/A | **48 bytes** |
| `_onDisposeListeners` array | ~48 bytes (if used) | N/A | **48 bytes** |

Per row (replacing valueProp only): **~136 bytes saved**
Per 1000 rows: **~136 KB**

If also replacing internal framework signals (totalProp, indexProp, etc.):
Per 1000 rows: **~200 KB**

### CPU

| Operation | Current | With Cell | Why |
|-----------|---------|-----------|-----|
| Creation | `new Prop(value, strictEquals)` + scope tracking | `new Cell(value)` | No equals ref, no scope |
| `set()` | equals check → notify listeners → notify derivatives → schedule computeds | Direct notify listeners | No equality, no derivative chain |
| Disposal | Null 3 arrays + fire dispose listeners | Null 1 array | Simpler |

The simpler `set()` path is the biggest CPU win — it eliminates the equals check and derivative notification for every row update. In the "update every 10th row" benchmark, this could improve partial update performance.

### Realistic assessment

| Metric | Estimated improvement |
|--------|----------------------|
| Run memory | ~200 KB reduction (~2% of 9.17 MB) |
| Create 1k CPU | ~5-10% faster (fewer allocations, simpler constructors) |
| Partial update CPU | ~10-15% faster (simpler set() path) |
| Code complexity | Low — Cell is a standalone class |

Cell's memory win is modest because Signal arrays are already lazy. The real value is **CPU performance** from the drastically simpler `set()` → `notify` path, and **architectural clarity** — Cell makes it explicit that a value doesn't participate in the reactive graph.

## Comparison with Tiered Signals

| Aspect | Cell | Tiered Signals |
|--------|------|----------------|
| Approach | New separate class | Restructure existing Signal |
| API change | New type | No change |
| Memory win | ~200 KB | ~50-80 KB |
| CPU win | Moderate (simpler set) | Minor (fewer fields) |
| Risk | Type compatibility issues | Hidden class instability |
| Effort | Low-medium | Medium |
| Composability | Manual interop with Signal | Transparent |

**Cell and Tiered Signals are complementary.** Cell replaces Signal entirely for cases that don't need reactivity features. Tiered Signals optimizes Signal for cases that need *some* features but not all.

## Files to Create/Modify

| File | Change |
|------|--------|
| `packages/tempots-core/src/cell.ts` | **New** — Cell class |
| `packages/tempots-core/src/index.ts` | Export Cell |
| `packages/tempots-render/src/render-kit.ts` | Replace internal `prop()` calls with `cell()` where possible |
| `packages/tempots-core/src/keyed-position.ts` | Consider Cell for internal fields |
| `packages/tempots-core/test/cell.spec.ts` | **New** — tests |

## Open Questions

1. **User-facing API for KeyedForEach items**: Currently `item: (value: Signal<T>, position: KeyedPosition) => TNode`. If valueProp becomes a Cell, should the callback accept `Cell<T>`? Or keep wrapping in a Signal?
2. **No equality check**: Cell always notifies on `set()`. For the benchmark this is fine (values always change). For general use, could this cause excessive re-renders? Should Cell have an optional equality mode?
3. **ReadSignal compatibility**: Much of Tempo's API accepts `Signal<T>` or `ReadSignal<T>`. Cell doesn't implement these interfaces. Need adapter or union types.
4. **Naming**: `Cell` is used by some other libraries (e.g., MobX). Alternatives: `Atom`, `Box`, `Ref`, `Slot`.
