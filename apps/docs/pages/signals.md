---
title: Signals
order: 40
description: Signals are the reactive data stores. They are used to manage state and notify state changes.
---
# Signals

## Create signals

```ts
function computed&lt;T&gt;(
  fn: () =&gt; T,
  signals: Array&lt;AnySignal&gt;,
  equals: (a: T, b: T) =&gt; boolean = (a, b) =&gt; a === b
): Computed&lt;T&gt;
```

```ts
function effect(fn: () =&gt; void, signals: Array&lt;AnySignal&gt;) =&gt; () =&gt; void
```

```ts
function prop&lt;T&gt;(
  value: T,
  equals: (a: T, b: T) =&gt; boolean = (a, b) =&gt; a === b
): Prop&lt;T&gt;
```

```ts
function signal&lt;T&gt;(
  value: T,
  equals: (a: T, b: T) =&gt; boolean = (a, b) =&gt; a === b
): Signal&lt;T&gt;
```

## The Signal class

```ts
static ofPromise&lt;T&gt;(
  promise: Promise&lt;T&gt;,
  init: T,
  recover?: (error: unknown) =&gt; T,
  equals: (a: T, b: T) =&gt; boolean = (a, b) =&gt; a === b
): Signal&lt;T&gt;
```

```ts
static is&lt;T = unknown&gt;(value: unknown): value is Signal&lt;T&gt;
```

```ts
static wrap&lt;T&gt;(
  value: T | Signal&lt;T&gt;,
  equals: (a: T, b: T) =&gt; boolean = (a, b) =&gt; a === b
): Signal&lt;T&gt;
```

```ts
static maybeWrap&lt;T&gt;(
  value: T | Signal&lt;T&gt; | null | undefined
): Signal&lt;T&gt; | undefined | null
```

```ts
static unwrap&lt;T&gt;(value: Signal&lt;T&gt; | T): T
```

```ts
static map&lt;T, U&gt;(value: Value&lt;T&gt;, fn: (value: T) =&gt; U): Value&lt;U&gt;
```

```ts
get value(): T
```

```ts
readonly hasListeners: () =&gt; boolean
```

```ts
readonly on: (listener: (value: T) =&gt; void) =&gt; () =&gt; void
```

```ts
readonly isDisposed: () =&gt; boolean
```

```ts
readonly onDispose: (listener: () =&gt; void) =&gt; void
```

```ts
readonly dispose: () =&gt; void
```

```ts
readonly map: &lt;U&gt;(
  fn: (value: T) =&gt; U,
  equals: (a: U, b: U) =&gt; boolean = (a, b) =&gt; a === b
) =&gt; Computed&lt;U&gt;
```

```ts
readonly flatMap: &lt;U&gt;(
  fn: (value: T) =&gt; Signal&lt;U&gt;,
  equals: (a: U, b: U) =&gt; boolean = (a, b) =&gt; a === b
) =&gt; Computed&lt;U&gt;
```

```ts
readonly tap: (fn: (value: T) =&gt; void) =&gt; void
```

```ts
readonly at: &lt;K extends keyof T&gt;(key: K) =&gt; Signal&lt;T[K]&gt;
```

```ts
readonly $: { [K in keyof T]: Signal&lt;T[K]&gt; }
```

```ts
readonly filter: (fn: (value: T) =&gt; boolean, startValue?: T) =&gt; Computed&lt;T&gt;
```

```ts
readonly filterMap: &lt;U&gt;(
  fn: (value: T) =&gt; U | undefined | null,
  startValue: U,
  equals: (a: U, b: U) =&gt; boolean = (a, b) =&gt; a === b
) =&gt; Computed&lt;U&gt;
```

```ts
readonly mapAsync: &lt;U&gt;(
  fn: (value: T) =&gt; Promise&lt;U&gt;,
  alt: U,
  recover?: (error: unknown) =&gt; U,
  equals: (a: U, b: U) =&gt; boolean = (a, b) =&gt; a === b
) =&gt; Computed&lt;U&gt;
```

```ts
readonly mapMaybe: &lt;U&gt;(fn: (value: T) =&gt; U | undefined | null, alt: U) =&gt; Computed&lt;U&gt;
```

```ts
readonly deriveProp: (autoDisposeProp = true) =&gt; Prop&lt;T&gt;
```

```ts
readonly count: () =&gt; Computed&lt;number&gt;
```

```ts
readonly setDerivative: &lt;U&gt;(computed: Computed&lt;U&gt;) =&gt; void
```

