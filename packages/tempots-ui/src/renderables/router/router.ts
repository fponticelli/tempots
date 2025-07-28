import {
  TNode,
  Renderable,
  Signal,
  OneOfTuple,
  Use,
  Provide,
} from '@tempots/dom'
import { ExtractParams, MakeParams, RouteInfo } from './route-info'
import { Location } from './location'
import { _parseRouteSegments } from './match'
import { RouterContext, RouterContextProvider } from './router-context'

/**
 * Result of nested route matching that includes consumed and remaining paths.
 * @internal
 */
type NestedMatchResult = {
  params: Record<string, string>
  matchedPath: string
  remainingPath: string
  route: string
} | null

/**
 * Matches a path against route segments for nested routing.
 * Returns the consumed path, remaining path, and extracted parameters.
 * @internal
 */
const matchNestedRoute = (
  routeSegments: ReturnType<typeof _parseRouteSegments>,
  route: string,
  path: string
): NestedMatchResult => {
  const pathSegments = path.split('/').filter(segment => segment !== '')
  const params: Record<string, string> = {}
  let consumedSegments = 0

  for (let i = 0; i < routeSegments.length; i++) {
    const segment = routeSegments[i]!
    const pathSegment = pathSegments[i]

    if (!pathSegment && segment.type !== 'catch-all') {
      return null
    }

    if (segment.type === 'literal') {
      if (segment.value !== pathSegment) {
        return null
      }
      consumedSegments++
    } else if (segment.type === 'param') {
      params[segment.name] = pathSegment!
      consumedSegments++
    } else if (segment.type === 'catch-all') {
      // Catch-all consumes the current segment and leaves the rest for children
      const matchedPath =
        '/' + pathSegments.slice(0, consumedSegments).join('/')
      const remainingPath = '/' + pathSegments.slice(consumedSegments).join('/')
      return {
        params,
        matchedPath: matchedPath === '/' ? '' : matchedPath,
        remainingPath: remainingPath === '/' ? '' : remainingPath,
        route,
      }
    }
  }

  // Exact match - all segments consumed
  if (pathSegments.length === routeSegments.length) {
    const matchedPath = '/' + pathSegments.join('/')
    return {
      params,
      matchedPath: matchedPath === '/' ? '' : matchedPath,
      remainingPath: '',
      route,
    }
  }

  return null
}

/**
 * Creates a nested route matcher for the given routes.
 * @internal
 */
const makeNestedRouteMatcher = <Routes extends string[]>(routes: Routes) => {
  const routeEntries = routes.map((route: Routes[number]) => {
    const segments = _parseRouteSegments(route)
    return { route, segments }
  })

  return function matchRoute(path: string): NestedMatchResult {
    for (const { segments, route } of routeEntries) {
      const result = matchNestedRoute(segments, route, path)
      if (result) {
        return result
      }
    }
    return null
  }
}

/**
 * Creates the root router for an application that provides routing context to child components.
 *
 * RootRouter is the top-level router that matches against the full browser pathname
 * and creates the initial routing context. It provides the RouterContextProvider
 * that child ChildRouter components can use for nested routing scenarios.
 *
 * @example
 * ```typescript
 * // Basic app routing
 * const App = RootRouter({
 *   '/': () => html.div('Home Page'),
 *   '/about': () => html.div('About Page'),
 *   '/admin/*': () => AdminSection(), // Passes remaining path to AdminSection
 *   '*': () => html.div('404 - Page Not Found')
 * })
 *
 * render(App, document.body)
 * ```
 *
 * @example
 * ```typescript
 * // Nested routing with RootRouter and ChildRouter
 * const App = RootRouter({
 *   '/': () => html.div('Home'),
 *   '/admin/*': () => AdminRoutes(),
 *   '/blog/*': () => BlogRoutes()
 * })
 *
 * const AdminRoutes = ChildRouter({
 *   '/users': () => html.div('User List'),
 *   '/users/:id': (info) => html.div('User: ', info.$.params.$.id),
 *   '/settings': () => html.div('Admin Settings')
 * })
 * ```
 *
 * @template T - The type of the routes configuration object
 * @param routes - Object mapping route patterns to handler functions
 * @returns A renderable router component that handles URL routing and provides context
 * @throws {Error} When no matching route is found for the current URL
 * @public
 */
