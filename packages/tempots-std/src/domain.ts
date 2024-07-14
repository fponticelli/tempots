export type Maybe<T> = T | undefined

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type IndexKey = keyof any

export type Primitive = string | boolean | number | null | undefined

export type Nothing = undefined | null

export type Compare<T> = (a: T, b: T) => number

// eslint-disable-next-line @typescript-eslint/ban-types
export type Id<T> = {} & { [P in keyof T]: T[P] }

export type Merge<A, B> = Id<A & B>

export type TupleToUnion<T extends unknown[]> = T[number]

export type Fun0<R> = () => R
export type Fun1<A, R> = (a: A) => R
export type Fun2<A, B, R> = (a: A, b: B) => R
export type Fun3<A, B, C, R> = (a: A, b: B, c: C) => R
export type Fun4<A, B, C, D, R> = (a: A, b: B, c: C, d: D) => R
export type Fun5<A, B, C, D, E, R> = (a: A, b: B, c: C, d: D, e: E) => R
export type Fun6<A, B, C, D, E, F, R> = (
  a: A,
  b: B,
  c: C,
  d: D,
  e: E,
  f: F
) => R

export type FirstArgument<F> = F extends Fun1<infer A, unknown> ? A : never

export type FilterTuple<T extends unknown[], N> = T extends []
  ? []
  : T extends [infer H, ...infer R]
    ? N extends H
      ? FilterTuple<R, N>
      : [H, ...FilterTuple<R, N>]
    : T

export type SplitLiteral<
  T extends string,
  SplitBy extends string,
> = FilterTuple<
  T extends `${infer A}${SplitBy}${infer B}`
    ? [...SplitLiteral<A, SplitBy>, ...SplitLiteral<B, SplitBy>]
    : [T],
  ''
>

export type SplitLiteralToUnion<
  T extends string,
  SplitBy extends string,
> = TupleToUnion<SplitLiteral<T, SplitBy>>
