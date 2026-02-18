# Optimization: Tiered Signals

## Problem

Every `Signal` instance carries the full feature set regardless of whether it's used:

```typescript
class Signal<T> {
  protected readonly $__signal__ = true     // 8 bytes — type brand
  protected _value: T                        // 8 bytes — always needed
  public readonly equals: (a, b) => boolean  // 8 bytes — per-instance function ref
  protected _derivatives: Array<...> | null  // 8 bytes — for computed chains
  protected _onValueListeners: Array<...> | null  // 8 bytes — for .on()/.onChange()
  protected _onDisposeListeners: Array<...> | null // 8 bytes — for scope tracking
  // V8 object header: ~24 bytes
  // Total: ~72 bytes per Signal instance
}
```

The arrays are already lazily allocated (start as `null`), but the **field slots themselves** always exist in V8's hidden class. A Signal that only needs `.get()` and `.set()` still pays for `_derivatives`, `_onDisposeListeners`, and `equals` slots it never uses.

In the benchmark, each row creates:
- 1 `Prop` (valueProp) — uses: `set`, `onChange`, `dispose`. Does NOT use: `equals` (identity check suffices), `_derivatives` is often empty
- 1 `Computed` — uses: `get`, `_fn`, `_isDirty`, `on`. Adds 3 more fields
- 1 `KeyedPosition` — no signals created in benchmark (lazy)
- 1 `totalProp` (shared) — uses `set`, derivatives

At 1000 rows: 2,000 Signal/Prop/Computed instances × 72-96 bytes = **~160-190 KB** just for instance fields, plus ~300 KB for lazily created arrays.

## Concept

Instead of one monolithic Signal class with all features, structure signals so that capabilities are layered and fields are only present when the corresponding feature is actually used.

### Current: Flat hierarchy

```
Signal (6 fields: $__signal__, _value, equals, _derivatives, _onValueListeners, _onDisposeListeners)
  ├── Computed (adds 3 fields: $__computed__, _isDirty, _fn)
  └── Prop (adds 1 field: $__prop__)
```

Every instance pays for all 6 base fields even if unused.

### Proposed: Capability-based fields

The idea is that certain field groups represent distinct capabilities:

| Capability | Fields | When needed |
|------------|--------|-------------|
| **Value** | `_value` | Always |
| **Equality** | `equals` | Only when `set()` uses custom equality. Most signals use `===` |
| **Listeners** | `_onValueListeners` | Only when `.on()` or `.onChange()` is called |
| **Derivatives** | `_derivatives` | Only when another Computed depends on this signal |
| **Disposal** | `_onDisposeListeners` | Only when scope tracking or `.onDispose()` is used |
| **Type branding** | `$__signal__`, `$__prop__`, `$__computed__` | Only for `Signal.is()` / `Prop.is()` checks |

## Approach: Promote fields on first use

Instead of pre-declaring all fields in the constructor, add them dynamically when the corresponding API is first called. V8 handles this through hidden class transitions — objects sharing the same property addition sequence share the same hidden class.

```typescript
class Signal<T> {
  // Only the essential field exists at construction
  protected _value: T

  constructor(value: T) {
    this._value = value
  }

  get() {
    return this._value
  }

  // Equality — field added on first set() call or explicitly
  protected _equals?: (a: T, b: T) => boolean

  _setAndNotify(newValue: T) {
    const eq = this._equals ?? strictEquals
    if (eq(this._value, newValue)) return
    const prev = this._value
    this._value = newValue
    // ... notify
  }

  // Listeners — field added on first .on()/.onChange() call
  on(listener: (value: T) => void): () => void {
    if (this._onValueListeners === undefined) {
      this._onValueListeners = []  // Field promoted here
    }
    this._onValueListeners.push(listener)
    // ...
  }

  // Derivatives — field added on first setDerivative() call
  setDerivative(computed: Computed<unknown>) {
    if (this._derivatives === undefined) {
      this._derivatives = []  // Field promoted here
    }
    this._derivatives.push(computed)
  }

  // Disposal — field added on first onDispose() or scope tracking
  onDispose(listener: () => void) {
    if (this._onDisposeListeners === undefined) {
      this._onDisposeListeners = []  // Field promoted here
    }
    this._onDisposeListeners.push(listener)
  }
}
```

### V8 hidden class implications

V8 creates a new hidden class (Map) each time a property is added to an object. If properties are always added in the same order, all objects with that same addition sequence share one hidden class — this is efficient.

**Risk**: If different code paths add properties in different orders, V8 creates many hidden classes, hurting inline cache performance. To mitigate:
- Always add fields in a deterministic order
- Or use a flags field: `this._caps = 0` and bitwise check `this._caps & HAS_LISTENERS`

### Alternative: `undefined` sentinel instead of field promotion

Keep all fields declared but use `undefined` instead of `null` as the uninitialized marker. This avoids hidden class transitions entirely while still allowing V8 to optimize:

```typescript
class Signal<T> {
  protected _value: T
  protected _derivatives: Array<Computed<unknown>> | undefined
  protected _onValueListeners: Array<...> | undefined
  protected _onDisposeListeners: Array<() => void> | undefined
  // equals is NOT per-instance — use module-level default
}
```

This is close to what exists today (using `null` instead of `undefined`). The main wins would come from:

