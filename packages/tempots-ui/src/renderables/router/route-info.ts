import { SplitLiteral, TupleToUnion } from '@tempots/std'

/**
 * Represents information about a route.
 *
 * @typeParam P - The type of the route parameters.
 * @typeParam R - The type of the route.
 * @public
 */
export type RouteInfo<P, R = string> = {
  /**
   * The parameters of the route.
   */
  readonly params: P
  /**
   * The route that was matched.
   */
  readonly route: R
  /**
   * The path that was matched.
   */
  readonly path: string
  /**
   * The search parameters of the route.
   */
  readonly search: Record<string, string>
  /**
   * The hash of the route.
   */
  readonly hash?: string
}

/**
 * Represents a route parameter.
 *
 * @public
 */
export type RouteParam = {
  /**
   * The type of the route parameter.
   */
  type: 'param'
  /**
   * The name of the route parameter.
   */
  name: string
}

/**
 * Represents a literal route.
 *
 * @public
 */
export type RouteLiteral = {
  /**
   * The type of the route literal.
   */
  type: 'literal'
  /**
   * The value of the route literal
   */
  value: string
}

/**
 * Represents a catch-all route.
 *
 * @public
 */
export type RouteCatchAll = {
  /**
   * The type of the catch-all
   */
  type: 'catch-all'
}

/**
 * Represents a segment of a route.
 *
 * @public
 */
export type RouteSegment = RouteParam | RouteLiteral | RouteCatchAll

/**
 * Represents a route in the application.
 *
 * @public
 */
export type Route = RouteSegment[]

/**
 * Represents a type that transforms a tuple of strings into an object with string keys.
 * If the input type is a tuple, each element of the tuple will become a key in the resulting object,
 * with the corresponding value being a string.
 * If the input type is not a tuple, the resulting type will be `never`.
 *
 * @typeparam P - The input type, which can be a tuple of strings or any other type.
 * @returns - If `P` is a tuple, an object with string keys. Otherwise, `never`.
 * @public
 */
export type MakeParams<P> = P extends string[]
  ? { [K in TupleToUnion<P>]: string }
  : never

/**
 * Extracts the parameter names from a tuple type.
 *
 * @typeParam S - The tuple type from which to extract the parameter names.
 * @returns An array of parameter names extracted from the tuple type.
 * @public
 */
export type ExtractParamsFromTuple<S extends unknown[]> = S extends []
  ? []
  : S extends [infer H, ...infer R]
    ? H extends `:${infer P}`
      ? [P, ...ExtractParamsFromTuple<R>]
      : ExtractParamsFromTuple<R>
    : never

/**
 * Extracts the parameters from a string literal representing a route path.
 * @typeParam S - The string literal representing the route path.
 * @returns The extracted parameters from the route path.
 * @public
 */
export type ExtractParams<S extends string> =
  SplitLiteral<S, '/'> extends infer T
    ? T extends unknown[]
      ? ExtractParamsFromTuple<T>
      : never
    : never
