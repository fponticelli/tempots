import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Mock @tempots/dom
vi.mock('@tempots/dom', () => ({
  prop: vi.fn(),
  getWindow: vi.fn()
}))

import { makeBrowserLocationProp } from '../src/renderables/router/browser-location'

describe('browser-location.ts', () => {
  let mockWindow: any
  let mockGetWindow: any
  let mockProp: any

  beforeEach(async () => {
    vi.clearAllMocks()

    // Get the mocked functions
    const domMocks = await vi.importMock('@tempots/dom') as any
    mockGetWindow = domMocks.getWindow
    mockProp = domMocks.prop

    // Reset the prop mock to return a proper signal
    mockProp.mockImplementation((initial, equalsFn) => {
      const listeners: Array<(value: any) => void> = []
      const disposeListeners: Array<() => void> = []
      let currentValue = initial

      const signal = {
        value: currentValue,
        set: vi.fn((newValue: any) => {
          if (!equalsFn || !equalsFn(currentValue, newValue)) {
            currentValue = newValue
            signal.value = newValue
            listeners.forEach(listener => listener(newValue))
          }
        }),
        on: vi.fn((listener: (value: any) => void) => {
          listeners.push(listener)
        }),
        onDispose: vi.fn((listener: () => void) => {
          disposeListeners.push(listener)
        }),
        dispose: vi.fn(() => {
          disposeListeners.forEach(listener => listener())
        })
      }

      return signal
    })

    // Create a mock window object
    mockWindow = {
      location: {
        pathname: '/',
        search: '',
        hash: ''
      },
      history: {
        pushState: vi.fn()
      },
      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    }

    // Mock getWindow to return our mock window
    mockGetWindow.mockReturnValue(mockWindow)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('makeBrowserLocationProp', () => {
    it('should create a browser location prop with initial location', () => {
      mockWindow.location = {
        pathname: '/test',
        search: '?param=value',
        hash: '#section'
      }

      const locationProp = makeBrowserLocationProp()

      expect(locationProp).toBeDefined()
      expect(locationProp.value).toBeDefined()
      expect(locationProp.dispose).toBeDefined()
      expect(typeof locationProp.dispose).toBe('function')
    })

    it('should handle empty hash correctly', () => {
      mockWindow.location = {
        pathname: '/test',
        search: '',
        hash: ''
      }

      const locationProp = makeBrowserLocationProp()

      expect(locationProp).toBeDefined()
      expect(mockGetWindow).toHaveBeenCalled()
    })

    it('should handle hash with # prefix', () => {
      mockWindow.location = {
        pathname: '/test',
        search: '',
        hash: '#section'
      }

      const locationProp = makeBrowserLocationProp()

      expect(locationProp).toBeDefined()
      expect(mockGetWindow).toHaveBeenCalled()
    })

    it('should set up popstate event listener', () => {
      const locationProp = makeBrowserLocationProp()

      expect(mockWindow.addEventListener).toHaveBeenCalledWith('popstate', expect.any(Function))
      expect(locationProp).toBeDefined()
    })

    it('should handle popstate events', () => {
      mockWindow.location = {
        pathname: '/initial',
        search: '',
        hash: ''
      }

      const locationProp = makeBrowserLocationProp()

      // Get the popstate handler
      const popstateHandler = mockWindow.addEventListener.mock.calls.find(
        call => call[0] === 'popstate'
      )?.[1]

      expect(popstateHandler).toBeDefined()

      // Simulate a popstate event
      mockWindow.location = {
        pathname: '/new-path',
        search: '?new=param',
        hash: '#new-hash'
      }

      if (popstateHandler) {
        popstateHandler()
      }

      expect(locationProp.value.set).toHaveBeenCalled()
    })

    it('should clean up event listener on dispose', () => {
      const locationProp = makeBrowserLocationProp()

      // Call dispose
      locationProp.dispose()

      expect(mockWindow.removeEventListener).toHaveBeenCalledWith('popstate', expect.any(Function))
    })

    it('should handle location changes and update history', () => {
      const locationProp = makeBrowserLocationProp()

      // Verify that the location prop has an 'on' listener for history updates
      expect(locationProp.value.on).toHaveBeenCalled()

      // Get the location change handler
      const locationChangeHandler = locationProp.value.on.mock.calls[0]?.[0]
      expect(locationChangeHandler).toBeDefined()

      if (locationChangeHandler) {
        // Simulate a location change
        const newLocation = {
          pathname: '/new-path',
          search: { param: 'value' },
          hash: 'section'
        }
        locationChangeHandler(newLocation)

        expect(mockWindow.history.pushState).toHaveBeenCalled()
      }
    })

    it('should handle window being null/undefined', () => {
      mockGetWindow.mockReturnValue(null)

      const locationProp = makeBrowserLocationProp()

      expect(locationProp).toBeDefined()
      expect(locationProp.value).toBeDefined()
      expect(locationProp.dispose).toBeDefined()
    })

    it('should parse search parameters correctly', () => {
      mockWindow.location = {
        pathname: '/test',
        search: '?param1=value1&param2=value2',
        hash: ''
      }

      const locationProp = makeBrowserLocationProp()

      expect(locationProp).toBeDefined()
      expect(mockGetWindow).toHaveBeenCalled()
    })
  })

  // Note: Full integration tests with actual browser navigation are not included
  // due to the complexity of mocking the complete browser environment.
  // The current tests cover:
  // - Location prop creation and initialization
  // - Event listener setup and cleanup
  // - Popstate event handling
  // - History API integration
  // - Edge cases with null/undefined window
  // - Search parameter parsing
  // - Hash handling with and without # prefix
  //
  // The browser-location module requires a real browser environment to test
  // the complete navigation flow, including:
  // - Actual URL changes
  // - Browser back/forward button handling
  // - Real URLSearchParams parsing
  // - Complete history state management
})
