import { describe, expect, it } from 'vitest'
import { Fragment, OnDispose, Provide, Use, runHeadless } from '@tempots/dom'
import { Location } from '../src/renderables/router/location'
import { NavigationService } from '../src/renderables/router/navigation-service'

describe('NavigationService', () => {
  const attachNavigation = () =>
    Provide(Location, {}, () =>
      Use(Location, handle => {
        const detach = NavigationService.attach(handle)

        return Fragment(
          null,
          OnDispose((_removeTree, _ctx) => detach())
        )
      })
    )

  it('delegates to the active Location handle', () => {
    const { clear } = runHeadless(attachNavigation, {
      startUrl: 'https://example.com/start',
      selector: 'body',
    })

    try {
      NavigationService.navigate('/orders?tab=summary')
      expect(NavigationService.getHandle().location.value).toEqual({
        pathname: '/orders',
        search: { tab: 'summary' },
        hash: undefined,
      })

      NavigationService.setSearchParam('tab', 'details')
      expect(NavigationService.getHandle().location.value.search).toEqual({
        tab: 'details',
      })
    } finally {
      clear()
    }

    expect(() => NavigationService.getHandle()).toThrow(
      /no Location handle attached/i
    )
  })
})
