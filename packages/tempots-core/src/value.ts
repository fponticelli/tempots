import {
  ListenerOptions,
  computed,
  effect,
  prop,
  signal,
  Prop,
  Signal,
} from './signal'
import { ValueTypes } from './types'

/**
 * Represents a value that can either be a `Signal<T>` or a generic type `T`.
 *
 * @public
 */
export type Value<T> = Signal<T> | T

function isTruthy<T>(value: T): boolean {
  return value != null && value !== false && value !== 0 && value !== ''
}

function isFalsy<T>(value: T): boolean {
  return !isTruthy(value)
}

function isNil<T>(value: T): boolean {
  return value == null
}

function isDefined<T>(value: T): boolean {
  return value != null
}

export const Value = {
  /**
   * Maps a value or a Signal to a new value.
   * If the value is a Signal, it returns a new Signal with the mapped value.
   * If the value is not a Signal, it returns the mapped value.
   *
   * @typeParam T - The type of the value.
   * @typeParam U - The type of the new value.
   * @param value - The value or Signal to map.
   * @param fn - The function to map the value.
   * @returns The mapped value.
   */
  map: <T, U>(value: Value<T>, fn: (value: T) => U): Value<U> => {
    if (Signal.is(value)) {
      return value.map(fn)
    } else {
      return fn(value)
    }
  },

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
  toSignal: <T>(
    value: Value<T>,
    equals?: (a: T, b: T) => boolean
  ): Signal<T> => {
    if (Signal.is(value)) {
      // derive is necessary to avoid disposing the original signal
      return value.derive()
    } else {
      return signal(value, equals)
    }
  },

  /**
   * Wraps a value in a `Signal` if it is not already a `Signal`.
   * If the value is `null` or `undefined`, it returns `null` or `undefined` respectively.
   * @param value - The value to wrap or check.
   * @returns The wrapped value if it is not `null` or `undefined`, otherwise `null` or `undefined`.
   */
  maybeToSignal: <T>(
    value: Value<T> | undefined | null,
    equals?: (a: T, b: T) => boolean
  ): Signal<T> | undefined => {
    if (value == null) return undefined
    return Value.toSignal(value, equals)
  },
  /**
   * Gets the value from a `Signal` or the value itself if it is not a `Signal`.
   * @param value - The value or Signal instance to get the value from.
   * @returns The value.
   */
  get: <T>(value: Value<T>): T => {
    if (Signal.is(value)) {
      return value.get()
    } else {
      return value
    }
  },
  /**
   * Adds a listener to a `Signal` or calls the listener immediately if it is not a `Signal`.
   * @param value - The value or Signal instance to add the listener to.
   * @param listener - The listener to call when the value changes.
   * @returns A function to remove the listener.
   */
  on: <T>(value: Value<T>, listener: (value: T) => void): (() => void) => {
    if (Signal.is(value)) {
      return value.on(listener)
    } else {
      listener(value)
      return () => {}
    }
  },

  /**
   * Disposes of a value or a Signal.
   * If the value is a Signal, it disposes of the Signal.
   * If the value is not a Signal, it does nothing.
   * @param value - The value or Signal instance to dispose of.
   */
  dispose: <T>(value: Value<T>): void => {
    if (Signal.is(value)) {
      value.dispose()
    }
  },

  /**
   * Returns a function that disposes of a value or a Signal.
   * If the value is a Signal, it returns a function that disposes of the Signal.
   * If the value is not a Signal, it returns a function that does nothing.
   * @param value - The value or Signal instance to dispose of.
   * @returns A function to dispose of the value or Signal.
   */
  disposeFn:
    <T>(value: Value<T>) =>
    () =>
      Value.dispose(value),

  /**
   * Derives a Prop from a Signal.
   * If the value is a Signal, it returns a new Prop with the derived value.
   * If the value is not a Signal, it returns a new Prop with the value.
   * @param value - The value or Signal instance to derive the Prop from.
   * @param options - The options for the derived Prop.
   * @param options.autoDisposeProp - Determines whether the derived Prop should be automatically disposed.
   * @param options.equals - A function that determines if two values are equal.
   * @returns A Prop instance.
   */
  deriveProp: <T>(
    value: Value<T>,
    {
      autoDisposeProp = true,
      equals,
    }: {
      autoDisposeProp?: boolean
      equals?: (a: T, b: T) => boolean
    } = {}
  ): Prop<T> => {
    if (Signal.is(value)) {
      return value.deriveProp({ autoDisposeProp, equals })
    } else {
      return prop(value, equals)
    }
  },

  /**
   * Creates a new signal that emits `true` if the value is truthy, `false` otherwise.
   * @param value - The value or signal to check.
   * @returns A signal that emits `true` if the value is truthy, `false` otherwise.
   */
  truthy: <T>(value: Value<T>): Value<boolean> => Value.map(value, isTruthy),
  /**
   * Creates a new signal that emits `true` if the value is falsy, `false` otherwise.
   * @param value - The value or signal to check.
   * @returns A signal that emits `true` if the value is falsy, `false` otherwise.
   */
  falsy: <T>(value: Value<T>): Value<boolean> => Value.map(value, isFalsy),
  /**
   * Creates a new signal that emits `true` if the value is null or undefined, `false` otherwise.
   * @param value - The value or signal to check.
   * @returns A signal that emits `true` if the value is null or undefined, `false` otherwise.
   */
  nil: <T>(value: Value<T>): Value<boolean> => Value.map(value, isNil),
  /**
   * Creates a new signal that emits `true` if the value is not null or undefined, `false` otherwise.
   * @param value - The value or signal to check.
   * @returns A signal that emits `true` if the value is not null or undefined, `false` otherwise.
   */
  defined: <T>(value: Value<T>): Value<boolean> => Value.map(value, isDefined),
}

