import {
  TNode,
  renderableOfTNode,
  DOMContext,
  Fragment,
  makeProviderMark,
  OnUnmount,
  prop,
  Prop,
  UseProvider,
  WithProvider,
} from '@tempots/dom'

export interface LocationData {
  pathname: string
  search: Record<string, string>
  hash?: string
}

export const LocationProviderMarker =
  makeProviderMark<Prop<LocationData>>('LocationProvider')

export function makeLocation(): LocationData {
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

export function equalsLocation(a: LocationData, b: LocationData) {
  return (
    a.pathname === b.pathname &&
    JSON.stringify(a.search) === JSON.stringify(b.search) &&
    a.hash === b.hash
  )
}

export function locationFromURL(url: string): LocationData {
  const urlObj = new URL(url, window?.location.toString() ?? '')
  const search = Object.fromEntries(urlObj.searchParams.entries())
  return {
    pathname: urlObj.pathname,
    search,
    hash: urlObj.hash,
  }
}

export function setLocationFromUrl(prop: Prop<LocationData>, url: string) {
  const location = locationFromURL(url)
  prop.set(location)
  return prop
}

export function getFullURL(location: LocationData) {
  const search = new URLSearchParams(location.search)
  const searchStr = search.toString()
  const hash = location.hash
  return `${location.pathname}${searchStr ? `?${searchStr}` : ''}${
    hash ? `#${hash}` : ''
  }`
}

export function makeLocationProp(): Prop<LocationData> {
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

  location.on((location: LocationData) => {
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
    OnUnmount(location.dispose),
    WithProvider(LocationProviderMarker, location, child)
  )
}

export function UseLocation(fn: (location: Prop<LocationData>) => TNode) {
  return UseProvider(LocationProviderMarker, (location: Prop<LocationData>) => {
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
}
