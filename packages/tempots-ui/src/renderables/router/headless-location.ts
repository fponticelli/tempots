import { TNode, Fragment, OnDispose, Prop, WithProvider } from '@tempots/dom'
import { LocationProviderMarker } from './location'
import { LocationData, locationFromURL, urlFromLocation } from './location-data'

export const isAbsoluteURL = (url: string) => {
  return (
    url.startsWith('http://') ||
    url.startsWith('https://') ||
    url.startsWith('//')
  )
}

/**
 * Provides the location context to the child component.
 * @param child - The child component to be wrapped with the location context.
 * @returns The wrapped component with the location context.
 * @public
 */
export const ProvideHeadlessLocation = (url: Prop<string>, child: TNode) => {
  const location = url.iso(
    (newUrl: string) => locationFromURL(newUrl),
    (data: LocationData) => {
      if (isAbsoluteURL(data.pathname)) {
        return urlFromLocation(data)
      }
      const nurl = new URL(data.pathname, url.value)
      const pathname = nurl.origin + nurl.pathname
      return urlFromLocation({ ...data, pathname: pathname })
    }
  )

  return Fragment(
    OnDispose(location.dispose),
    WithProvider(LocationProviderMarker, location, child)
  )
}
