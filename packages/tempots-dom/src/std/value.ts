import { GetValueTypes } from '../types/domain'
import {
  ListenerOptions,
  computed,
  effect,
  prop,
  signal,
  Prop,
  Signal,
} from './signal'

/**
 * Represents a value that can either be a `Signal<T>` or a generic type `T`.
 *
 * @public
 */
export type Value<T> = Signal<T> | T

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
      return value
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
export const computedOf =
  <T extends Value<unknown>[]>(...args: T) =>
  <O>(
    fn: (...args: GetValueTypes<T>) => O,
    equals?: (a: O, b: O) => boolean
  ) => {
    if (args.length === 1) {
      return Value.toSignal(args[0]).map(fn as (value: T[0]) => O)
    }
    const signals = args.filter(arg => Signal.is(arg)) as Signal<unknown>[]
    return computed(
      () => fn(...(args.map(arg => Value.get(arg)) as GetValueTypes<T>)),
      signals,
      equals
    )
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
  (fn: (...args: GetValueTypes<T>) => void, options: ListenerOptions = {}) => {
    const signals = args.filter(arg => Signal.is(arg)) as Signal<unknown>[]
    return effect(
      () => fn(...(args.map(Value.get) as GetValueTypes<T>)),
      signals,
      options
    )
  }
