import { TNode, Renderable, oneof, Signal } from '@tempots/dom'
import { ExtractParams, MakeParams, RouteInfo } from './route-info'
import { UseLocation } from './location'
import { makeRouteMatcher } from './match'

export function Router<
  T extends {
    [K in keyof T]: (
      info: K extends string
        ? Signal<RouteInfo<MakeParams<ExtractParams<K>>, K>>
        : never
    ) => TNode
  },
>(routes: T): Renderable {
  const matchRoute = makeRouteMatcher(Object.keys(routes))
  return UseLocation(location => {
    const route = location.map(location => {
      const match = matchRoute(location.pathname)
      if (match == null) {
        console.error('No route found for', location)
        throw new Error('No route found')
      }
      return {
        params: match.params,
        route: match.route,
        path: match.path,
        search: location.search,
        hash: location.hash,
      } as RouteInfo<MakeParams<typeof match.params>, typeof match.route>
    })
    return oneof.tuple(
      route.map(route => [route.route, route]),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      routes as any
    )
  })
}
