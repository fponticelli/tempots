import type { NavigationOptions } from './navigation-options'
import type { LocationDraft, LocationHandle } from './location'

type MaybeHandle = LocationHandle | undefined

const assertHandle = (handle: MaybeHandle): LocationHandle => {
  if (handle == null) {
    throw new Error(
      'NavigationService: no Location handle attached. Make sure to attach one before calling navigation helpers.'
    )
  }
  return handle
}

class NavigationServiceImpl {
  private handles: LocationHandle[] = []

  attach(handle: LocationHandle): () => void {
    const existingIndex = this.handles.lastIndexOf(handle)
    if (existingIndex !== -1) {
      this.handles.splice(existingIndex, 1)
    }
    this.handles.push(handle)
    return () => this.detach(handle)
  }

  detach(handle: LocationHandle): void {
    for (let index = this.handles.length - 1; index >= 0; index--) {
      if (this.handles[index] === handle) {
        this.handles.splice(index, 1)
        break
      }
    }
  }

  private get current(): LocationHandle | undefined {
    return this.handles[this.handles.length - 1]
  }

  getHandle(): LocationHandle {
    return assertHandle(this.current)
  }

  navigate(url: string, options?: NavigationOptions): void {
    this.getHandle().navigate(url, options)
  }

  replace(url: string, options?: NavigationOptions): void {
    this.getHandle().replace(url, options)
  }

  go(delta: number, options?: NavigationOptions): void {
    this.getHandle().go(delta, options)
  }

  back(options?: NavigationOptions): void {
    this.getHandle().back(options)
  }

  forward(options?: NavigationOptions): void {
    this.getHandle().forward(options)
  }

  setPathname(pathname: string, options?: NavigationOptions): void {
    this.getHandle().setPathname(pathname, options)
  }

  setSearch(
    entries: Record<string, string | null | undefined>,
    options?: NavigationOptions
  ): void {
    this.getHandle().setSearch(entries, options)
  }

  setSearchParam(
    key: string,
    value: string | null | undefined,
    options?: NavigationOptions
  ): void {
    this.getHandle().setSearchParam(key, value, options)
  }

  updateSearch(
    updater: (curr: Record<string, string>) => Record<string, string>,
    options?: NavigationOptions
  ): void {
    this.getHandle().updateSearch(updater, options)
  }

  setHash(hash: string | undefined | null, options?: NavigationOptions): void {
    this.getHandle().setHash(hash, options)
  }

  clearHash(options?: NavigationOptions): void {
    this.getHandle().clearHash(options)
  }

  run(
    mutate: (draft: LocationDraft) => void,
    options?: NavigationOptions
  ): void {
    this.getHandle().run(mutate, options)
  }
}

export const NavigationService = new NavigationServiceImpl()