/**
 * Creates a computed signal that depends on other signals or literal values and updates when any of the dependencies change.
 *
 * @typeParam T - The type of the argument values.
 * @param fn - The function that computes the value.
 * @param equals - The equality function used to compare the previous and current computed values.
 * @returns - The computed signal.
 * @public
 */
export const computedOf = <T extends Value<unknown>[]>(...args: T) => {
  return <O>(
    fn: (...args: ValueTypes<T>) => O,
    equals?: (a: O, b: O) => boolean
  ) => {
    if (args.length === 1) {
      return Value.toSignal(args[0]).map(fn as (value: T[0]) => O)
    }
    const signals = args.filter(arg => Signal.is(arg)) as Signal<unknown>[]
    return computed(
      () => fn(...(args.map(arg => Value.get(arg)) as ValueTypes<T>)),
      signals,
      equals
    )
  }
}

/**
 * Creates a computed signal that depends on other signals or literal values and performs an
 * asynchronous computation when any of the dependencies change.
 *
 * This is the async version of `computedOf`. It handles Promise-based computations by providing
 * an alternative value while the async operation is pending and optional error recovery.
 *
 * @typeParam T - The types of the dependency values.
 * @param args - The signals or literal values that the computation depends on.
 * @returns A function that takes the async computation function and configuration.
 *
 * @example
 * ```ts
 * const userId = sig(1)
 * const userData = computedOfAsync(userId)(
 *   async (id) => await fetchUser(id),
 *   { name: 'Loading...', id: 0 },  // alt value while loading
 *   (error) => ({ name: 'Error', id: -1 })  // optional recovery
 * )
 * ```
 *
 * @public
 */
export const computedOfAsync = <T extends Value<unknown>[]>(...args: T) => {
  /**
   * @param fn - The async function that computes the value from the dependencies.
   * @param alt - The alternative value to use while the async operation is pending or on error (if no recover is provided).
   * @param recover - Optional function to recover from errors, returning an alternative value.
   * @param equals - Optional equality function to compare values. Defaults to strict equality.
   * @returns A signal that emits the computed value.
   */
  return <O>(
    fn: (...args: ValueTypes<T>) => Promise<O>,
    alt: O,
    recover?: (error: unknown) => O,
    equals: (a: O, b: O) => boolean = (a, b) => a === b
  ) => {
    return computedOf(...args)((...args) => args).mapAsync(
      ([...args]) => fn(...(args as ValueTypes<T>)),
      alt,
      recover,
      equals
    )
  }
}

/**
 * Joins a set of signals into a single signal that emits a record of the values.
 * @param values - The set of signals to join as a record of `Value`s.
 * @returns A signal that emits a record of the values.
 * @public
 */
export const joinSignals = <T extends Record<string, Value<unknown>>>(
  values: T
): Signal<{ [K in keyof T]: T[K] }> => {
  const keys = Object.keys(values) as (keyof T)[]
  return computedOf(...Object.values(values))(
    (...args) =>
      Object.fromEntries(keys.map((key, index) => [key, args[index]])) as {
        [K in keyof T]: T[K]
      }
  )
}

/**
 * Creates an effect that depends on other signals or literal values and updates when any of the dependencies change.
 *
 * @param args - The array of signals or literal values that the effect depends on.
 * @returns A disposable object that can be used to stop the effect.
 * @public
 */
export const effectOf =
  <T extends Value<unknown>[]>(...args: T) =>
  (fn: (...args: ValueTypes<T>) => void, options: ListenerOptions = {}) => {
    const signals = args.filter(arg => Signal.is(arg)) as Signal<unknown>[]
    return effect(
      () => fn(...(args.map(Value.get) as ValueTypes<T>)),
      signals,
      options
    )
  }
