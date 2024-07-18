import { Maybe } from './domain'

/**
 * Returns the input value as is.
 *
 * @param v - The value to be returned.
 * @returns The input value.
 * @typeParam T - The type of the input value.
 * @public
 */
export function identity<T>(v: T): T {
  return v
}

/**
 * Curries a function from left to right.
 *
 * @param f - The function to curry.
 * @returns A curried function.
 * @public
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function curryLeft<A, Rest extends any[], Ret>(
  f: (a: A, ...rest: Rest) => Ret
) {
  return (a: A) =>
    (...rest: Rest): Ret =>
      f(a, ...rest)
}

/**
 * Memoizes the result of a function and returns a new function that caches the result.
 * The cached result is returned if available, otherwise the original function is called
 * and the result is cached for future invocations.
 *
 * @param f - The function to memoize.
 * @returns A new function that caches the result of the original function.
 * @public
 */
export function memoize<T>(f: () => NonNullable<T>): () => NonNullable<T> {
  let value: Maybe<T>
  return () => {
    if (value === undefined) {
      value = f()
    }
    return value!
  }
}
