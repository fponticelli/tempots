import { Value } from '../types/domain'

// Using string instead of symbol to avoid issues with multiple versions of tempots
const $isSignal = '$__signal__'
const $isProp = '$__prop__'
const $isComputed = '$__computed__'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnySignal<T = any> = Signal<T> | Prop<T> | Computed<T>

export class Signal<T> {
  static ofPromise<T>(
    promise: Promise<T>,
    init: T,
    recover?: (error: unknown) => T,
    equals: (a: T, b: T) => boolean = (a, b) => a === b
  ): Signal<T> {
    const signal = new Signal(init, equals)
    promise
      .then(value => signal._setAndNotify(value, false))
      .catch(error => {
        if (recover != null) {
          signal._setAndNotify(recover(error), false)
        } else {
          console.error(
            'Unhandled promise rejection in Signal.ofPromise:',
            error
          )
        }
      })
    return signal
  }
  static is<T = unknown>(value: unknown): value is Signal<T> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return value != null && (value as any)[$isSignal] === true
  }
  static wrap<T>(
    value: T | Signal<T>,
    // istanbul ignore next
    equals: (a: T, b: T) => boolean = (a, b) => a === b
  ): Signal<T> {
    return Signal.is<T>(value) ? value : new Signal(value, equals)
  }
  static maybeWrap<T>(
    value: T | Signal<T> | null | undefined
  ): Signal<T> | undefined | null {
    return value == null ? (value as null | undefined) : Signal.wrap(value)
  }
  static unwrap<T>(value: Signal<T> | T): T {
    return Signal.is<T>(value) ? value.get() : value
  }
  static map<T, U>(value: Value<T>, fn: (value: T) => U): Value<U> {
    if (Signal.is<T>(value)) {
      return value.map(fn)
    } else {
      return fn(value)
    }
  }

  protected readonly [$isSignal] = true
  protected _value: T
  protected readonly _derivatives: Array<Computed<unknown>> = []
  protected readonly _onValueListeners: Array<(value: T) => void> = []
  protected readonly _onDisposeListeners: Array<() => void> = []

  constructor(
    value: T,
    public readonly equals: (a: T, b: T) => boolean
  ) {
    this._value = value
  }
  readonly get = () => this._value
  get value() {
    return this._value
  }

  readonly hasListeners = () => this._onValueListeners.length > 0

  readonly on = (listener: (value: T) => void) => {
    listener(this.get())
    this._onValueListeners.push(listener)
    return () => {
      this._onValueListeners.splice(this._onValueListeners.indexOf(listener), 1)
    }
  }

  protected readonly _setAndNotify = (newV: T, forceNotifications: boolean) => {
    const same = this.equals(this._value, newV)
    if (!same) {
      this._value = newV
    }
    if (forceNotifications || !same) {
      this._onValueListeners.forEach(l => l(newV))
    }
  }

  protected _disposed = false

  readonly isDisposed = () => this._disposed

  readonly onDispose = (listener: () => void) => {
    this._onDisposeListeners.push(listener)
  }

  readonly dispose = () => {
    if (this._disposed) return
    this._disposed = true
    this._onDisposeListeners.forEach(l => l())
    this._onDisposeListeners.length = 0
    this._derivatives.length = 0
  }

  readonly map = <U>(
    fn: (value: T) => U,
    equals: (a: U, b: U) => boolean = (a, b) => a === b
  ) => {
    const comp = new Computed(() => {
      try {
        return fn(this.get())
      } catch (error) {
        console.error('Error in Signal.map:', error)
        throw error
      }
    }, equals)
    this.setDerivative(comp)
    return comp
  }

  readonly flatMap = <U>(
    fn: (value: T) => Signal<U>,
    equals: (a: U, b: U) => boolean = (a, b) => a === b
  ) => {
    const computed = new Computed(() => {
      try {
        return fn(this.get()).get()
      } catch (error) {
        console.error('Error in Signal.flatMap:', error)
        throw error
      }
    }, equals)
    this.setDerivative(computed)
    return computed
  }

  readonly tap = (fn: (value: T) => void) => {
    return this.map(value => {
      fn(value)
      return value
    })
  }

  readonly at = <K extends keyof T>(key: K): Signal<T[K]> =>
    this.map(value => value[key])

  readonly $ = new Proxy(this, {
    get: (_, key) => this.at(key as keyof T),
  }) as { [K in keyof T]: Signal<T[K]> }

  readonly filter = (fn: (value: T) => boolean, startValue?: T) => {
    let latestValue = startValue ?? this.get()
    const computed = new Computed(() => {
      try {
        const value = this.get()
        return (latestValue = fn(value) ? value : latestValue)
      } catch (error) {
        console.error('Error in Signal.filter:', error)
        throw error
      }
    }, this.equals)
    this.setDerivative(computed)
    return computed
  }

  readonly filterMap = <U>(
    fn: (value: T) => U | undefined | null,
    startValue: U,
    equals: (a: U, b: U) => boolean = (a, b) => a === b
  ) => {
    let latestValue = startValue
    const computed = new Computed(() => {
      try {
        const value = this.get()
        const mapped = fn(value)
        return (latestValue = mapped != undefined ? mapped : latestValue)
      } catch (error) {
        console.error('Error in Signal.filterMap:', error)
        throw error
      }
    }, equals)
    this.setDerivative(computed)
    return computed
  }

  readonly mapAsync = <U>(
    fn: (value: T) => Promise<U>,
    alt: U,
    recover?: (error: unknown) => U,
    equals: (a: U, b: U) => boolean = (a, b) => a === b
  ) => {
    const p = useProp(alt, equals)
    let count = 0
    p.onDispose(
      this.on(v => {
        const current = ++count
        try {
          fn(v)
            .then(value => {
              if (current === count) p.set(value)
            })
            .catch(error => {
              if (current === count) {
                if (recover != null) {
                  p.set(recover(error))
                } else {
                  console.error(
                    'Unhandled promise rejection in Signal.mapAsync:',
                    error
                  )
                }
              }
            })
        } catch (error) {
          console.error('Error in Signal.mapAsync:', error)
          throw error
        }
      })
    )
    return p
  }

  readonly mapMaybe = <U>(fn: (value: T) => U | undefined | null, alt: U) =>
    this.map(value => fn(value) ?? alt)

  readonly feedProp = (
    prop: Prop<T>,
    // istanbul ignore next
    autoDisposeProp = false
  ) => {
    const clean = this.on(prop.set)
    prop.onDispose(clean)
    if (autoDisposeProp) this.onDispose(prop.dispose)
    else this.onDispose(clean)
    return prop
  }

  readonly deriveProp = (autoDisposeProp = true) => {
    return this.feedProp(useProp(this.get()), autoDisposeProp)
  }

  readonly count = () => {
    let count = 0
    return this.map(() => ++count)
  }

  readonly setDerivative = <U>(computed: Computed<U>) => {
    this._derivatives.push(computed as Computed<unknown>)
    computed.onDispose(() => {
      this._derivatives.splice(
        this._derivatives.indexOf(computed as Computed<unknown>),
        1
      )
    })
    computed.onDispose(this.on(computed.setDirty))
    this.onDispose(computed.dispose)
  }
}