1. **Removing `equals` from instance**: Use a module-level `strictEquals` instead of storing it per-instance. Only signals with custom equality would need it (very rare).
2. **Removing type brands from instance**: Replace `$__signal__`, `$__prop__`, `$__computed__` booleans with `instanceof` checks or a single numeric `_type` field.
3. **Consolidating to a single listeners array**: Instead of separate `_onValueListeners` + `_derivatives` + `_onDisposeListeners` (3 potential arrays), use one `_listeners` array with tagged entries.

## Proposed Changes

### Change 1: Remove per-instance `equals`

**Current**: Every Signal stores an `equals` function reference (8 bytes).
**Proposed**: Use module-level `strictEquals` as default. Only store `equals` on instances that need custom equality (via optional field or subclass).

```typescript
// Module level
const _defaultEquals = <T>(a: T, b: T) => a === b

class Signal<T> {
  // No 'equals' field by default
  protected _value: T

  _setAndNotify(newValue: T) {
    const eq = (this as any)._equals ?? _defaultEquals
    if (eq(this._value, newValue)) return
    // ...
  }
}

// Factory for custom equality
function signalWithEquals<T>(value: T, equals: (a: T, b: T) => boolean): Signal<T> {
  const s = new Signal(value)
  ;(s as any)._equals = equals
  return s
}
```

**Savings**: 8 bytes × 2,000 signals = **16 KB** per 1000 rows. Small but free.

### Change 2: Replace type brands with a single `_type` field

**Current**: 3 boolean fields across the hierarchy: `$__signal__` (Signal), `$__prop__` (Prop), `$__computed__` (Computed). Each is 8 bytes in V8.
**Proposed**: One numeric `_type` field with bit flags.

```typescript
const SIGNAL = 1
const PROP = 2
const COMPUTED = 4

class Signal<T> {
  protected _type = SIGNAL

  static is(value: unknown): value is Signal<unknown> {
    return value != null && ((value as any)._type & SIGNAL) !== 0
  }
}

class Prop<T> extends Signal<T> {
  protected _type = SIGNAL | PROP

  static is(value: unknown): value is Prop<unknown> {
    return value != null && ((value as any)._type & PROP) !== 0
  }
}

class Computed<T> extends Signal<T> {
  protected _type = SIGNAL | COMPUTED
}
```

**Savings**: Replaces 2-3 boolean fields with 1 number field. Net: **~8-16 bytes per signal** → 16-32 KB per 1000 rows.

### Change 3: Unified listeners array

**Current**: Three separate arrays that may be allocated per signal:
- `_onValueListeners`: for `.on()`/`.onChange()` subscribers
- `_derivatives`: for Computed dependencies
- `_onDisposeListeners`: for disposal callbacks

**Proposed**: Single `_listeners` array with tagged entries:

```typescript
// Tags
const VALUE_LISTENER = 0
const DERIVATIVE = 1
const DISPOSE_LISTENER = 2

type ListenerEntry =
  | [typeof VALUE_LISTENER, (value: any, prev: any) => void]
  | [typeof DERIVATIVE, Computed<unknown>]
  | [typeof DISPOSE_LISTENER, () => void]

class Signal<T> {
  protected _listeners: ListenerEntry[] | null = null
}
```

**Pros**: One array instead of three. Fewer field slots. Fewer null checks.
**Cons**: Iteration requires tag checking. Mixed types in array may hurt V8 optimization (polymorphic array elements). More complex removal logic.

**Alternative**: Use separate sub-arrays but stored in a single object to reduce field count:

```typescript
type SignalState = {
  val?: Array<(v: any, p: any) => void>
  der?: Array<Computed<unknown>>
  dis?: Array<() => void>
}

class Signal<T> {
  protected _value: T
  protected _state: SignalState | null = null  // One field instead of three
}
```

**Savings**: 2 fewer fields per signal (24 → 16 bytes for array-related fields). At 2,000 signals: **~16 KB**. Modest, but the real win is simpler hidden classes.

## Expected Impact

| Change | Memory saving (1k rows) | CPU impact | Effort |
|--------|------------------------|------------|--------|
| Remove per-instance `equals` | ~16 KB | Negligible | Low |
| Single `_type` field | ~16-32 KB | Negligible | Low |
| Unified state object | ~16 KB | Minor (one fewer null check) | Medium |
| **Combined** | **~50-80 KB** | Minor CPU improvement | Medium |

### Realistic assessment

Tiered signals is primarily a **code hygiene and hidden-class optimization** rather than a dramatic memory win. The arrays being `null`/`undefined` already avoids the big allocations. The remaining wins are:
- **~50-80 KB memory** from fewer per-instance fields
- **Better V8 inline caching** from simpler hidden classes (fewer shape transitions)
- **Slightly faster creation** from fewer field initializations in constructors

The gains compound with other optimizations (template cloning reduces signal count further, cells replace some signals entirely).

## Files to Modify

| File | Change |
|------|--------|
| `packages/tempots-core/src/signal.ts` | Restructure Signal/Computed/Prop fields |
| `packages/tempots-core/src/signal-utils.ts` | Update any `equals` references |
| All call sites of `Signal.is()`, `Prop.is()`, `Computed.is()` | Update to new detection pattern |
| `packages/tempots-core/test/signal.spec.ts` | Update tests |

## Open Questions

1. **`instanceof` vs type brands**: Could we use `instanceof` instead of type brands? It's faster but breaks across module boundaries (dual-package hazard with bundled vs workspace instances). The current externalization setup mitigates this.
2. **Custom equality frequency**: How often do users actually pass custom `equals`? If rarely, removing it from the base class is safe. If common, it needs to stay.
3. **V8 profiling**: The hidden class hypothesis should be validated with `--trace-maps` before investing in structural changes.
