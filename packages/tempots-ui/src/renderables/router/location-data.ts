import { getWindow, Prop } from '@tempots/dom'

/**
 * Represents the data for a location.
 *
 * @public
 */
export type LocationData = {
  /**
   * The pathname of the location.
   */
  readonly pathname: string
  /**
   * The search parameters of the location.
   */
  readonly search: Record<string, string>
  /**
   * The hash of the location.
   */
  readonly hash?: string
}

/**
 * Compares two location objects and returns true if they are equal, false otherwise.
 * @param a - The first location object to compare.
 * @param b - The second location object to compare.
 * @returns True if the location objects are equal, false otherwise.
 * @public
 */
export const areLocationsEqual = (a: LocationData, b: LocationData) =>
  a.pathname === b.pathname &&
  JSON.stringify(a.search) === JSON.stringify(b.search) &&
  a.hash === b.hash

/**
 * Converts a URL string into a LocationData object.
 * @param url - The URL string to convert.
 * @returns The LocationData object representing the URL.
 * @public
 */
export const locationFromURL = (
  url: string,
  baseUrl?: string
): LocationData => {
  const urlObj = new URL(url, baseUrl ?? getWindow()?.location.toString())
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
export const urlFromLocation = (location: LocationData) => {
  const search = new URLSearchParams(location.search)
  const searchStr = search.toString()
  const hash = location.hash
  return `${location.pathname}${searchStr ? `?${searchStr}` : ''}${
    hash ? `#${hash}` : ''
  }`
}