// istanbul ignore next
const queue =
  typeof queueMicrotask === 'function'
    ? queueMicrotask
    : (fn: () => void) => Promise.resolve().then(fn)

export class Computed<T> extends Signal<T> {
  static is<T = unknown>(value: unknown): value is Computed<T> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return value != null && (value as any)[$isComputed] === true
  }
  protected readonly [$isComputed] = true
  protected _isDirty = false

  constructor(
    private readonly _fn: () => T,
    equals: (a: T, b: T) => boolean
  ) {
    // cheat to avoid reading when possibly not necessary
    super(undefined as T, equals)
    this.setDirty()
  }

  readonly setDirty = () => {
    if (this._isDirty || this._disposed) return
    this._isDirty = true
    this._derivatives.forEach(d => d.setDirty())
    this.scheduleNotify()
  }

  protected _scheduleCount = 0
  protected readonly scheduleNotify = () => {
    const count = ++this._scheduleCount
    queue(() => {
      if (this._scheduleCount !== count || this._disposed !== false) return
      if (this._isDirty) {
        this._isDirty = false
        this._setAndNotify(this._fn(), false)
      }
    })
  }

  /** {@inheritDoc Signal.get} */
  readonly get = () => {
    if (this._isDirty) {
      this._isDirty = false
      this._value = this._fn()
      this._setAndNotify(this._value, true)
    }
    return this._value
  }
  /** {@inheritDoc Signal.value} */
  get value() {
    return this.get()
  }
}

export type ReducerEffect<S, A> = (data: {
  previousState: S
  state: S
  action: A
  dispatch: (action: A) => void
}) => void

export class Prop<T> extends Signal<T> {
  static is<T = unknown>(value: unknown): value is Prop<T> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return value != null && (value as any)[$isProp] === true
  }
  protected readonly [$isProp] = true

  readonly set = (value: T) => {
    this._setAndNotify(value, false)
  }
  readonly update = (fn: (value: T) => T) => {
    this._setAndNotify(fn(this.get()), false)
  }
  readonly reducer = <A>(
    fn: (acc: T, value: A) => T,
    ...effects: ReducerEffect<T, A>[]
  ) => {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const signal = this
    return function dispatch(action: A) {
      const value = signal.value
      signal.update(value => fn(value, action))
      if (signal.equals(value, signal.value)) return
      effects.forEach(effect =>
        effect({
          previousState: value,
          state: signal.value,
          action,
          dispatch,
        })
      )
    }
  }
  readonly iso = <U>(
    to: (value: T) => U,
    from: (value: U) => T,
    equals: (a: U, b: U) => boolean = (a, b) => a === b
  ) => {
    const prop = new Prop(to(this.get()), equals)
    prop.onDispose(this.on(value => prop.set(to(value))))
    prop.on(value => this._setAndNotify(from(value), false))
    return prop
  }
  readonly atProp = <K extends keyof T>(key: K): Prop<T[K]> => {
    return this.iso(
      value => value[key],
      value => ({ ...this.value, [key]: value })
    )
  }
  /** {@inheritDoc Signal.get} */
  get value() {
    return this.get()
  }
  set value(value: T) {
    this._setAndNotify(value, false)
  }
}

export function useComputed<T>(
  fn: () => T,
  dependencies: Array<AnySignal>,
  equals: (a: T, b: T) => boolean = (a, b) => a === b
): Computed<T> {
  const computed = new Computed(fn, equals)
  dependencies.forEach(signal => signal.setDerivative(computed))
  return computed
}

export function useEffect(fn: () => void, signals: Array<AnySignal>) {
  return useComputed(fn, signals).dispose
}

export function useProp<T>(
  value: T,
  equals: (a: T, b: T) => boolean = (a, b) => a === b
): Prop<T> {
  return new Prop(value, equals)
}

export function useSignal<T>(
  value: T,
  equals: (a: T, b: T) => boolean = (a, b) => a === b
): Signal<T> {
  return new Signal(value, equals)
}
