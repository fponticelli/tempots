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

/**
 * Composes functions from right to left.
 *
 * This function creates a new function that applies the given functions
 * in right-to-left order. The rightmost function can accept multiple arguments,
 * while the others must be unary.
 *
 * @example
 * ```typescript
 * const add = (a: number, b: number) => a + b
 * const double = (x: number) => x * 2
 * const square = (x: number) => x * x
 *
 * const composed = compose(square, double, add)
 * const result = composed(2, 3) // square(double(add(2, 3))) = square(double(5)) = square(10) = 100
 * ```
 *
 * @param fns - Functions to compose
 * @returns A new function that applies all functions in right-to-left order
 * @public
 */
// Overloads for better type safety with specific numbers of functions
export function compose(): <T>(arg: T) => T

export function compose<TArgs extends unknown[], R1>(
  fn1: (...args: TArgs) => R1
): (...args: TArgs) => R1

export function compose<TArgs extends unknown[], R1, R2>(
  fn2: (arg: R1) => R2,
  fn1: (...args: TArgs) => R1
): (...args: TArgs) => R2

export function compose<TArgs extends unknown[], R1, R2, R3>(
  fn3: (arg: R2) => R3,
  fn2: (arg: R1) => R2,
  fn1: (...args: TArgs) => R1
): (...args: TArgs) => R3

export function compose<TArgs extends unknown[], R1, R2, R3, R4>(
  fn4: (arg: R3) => R4,
  fn3: (arg: R2) => R3,
  fn2: (arg: R1) => R2,
  fn1: (...args: TArgs) => R1
): (...args: TArgs) => R4

export function compose(
  ...fns: Array<(arg: unknown) => unknown>
): (...args: unknown[]) => unknown {
  if (fns.length === 0) {
    return <T>(arg: T): T => arg
  }

  if (fns.length === 1) {
    return fns[0] as (...args: unknown[]) => unknown
  }

  const [first, ...rest] = [...fns].reverse()

  return (...args: unknown[]) =>
    rest.reduce(
      (acc, fn) => fn(acc),
      (first as (...args: unknown[]) => unknown)(...args)
    )
}

/**
 * Pipes a value through a series of functions from left to right.
 *
 * This function applies the given functions to a value in left-to-right order,
 * passing the result of each function to the next.
 *
 * @example
 * ```typescript
 * const add5 = (x: number) => x + 5
 * const double = (x: number) => x * 2
 * const square = (x: number) => x * x
 *
 * const result = pipe(3, add5, double, square) // square(double(add5(3))) = square(double(8)) = square(16) = 256
 * ```
 *
 * @param value - The initial value
 * @param fns - Functions to apply in sequence
 * @returns The final result after applying all functions
 * @public
 */
// Overloads for better type safety with specific numbers of functions
export function pipe<A, B>(value: A, f1: (a: A) => B): B
export function pipe<A, B, C>(value: A, f1: (a: A) => B, f2: (b: B) => C): C
export function pipe<A, B, C, D>(
  value: A,
  f1: (a: A) => B,
  f2: (b: B) => C,
  f3: (c: C) => D
): D
export function pipe<A, B, C, D, E>(
  value: A,
  f1: (a: A) => B,
  f2: (b: B) => C,
  f3: (c: C) => D,
  f4: (d: D) => E
): E
export function pipe<T>(
  value: T,
  ...fns: Array<(arg: unknown) => unknown>
): unknown
export function pipe<T>(
  value: T,
  ...fns: Array<(arg: unknown) => unknown>
): unknown {
  return fns.reduce((acc, fn) => fn(acc), value as unknown)
}

export type ArgsSubset<T extends unknown[]> = T extends []
  ? []
  : T extends [infer A, ...infer Rest]
    ? [A] | [A, ...ArgsSubset<Rest>]
    : never

export type ArgsAfter<
  Args extends unknown[],
  After extends ArgsSubset<Args>,
> = Args extends [...After, ...infer Rest] ? Rest : never

