import { TNode, Renderable, Signal, OneOfTuple } from '@tempots/dom'
import { ExtractParams, MakeParams, RouteInfo } from './route-info'
import { UseLocation } from './location'
import { _makeRouteMatcher } from './match'

/**
 * Creates a router that maps routes to corresponding renderable components.
 *
 * @typeParam T - The type of the routes object.
 * @param routes - An object containing route handlers.
 * @returns - The router renderable.
 * @public
 */
export const Router = <
  T extends {
    [K in keyof T]: (
      info: K extends string
        ? Signal<RouteInfo<MakeParams<ExtractParams<K>>, K>>
        : never
    ) => TNode
  },
>(
  routes: T
): Renderable => {
  const matchRoute = _makeRouteMatcher(Object.keys(routes))
  return UseLocation(location => {
    const route = location.map(location => {
      const match = matchRoute(location.pathname)
      console.log('## MATCH', match)
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
    console.log('## ROUTES', routes, route.value)
    return OneOfTuple(
      route.map(route => [route.route, route]),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      routes as any
    )
  })
}
