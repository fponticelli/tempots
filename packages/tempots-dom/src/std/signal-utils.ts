import { getWindow } from '../dom/window'
import { GetValueType, RemoveSignals, Values } from '../types/domain'
import { guessInterpolate } from './interpolate'
import { AnySignal, computed, Computed, prop, Prop, Signal } from './signal'
import { computedOf, Value } from './value'

/**
 * Represents a memory store that stores key-value pairs.
 *
 * @public
 */
export class MemoryStore {
  private readonly _store: Map<string, string> = new Map()

  /**
   * Retrieves the value associated with the specified key from the memory store.
   * @param key - The key to retrieve the value for.
   * @returns The value associated with the key, or `null` if the key is not found.
   */
  readonly getItem = (key: string): string | null => {
    return this._store.get(key) ?? null
  }

  /**
   * Sets the value associated with the specified key in the memory store.
   * @param key - The key to set the value for.
   * @param value - The value to set.
   */
  readonly setItem = (key: string, value: string): void => {
    this._store.set(key, value)
  }
}

/**
 * Represents the properties required for storing and retrieving a value of type `T`.
 *
 * @typeParam T - The type of the value to be stored.
 * @public
 */
export type StoredPropOptions<T> = {
  /**
   * The key to use for storing and retrieving the value.
   */
  key: string
  /**
   * The default value to use if the value is not found in the store.
   * This can be a value of type `T` or a function that returns a value of type `T`.
   * If a function is provided, it will be called to get the default value.
   */
  defaultValue: T | (() => T)
  /**
   * The store to use for storing and retrieving the value.
   */
  store: {
    /**
     * Retrieves the value associated with the specified key from the store.
     * @param key - The key to retrieve the value for.
     * @returns The value associated with the key, or `null` if the key is not found.
     */
    getItem: (key: string) => string | null
    /**
     * Sets the value associated with the specified key in the store.
     * @param key - The key to set the value for.
     * @param value - The value to set.
     */
    setItem: (key: string, value: string) => void
  }
  /**
   * A function that serializes a value of type `T` to a string.
   * The default implementation uses `JSON.stringify`.
   */
  // istanbul ignore next
  serialize?: (v: T) => string
  /**
   * A function that deserializes a string to a value of type `T`.
   * The default implementation uses `JSON.parse`.
   */
  // istanbul ignore next
  deserialize?: (v: string) => T
  /**
   * A function that compares two values of type `T` for equality.
   * The default implementation uses strict equality (`===`).
   */
  // istanbul ignore next
  equals?: (a: T, b: T) => boolean
  /**
   * A function that is called when a value is loaded from the store.
   * The default implementation returns the value as is.
   */
  onLoad?: (value: T) => T
}

/**
 * Creates a stored property that persists its value in a storage mechanism.
 *
 * @typeParam T - The type of the property value.
 * @param options - The options for creating the stored property.
 * @returns - The created stored property.
 * @public
 */
export const storedProp = <T>({
  key,
  defaultValue,
  store,
  serialize = JSON.stringify,
  deserialize = JSON.parse,
  equals = (a, b) => a === b,
  onLoad = value => value,
}: StoredPropOptions<T>): Prop<T> => {
  const initialValue = store.getItem(key)
  const prop = new Prop<T>(
    initialValue != null
      ? onLoad(deserialize(initialValue))
      : typeof defaultValue === 'function'
        ? (defaultValue as () => T)()
        : defaultValue,
    equals
  )
  prop.on(value => store.setItem(key, serialize(value)))
  return prop
}

/**
 * Represents the properties required for storing and retrieving a value of type `T`.
 *
 * @typeParam T - The type of the value to be stored.
 * @public
 */
export type StorageOptions<T> = {
  /**
   * The key to use for storing and retrieving the value.
   */
  key: string
  /**
   * The default value to use if the value is not found in the store.
   * This can be a value of type `T` or a function that returns a value of type `T`.
   * If a function is provided, it will be called to get the default value.
   */
  defaultValue: T | (() => T)
  /**
   * A function that serializes a value of type `T` to a string.
   * The default implementation uses `JSON.stringify`.
   */
  // istanbul ignore next
  serialize?: (v: T) => string
  /**
   * A function that deserializes a string to a value of type `T`.
   * The default implementation uses `JSON.parse`.
   */
  // istanbul ignore next
  deserialize?: (v: string) => T
  /**
   * A function that compares two values of type `T` for equality.
   * The default implementation uses strict equality (`===`).
   */
  // istanbul ignore next
  equals?: (a: T, b: T) => boolean
  /**
   * A function that is called when a value is loaded from the store.
   * The default implementation returns the value as is.
   */
  onLoad?: (value: T) => T
}