export type Drop<
  T extends unknown[],
  N extends number,
  I extends unknown[] = [],
> = I['length'] extends N
  ? T
  : // eslint-disable-next-line @typescript-eslint/no-unused-vars
    T extends [infer _, ...infer R]
    ? Drop<R, N, [...I, unknown]>
    : []

/**
 * Creates a partially applied function.
 *
 * This function allows you to fix some arguments of a function,
 * returning a new function that accepts the remaining arguments.
 *
 * @example
 * ```typescript
 * const add = (a: number, b: number, c: number) => a + b + c
 * const add5And10 = partial(add, 5, 10)
 * const result = add5And10(3) // 5 + 10 + 3 = 18
 * ```
 *
 * @param fn - The function to partially apply
 * @param partialArgs - Arguments to fix
 * @returns A new function that accepts the remaining arguments
 * @public
 */
export function partial<
  PrefixArgs extends unknown[],
  RestArgs extends unknown[],
  Return,
>(
  fn: (...args: [...PrefixArgs, ...RestArgs]) => Return,
  ...prefixArgs: PrefixArgs
): (...rest: RestArgs) => Return {
  return (...rest: RestArgs) => fn(...prefixArgs, ...rest)
}

export type Reverse<T extends unknown[]> = T extends [infer A, ...infer Rest]
  ? [...Reverse<Rest>, A]
  : []

/**
 * Reverses the order of all arguments of a function.
 *
 * This function creates a new function that calls the original function
 * with all arguments in reverse order. This is useful for creating more
 * readable function compositions or when you need to change the argument
 * order for currying or partial application.
 *
 * @example
 * ```typescript
 * const divide = (a: number, b: number) => a / b
 * const flippedDivide = flip(divide)
 *
 * divide(10, 2) // 5
 * flippedDivide(2, 10) // 5 (same result, but arguments are reversed)
 *
 * // Works with any number of arguments
 * const subtract = (a: number, b: number, c: number) => a - b - c
 * const flippedSubtract = flip(subtract)
 *
 * subtract(10, 3, 2) // 5 (10 - 3 - 2)
 * flippedSubtract(2, 3, 10) // 5 (10 - 3 - 2, arguments reversed)
 * ```
 *
 * @param fn - The function to flip
 * @returns A new function with all arguments reversed
 * @public
 */
export function flip<TArgs extends unknown[], R>(
  fn: (...args: TArgs) => R
): (...args: Reverse<TArgs>) => R {
  return (...args: unknown[]) =>
    fn(...(args.slice().reverse() as unknown as TArgs))
}

/**
 * Ensures a function is called at most once.
 *
 * Subsequent calls return the result of the first call without
 * executing the function again.
 *
 * @example
 * ```typescript
 * let counter = 0
 * const increment = once(() => ++counter)
 *
 * increment() // 1
 * increment() // 1 (same result, function not called again)
 * increment() // 1
 * ```
 *
 * @param fn - The function to wrap
 * @returns A new function that can only be called once
 * @public
 */
export const once = <Args extends readonly unknown[], Return>(
  fn: (...args: Args) => Return
): ((...args: Args) => Return) => {
  let called = false
  let result: Return

  return (...args: Args) => {
    if (!called) {
      called = true
      result = fn(...args)
    }
    return result
  }
}

/**
 * Creates a negated version of a predicate function.
 *
 * This function returns a new predicate that returns the opposite
 * boolean result of the original predicate.
 *
 * @example
 * ```typescript
 * const isEven = (n: number) => n % 2 === 0
 * const isOdd = negate(isEven)
 *
 * isEven(4) // true
 * isOdd(4) // false
 * isOdd(3) // true
 * ```
 *
 * @param predicate - The predicate function to negate
 * @returns A new predicate that returns the opposite result
 * @public
 */
export const negate = <Args extends readonly unknown[]>(
  predicate: (...args: Args) => boolean
): ((...args: Args) => boolean) => {
  return (...args: Args) => !predicate(...args)
}
