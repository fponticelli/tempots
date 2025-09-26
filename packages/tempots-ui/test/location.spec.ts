import { describe, it, expect } from 'vitest'
import { Provide, Use, runHeadless } from '@tempots/dom'
import {
  Location,
  type LocationHandle,
} from '../src/renderables/router/location'

describe('Location provider', () => {
  const renderWithLocation = (startUrl: string) => {
    let handle: LocationHandle | undefined

    const App = () =>
      Provide(Location, {}, () =>
        Use(Location, location => {
          handle = location
          return null
        })
      )

    const headless = runHeadless(App, {
      startUrl,
      selector: 'body',
    })

    if (handle == null) {
      throw new Error('Location handle not initialized')
    }

    return { handle, cleanup: headless.clear }
  }

  it('should expose reactive location state and helpers', () => {
    const { handle, cleanup } = renderWithLocation(
      'https://example.com/base?foo=bar#hash'
    )

    try {
      expect(handle.location.value).toEqual({
        pathname: '/base',
        search: { foo: 'bar' },
        hash: 'hash',
      })

      handle.setSearchParam('foo', 'baz')
      expect(handle.location.value.search).toEqual({ foo: 'baz' })

      handle.setSearch({ foo: null, bar: '1' })
      expect(handle.location.value.search).toEqual({ bar: '1' })

      handle.setHash(undefined)
      expect(handle.location.value.hash).toBeUndefined()

      handle.setPathname('/orders')
      expect(handle.location.value.pathname).toBe('/orders')

      handle.updateSearch(curr => ({ ...curr, id: '123' }))
      expect(handle.location.value.search).toEqual({ bar: '1', id: '123' })

      handle.run(draft =>
        draft
          .setPathname('/checkout')
          .setSearch({ bar: null, id: null, step: 'shipping' })
          .setHash('summary')
      )

      expect(handle.location.value).toEqual({
        pathname: '/checkout',
        search: { step: 'shipping' },
        hash: 'summary',
      })
    } finally {
      cleanup()
    }
  })

  it('should navigate with relative URLs and replace option', () => {
    const { handle, cleanup } = renderWithLocation(
      'https://example.com/app/dashboard?tab=overview'
    )

    try {
      handle.navigate('../settings?section=profile')
      expect(handle.location.value).toEqual({
        pathname: '/settings',
        search: { section: 'profile' },
        hash: undefined,
      })

      handle.replace('/settings?section=billing', { replace: true })
      expect(handle.location.value.search).toEqual({ section: 'billing' })
    } finally {
      cleanup()
    }
  })
})
