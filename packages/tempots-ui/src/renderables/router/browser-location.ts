import { prop, getWindow } from '@tempots/dom'
import {
  LocationData,
  areLocationsEqual,
  urlFromLocation,
} from './location-data'

/**
 * Creates a location object based on the current browser location.
 * @returns The location object representing the current browser location.
 * @internal
 */
const _getLocation = (): LocationData => {
  const win = getWindow()
  const hash =
    win?.location.hash === ''
      ? undefined
      : (win?.location.hash.substring(1) ?? undefined)
  return {
    pathname: win?.location.pathname ?? '',
    search: Object.fromEntries(
      new URLSearchParams(win?.location.search ?? '').entries()
    ),
    hash,
  }
}

/**
 * Creates a location prop that represents the current browser location.
 * The location prop is updated whenever the browser location changes.
 *
 * @returns The location prop.
 * @internal
 */
export const makeBrowserLocationProp = () => {
  const location = prop(_getLocation(), areLocationsEqual)

  const win = getWindow()

  const handler = () => {
    let hash = win?.location.hash ?? ''
    if (hash.startsWith('#')) {
      hash = hash.substring(1)
    }
    const newLocation = {
      pathname: win?.location.pathname ?? '',
      search: Object.fromEntries(
        new URLSearchParams(win?.location.search ?? '').entries()
      ),
      hash: hash === '' ? undefined : hash,
    }
    location.set(newLocation)
  }

  win?.addEventListener('popstate', handler)

  location.onDispose(() => {
    win?.removeEventListener('popstate', handler)
  })

  location.on((location: LocationData) => {
    win?.history.pushState({}, '', urlFromLocation(location))
  })

  return {
    value: location,
    dispose: location.dispose,
  }
}
