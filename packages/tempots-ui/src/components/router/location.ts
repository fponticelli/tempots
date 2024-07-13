import {
  TNode,
  childToRenderable,
  DOMContext,
  Fragment,
  makeProviderMark,
  OnDispose,
  prop,
  Prop,
  UseProvider,
  WithProvider,
} from '@tempots/dom'

export interface Location {
  pathname: string
  search: Record<string, string>
  hash?: string
}

export const LocationProviderMarker =
  makeProviderMark<Prop<Location>>('LocationProvider')

export function makeLocation(): Location {
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

export function equalsLocation(a: Location, b: Location) {
  return (
    a.pathname === b.pathname &&
    JSON.stringify(a.search) === JSON.stringify(b.search) &&
    a.hash === b.hash
  )
}

export function locationFromURL(url: string): Location {
  const urlObj = new URL(url, window?.location.toString() ?? '')
  const search = Object.fromEntries(urlObj.searchParams.entries())
  return {
    pathname: urlObj.pathname,
    search,
    hash: urlObj.hash,
  }
}

export function setLocationFromUrl(prop: Prop<Location>, url: string) {
  const location = locationFromURL(url)
  prop.set(location)
  return prop
}

export function makeLocationProp(): Prop<Location> {
  const location = prop(makeLocation(), equalsLocation)

  const handler = () => {
    const newLocation = {
      ...location.value,
      pathname: window?.location.pathname ?? '',
    }
    location.set(newLocation)
  }

  window?.addEventListener('popstate', handler)

  location.onDispose(() => {
    window?.removeEventListener('popstate', handler)
  })

  location.on((location: Location) => {
    const search = new URLSearchParams(location.search)
    const searchStr = search.toString()
    const hash = location.hash
    const url = `${location.pathname}${searchStr ? `?${searchStr}` : ''}${
      hash ? `#${hash}` : ''
    }`
    window?.history.pushState({}, '', url)
  })

  return location
}

export function ProvideLocation(child: TNode) {
  const location = makeLocationProp()

  return Fragment(
    OnDispose(location.dispose),
    WithProvider(LocationProviderMarker, location, child)
  )
}

export function UseLocation(fn: (location: Prop<Location>) => TNode) {
  return UseProvider(LocationProviderMarker, (location: Prop<Location>) => {
    // prevents accidentally disposing of the source location prop
    return (ctx: DOMContext) => {
      const derived = prop(location.value, location.equals)
      location.feedProp(derived)
      derived.on(location.set)
      const clear = childToRenderable(fn(derived))(ctx)
      return (removeTree: boolean) => {
        derived.dispose()
        clear(removeTree)
      }
    }
  })
}
