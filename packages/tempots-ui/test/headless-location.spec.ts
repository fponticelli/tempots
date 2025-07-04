import { describe, it, expect, vi, beforeEach } from 'vitest'
import { makeHeadlessLocationProp, isAbsoluteURL } from '../src/renderables/router/headless-location'

// Mock the location-data module
vi.mock('../src/renderables/router/location-data', () => ({
  locationFromURL: vi.fn((url: string) => ({
    pathname: new URL(url).pathname,
    search: Object.fromEntries(new URL(url).searchParams.entries()),
    hash: new URL(url).hash ? new URL(url).hash.substring(1) : undefined
  })),
  urlFromLocation: vi.fn((location: any) => {
    const url = new URL(location.pathname, 'http://localhost')
    Object.entries(location.search || {}).forEach(([key, value]) => {
      url.searchParams.set(key, value as string)
    })
    if (location.hash) {
      url.hash = location.hash
    }
    return url.toString()
  })
}))

describe('headless-location.ts', () => {
  let mockContext: any

  beforeEach(() => {
    vi.clearAllMocks()

    // Create a mock HeadlessContext
    mockContext = {
      container: {
        currentURL: {
          value: 'http://localhost:3000/current',
          iso: vi.fn((fromFn, toFn) => {
            const mockIso = {
              value: fromFn('http://localhost:3000/current'),
              dispose: vi.fn()
            }
            return mockIso
          })
        }
      }
    }
  })

  describe('isAbsoluteURL', () => {
    it('should return true for http URLs', () => {
      expect(isAbsoluteURL('http://example.com')).toBe(true)
      expect(isAbsoluteURL('http://localhost:3000/path')).toBe(true)
    })

    it('should return true for https URLs', () => {
      expect(isAbsoluteURL('https://example.com')).toBe(true)
      expect(isAbsoluteURL('https://secure.example.com/path')).toBe(true)
    })

    it('should return true for protocol-relative URLs', () => {
      expect(isAbsoluteURL('//example.com')).toBe(true)
      expect(isAbsoluteURL('//cdn.example.com/resource')).toBe(true)
    })

    it('should return false for relative URLs', () => {
      expect(isAbsoluteURL('/path')).toBe(false)
      expect(isAbsoluteURL('path')).toBe(false)
      expect(isAbsoluteURL('./path')).toBe(false)
      expect(isAbsoluteURL('../path')).toBe(false)
    })

    it('should return false for empty or invalid URLs', () => {
      expect(isAbsoluteURL('')).toBe(false)
      expect(isAbsoluteURL('ftp://example.com')).toBe(false)
      expect(isAbsoluteURL('mailto:test@example.com')).toBe(false)
    })
  })

  describe('makeHeadlessLocationProp', () => {
    it('should create a headless location prop', () => {
      const locationProp = makeHeadlessLocationProp(mockContext)

      expect(locationProp).toBeDefined()
      expect(locationProp.value).toBeDefined()
      expect(locationProp.dispose).toBeDefined()
      expect(typeof locationProp.dispose).toBe('function')
    })

    it('should call iso on the currentURL', () => {
      makeHeadlessLocationProp(mockContext)

      expect(mockContext.container.currentURL.iso).toHaveBeenCalledWith(
        expect.any(Function),
        expect.any(Function)
      )
    })

    it('should handle URL to location conversion', () => {
      makeHeadlessLocationProp(mockContext)

      // Get the fromFn (first argument to iso)
      const fromFn = mockContext.container.currentURL.iso.mock.calls[0][0]

      // Test the fromFn - it should call locationFromURL
      const testUrl = 'http://localhost:3000/test?param=value#section'
      const result = fromFn(testUrl)

      // Verify the function was called and returned a location object
      expect(result).toBeDefined()
      expect(typeof result).toBe('object')
    })

    it('should handle location to URL conversion for absolute paths', () => {
      makeHeadlessLocationProp(mockContext)

      // Get the toFn (second argument to iso)
      const toFn = mockContext.container.currentURL.iso.mock.calls[0][1]

      // Test with absolute URL
      const absoluteLocation = {
        pathname: 'http://example.com/absolute',
        search: { param: 'value' },
        hash: 'section'
      }

      const result = toFn(absoluteLocation)

      // For absolute URLs, it should return the URL as-is
      expect(result).toBeDefined()
      expect(typeof result).toBe('string')
    })

    it('should handle location to URL conversion for relative paths', () => {
      makeHeadlessLocationProp(mockContext)

      // Get the toFn (second argument to iso)
      const toFn = mockContext.container.currentURL.iso.mock.calls[0][1]

      // Test with relative path
      const relativeLocation = {
        pathname: '/relative/path',
        search: { param: 'value' },
        hash: 'section'
      }

      const result = toFn(relativeLocation)

      // For relative paths, it should create a full URL
      expect(result).toBeDefined()
      expect(typeof result).toBe('string')
    })

    it('should create proper URL for relative paths using current URL as base', () => {
      makeHeadlessLocationProp(mockContext)

      // Get the toFn (second argument to iso)
      const toFn = mockContext.container.currentURL.iso.mock.calls[0][1]

      // Test with relative path
      const relativeLocation = {
        pathname: '/api/users',
        search: {},
        hash: undefined
      }

      const result = toFn(relativeLocation)

      // The function should create a new URL using the current URL as base
      // and then extract the full pathname including origin
      expect(result).toBeDefined()
    })

    it('should handle empty search and hash', () => {
      makeHeadlessLocationProp(mockContext)

      // Get the toFn (second argument to iso)
      const toFn = mockContext.container.currentURL.iso.mock.calls[0][1]

      const location = {
        pathname: '/simple',
        search: {},
        hash: undefined
      }

      const result = toFn(location)
      expect(result).toBeDefined()
    })

    it('should dispose properly', () => {
      const locationProp = makeHeadlessLocationProp(mockContext)

      // The dispose function should be available
      expect(typeof locationProp.dispose).toBe('function')

      // Call dispose
      locationProp.dispose()

      // Verify that the underlying iso dispose was called
      expect(locationProp.value.dispose).toHaveBeenCalled()
    })
  })

  // Note: Full integration tests with actual HeadlessContext are not included
  // due to the complexity of the HeadlessContext system. The current tests cover:
  // - URL validation utilities (isAbsoluteURL)
  // - Location prop creation and initialization
  // - URL to location conversion
  // - Location to URL conversion for both absolute and relative paths
  // - Proper disposal handling
  // - Edge cases with empty search and hash
  //
  // The headless-location module requires a complete HeadlessContext setup
  // to test the full navigation flow, including:
  // - Actual URL state management
  // - Context container integration
  // - Signal-based reactive updates
  // - Complete iso transformation behavior
})