/**
 * Creates a prop that is backed by the localStorage or a MemoryStore.
 *
 * @param options - The options for creating the prop.
 * @returns The created prop.
 * @public
 */
export const localStorageProp = <T>(options: StorageOptions<T>): Prop<T> =>
  storedProp({
    ...options,
    /* c8 ignore next 3 */
    store: getWindow()?.localStorage ?? new MemoryStore(),
  })

/**
 * Creates a prop that stores its value in the session storage.
 *
 * @param options - The options for the storage prop.
 * @returns A prop that stores its value in the session storage.
 * @public
 */
export const sessionStorageProp = <T>(options: StorageOptions<T>): Prop<T> =>
  storedProp({
    ...options,
    /* c8 ignore next 3 */
    store: getWindow()?.sessionStorage ?? new MemoryStore(),
  })

function raf(fn: FrameRequestCallback) {
  if (typeof requestAnimationFrame === 'function') {
    return requestAnimationFrame(fn)
    /* c8 ignore next */
  } else {
    /* c8 ignore next 2 */
    return setTimeout(fn, 0)
  }
}

/**
 * Options for animating signals.
 *
 * @typeParam T - The type of the signal values.
 * @public
 */
export type AnimateSignalsOptions<T> = {
  /**
   * The function that interpolates between two values.
   */
  interpolate?: (start: T, end: T, delta: number) => T
  /**
   * The duration of the animation in milliseconds.
   */
  duration?: Value<number>
  /**
   * The easing function for the animation.
   */
  easing?: (t: number) => number
  /**
   * The function that compares two values for equality.
   */
  equals?: (a: T, b: T) => boolean
}

/**
 * Animates signals based on the provided options.
 *
 * @typeParam T - The type of the animated value.
 * @param initialValue - The initial value of the animation.
 * @param fn - A function that returns the end value of the animation.
 * @param dependencies - An array of signals that the animation depends on.
 * @param options - Optional options for the animation.
 * @returns - The animated value as Prop<T>
 * @public
 */
export const animateSignals = <T>(
  initialValue: T,
  fn: () => T,
  dependencies: Array<AnySignal>,
  options?: AnimateSignalsOptions<T>
): Prop<T> => {
  /* c8 ignore next */
  const duration = options?.duration ?? 300
  const easing = options?.easing ?? (t => t)
  const equals = options?.equals ?? ((a, b) => a === b)
  let interpolate = options?.interpolate
  let startValue = initialValue
  let endValue = fn()
  let startTime = performance.now()
  let animationFrame: number | null = null
  let done = true
  const computed = new Computed(fn, equals)
  const animated = prop(initialValue, equals)
  animated.onDispose(() => {
    if (animationFrame !== null) cancelAnimationFrame(animationFrame)
  })
  animated.onDispose(computed.dispose)
  dependencies.forEach(signal => {
    signal.setDerivative(computed)
    signal.onDispose(animated.dispose)
  })
  const changeEndValue = (value: T) => {
    endValue = value
    startTime = performance.now()
    startValue = animated.value
    if (done) {
      done = false
      animationFrame = raf(update)
    }
  }
  const update = () => {
    const now = performance.now()
    const delta = (now - startTime) / Value.get(duration)
    const t = easing(delta)
    if (interpolate == null) {
      interpolate = guessInterpolate(startValue) as (
        start: T,
        end: T,
        delta: number
      ) => T
    }
    let currentValue = interpolate(startValue, endValue, t)
    if (delta >= 1) {
      done = true
      currentValue = endValue
    } else {
      animationFrame = raf(update)
    }
    animated.set(currentValue)
  }
  computed.on(changeEndValue)
  return animated
}

/**
 * Represents the configuration options for animating a signal.
 *
 * @typeParam T - The type of the signal value.
 * @public
 */
