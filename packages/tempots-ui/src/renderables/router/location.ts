/**
 * Runtime location provider that unifies browser and headless navigation while exposing
 * a convenience handle for reading and mutating URL state.
 */
import {
  DOMContext,
  Provider,
  Signal,
  computedOf,
  makeProviderMark,
} from '@tempots/dom'
import type { Prop, SplitValue } from '@tempots/dom'
import { LocationData, urlFromLocation } from './location-data'
import { makeBrowserLocationSource } from './browser-location'
import { makeHeadlessLocationSource } from './headless-location'
import type { NavigationOptions } from './navigation-options'
export type { NavigationOptions } from './navigation-options'

/**
 * Options that control how `LocationHandle.match` and `matchSignal` interpret URL parts.
 *
 * @public
 */
export type LocationMatchOptions = {
  /**
   * Whether the search parameters should participate in the match. Defaults to `true`.
   */
  includeSearch?: boolean
  /**
   * Whether the hash fragment should participate in the match. Defaults to `true`.
   */
  includeHash?: boolean
  /**
   * Keys that should be ignored when comparing search parameters.
   */
  ignoreSearchParams?: string[]
}

type HistoryAction = 'pushState' | 'replaceState'

/**
 * Internal adapter that abstracts over browser/headless location implementations.
 */
type LocationSource = {
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

/**
 * Creates a shallow clone of the provided location data.
 */
const cloneLocationData = (data: LocationData): LocationData => ({
  pathname: data.pathname,
  search: { ...data.search },
  hash: data.hash ?? undefined,
})

/**
 * Normalises hash inputs so downstream consumers always receive `undefined` for empty values.
 */
const normalizeHash = (hash: string | undefined | null): string | undefined => {
  if (hash == null) return undefined
  const trimmed = `${hash}`
  return trimmed === '' ? undefined : trimmed
}

/**
 * Applies a set of key updates/removals to the provided search object.
 */
const applySearchEntries = (
  base: Record<string, string>,
  entries: Record<string, string | null | undefined>
) => {
  const next = { ...base }
  for (const [key, value] of Object.entries(entries)) {
    if (value == null) {
      delete next[key]
    } else {
      next[key] = value
    }
  }
  return next
}

const filterLocationForMatch = (
  location: LocationData,
  options: LocationMatchOptions | undefined
): LocationData => {
  const includeSearch = options?.includeSearch ?? true
  const includeHash = options?.includeHash ?? true
  const ignoreParams = options?.ignoreSearchParams ?? []

  let search: Record<string, string>
  if (!includeSearch) {
    search = {}
  } else if (ignoreParams.length === 0) {
    search = { ...location.search }
  } else {
    const ignoreSet = new Set(ignoreParams)
    search = {}
    for (const [key, value] of Object.entries(location.search)) {
      if (!ignoreSet.has(key)) {
        search[key] = value
      }
    }
  }

  return {
    pathname: location.pathname,
    search,
    hash: includeHash ? location.hash : undefined,
  }
}

export const evaluateLocationMatch = (
  location: LocationData,
  matcher: string | RegExp | ((location: LocationData) => boolean),
  options: LocationMatchOptions | undefined
) => {
  const filtered = filterLocationForMatch(location, options)
  if (typeof matcher === 'string') {
    return urlFromLocation(filtered) === matcher
  }
  if (matcher instanceof RegExp) {
    if (matcher.global || matcher.sticky) {
      matcher.lastIndex = 0
    }
    return matcher.test(urlFromLocation(filtered))
  }
  return matcher(filtered)
}

/**
 * Mutable draft used by `LocationHandle.run` to stage changes before a single commit.
 */
class LocationDraftImpl implements LocationDraft {
  constructor(private current: LocationData) {}

  get location(): LocationData {
    return this.current
  }

  setLocation(data: LocationData): this {
    this.current = cloneLocationData(data)
    return this
  }

  setPathname(pathname: string): this {
    this.current = {
      ...this.current,
      pathname,
    }
    return this
  }

  setHash(hash: string | undefined | null): this {
    const normalized = normalizeHash(hash)
    if (normalized == null) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { hash: _unused, ...rest } = this.current
      this.current = rest
    } else {
      this.current = {
        ...this.current,
        hash: normalized,
      }
    }
    return this
  }

  clearHash(): this {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { hash: _unused, ...rest } = this.current
    this.current = rest
    return this
  }

  setSearch(entries: Record<string, string | null | undefined>): this {
    this.current = {
      ...this.current,
      search: applySearchEntries(this.current.search, entries),
    }
    return this
  }

  setSearchParam(key: string, value: string | null | undefined): this {
    return this.setSearch({ [key]: value })
  }

  updateSearch(
    updater: (curr: Record<string, string>) => Record<string, string>
  ): this {
    this.current = {
      ...this.current,
      search: { ...updater({ ...this.current.search }) },
    }
    return this
  }
}

