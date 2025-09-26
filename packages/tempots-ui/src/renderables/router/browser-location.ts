import { getWindow, prop } from '@tempots/dom'
import type { Prop } from '@tempots/dom'
import type { NavigationOptions } from './navigation-options'
import {
  LocationData,
  areLocationsEqual,
  locationFromURL,
  urlFromLocation,
} from './location-data'
import { withViewTransition } from '../../utils/view-transition'

type HistoryAction = 'pushState' | 'replaceState'

const readWindowLocation = (): LocationData => {
  const win = getWindow()
  const hash = win?.location.hash ?? ''
  return {
    pathname: win?.location.pathname ?? '',
    search: Object.fromEntries(
      new URLSearchParams(win?.location.search ?? '').entries()
    ),
    hash: hash.startsWith('#')
      ? hash.substring(1) || undefined
      : hash === ''
        ? undefined
        : hash,
  }
}

const applyScrollOption = (options: NavigationOptions | undefined) => {
  if (options?.scroll !== 'auto') {
    return
  }
  const win = getWindow()
  if (!win) return
  win.requestAnimationFrame(() =>
    win.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  )
}

const runWithViewTransition = (fn: () => void, options?: NavigationOptions) => {
  if (options?.viewTransition) {
    withViewTransition(fn)
  } else {
    fn()
  }
}

export type BrowserLocationSource = {
  location: Prop<LocationData>
  dispose: () => void
  commit: (
    data: LocationData,
    options: NavigationOptions | undefined,
    action: HistoryAction
  ) => void
  go: (delta: number, options?: NavigationOptions) => void
  back: (options?: NavigationOptions) => void
  forward: (options?: NavigationOptions) => void
  resolve: (url: string) => LocationData
}

export const makeBrowserLocationSource = (): BrowserLocationSource => {
  const location = prop(readWindowLocation(), areLocationsEqual)
  const win = getWindow()

  const syncFromWindow = () => {
    location.set(readWindowLocation())
  }

  win?.addEventListener('popstate', syncFromWindow)
  win?.addEventListener('hashchange', syncFromWindow)

  const commit = (
    data: LocationData,
    options: NavigationOptions | undefined,
    action: HistoryAction
  ) => {
    runWithViewTransition(() => {
      if (win) {
        const url = urlFromLocation(data)
        const state = options?.state ?? {}
        if (action === 'replaceState' || options?.replace) {
          win.history.replaceState(state, '', url)
        } else {
          win.history.pushState(state, '', url)
        }
      }
      location.set(data)
    }, options)

    applyScrollOption(options)
  }

  const go = (delta: number, options?: NavigationOptions) => {
    runWithViewTransition(() => {
      win?.history.go(delta)
    }, options)
    applyScrollOption(options)
  }

  const back = (options?: NavigationOptions) => go(-1, options)
  const forward = (options?: NavigationOptions) => go(1, options)

  const dispose = () => {
    win?.removeEventListener('popstate', syncFromWindow)
    win?.removeEventListener('hashchange', syncFromWindow)
    location.dispose()
  }

  return {
    location,
    commit,
    go,
    back,
    forward,
    resolve: (url: string) => locationFromURL(url),
    dispose,
  }
}
