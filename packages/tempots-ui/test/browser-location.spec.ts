import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('@tempots/dom', () => ({
  prop: vi.fn(),
  getWindow: vi.fn(),
}))

import {
  makeBrowserLocationSource,
  type BrowserLocationSource,
} from '../src/renderables/router/browser-location'
import type { LocationData } from '../src/renderables/router/location-data'

describe('browser-location.ts', () => {
  let mockWindow: any
  let mockGetWindow: ReturnType<typeof vi.mocked>
  let mockProp: ReturnType<typeof vi.mocked>

  beforeEach(async () => {
    vi.clearAllMocks()
    const domMocks = (await vi.importMock('@tempots/dom')) as any
    mockGetWindow = domMocks.getWindow
    mockProp = domMocks.prop

    const listeners: Record<string, Array<() => void>> = {
      popstate: [],
      hashchange: [],
    }

    mockWindow = {
      location: {
        pathname: '/initial',
        search: '',
        hash: '',
      },
      history: {
        pushState: vi.fn(),
        replaceState: vi.fn(),
        go: vi.fn(),
      },
      addEventListener: vi.fn((name: string, handler: () => void) => {
        listeners[name]?.push(handler)
      }),
      removeEventListener: vi.fn((name: string, handler: () => void) => {
        const stack = listeners[name]
        if (!stack) return
        const index = stack.indexOf(handler)
        if (index >= 0) stack.splice(index, 1)
      }),
      requestAnimationFrame: (cb: FrameRequestCallback) => cb(0),
      scrollTo: vi.fn(),
    }

    mockGetWindow.mockReturnValue(mockWindow)

    mockProp.mockImplementation(
      (initial: LocationData, _equals: (a: LocationData, b: LocationData) => boolean) => {
        let currentValue = initial
        const api = {
          get value() {
            return currentValue
          },
          set: vi.fn((next: LocationData) => {
            currentValue = next
          }),
          dispose: vi.fn(),
        }
        return api
      }
    )
  })

  const createSource = () => makeBrowserLocationSource() as BrowserLocationSource

  it('should initialise with current window location', () => {
    const source = createSource()

    expect(source.location.value).toEqual({
      pathname: '/initial',
      search: {},
      hash: undefined,
    })
    expect(mockWindow.addEventListener).toHaveBeenCalledWith('popstate', expect.any(Function))
    expect(mockWindow.addEventListener).toHaveBeenCalledWith('hashchange', expect.any(Function))

    source.dispose()
    expect(source.location.dispose).toHaveBeenCalled()
  })

  it('should push history entries by default', () => {
    const source = createSource()
    const next: LocationData = {
      pathname: '/next',
      search: { q: '1' },
      hash: 'section',
    }

    source.commit(next, undefined, 'pushState')

    expect(mockWindow.history.pushState).toHaveBeenCalledWith({}, '', '/next?q=1#section')
    expect(source.location.set).toHaveBeenCalledWith(next)

    source.dispose()
  })

  it('should respect replace navigation option', () => {
    const source = createSource()
    const next: LocationData = {
      pathname: '/replace',
      search: {},
      hash: undefined,
    }

    source.commit(next, { state: { from: 'test' }, replace: true }, 'pushState')

    expect(mockWindow.history.replaceState).toHaveBeenCalledWith({ from: 'test' }, '', '/replace')
    expect(mockWindow.history.pushState).not.toHaveBeenCalled()

    source.dispose()
  })

  it('should use replaceState action when requested explicitly', () => {
    const source = createSource()
    const next: LocationData = {
      pathname: '/explicit',
      search: {},
      hash: undefined,
    }

    source.commit(next, undefined, 'replaceState')
    expect(mockWindow.history.replaceState).toHaveBeenCalledWith({}, '', '/explicit')

    source.dispose()
  })

  it('should delegate go/back/forward to history', () => {
    const source = createSource()

    source.go(2)
    source.back()
    source.forward()

    expect(mockWindow.history.go).toHaveBeenCalledWith(2)
    expect(mockWindow.history.go).toHaveBeenCalledWith(-1)
    expect(mockWindow.history.go).toHaveBeenCalledWith(1)

    source.dispose()
  })
})

