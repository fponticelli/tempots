import { SplitLiteral, TupleToUnion } from '@tempots/std'

export interface RouteInfo<P, R = string> {
  params: P
  route: R
  path: string
  search: Record<string, string>
  hash?: string
}

export type RouteParam = {
  type: 'param'
  name: string
}

export type RouteLiteral = {
  type: 'literal'
  value: string
}

export type RouteCatchAll = {
  type: 'catch-all'
}

export type RouteSegment = RouteParam | RouteLiteral | RouteCatchAll

export type Route = RouteSegment[]

export type MakeParams<P> = P extends string[]
  ? { [K in TupleToUnion<P>]: string }
  : never

export type ExtractParamsFromTuple<S extends unknown[]> = S extends []
  ? []
  : S extends [infer H, ...infer R]
    ? H extends `:${infer P}`
      ? [P, ...ExtractParamsFromTuple<R>]
      : ExtractParamsFromTuple<R>
    : never

export type ExtractParams<S extends string> =
  SplitLiteral<S, '/'> extends infer T
    ? T extends unknown[]
      ? ExtractParamsFromTuple<T>
      : never
    : never