export const RootRouter = <
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
  const matchRoute = makeNestedRouteMatcher(Object.keys(routes))

  return Provide(RouterContextProvider, {}, () =>
    Use(Location, location => {
      return Use(RouterContextProvider, contextStack => {
        const route = location.map(location => {
          const match = matchRoute(location.pathname)
          if (match == null) {
            console.error('No route found for', location)
            throw new Error('No route found')
          }

          // Create new router context for this level
          const newContext: RouterContext = {
            matchedPath: match.matchedPath,
            remainingPath: match.remainingPath,
            fullPath: location.pathname,
            params: match.params,
          }

          // Update context stack with new context
          contextStack.value = [...contextStack.value, newContext]

          return {
            params: match.params,
            route: match.route,
            path: match.matchedPath || location.pathname,
            search: location.search,
            hash: location.hash,
          } as RouteInfo<MakeParams<typeof match.params>, typeof match.route>
        })

        return OneOfTuple(
          route.map(route => [route.route, route]),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          routes as any
        )
      })
    })
  )
}

/**
 * Creates a nested router that matches against the remaining path from parent routers.
 *
 * ChildRouter is used for nested routing scenarios where a parent router (RootRouter or
 * another ChildRouter) has matched a portion of the path and passed the remaining path
 * to child components. ChildRouter reads the parent routing context and matches its
 * routes against the remaining path.
 *
 * @example
 * ```typescript
 * // Parent RootRouter passes remaining path to AdminRoutes
 * const App = RootRouter({
 *   '/admin/*': () => AdminRoutes(),
 *   '/blog/*': () => BlogRoutes()
 * })
 *
 * // ChildRouter matches against remaining path
 * const AdminRoutes = ChildRouter({
 *   '/users': () => html.div('User List'),
 *   '/users/:id': (info) => html.div('User: ', info.$.params.$.id),
 *   '/settings': () => html.div('Admin Settings'),
 *   '*': () => html.div('Admin 404')
 * })
 * ```
 *
 * @example
 * ```typescript
 * // Multiple levels of nesting
 * const BlogRoutes = ChildRouter({
 *   '/posts/*': () => PostRoutes(),
 *   '/categories': () => html.div('Categories')
 * })
 *
 * const PostRoutes = ChildRouter({
 *   '/': () => html.div('All Posts'),
 *   '/:id': (info) => html.div('Post: ', info.$.params.$.id),
 *   '/:id/comments': (info) => html.div('Comments for: ', info.$.params.$.id)
 * })
 * ```
 *
 * @template T - The type of the routes configuration object
 * @param routes - Object mapping route patterns to handler functions
 * @returns A renderable router component that handles nested URL routing
 * @throws {Error} When no matching route is found for the remaining path
 * @public
 */
export const ChildRouter = <
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
  const matchRoute = makeNestedRouteMatcher(Object.keys(routes))

  return Use(RouterContextProvider, contextStack => {
    return Use(Location, location => {
      const route = contextStack.map(stack => {
        // Get the remaining path from the last context in the stack
        const parentContext = stack[stack.length - 1]
        const remainingPath = parentContext?.remainingPath || ''

        if (remainingPath === '') {
          console.error('No remaining path for SubRouter', stack)
          throw new Error('No remaining path for SubRouter')
        }

        const match = matchRoute(remainingPath)
        if (match == null) {
          console.error('No route found for remaining path', remainingPath)
          throw new Error('No route found')
        }

        // Accumulate parameters from all parent contexts
        const accumulatedParams = stack.reduce(
          (acc, ctx) => ({ ...acc, ...ctx.params }),
          {}
        )
        const allParams = { ...accumulatedParams, ...match.params }

        // Create new router context for this level
        const newContext: RouterContext = {
          matchedPath: match.matchedPath,
          remainingPath: match.remainingPath,
          fullPath: parentContext?.fullPath || remainingPath,
          params: allParams,
        }

        // Update context stack with new context
        contextStack.value = [...stack, newContext]

        return {
          params: allParams,
          route: match.route,
          path: match.matchedPath,
          search: location.value.search,
          hash: location.value.hash,
        } as RouteInfo<MakeParams<typeof allParams>, typeof match.route>
      })

      return OneOfTuple(
        route.map(route => [route.route, route]),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        routes as any
      )
    })
  })
}
