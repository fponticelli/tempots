/**
 * Represents a type that can either hold a value of type T or be undefined.
 *
 * @typeParam T - The type of the value that the Maybe type can hold.
 * @public
 */
export type Maybe<T> = T | undefined

/**
 * Represents a key type that can be used to index any object.
 * @public
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type IndexKey = keyof any

/**
 * Represents a primitive value that can be of type string, boolean, number, null, or undefined.
 * @public
 */
export type Primitive = string | boolean | number | null | undefined

/**
 * Represents a value that can be either `undefined` or `null`.
 * @public
 */
export type Nothing = undefined | null

/**
 * Represents a function that compares two values of type T and returns a number.
 * The returned number indicates the relative order of the two values:
 * - A negative number if `a` is less than `b`.
 * - Zero if `a` is equal to `b`.
 * - A positive number if `a` is greater than `b`.
 *
 * @typeParam T - The type of values being compared.
 *
 * @param a - The first value to compare.
 * @param b - The second value to compare.
 * @returns A number indicating the relative order of the two values.
 * @public
 */
export type Compare<T> = (a: T, b: T) => number

/**
 * Represents an identity type that preserves the properties of the original type.
 * @typeParam T - The original type.
 * @public
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export type Id<T> = {} & { [P in keyof T]: T[P] }

/**
 * Represents the type resulting from merging two types `A` and `B`.
 * The resulting type is the intersection of `A` and `B`.
 *
 * @typeParam A - The first type to merge.
 * @typeParam B - The second type to merge.
 * @public
 */
export type Merge<A, B> = Id<A & B>

/**
 * Converts a tuple type to a union type.
 *
 * @typeParam T - The tuple type to convert.
 * @param T - The tuple to convert to a union.
 * @returns The union type.
 * @public
 */
export type TupleToUnion<T extends unknown[]> = T[number]

/**
 * Represents a function that takes no arguments and returns a value of type `R`.
 * @typeParam R - The return type of the function.
 * @public
 */
export type Fun0<R> = () => R
/**
 * Represents a function that takes one argument of type `A` and returns a value of type `R`.
 * @typeParam A - The type of the function argument.
 * @typeParam R - The type of the function return value.
 * @public
 */
export type Fun1<A, R> = (a: A) => R
/**
 * Represents a function that takes two arguments of types `A` and `B`, and returns a value of type `R`.
 * @typeParam A - The type of the first argument.
 * @typeParam B - The type of the second argument.
 * @typeParam R - The type of the return value.
 * @public
 */
export type Fun2<A, B, R> = (a: A, b: B) => R
/**
 * Represents a function that takes three arguments of types A, B, and C, and returns a value of type R.
 *
 * @typeParam A - The type of the first argument.
 * @typeParam B - The type of the second argument.
 * @typeParam C - The type of the third argument.
 * @typeParam R - The type of the return value.
 * @public
 */
export type Fun3<A, B, C, R> = (a: A, b: B, c: C) => R
/**
 * Represents a function that takes four arguments of types A, B, C, and D,
 * and returns a value of type R.
 *
 * @typeParam A - The type of the first argument.
 * @typeParam B - The type of the second argument.
 * @typeParam C - The type of the third argument.
 * @typeParam D - The type of the fourth argument.
 * @typeParam R - The type of the return value.
 * @public
 */
export type Fun4<A, B, C, D, R> = (a: A, b: B, c: C, d: D) => R
/**
 * Represents a function that takes five arguments of types A, B, C, D, and E,
 * and returns a value of type R.
 *
 * @typeParam A - The type of the first argument.
 * @typeParam B - The type of the second argument.
 * @typeParam C - The type of the third argument.
 * @typeParam D - The type of the fourth argument.
 * @typeParam E - The type of the fifth argument.
 * @typeParam R - The type of the return value.
 * @public
 */
export type Fun5<A, B, C, D, E, R> = (a: A, b: B, c: C, d: D, e: E) => R
/**
 * Represents a function that takes six arguments of types A, B, C, D, E, F and returns a value of type R.
 * @typeParam A - The type of the first argument.
 * @typeParam B - The type of the second argument.
 * @typeParam C - The type of the third argument.
 * @typeParam D - The type of the fourth argument.
 * @typeParam E - The type of the fifth argument.
 * @typeParam F - The type of the sixth argument.
 * @typeParam R - The type of the return value.
 * @public
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
 * @typeParam F - The function type.
 * @returns The type of the first argument of the function type.
 * @public
 */
export type FirstArgument<F> = F extends Fun1<infer A, unknown> ? A : never

/**
 * Filters out elements from a tuple that are equal to the specified type.
 *
 * @typeParam T - The input tuple.
 * @typeParam N - The type to filter out from the tuple.
 * @param T - The input tuple.
 * @returns The filtered tuple.
 * @public
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
 * @typeParam T - The string literal type to split.
 * @typeParam SplitBy - The delimiter to split the string by.
 * @returns A tuple containing the split parts of the string.
 * @public
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
 * @typeParam T - The string literal type to split.
 * @typeParam SplitBy - The delimiter used to split the string literal type.
 * @returns A union type representing the split values of the string literal type.
 * @public
 */
export type SplitLiteralToUnion<
  T extends string,
  SplitBy extends string,
> = TupleToUnion<SplitLiteral<T, SplitBy>>

/**
 * Creates a new type by making the specified key `K` of `T` optional.
 * @typeParam T - The type to create a new type from.
 * @typeParam K - The key of `T` to make optional.
 * @returns A new type with the specified key made optional.
 * @public
 */
export type PartialBy<T, K extends keyof T> = Merge<
  Omit<T, K>,
  Partial<Pick<T, K>>
>
