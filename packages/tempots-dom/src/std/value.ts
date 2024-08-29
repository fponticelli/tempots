import { GetValueTypes } from '../types/domain'
import { makeComputed, makeEffect, makeSignal, Signal } from './signal'

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
      return makeSignal(value, equals)
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
export const makeComputedOf =
  <T extends Value<unknown>[]>(...args: T) =>
  <O>(
    fn: (...args: GetValueTypes<T>) => O,
    equals?: (a: O, b: O) => boolean
  ) => {
    const signals = args.filter(arg => Signal.is(arg)) as Signal<unknown>[]
    return makeComputed(
      () => fn(...(args.map(arg => Value.get(arg)) as GetValueTypes<T>)),
      signals,
      equals
    )
  }

/**
 * Creates an effect that depends on other signals or literal values and updates when any of the dependencies change.
 *
 * @param args - The array of signals or literal values that the effect depends on.
 * @returns A disposable object that can be used to stop the effect.
 * @public
 */
export const makeEffectOf =
  <T extends Value<unknown>[]>(...args: T) =>
  (fn: (...args: GetValueTypes<T>) => void) => {
    const signals = args.filter(arg => Signal.is(arg)) as Signal<unknown>[]
    makeEffect(() => fn(...(args.map(Value.get) as GetValueTypes<T>)), signals)
  }
