import { ExtractParams, Route, RouteSegment } from './route-info'

export type MatchResult<P extends string> = {
  params: ExtractParams<P>
  path: P
} | null

export type MatchResultWithRoute<P extends string, R extends string> = {
  params: ExtractParams<P>
  route: R
  path: P
} | null

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
