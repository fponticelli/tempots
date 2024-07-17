/**
 * Represents a type that can either hold a value of type T or be undefined.
 *
 * @template T - The type of the value that the Maybe type can hold.
 */
export type Maybe<T> = T | undefined

/**
 * Represents a key type that can be used to index any object.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type IndexKey = keyof any

/**
 * Represents a primitive value that can be of type string, boolean, number, null, or undefined.
 */
export type Primitive = string | boolean | number | null | undefined

/**
 * Represents a value that can be either `undefined` or `null`.
 */
export type Nothing = undefined | null

/**
 * Represents a function that compares two values of type T and returns a number.
 * The returned number indicates the relative order of the two values:
 * - A negative number if `a` is less than `b`.
 * - Zero if `a` is equal to `b`.
 * - A positive number if `a` is greater than `b`.
 *
 * @typeparam T The type of values being compared.
 *
 * @param a The first value to compare.
 * @param b The second value to compare.
 * @returns A number indicating the relative order of the two values.
 */
export type Compare<T> = (a: T, b: T) => number

/**
 * Represents an identity type that preserves the properties of the original type.
 * @template T - The original type.
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export type Id<T> = {} & { [P in keyof T]: T[P] }

/**
 * Represents the type resulting from merging two types `A` and `B`.
 * The resulting type is the intersection of `A` and `B`.
 *
 * @typeparam A - The first type to merge.
 * @typeparam B - The second type to merge.
 */
export type Merge<A, B> = Id<A & B>

/**
 * Converts a tuple type to a union type.
 *
 * @template T - The tuple type to convert.
 * @param {T} - The tuple to convert to a union.
 * @returns {TupleToUnion<T>} - The union type.
 */
export type TupleToUnion<T extends unknown[]> = T[number]

/**
 * Represents a function that takes no arguments and returns a value of type `R`.
 * @template R The return type of the function.
 */
export type Fun0<R> = () => R
/**
 * Represents a function that takes one argument of type `A` and returns a value of type `R`.
 * @template A The type of the function argument.
 * @template R The type of the function return value.
 */
export type Fun1<A, R> = (a: A) => R
/**
 * Represents a function that takes two arguments of types `A` and `B`, and returns a value of type `R`.
 * @template A The type of the first argument.
 * @template B The type of the second argument.
 * @template R The type of the return value.
 */
export type Fun2<A, B, R> = (a: A, b: B) => R
/**
 * Represents a function that takes three arguments of types A, B, and C, and returns a value of type R.
 *
 * @template A - The type of the first argument.
 * @template B - The type of the second argument.
 * @template C - The type of the third argument.
 * @template R - The type of the return value.
 */
export type Fun3<A, B, C, R> = (a: A, b: B, c: C) => R
/**
 * Represents a function that takes four arguments of types A, B, C, and D,
 * and returns a value of type R.
 *
 * @template A - The type of the first argument.
 * @template B - The type of the second argument.
 * @template C - The type of the third argument.
 * @template D - The type of the fourth argument.
 * @template R - The type of the return value.
 */
export type Fun4<A, B, C, D, R> = (a: A, b: B, c: C, d: D) => R
/**
 * Represents a function that takes five arguments of types A, B, C, D, and E,
 * and returns a value of type R.
 *
 * @template A - The type of the first argument.
 * @template B - The type of the second argument.
 * @template C - The type of the third argument.
 * @template D - The type of the fourth argument.
 * @template E - The type of the fifth argument.
 * @template R - The type of the return value.
 */
export type Fun5<A, B, C, D, E, R> = (a: A, b: B, c: C, d: D, e: E) => R
/**
 * Represents a function that takes six arguments of types A, B, C, D, E, F and returns a value of type R.
 * @template A - The type of the first argument.
 * @template B - The type of the second argument.
 * @template C - The type of the third argument.
 * @template D - The type of the fourth argument.
 * @template E - The type of the fifth argument.
 * @template F - The type of the sixth argument.
 * @template R - The type of the return value.
 */
export type Fun6<A, B, C, D, E, F, R> = (
  a: A,
  b: B,
  c: C,
  d: D,
  e: E,
  f: F
) => R

/**
 * Extracts the first argument type from a function type.
 * @template F - The function type.
 * @returns The type of the first argument of the function type.
 */
export type FirstArgument<F> = F extends Fun1<infer A, unknown> ? A : never

/**
 * Filters out elements from a tuple that are equal to the specified type.
 *
 * @template T - The input tuple.
 * @template N - The type to filter out from the tuple.
 * @param {T} - The input tuple.
 * @returns {FilterTuple<T, N>} - The filtered tuple.
 */
export type FilterTuple<T extends unknown[], N> = T extends []
  ? []
  : T extends [infer H, ...infer R]
    ? N extends H
      ? FilterTuple<R, N>
      : [H, ...FilterTuple<R, N>]
    : T

/**
 * Splits a string literal type `T` by a specified delimiter `SplitBy`.
 * Returns a tuple containing the split parts of the string.
 *
 * @template T - The string literal type to split.
 * @template SplitBy - The delimiter to split the string by.
 * @returns A tuple containing the split parts of the string.
 */
export type SplitLiteral<
  T extends string,
  SplitBy extends string,
> = FilterTuple<
  T extends `${infer A}${SplitBy}${infer B}`
    ? [...SplitLiteral<A, SplitBy>, ...SplitLiteral<B, SplitBy>]
    : [T],
  ''
>

/**
 * Converts a string literal type `T` into a union type by splitting it using the specified delimiter `SplitBy`.
 * @template T - The string literal type to split.
 * @template SplitBy - The delimiter used to split the string literal type.
 * @returns A union type representing the split values of the string literal type.
 */
export type SplitLiteralToUnion<
  T extends string,
  SplitBy extends string,
> = TupleToUnion<SplitLiteral<T, SplitBy>>
