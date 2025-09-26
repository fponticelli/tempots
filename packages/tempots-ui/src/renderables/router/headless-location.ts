import { HeadlessContext } from '@tempots/dom'
import type { Prop } from '@tempots/dom'
import type { NavigationOptions } from './navigation-options'
import { LocationData, locationFromURL, urlFromLocation } from './location-data'

export type HeadlessLocationSource = {
  location: Prop<LocationData>
  dispose: () => void
  commit: (
    data: LocationData,
    options: NavigationOptions | undefined,
    action: 'pushState' | 'replaceState'
  ) => void
  go: (delta: number, options?: NavigationOptions) => void
  back: (options?: NavigationOptions) => void
  forward: (options?: NavigationOptions) => void
  resolve: (url: string) => LocationData
}

export const isAbsoluteURL = (url: string) =>
  url.startsWith('http://') ||
  url.startsWith('https://') ||
  url.startsWith('//')

export const makeHeadlessLocationSource = (
  ctx: HeadlessContext
): HeadlessLocationSource => {
  const currentUrl = ctx.container.currentURL
  const location = currentUrl.iso(
    (newUrl: string) => locationFromURL(newUrl, currentUrl.value),
    (data: LocationData) => {
      if (isAbsoluteURL(data.pathname)) {
        return urlFromLocation(data)
      }
      const base = new URL(data.pathname, currentUrl.value)
      const pathname = base.origin + base.pathname
      return urlFromLocation({ ...data, pathname })
    }
  )

  const commit = (
    data: LocationData,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _options: NavigationOptions | undefined,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _action: 'pushState' | 'replaceState'
  ) => {
    location.set(data)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const go = (_delta: number, _options?: NavigationOptions) => {}

  const dispose = () => {
    location.dispose()
  }

  return {
    location,
    dispose,
    commit,
    go,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    back: (_options?: NavigationOptions) => {},
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    forward: (_options?: NavigationOptions) => {},
    resolve: (url: string) => locationFromURL(url, currentUrl.value),
  }
}
