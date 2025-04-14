import {
  TNode,
  renderableOfTNode,
  DOMContext,
  Fragment,
  makeProviderMark,
  prop,
  Prop,
  UseProvider,
  WithBrowserCtx,
  WithHeadlessCtx,
  Async,
} from '@tempots/dom'
import { LocationData } from './location-data'

/**
 * Marker for the LocationProvider.
 *
 * @public
 */
export const LocationProviderMarker =
  makeProviderMark<Prop<LocationData>>('LocationProvider')

/**
 * Provides the location context to the child component.
 * @param child - The child component to be wrapped with the location context.
 * @returns The wrapped component with the location context.
 * @public
 */
export const ProvideLocation = (
  child: (location: Prop<LocationData>) => TNode
) => {
  return Fragment(
    WithBrowserCtx(() => {
      return Async(
        import('./browser-location').then(mod => mod.ProvideBrowserLocation),
        ProvideBrowserLocation => ProvideBrowserLocation(child)
      )
    }),
    WithHeadlessCtx(ctx => {
      return Async(
        import('./headless-location').then(mod => mod.ProvideHeadlessLocation),
        ProvideHeadlessLocation =>
          ProvideHeadlessLocation(ctx.container.currentURL, child)
      )
    })
  )
}

/**
 * A hook that provides the current location data to the given function.
 * @param fn - The function that receives the location data.
 * @returns A function that can be used to clean up the resources when the location changes.
 * @public
 */
export const UseLocation = (fn: (location: Prop<LocationData>) => TNode) =>
  UseProvider(LocationProviderMarker, (location: Prop<LocationData>) => {
    // prevents accidentally disposing of the source location prop
    return (ctx: DOMContext) => {
      const derived = prop(location.value, location.equals)
      location.feedProp(derived)
      derived.on(location.set)
      const clear = renderableOfTNode(fn(derived))(ctx)
      return (removeTree: boolean) => {
        derived.dispose()
        clear(removeTree)
      }
    }
  })
