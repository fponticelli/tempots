import { makeProviderMark, Prop, Provider, DOMContext } from '@tempots/dom'
import { LocationData } from './location-data'
import { makeHeadlessLocationProp } from './headless-location'
import { makeBrowserLocationProp } from './browser-location'

/**
 * Provider for browser location and navigation functionality.
 *
 * The Location provider gives components access to the current URL and provides
 * methods for programmatic navigation. It automatically detects whether it's
 * running in a browser or headless environment and provides the appropriate
 * implementation.
 *
 * @example
 * ```typescript
 * // Use location in a component
 * const CurrentPath = () =>
 *   Use(Location, location => html.div(
 *     'Current path: ', location.$.pathname,
 *     html.br(),
 *     'Search params: ', location.$.search,
 *     html.br(),
 *     'Hash: ', location.$.hash
 *   ))
 * ```
 *
 * @example
 * ```typescript
 * // Navigation buttons
 * const Navigation = () =>
 *   Use(Location, location => html.nav(
 *     html.button(
 *       on.click(() => location.navigate('/')),
 *       'Home'
 *     ),
 *     html.button(
 *       on.click(() => location.navigate('/about')),
 *       'About'
 *     ),
 *     html.button(
 *       on.click(() => location.back()),
 *       'Back'
 *     ),
 *     html.button(
 *       on.click(() => location.forward()),
 *       'Forward'
 *     )
 *   ))
 * ```
 *
 * @example
 * ```typescript
 * // Conditional rendering based on path
 * const ConditionalContent = () =>
 *   Use(Location, location =>
 *     When(location.map(loc => loc.pathname.startsWith('/admin')),
 *       () => AdminPanel(),
 *       () => PublicContent()
 *     )
 *   )
 * ```
 *
 * @example
 * ```typescript
 * // URL parameter extraction
 * const ProductPage = () =>
 *   Use(Location, location => {
 *     const searchParams = location.map(loc => new URLSearchParams(loc.search))
 *     const productId = searchParams.map(params => params.get('id'))
 *
 *     return Ensure(productId,
 *       (id) => ProductDetail({ id }),
 *       () => html.div('Product ID required')
 *     )
 *   })
 * ```
 *
 * @public
 */
export const Location: Provider<Prop<LocationData>> = {
  mark: makeProviderMark<Prop<LocationData>>('LocationProvider'),
  create: (_: unknown, ctx: DOMContext) => {
    if (ctx.isBrowser()) {
      return makeBrowserLocationProp()
    } else if (ctx.isHeadless()) {
      return makeHeadlessLocationProp(ctx)
    } else {
      throw new Error('Unknown context')
    }
  },
}