/**
 * Chooses the history action to perform based on navigation options.
 */
const navigationActionFromOptions = (
  options: NavigationOptions | undefined,
  fallback: HistoryAction
): HistoryAction => (options?.replace ? 'replaceState' : fallback)

/**
 * Creates a handle wrapper around a raw `LocationSource`.
 */
const buildHandle = (
  source: LocationSource
): {
  handle: LocationHandle
  dispose: () => void
} => {
  const location = source.location as Signal<LocationData>
  const url = location.map(urlFromLocation)
  const pathname = location.map(loc => loc.pathname)
  const search = location.map(loc => ({ ...loc.search }))
  const hash = location.map(loc => loc.hash)

  const match = (
    matcher: string | RegExp | ((location: LocationData) => boolean),
    matchOptions?: LocationMatchOptions
  ) => evaluateLocationMatch(source.location.value, matcher, matchOptions)

  const matchSignal = (
    matcher: SplitValue<
      string | RegExp | ((location: LocationData) => boolean)
    >,
    matchOptions?: LocationMatchOptions
  ) =>
    computedOf(
      location,
      matcher
    )((current, currentMatcher) =>
      evaluateLocationMatch(current, currentMatcher, matchOptions)
    )

  const commit = (
    data: LocationData,
    options: NavigationOptions | undefined,
    action: HistoryAction
  ) => {
    const normalized = cloneLocationData({
      ...data,
      hash: normalizeHash(data.hash ?? undefined),
    })
    source.commit(normalized, options, action)
  }

  const setLocation = (data: LocationData, options?: NavigationOptions) => {
    const action = navigationActionFromOptions(options, 'pushState')
    commit(data, options, action)
  }

  const updateLocation = (
    updater: (curr: LocationData) => LocationData,
    options?: NavigationOptions
  ) => {
    const next = updater(cloneLocationData(source.location.value))
    setLocation(next, options)
  }

  const navigate = (urlStr: string, options?: NavigationOptions) => {
    const next = source.resolve(urlStr)
    setLocation(next, options)
  }

  const replace = (urlStr: string, options?: NavigationOptions) => {
    const merged = { ...options, replace: true }
    navigate(urlStr, merged)
  }

  const go = (delta: number, options?: NavigationOptions) => {
    source.go(delta, options)
  }

  const back = (options?: NavigationOptions) => {
    source.back(options)
  }

  const forward = (options?: NavigationOptions) => {
    source.forward(options)
  }

  const setPathname = (pathname: string, options?: NavigationOptions) =>
    updateLocation(curr => ({ ...curr, pathname }), options)

  const setHash = (
    hashValue: string | undefined | null,
    options?: NavigationOptions
  ) =>
    updateLocation(curr => {
      const next = { ...curr }
      const normalized = normalizeHash(hashValue)
      if (normalized == null) {
        delete next.hash
      } else {
        next.hash = normalized
      }
      return next
    }, options)

  const clearHash = (options?: NavigationOptions) => setHash(undefined, options)

  const setSearch = (
    entries: Record<string, string | null | undefined>,
    options?: NavigationOptions
  ) =>
    updateLocation(
      curr => ({
        ...curr,
        search: applySearchEntries(curr.search, entries),
      }),
      options
    )

  const setSearchParam = (
    key: string,
    value: string | null | undefined,
    options?: NavigationOptions
  ) => setSearch({ [key]: value }, options)

  const updateSearch = (
    updater: (curr: Record<string, string>) => Record<string, string>,
    options?: NavigationOptions
  ) =>
    updateLocation(
      curr => ({
        ...curr,
        search: { ...updater({ ...curr.search }) },
      }),
      options
    )

  const queryParam = (key: string): Signal<string | undefined> =>
    location.map(loc => loc.search[key] as string | undefined)

  const run = (
    mutate: (draft: LocationDraft) => void,
    options?: NavigationOptions
  ) => {
    const draft = new LocationDraftImpl(
      cloneLocationData(source.location.value)
    )
    mutate(draft)
    setLocation(cloneLocationData(draft.location), options)
  }

  const dispose = () => {
    source.dispose()
    url.dispose()
    pathname.dispose()
    search.dispose()
    hash.dispose()
  }

  return {
    handle: {
      location,
      url,
      pathname,
      search,
      hash,
      setLocation,
      updateLocation,
      navigate,
      replace,
      go,
      back,
      forward,
      setPathname,
      setHash,
      clearHash,
      setSearch,
      setSearchParam,
      updateSearch,
      queryParam,
      run,
      match,
      matchSignal,
    },
    dispose,
  }
}

/**
 * A read/write navigation handle exposed by the Location provider.
 *
 * @public
 */
