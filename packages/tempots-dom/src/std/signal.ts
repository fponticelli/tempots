import { Value } from '../types/domain'

/**
 * Represents any type of signal.
 * It can be a Signal, Prop, or Computed.
 *
 * @typeParam T - The type of value the signal holds.
 * @public
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnySignal<T = any> = Signal<T> | Prop<T> | Computed<T>

/**
 * Represents a type that maps each property of `T` to a `Signal` of its corresponding type.
 * @typeParam T - The type of the object.
 * @public
 */
export type AtGetter<T> = {
  [K in keyof T]: Signal<T[K]>
}

/**
 * Represents a signal that holds a value and notifies its listeners when the value changes.
 * @typeParam T - The type of the value held by the signal.
 * @public
 */
export class Signal<T> {
  /**
   * Creates a Signal that holds the result of a Promise.
   *
   * @typeParam O - The type of the value returned by the Promise.
   * @param promise - The Promise to use to feed the Signal.
   * @param init - The initial value of the Signal before the Promise resolves.
   * @param recover - A function to recover from Promise rejection and provide an alternative value for the Signal.
   * @param equals - A function to compare two values of type O for equality. Defaults to strict equality (===).
   * @returns - A Signal that represents the result of the Promise.
   */
  static readonly ofPromise = <O>(
    promise: Promise<O>,
    init: O,
    recover?: (error: unknown) => O,
    equals: (a: O, b: O) => boolean = (a, b) => a === b
  ): Signal<O> => {
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

  /**
   * Checks if a value is a Signal.
   *
   * @param value - The value to check.
   * @returns `true` if the value is a Signal, `false` otherwise.
   */
  static readonly is = <O = unknown>(value: unknown): value is Signal<O> =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value != null && (value as any).$__signal__ === true

  /**
   * Wraps a value or a Signal instance into a Signal.
   * If the value is already a Signal, it returns the value itself.
   * If the value is not a Signal, it creates a new Signal instance with the given value.
   *
   * @typeParam O - The type of the value.
   * @param value - The value or Signal instance to wrap.
   * @param equals - A function that determines if two values are equal. Defaults to strict equality (===).
   * @returns A Signal instance.
   */
  static readonly wrap = <O>(
    value: O | Signal<O>,
    // istanbul ignore next
    equals: (a: O, b: O) => boolean = (a, b) => a === b
  ): Signal<O> => (Signal.is<O>(value) ? value : new Signal(value, equals))

  /**
   * Wraps a value in a `Signal` if it is not already a `Signal`.
   * If the value is `null` or `undefined`, it returns `null` or `undefined` respectively.
   * @param value - The value to wrap or check.
   * @returns The wrapped value if it is not `null` or `undefined`, otherwise `null` or `undefined`.
   */
  static readonly maybeWrap = <O>(
    value: O | Signal<O> | null | undefined
  ): Signal<O> | undefined | null =>
    value == null ? (value as null | undefined) : Signal.wrap(value)

  /**
   * Unwraps a value from a `Signal` if it is a `Signal`, otherwise returns the value as is.
   *
   * @param value - The value to unwrap.
   * @returns The unwrapped value.
   */
  static readonly unwrap = <O>(value: Signal<O> | O): O =>
    Signal.is<O>(value) ? value.get() : value

  /**
   * Maps the value of a `Signal` or a regular value using the provided mapping function.
   * If the input value is a `Signal`, the mapping function is applied to its value.
   * If the input value is not a `Signal`, the mapping function is directly applied to the value.
   *
   * @param value - The input value to be mapped.
   * @param fn - The mapping function to be applied to the value.
   * @returns A new `Signal` with the mapped value if the input value is a `Signal`,
   * otherwise, the result of applying the mapping function to the value.
   *
   * @typeParam N - The type of the input value.
   * @typeParam O - The type of the mapped value.
   */
  static readonly map = <N, O>(
    value: Value<N>,
    fn: (value: N) => O
  ): Value<O> => {
    if (Signal.is<N>(value)) {
      return value.map(fn)
    } else {
      return fn(value)
    }
  }

  /**
   * @internal
   */
  protected readonly $__signal__ = true
  /**
   * @internal
   */
  protected _value: T
  /**
   * @internal
   */
  protected readonly _derivatives: Array<Computed<unknown>> = []
  /**
   * @internal
   */
  protected readonly _onValueListeners: Array<(value: T) => void> = []
  /**
   * @internal
   */
  protected readonly _onDisposeListeners: Array<() => void> = []

  /**
   * Represents a signal with a value of type T.
   *
   * @param value - The initial value of the signal.
   * @param equals - A function that determines whether two values of type T are equal.
   * @public
   */
  constructor(
    value: T,
    public readonly equals: (a: T, b: T) => boolean
  ) {
    this._value = value
  }

  /**
   * Gets the current value of the signal.
   * @returns The current value of the signal.
   */
  readonly get = () => this._value

  /**
   * Gets the value of the signal.
   * @returns The current value of the signal.
   */
  get value() {
    return this._value
  }

  /**
   * Checks if the signal has any registered listeners.
   * @returns `true` if the signal has listeners, `false` otherwise.
   */
  readonly hasListeners = () => this._onValueListeners.length > 0

  /**
   * Registers a listener function to be called whenever the value of the signal changes.
   * The listener function will be immediately called with the current value of the signal.
   * Returns a function that can be called to unregister the listener.
   *
   * @param listener - The listener function to be called when the value of the signal changes.
   */
  readonly on = (listener: (value: T) => void) => {
    listener(this.get())
    this._onValueListeners.push(listener)
    return () => {
      this._onValueListeners.splice(this._onValueListeners.indexOf(listener), 1)
    }
  }

  /**
   * @internal
   */
  protected readonly _setAndNotify = (newV: T, forceNotifications: boolean) => {
    const same = this.equals(this._value, newV)
    if (!same) {
      this._value = newV
    }
    if (forceNotifications || !same) {
      this._onValueListeners.forEach(l => l(newV))
    }
  }

  /**
   * @internal
   */
  protected _disposed = false

  /**
   * Checks whether the signal is disposed.
   * @returns True if the signal is disposed, false otherwise.
   */
  readonly isDisposed = () => this._disposed

  /**
   * Adds a listener function to be called when the object is disposed.
   * @param listener - The listener function to be called when the object is disposed.
   * @returns A function that can be called to remove the listener.
   */
  readonly onDispose = (listener: () => void) => {
    this._onDisposeListeners.push(listener)
  }

  /**
   * Disposes the signal, releasing any resources associated with it.
   */
  readonly dispose = () => {
    if (this._disposed) return
    this._disposed = true
    this._onDisposeListeners.forEach(l => l())
    this._onDisposeListeners.length = 0
    this._derivatives.length = 0
  }

  /**
   * Returns a new Computed instance that applies the given mapping function to the value of this Signal.
   * The mapping function is called whenever the value of this Signal changes.
   *
   * @typeParam O - The type of the mapped value.
   * @param fn - The mapping function to apply to the value of this Signal.
   * @param equals - Optional equality function to determine if two mapped values are equal.
   * @returns - A new Computed instance with the mapped value.
   */
  readonly map = <O>(
    fn: (value: T) => O,
    equals: (a: O, b: O) => boolean = (a, b) => a === b
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

  /**
   * Returns a new Signal that applies the given function to the value of the current Signal,
   * and then flattens the resulting Signal.
   *
   * @typeParam O - The type of the value emitted by the resulting Signal.
   * @param fn - The function to apply to the value of the current Signal.
   * @param equals - A function that determines whether two values of type O are equal.
   *               Defaults to a strict equality check (===).
   * @returns A new Signal that emits the values of the resulting Signal.
   */
  readonly flatMap = <O>(
    fn: (value: T) => Signal<O>,
    equals: (a: O, b: O) => boolean = (a, b) => a === b
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

  /**
   * Invokes a callback function with the current value of the signal, without modifying the signal.
   *
   * @param fn - The callback function to be invoked with the current value of the signal.
   * @returns A new signal that emits the same value as the original signal and invokes the callback function.
   */
  readonly tap = (fn: (value: T) => void) => {
    return this.map(value => {
      fn(value)
      return value
    })
  }

  /**
   * Returns a new Signal that emits the value at the specified key of the current value.
   *
   * @param key - The key of the value to retrieve.
   * @returns A new Signal that emits the value at the specified key.
   */
  readonly at = <K extends keyof T>(key: K): Signal<T[K]> =>
    this.map(value => value[key])

  /**
   * Represents a collection of signals for each key in the value of the signal.
   * @typeParam T - The type of the signals.
   */
  readonly $ = new Proxy(this, {
    /**
     * Retrieves the signal with the specified key.
     * @param _ - The target object.
     * @param key - The key of the signal.
     * @returns The signal associated with the key.
     */
    get: (_, key) => this.at(key as keyof T),
  }) as AtGetter<T>
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

  /**
   * Returns a new Computed object that applies the provided mapping function to the value of this Signal,
   * and filters out values that are `undefined` or `null`.
   *
   * @typeParam O - The type of the mapped value.
   * @param fn - The mapping function to apply to the value of this Signal.
   * @param startValue - The initial value for the Computed object.
   * @param equals - Optional equality function to determine if two values are equal.
   * @returns - A new Computed object with the mapped and filtered values.
   */
  readonly filterMap = <O>(
    fn: (value: T) => O | undefined | null,
    startValue: O,
    equals: (a: O, b: O) => boolean = (a, b) => a === b
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

  /**
   * Maps the values emitted by the signal to a new value asynchronously using the provided function.
   * If the function throws an error, it will be caught and logged.
   * If a recovery function is provided, it will be called with the error and its return value will be used as the mapped value.
   * If no recovery function is provided, the error will be logged as an unhandled promise rejection.
   *
   * @typeParam O - The type of the mapped value.
   * @param fn - The function to map the values emitted by the signal.
   * @param alt - The alternate value to use if the signal is disposed or the mapping function throws an error.
   * @param recover - The recovery function to handle errors thrown by the mapping function.
   * @param equals - The equality function to compare the mapped values for equality.
   * @returns A property that holds the mapped value and can be observed for changes.
   */
  readonly mapAsync = <O>(
    fn: (value: T) => Promise<O>,
    alt: O,
    recover?: (error: unknown) => O,
    equals: (a: O, b: O) => boolean = (a, b) => a === b
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

  /**
   * Maps the values of the signal using the provided function `fn`, and returns a new signal
   * containing the mapped values. If the mapped value is `undefined` or `null`, it is replaced
   * with the provided `alt` value.
   *
   * @typeParam O - The type of the mapped value.
   * @param fn - The function used to map the values of the signal.
   * @param alt - The alternative value to use when the mapped value is `undefined` or `null`.
   * @returns A new signal containing the mapped values.
   */
  readonly mapMaybe = <O>(fn: (value: T) => O | undefined | null, alt: O) =>
    this.map(value => fn(value) ?? alt)

  /**
   * Feeds a property into the signal and sets up disposal behavior.
   * @param prop - The property to feed into the signal.
   * @param autoDisposeProp - Determines whether the property should be automatically disposed when the signal is disposed.
   * @returns The input property.
   */
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

  /**
   * Derives a new property from the current signal.
   * @param autoDisposeProp - Determines whether the derived property should be automatically disposed.
   * @returns The derived property.
   */
  readonly deriveProp = (autoDisposeProp = true) =>
    this.feedProp(useProp(this.get()), autoDisposeProp)

  /**
   * Returns a signal that emits the count of values received so far.
   * @returns A signal that emits the count of values received so far.
   */
  readonly count = () => {
    let count = 0
    return this.map(() => ++count)
  }

  /**
   * Adds a computed value as a derivative of the signal.
   * When the computed value is disposed, it is automatically removed from the derivatives list.
   * Additionally, when the computed value is disposed, it sets the signal as dirty.
   * @param computed - The computed value to add as a derivative.
   */
  readonly setDerivative = <O>(computed: Computed<O>) => {
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

/**
 * Represents a computed signal that derives its value from a function.
 * It extends the `Signal` class.
 *
 * @typeParam T - The type of the computed value.
 * @public
 */
export class Computed<T> extends Signal<T> {
  /**
   * Checks if a value is an instance of `Computed`.
   *
   * @param value - The value to check.
   * @returns `true` if the value is an instance of `Computed`, `false` otherwise.
   */
  static is<T = unknown>(value: unknown): value is Computed<T> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return value != null && (value as any).$__computed__ === true
  }
  /**
   * @internal
   */
  protected readonly $__computed__ = true
  /**
   * @internal
   */
  protected _isDirty = false

  /**
   * Represents a Signal object.
   * @param _fn - The function that returns the value of the signal.
   * @param equals - The function used to compare two values of type T for equality.
   */
  constructor(
    private readonly _fn: () => T,
    equals: (a: T, b: T) => boolean
  ) {
    // cheat to avoid reading when possibly not necessary
    super(undefined as T, equals)
    this.setDirty()
  }

  /**
   * Marks the signal as dirty, indicating that its value has changed and needs to be recalculated.
   * If the signal is already dirty or disposed, this method does nothing.
   * It also marks all dependent signals as dirty and schedules a notification to update their values.
   */
  readonly setDirty = () => {
    if (this._isDirty || this._disposed) return
    this._isDirty = true
    this._derivatives.forEach(d => d.setDirty())
    this._scheduleNotify()
  }

  /**
   * @internal
   */
  protected _scheduleCount = 0
  /**
   * Schedules a notification to be executed asynchronously.
   * If the signal is dirty, it will be updated and notified.
   * @internal
   */
  protected readonly _scheduleNotify = () => {
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

/**
 * Represents the data passed to a reducer effect.
 *
 * @typeParam S - The type of the state.
 * @typeParam A - The type of the action.
 * @public
 */
export type ReducerEffectData<S, A> = {
  /**
   * The previous state before the action was dispatched.
   */
  previousState: S
  /**
   * The current state after the action was dispatched.
   */
  state: S
  /**
   * The action that was dispatched.
   */
  action: A
  /**
   * A function to dispatch a new action.
   */
  dispatch: (action: A) => void
}

/**
 * Represents a function that defines a reducer effect.
 * A reducer effect is a function that takes in the previous state, current state, action, and a dispatch function,
 * and performs some side effects based on the state and action.
 *
 * @typeParam S - The type of the state.
 * @typeParam A - The type of the action.
 *
 * @param data - An object containing the previous state, current state, action, and dispatch function.
 * @public
 */
export type ReducerEffect<S, A> = (data: ReducerEffectData<S, A>) => void

/**
 * Represents a property signal that holds a value of type T.
 * It extends the `Signal` class.
 *
 * @typeParam T - The type of the property value.
 * @public
 */
export class Prop<T> extends Signal<T> {
  /**
   * Checks if a value is a Prop.
   * @param value - The value to check.
   * @returns `true` if the value is a Prop, `false` otherwise.
   */
  static is = <T = unknown>(value: unknown): value is Prop<T> =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value != null && (value as any).$__prop__ === true

  /**
   * @internal
   */
  protected readonly $__prop__ = true

  /**
   * Changes the value of the property and notifies its listeners.
   *
   * @param value - The new value of the property.
   */
  readonly set = (value: T) => {
    this._setAndNotify(value, false)
  }

  /**
   * Updates the value of the signal by applying the provided function to the current value.
   * @param fn - The function to apply to the current value.
   */
  readonly update = (fn: (value: T) => T) => {
    this._setAndNotify(fn(this.get()), false)
  }

  /**
   * Creates a reducer function that combines the provided reducer function and effects.
   * @param fn - The reducer function that takes the current state and an action, and returns the new state.
   * @param effects - An array of effects to be executed after the state is updated.
   * @returns A dispatch function that can be used to update the state and trigger the effects.
   */
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

  /**
   * Creates an isomorphism for the Signal.
   * An isomorphism is a pair of functions that convert values between two types,
   * along with an equality function to compare values of the second type.
   *
   * @param to - A function that converts values from type T to type O.
   * @param from - A function that converts values from type O to type T.
   * @param equals - An optional function that compares values of type O for equality.
   *                Defaults to a strict equality check (===).
   * @returns A Prop object representing the isomorphism.
   */
  readonly iso = <O>(
    to: (value: T) => O,
    from: (value: O) => T,
    equals: (a: O, b: O) => boolean = (a, b) => a === b
  ) => {
    const prop = new Prop(to(this.get()), equals)
    prop.onDispose(this.on(value => prop.set(to(value))))
    prop.on(value => this._setAndNotify(from(value), false))
    return prop
  }

  /**
   * Returns a `Prop` that represents the value at the specified key of the current value.
   *
   * @param key - The key of the value to access.
   * @returns A `Prop` that represents the value at the specified key.
   */
  readonly atProp = <K extends keyof T>(key: K): Prop<T[K]> => {
    return this.iso(
      value => value[key],
      value => ({ ...this.value, [key]: value })
    )
  }
  /**
   *  Access for the current value of the property.
   */
  get value() {
    return this.get()
  }

  set value(value: T) {
    this._setAndNotify(value, false)
  }
}

/**
 * Creates a computed signal that depends on other signals and updates when any of the dependencies change.
 *
 * @typeParam T - The type of the computed value.
 * @param fn - The function that computes the value.
 * @param dependencies - The array of signals that the computed value depends on.
 * @param equals - The equality function used to compare the previous and current computed values.
 * @returns - The computed signal.
 * @public
 */
export const useComputed = <T>(
  fn: () => T,
  dependencies: Array<AnySignal>,
  equals: (a: T, b: T) => boolean = (a, b) => a === b
): Computed<T> => {
  const computed = new Computed(fn, equals)
  dependencies.forEach(signal => signal.setDerivative(computed))
  return computed
}

/**
 * Executes the provided function `fn` whenever any of the signals in the `signals` array change.
 * Returns a disposable object that can be used to stop the effect.
 *
 * @param fn - The function to execute when the signals change.
 * @param signals - An array of signals to watch for changes.
 * @returns A disposable object that can be used to stop the effect.
 * @public
 */
export const useEffect = (fn: () => void, signals: Array<AnySignal>) =>
  useComputed(fn, signals).dispose

/**
 * Creates a new Prop object with the specified value and equality function.
 *
 * @typeParam T - The type of the value.
 * @param value - The initial value of the Prop.
 * @param equals - The equality function used to compare values. Defaults to strict equality (===).
 * @returns A new Prop object.
 * @public
 */
export const useProp = <T>(
  value: T,
  equals: (a: T, b: T) => boolean = (a, b) => a === b
): Prop<T> => new Prop(value, equals)

/**
 * Creates a signal with the specified initial value and equality function.
 *
 * @typeParam T - The type of the signal value.
 * @param value - The initial value of the signal.
 * @param equals - The equality function used to compare signal values. Defaults to a strict equality check (`===`).
 * @returns A new Signal instance.
 * @public
 */
export const useSignal = <T>(
  value: T,
  equals: (a: T, b: T) => boolean = (a, b) => a === b
): Signal<T> => new Signal(value, equals)
