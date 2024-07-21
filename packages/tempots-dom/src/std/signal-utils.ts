import { RemoveSignals, Value } from '../types/domain'
import { guessInterpolate } from './interpolate'
import {
  AnySignal,
  useComputed,
  Computed,
  useProp,
  Prop,
  Signal,
} from './signal'

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
  prop.on(value => {
    store.setItem(key, serialize(value))
  })
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
    store: window?.localStorage ?? new MemoryStore(),
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
    store: window?.sessionStorage ?? new MemoryStore(),
  })

function raf(fn: FrameRequestCallback) {
  if (typeof requestAnimationFrame === 'function') {
    return requestAnimationFrame(fn)
  } else {
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
  // istanbul ignore next
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
  const animated = useProp(initialValue, equals)
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
    const delta = (now - startTime) / Signal.unwrap(duration)
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
  // istanbul ignore next
  const { initialValue, ...rest } = options ?? {}
  // istanbul ignore next
  return animateSignals(
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
export const useComputedRecord = <T extends Record<string, Value<unknown>>, O>(
  record: T,
  fn: (value: RemoveSignals<T>) => O
) => {
  type RSignal = [string | number | symbol, Signal<unknown>]
  type RSignals = RSignal[]
  type RLiterals = RemoveSignals<T>
  type R = { signals: RSignals; literals: RLiterals }
  const { signals, literals } = Object.entries(record).reduce(
    ({ signals, literals }, [key, value]) => {
      if (Signal.is(value)) {
        signals.push([key, value] as RSignal)
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(literals as any)[key] = value
      }
      return { signals, literals }
    },
    { signals: [], literals: {} as RemoveSignals<T> } as R
  )
  const signalsArray = signals.map(([, s]) => s)
  return useComputed(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    signals.forEach(([key, sig]) => ((literals as any)[key] = sig.value))
    return fn(literals)
  }, signalsArray)
}