## The Computed class

```ts
class Computed&lt;T&gt; extends Signal&lt;T&gt;
```

```ts
static is&lt;T = unknown&gt;(value: unknown): value is Computed&lt;T&gt;
```

```ts
type ReducerEffect&lt;S, A&gt; = (data: {
  previousState: S
  state: S
  action: A
  dispatch: (action: A) =&gt; void
}) =&gt; void
```

## The Prop class

```ts
class Prop&lt;T&gt; extends Signal&lt;T&gt;
```

```ts
static is&lt;T = unknown&gt;(value: unknown): value is Prop&lt;T&gt;
```

```ts
readonly set: (value: T) =&gt; void
```

```ts
readonly update: (fn: (value: T) =&gt; T) =&gt; void
```

```ts
readonly reducer = &lt;A&gt;(
  fn: (acc: T, value: A) =&gt; T,
  ...effects: ReducerEffect&lt;T, A&gt;[]
) =&gt; (action: A) =&gt; void
```

```ts
readonly iso: &lt;U&gt;(
  to: (value: T) =&gt; U,
  from: (value: U) =&gt; T,
  equals: (a: U, b: U) =&gt; boolean = (a, b) =&gt; a === b
) =&gt; Prop&lt;U&gt;
```

```ts
readonly atProp: &lt;K extends keyof T&gt;(key: K): Prop&lt;T[K]&gt; =&gt; Prop&lt;T[K]&gt;
```

```ts
get value(): T
```

```ts
set value(value: T): T
```

## Utility functions

```ts
function propOfStorage&lt;T&gt;({
  key,
  defaultValue,
  store,
  serialize = JSON.stringify,
  deserialize = JSON.parse,
  equals = (a, b) =&gt; a === b,
  onLoad = value =&gt; value,
}: {
  key: string
  defaultValue: T | (() =&gt; T)
  store: {
    getItem: (key: string) =&gt; string | null
    setItem: (key: string, value: string) =&gt; void
  }
  serialize?: (v: T) =&gt; string
  deserialize?: (v: string) =&gt; T
  equals?: (a: T, b: T) =&gt; boolean
  onLoad?: (value: T) =&gt; T
}): Prop&lt;T&gt;
```

```ts
function propOfLocalStorage&lt;T&gt;(options: {
  key: string
  defaultValue: T | (() =&gt; T)
  serialize?: (v: T) =&gt; string
  deserialize?: (v: string) =&gt; T
  equals?: (a: T, b: T) =&gt; boolean
  onLoad?: (value: T) =&gt; T
}): Prop&lt;T&gt;
```

```ts
function propOfSessionStorage&lt;T&gt;(options: {
  key: string
  defaultValue: T | (() =&gt; T)
  serialize?: (v: T) =&gt; string
  deserialize?: (v: string) =&gt; T
  equals?: (a: T, b: T) =&gt; boolean
  onLoad?: (value: T) =&gt; T
}): Prop&lt;T&gt;
```

```ts
function animate&lt;T&gt;(
  initialValue: T,
  fn: () =&gt; T,
  signals: Array&lt;AnySignal&gt;,
  options?: {
    interpolate?: (start: T, end: T, delta: number) =&gt; T
    duration?: Value&lt;number&gt;
    easing?: (t: number) =&gt; number
    equals?: (a: T, b: T) =&gt; boolean
  }
): Prop&lt;T&gt;
```

```ts
function animateOne&lt;T&gt;(
  signal: Signal&lt;T&gt;,
  options?: {
    initialValue?: T
    interpolate?: (start: T, end: T, delta: number) =&gt; T
    duration?: number
    easing?: (t: number) =&gt; number
    equals?: (a: T, b: T) =&gt; boolean
  }
): Prop&lt;T&gt;
```

```ts
type Value&lt;T&gt; = Signal&lt;T&gt; | T
type NValue&lt;T&gt; =
  | Value&lt;T&gt;
  | Value&lt;T | null&gt;
  | Value&lt;T | undefined&gt;
  | Value&lt;T | null | undefined&gt;
  | null
  | undefined
```

```ts
type GetValueType&lt;T&gt; = T extends Signal&lt;infer V&gt; ? V : T
```

```ts
function computedRecord&lt;T extends Record&lt;string, Value&lt;unknown&gt;&gt;, U&gt;(
  record: T,
  fn: (value: RemoveSignals&lt;T&gt;) =&gt; U
): Computed&lt;U&gt;
```
