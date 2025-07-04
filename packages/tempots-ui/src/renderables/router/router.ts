import { TNode, Renderable, Signal, OneOfTuple, Use } from '@tempots/dom'
import { ExtractParams, MakeParams, RouteInfo } from './route-info'
import { Location } from './location'
import { _makeRouteMatcher } from './match'

/**
 * Creates a client-side router that maps URL patterns to renderable components.
 *
 * The Router component provides declarative routing for single-page applications.
 * It automatically extracts route parameters from URLs and passes them to the
 * corresponding route handlers. The router integrates with the browser's history
 * API and updates the UI when the URL changes.
 *
 * @example
 * ```typescript
 * // Basic routing setup
 * const AppRouter = Router({
 *   '/': () => html.div('Home Page'),
 *   '/about': () => html.div('About Page'),
 *   '/contact': () => html.div('Contact Page'),
 *   '*': () => html.div('404 - Page Not Found')
 * })
 *
 * render(AppRouter, document.body)
 * ```
 *
 * @example
 * ```typescript
 * // Routes with parameters
 * const BlogRouter = Router({
 *   '/': () => html.div('Blog Home'),
 *   '/posts/:id': (info) => {
 *     const postId = info.$.params.$.id
 *     return html.div(
 *       html.h1('Post ID: ', postId),
 *       html.p('Loading post...')
 *     )
 *   },
 *   '/users/:userId/posts/:postId': (info) => {
 *     const userId = info.$.params.$.userId
 *     const postId = info.$.params.$.postId
 *     return html.div(
 *       html.h1('User ', userId, ' - Post ', postId),
 *       UserPost({ userId, postId })
 *     )
 *   },
 *   '*': () => html.div('Page not found')
 * })
 * ```
 *
 * @example
 * ```typescript
 * // Using route info for navigation and data
 * const ProductRouter = Router({
 *   '/products': () => ProductList(),
 *   '/products/:id': (info) => {
 *     const productId = info.$.params.$.id
 *     const searchParams = info.$.search
 *
 *     return html.div(
 *       html.h1('Product ', productId),
 *       html.p('Search params: ', searchParams),
 *       ProductDetail({
 *         id: productId,
 *         variant: new URLSearchParams(searchParams.value).get('variant')
 *       })
 *     )
 *   },
 *   '/products/:id/reviews': (info) => {
 *     const productId = info.$.params.$.id
 *     return ProductReviews({ productId })
 *   }
 * })
 * ```
 *
 * @example
 * ```typescript
 * // Programmatic navigation
 * import { Location } from '@tempots/ui'
 *
 * const Navigation = () => html.nav(
 *   html.button(
 *     on.click(() => Location.navigate('/')),
 *     'Home'
 *   ),
 *   html.button(
 *     on.click(() => Location.navigate('/about')),
 *     'About'
 *   ),
 *   html.button(
 *     on.click(() => Location.navigate('/products/123')),
 *     'Product 123'
 *   )
 * )
 * ```
 *
 * @template T - The type of the routes configuration object
 * @param routes - Object mapping route patterns to handler functions
 * @returns A renderable router component that handles URL routing
 * @throws {Error} When no matching route is found for the current URL
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
  /* c8 ignore next 19 */
  return Use(Location, location => {
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
    return OneOfTuple(
      route.map(route => [route.route, route]),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      routes as any
      /* c8 ignore next 2 */
    )
  })
}
