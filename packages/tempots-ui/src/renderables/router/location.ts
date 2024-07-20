import {
  TNode,
  renderableOfTNode,
  DOMContext,
  Fragment,
  makeProviderMark,
  OnUnmount,
  useProp,
  Prop,
  UseProvider,
  WithProvider,
} from '@tempots/dom'

/**
 * Represents the data for a location.
 *
 * @public
 */
export interface LocationData {
  /**
   * The pathname of the location.
   */
  pathname: string
  /**
   * The search parameters of the location.
   */
  search: Record<string, string>
  /**
   * The hash of the location.
   */
  hash?: string
}

/**
 * Marker for the LocationProvider.
 *
 * @public
 */
export const LocationProviderMarker =
  makeProviderMark<Prop<LocationData>>('LocationProvider')

/**
 * Creates a location object based on the current browser location.
 * @returns The location object representing the current browser location.
 * @public
 */
export const makeLocation = (): LocationData => {
  const hash =
    window?.location.hash === ''
      ? undefined
      : (window?.location.hash.substring(1) ?? undefined)
  return {
    pathname: window?.location.pathname ?? '',
    search: Object.fromEntries(
      new URLSearchParams(window?.location.search ?? '').entries()
    ),
    hash,
  }
}

/**
 * Compares two location objects and returns true if they are equal, false otherwise.
 * @param a - The first location object to compare.
 * @param b - The second location object to compare.
 * @returns True if the location objects are equal, false otherwise.
 * @public
 */
export const equalsLocation = (a: LocationData, b: LocationData) =>
  a.pathname === b.pathname &&
  JSON.stringify(a.search) === JSON.stringify(b.search) &&
  a.hash === b.hash

/**
 * Converts a URL string into a LocationData object.
 * @param url - The URL string to convert.
 * @returns The LocationData object representing the URL.
 * @public
 */
export const locationFromURL = (url: string): LocationData => {
  const urlObj = new URL(url, window?.location.toString() ?? '')
  const search = Object.fromEntries(urlObj.searchParams.entries())
  let hash = urlObj.hash
  if (hash.startsWith('#')) {
    hash = hash.substring(1)
  }
  return {
    pathname: urlObj.pathname,
    search,
    hash: hash === '' ? undefined : hash,
  }
}

/**
 * Sets the location from the given URL and updates the specified property.
 * @param prop - The property to update with the new location.
 * @param url - The URL from which to extract the location.
 * @returns The updated property.
 * @public
 */
export const setLocationFromUrl = (prop: Prop<LocationData>, url: string) => {
  const location = locationFromURL(url)
  prop.set(location)
  return prop
}

/**
 * Returns the full URL based on the provided location data.
 *
 * @param location - The location data object.
 * @returns The full URL string.
 * @public
 */
export const getFullURL = (location: LocationData) => {
  const search = new URLSearchParams(location.search)
  const searchStr = search.toString()
  const hash = location.hash
  return `${location.pathname}${searchStr ? `?${searchStr}` : ''}${
    hash ? `#${hash}` : ''
  }`
}

/**
 * Creates a location prop that represents the current browser location.
 * The location prop is updated whenever the browser location changes.
 *
 * @returns The location prop.
 * @public
 */
export const makeLocationProp = (): Prop<LocationData> => {
  const location = useProp(makeLocation(), equalsLocation)

  const handler = () => {
    let hash = window?.location.hash ?? ''
    if (hash.startsWith('#')) {
      hash = hash.substring(1)
    }
    const newLocation = {
      pathname: window?.location.pathname ?? '',
      search: Object.fromEntries(
        new URLSearchParams(window?.location.search ?? '').entries()
      ),
      hash: hash === '' ? undefined : hash,
    }
    location.set(newLocation)
  }

  window?.addEventListener('popstate', handler)

  location.onDispose(() => {
    window?.removeEventListener('popstate', handler)
  })

  location.on((location: LocationData) => {
    window?.history.pushState({}, '', getFullURL(location))
  })

  return location
}

/**
 * Provides the location context to the child component.
 * @param child - The child component to be wrapped with the location context.
 * @returns The wrapped component with the location context.
 * @public
 */
export const ProvideLocation = (child: TNode) => {
  const location = makeLocationProp()

  return Fragment(
    OnUnmount(location.dispose),
    WithProvider(LocationProviderMarker, location, child)
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
      const derived = useProp(location.value, location.equals)
      location.feedProp(derived)
      derived.on(location.set)
      const clear = renderableOfTNode(fn(derived))(ctx)
      return (removeTree: boolean) => {
        derived.dispose()
        clear(removeTree)
      }
    }
  })
