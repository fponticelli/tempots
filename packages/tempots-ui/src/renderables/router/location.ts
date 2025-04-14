import { makeProviderMark, Prop, Provider, DOMContext } from '@tempots/dom'
import { LocationData } from './location-data'
import { makeHeadlessLocationProp } from './headless-location'
import { makeBrowserLocationProp } from './browser-location'

/**
 * Provider for the location context.
 * @param child - The child component to be wrapped with the location context.
 * @returns The wrapped component with the location context.
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