export type LocationHandle = {
  /**
   * Reactive signal containing the structured location (pathname, search, hash).
   */
  readonly location: Signal<LocationData>
  /**
   * Reactive signal containing the full URL string derived from the location.
   */
  readonly url: Signal<string>
  /**
   * Reactive signal for the current pathname.
   */
  readonly pathname: Signal<string>
  /**
   * Reactive signal with the parsed search parameters.
   */
  readonly search: Signal<Record<string, string>>
  /**
   * Reactive signal for the current hash fragment (without the leading `#`).
   */
  readonly hash: Signal<string | undefined>

  /**
   * Replaces the entire location with the provided data.
   */
  setLocation: (data: LocationData, options?: NavigationOptions) => void
  /**
   * Applies a transformer to the current location and commits the result.
   */
  updateLocation: (
    updater: (curr: LocationData) => LocationData,
    options?: NavigationOptions
  ) => void

  /**
   * Navigates to the provided URL string, resolving relative paths when needed.
   */
  navigate: (url: string, options?: NavigationOptions) => void
  /**
   * Navigates to the URL string, forcing a history replace even if options do not specify it.
   */
  replace: (url: string, options?: NavigationOptions) => void
  /**
   * Moves backward in history, when supported by the underlying source.
   */
  back: (options?: NavigationOptions) => void
  /**
   * Moves forward in history, when supported by the underlying source.
   */
  forward: (options?: NavigationOptions) => void
  /**
   * Performs a relative history navigation offset.
   */
  go: (delta: number, options?: NavigationOptions) => void

  /**
   * Updates only the pathname portion of the current location.
   */
  setPathname: (pathname: string, options?: NavigationOptions) => void
  /**
   * Updates the hash fragment, normalising empty values to `undefined`.
   */
  setHash: (
    hash: string | undefined | null,
    options?: NavigationOptions
  ) => void
  /**
   * Removes the current hash fragment.
   */
  clearHash: (options?: NavigationOptions) => void
  /**
   * Merges the provided entries into the current search parameters (null/undefined removes keys).
   */
  setSearch: (
    entries: Record<string, string | null | undefined>,
    options?: NavigationOptions
  ) => void
  /**
   * Convenience helper for updating a single search parameter.
   */
  setSearchParam: (
    key: string,
    value: string | null | undefined,
    options?: NavigationOptions
  ) => void
  /**
   * Applies a transformer to the search parameters, committing the result.
   */
  updateSearch: (
    updater: (curr: Record<string, string>) => Record<string, string>,
    options?: NavigationOptions
  ) => void
  /**
   * Returns a derived signal for a single search parameter.
   */
  queryParam: (key: string) => Signal<string | undefined>

  /**
   * Runs mutations against a draft copy and commits once after the callback finishes.
   */
  run: (
    mutate: (draft: LocationDraft) => void,
    options?: NavigationOptions
  ) => void
  /**
   * Evaluates whether the current location matches the provided matcher, honouring match options.
   */
  match: (
    matcher: string | RegExp | ((location: LocationData) => boolean),
    options?: LocationMatchOptions
  ) => boolean
  /**
   * Returns a reactive signal that mirrors the result of `match`.
   */
  matchSignal: (
    matcher: SplitValue<
      string | RegExp | ((location: LocationData) => boolean)
    >,
    options?: LocationMatchOptions
  ) => Signal<boolean>
}

/**
 * Draft object provided inside `LocationHandle.run` for staged updates.
 *
 * @public
 */
export type LocationDraft = {
  readonly location: LocationData
  setLocation: (data: LocationData) => LocationDraft
  setPathname: (pathname: string) => LocationDraft
  setHash: (hash: string | undefined | null) => LocationDraft
  clearHash: () => LocationDraft
  setSearch: (
    entries: Record<string, string | null | undefined>
  ) => LocationDraft
  setSearchParam: (
    key: string,
    value: string | null | undefined
  ) => LocationDraft
  updateSearch: (
    updater: (curr: Record<string, string>) => Record<string, string>
  ) => LocationDraft
}

/**
 * Instantiates the appropriate location source for the current rendering context.
 */
const makeLocationSource = (ctx: DOMContext): LocationSource => {
  if (ctx.isBrowser()) {
    return makeBrowserLocationSource()
  }
  if (ctx.isHeadless()) {
    return makeHeadlessLocationSource(ctx)
  }
  throw new Error('Unknown context')
}

/**
 * Provider exposing the LocationHandle for navigation and location state.
 *
 * @public
 */
export const Location: Provider<LocationHandle> = {
  mark: makeProviderMark<LocationHandle>('Location'),
  create: (_: unknown, ctx: DOMContext) => {
    const source = makeLocationSource(ctx)
    const { handle, dispose } = buildHandle(source)

    return {
      value: handle,
      dispose,
    }
  },
}