export type AnimateSignal<T> = {
  /**
   * The initial value for the animation. If not provided, the current value of the input signal will be used.
   */
  initialValue?: T
  /**
   * The interpolation function to use for calculating intermediate values during the animation.
   */
  interpolate?: (start: T, end: T, delta: number) => T
  /**
   * The duration of the animation in milliseconds.
   */
  duration?: number
  /**
   * The easing function to use for controlling the animation progress.
   */
  easing?: (t: number) => number
  /**
   * The equality function to use for comparing signal values.
   */
  equals?: (a: T, b: T) => boolean
}

/**
 * Animates a signal by creating a new signal that transitions from an initial value to the current value of the input signal.
 *
 * @typeParam T - The type of the signal value.
 * @param signal - The input signal to animate.
 * @param options - The animation options.
 * @returns - The animated signal.
 * @public
 */
export const animateSignal = <T>(
  signal: Signal<T>,
  options?: AnimateSignal<T>
): Prop<T> => {
  /* c8 ignore next */
  const { initialValue, ...rest } = options ?? {}
  /* c8 ignore next */
  return animateSignals(
    /* c8 ignore next 2 */
    initialValue ?? signal.get(),
    signal.get,
    [signal],
    rest
  )
}

/**
 * Computes a value based on a record of signals and literals.
 *
 * @typeParam T - The type of the record containing signals and literals.
 * @typeParam O - The type of the computed value.
 * @param record - The record containing signals and literals.
 * @param fn - The function to compute the value based on the literals.
 * @returns - The computed value as a signal.
 * @public
 */
export const computedRecord = <T extends Record<string, Value<unknown>>, O>(
  record: T,
  fn: (value: RemoveSignals<T>) => O
) => {
  const signals = Object.values(record).filter(Signal.is) as Signal<unknown>[]
  const keys = Object.keys(record) as (keyof T)[]
  return computed(() => {
    const literals = {} as RemoveSignals<T>
    for (const key of keys) {
      literals[key] = Value.get(record[key]) as GetValueType<T[typeof key]>
    }
    return fn(literals)
  }, signals)
}

/**
 * Merges a record of signals and literals into a single signal.
 *
 * @typeParam T - The type of the record containing signals and literals.
 * @param options - The record containing signals and literals.
 * @returns - The merged signal.
 * @public
 */
export const merge = <T extends Record<string, Value<unknown>>>(
  options: T
): Signal<{ [K in keyof T]: GetValueType<T[K]> }> =>
  computedRecord(options, v => v as { [K in keyof T]: GetValueType<T[K]> })

/**
 * Delays the value of a signal by a specified amount of time.
 *
 * @typeParam T - The type of the signal value.
 * @param signal - The signal to delay.
 * @param ms - The amount of time to delay the signal in milliseconds.
 * @returns - The delayed signal.
 * @public
 */
export const delaySignal = <T>(
  signal: Signal<T>,
  ms: number | ((value: T) => number)
): Signal<T> => {
  const newSignal = prop(signal.get())
  let timeout: ReturnType<typeof setTimeout> | null = null
  const dispose = signal.on(value => {
    if (timeout != null) clearTimeout(timeout)
    timeout = setTimeout(
      () => {
        timeout = null
        newSignal.set(value)
      },
      typeof ms === 'function' ? ms(value) : ms
    )
  })
  newSignal.onDispose(() => {
    dispose()
    /* c8 ignore next 2 */
    if (timeout != null) clearTimeout(timeout)
  })
  return newSignal
}

/**
 * Binds a function or signal of a function to a set of signals and literals.
 *
 * @typeParam FN - The type of the function to bind.
 * @typeParam R - The return type of the function.
 * @param fn - The function to bind.
 * @returns - A function that takes a set of signals and literals and returns a computed signal.
 * @public
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const bind = <FN extends (...args: any[]) => R, R = ReturnType<FN>>(
  fn: Value<FN>
) => {
  return (...args: Values<Parameters<FN>>): Computed<R> => {
    return computedOf(
      fn as Value<FN>,
      ...args
    )((f, ...rest) => (f as FN)(...rest))
  }
}

/**
 * Returns the first non-null and non-undefined value from a set of signals and literals.
 *
 * @typeParam T - The type of the signals and literals.
 * @param args - The set of signals and literals to search.
 * @returns - A computed signal that emits the first non-null and non-undefined value.
 * @public
 */
export const coalesce = <T extends Value<unknown>[]>(...args: T) => {
  return computedOf(...args)((...args) => args.find(a => a != null))
}
