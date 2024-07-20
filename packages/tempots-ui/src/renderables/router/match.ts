import { ExtractParams, Route, RouteSegment } from './route-info'

/**
 * The result of a route match.
 *
 * @public
 */
export type MatchResult<P extends string> = {
  params: ExtractParams<P>
  path: P
} | null

/**
 * The result of a route match with the matched route.
 *
 * @public
 */
export type MatchResultWithRoute<P extends string, R extends string> = {
  params: ExtractParams<P>
  route: R
  path: P
} | null

/**
 * Matches a path against a route.
 *
 * @param route - The route to match against.
 * @param path - The path to match.
 * @returns The match result.
 * @public
 */
export function matchesRoute<P extends string>(
  route: Route,
  path: P
): MatchResult<P> {
  type Params = ExtractParams<P>
  const pathSegments = path.split('/').filter(segment => segment !== '')

  const params = {} as Params

  for (let i = 0; i < route.length; i++) {
    const segment = route[i]!
    const pathSegment = pathSegments[i]

    if (!pathSegment && segment.type !== 'catch-all') {
      return null
    }

    if (segment.type === 'literal') {
      if (segment.value !== pathSegment) {
        return null
      }
    } else if (segment.type === 'param') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(params as any)[segment.name] = pathSegment
    } else if (segment.type === 'catch-all') {
      return { params, path }
    }
  }

  if (pathSegments.length !== route.length) {
    return null
  }

  return { params, path }
}

/**
 * Parses a route string into an array of route segments.
 *
 * @param route - The route string to parse.
 * @returns An array of route segments.
 * @public
 */
export function parseRouteSegments(route: string): Route {
  return route
    .split('/')
    .map((segment): RouteSegment => {
      if (segment.startsWith(':')) {
        return { type: 'param', name: segment.slice(1) }
      } else if (segment === '*') {
        return { type: 'catch-all' }
      } else {
        return { type: 'literal', value: segment }
      }
    })
    .filter(segment => {
      return segment.type !== 'literal' || segment.value !== ''
    })
}

/**
 * Creates a route matcher function that can be used to match paths against a list of routes.
 *
 * @param routes - An array of route strings.
 * @returns A function that can be used to match paths against the provided routes.
 * @public
 */
export function makeRouteMatcher<Routes extends string[]>(routes: Routes) {
  const routeEntries = routes.map((route: Routes[number]) => {
    const segments = parseRouteSegments(route)
    return { route, segments }
  })

  return function matchRoute<S extends string>(
    path: S
  ): MatchResultWithRoute<S, Routes[number]> {
    for (const { segments, route } of routeEntries) {
      const result = matchesRoute(segments, path)
      if (result) {
        return { ...result, route }
      }
    }
    return null
  }
}
