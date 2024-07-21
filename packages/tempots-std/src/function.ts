import { Maybe } from './domain'

/**
 * Returns the input value as is.
 *
 * @param v - The value to be returned.
 * @returns The input value.
 * @typeParam T - The type of the input value.
 * @public
 */
export const identity = <T>(v: T): T => v

/**
 * Curries a function from left to right.
 *
 * @param f - The function to curry.
 * @returns A curried function.
 * @public
 */
export const curryLeft =
  <A, Rest extends unknown[], Ret>(f: (a: A, ...rest: Rest) => Ret) =>
  (a: A) =>
  (...rest: Rest): Ret =>
    f(a, ...rest)

/**
 * Memoizes the result of a function and returns a new function that caches the result.
 * The cached result is returned if available, otherwise the original function is called
 * and the result is cached for future invocations.
 *
 * @param f - The function to memoize.
 * @returns A new function that caches the result of the original function.
 * @public
 */
export const memoize = <T>(f: () => NonNullable<T>): (() => NonNullable<T>) => {
  let value: Maybe<T>
  return () => {
    if (value === undefined) {
      value = f()
    }
    return value!
  }
}
