import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Location } from '../src/renderables/router/location'
import { makeBrowserLocationProp } from '../src/renderables/router/browser-location'
import { makeHeadlessLocationProp } from '../src/renderables/router/headless-location'

// Mock the dependencies
vi.mock('../src/renderables/router/browser-location', () => ({
  makeBrowserLocationProp: vi.fn()
}))

vi.mock('../src/renderables/router/headless-location', () => ({
  makeHeadlessLocationProp: vi.fn()
}))

describe('location.ts', () => {
  let mockMakeBrowserLocationProp: any
  let mockMakeHeadlessLocationProp: any

  beforeEach(() => {
    vi.clearAllMocks()
    mockMakeBrowserLocationProp = vi.mocked(makeBrowserLocationProp)
    mockMakeHeadlessLocationProp = vi.mocked(makeHeadlessLocationProp)
  })

  describe('Location Provider', () => {
    it('should have correct provider structure', () => {
      expect(Location).toBeDefined()
      expect(typeof Location.mark).toBe('symbol')
      expect(typeof Location.create).toBe('function')
    })

    it('should create browser location when context is browser', () => {
      // This covers lines 83-84: browser context detection
      const mockBrowserProp = { value: { pathname: '/', search: {}, hash: undefined } }
      mockMakeBrowserLocationProp.mockReturnValue(mockBrowserProp)

      const mockContext = {
        isBrowser: () => true,
        isHeadless: () => false
      }

      const result = Location.create(undefined, mockContext as any)

      expect(mockMakeBrowserLocationProp).toHaveBeenCalledTimes(1)
      expect(mockMakeHeadlessLocationProp).not.toHaveBeenCalled()
      expect(result).toBe(mockBrowserProp)
    })

    it('should create headless location when context is headless', () => {
      // This covers lines 85-86: headless context detection
      const mockHeadlessProp = { value: { pathname: '/headless', search: {}, hash: undefined } }
      mockMakeHeadlessLocationProp.mockReturnValue(mockHeadlessProp)

      const mockContext = {
        isBrowser: () => false,
        isHeadless: () => true
      }

      const result = Location.create(undefined, mockContext as any)

      expect(mockMakeHeadlessLocationProp).toHaveBeenCalledTimes(1)
      expect(mockMakeHeadlessLocationProp).toHaveBeenCalledWith(mockContext)
      expect(mockMakeBrowserLocationProp).not.toHaveBeenCalled()
      expect(result).toBe(mockHeadlessProp)
    })

    it('should throw error for unknown context', () => {
      // This covers lines 87-89: unknown context error
      const mockContext = {
        isBrowser: () => false,
        isHeadless: () => false
      }

      expect(() => {
        Location.create(undefined, mockContext as any)
      }).toThrow('Unknown context')

      expect(mockMakeBrowserLocationProp).not.toHaveBeenCalled()
      expect(mockMakeHeadlessLocationProp).not.toHaveBeenCalled()
    })

    it('should handle browser context with false headless', () => {
      const mockBrowserProp = { value: { pathname: '/browser', search: {}, hash: undefined } }
      mockMakeBrowserLocationProp.mockReturnValue(mockBrowserProp)

      const mockContext = {
        isBrowser: () => true,
        isHeadless: () => false
      }

      const result = Location.create(undefined, mockContext as any)

      expect(mockMakeBrowserLocationProp).toHaveBeenCalledTimes(1)
      expect(result).toBe(mockBrowserProp)
    })

    it('should handle headless context with false browser', () => {
      const mockHeadlessProp = { value: { pathname: '/headless-test', search: {}, hash: undefined } }
      mockMakeHeadlessLocationProp.mockReturnValue(mockHeadlessProp)

      const mockContext = {
        isBrowser: () => false,
        isHeadless: () => true
      }

      const result = Location.create(undefined, mockContext as any)

      expect(mockMakeHeadlessLocationProp).toHaveBeenCalledTimes(1)
      expect(mockMakeHeadlessLocationProp).toHaveBeenCalledWith(mockContext)
      expect(result).toBe(mockHeadlessProp)
    })

    it('should prioritize browser context when both are true', () => {
      // Edge case: if both isBrowser and isHeadless return true, browser should take precedence
      const mockBrowserProp = { value: { pathname: '/priority-test', search: {}, hash: undefined } }
      mockMakeBrowserLocationProp.mockReturnValue(mockBrowserProp)

      const mockContext = {
        isBrowser: () => true,
        isHeadless: () => true // This should be ignored
      }

      const result = Location.create(undefined, mockContext as any)

      expect(mockMakeBrowserLocationProp).toHaveBeenCalledTimes(1)
      expect(mockMakeHeadlessLocationProp).not.toHaveBeenCalled()
      expect(result).toBe(mockBrowserProp)
    })

    it('should handle context methods that throw errors', () => {
      const mockContext = {
        isBrowser: () => {
          throw new Error('Browser detection failed')
        },
        isHeadless: () => false
      }

      expect(() => {
        Location.create(undefined, mockContext as any)
      }).toThrow('Browser detection failed')
    })

    it('should handle context with undefined methods', () => {
      const mockContext = {
        isBrowser: undefined,
        isHeadless: () => false
      }

      expect(() => {
        Location.create(undefined, mockContext as any)
      }).toThrow() // Should throw when trying to call undefined method
    })

    it('should pass correct arguments to create method', () => {
      const mockBrowserProp = { value: { pathname: '/', search: {}, hash: undefined } }
      mockMakeBrowserLocationProp.mockReturnValue(mockBrowserProp)

      const mockContext = {
        isBrowser: () => true,
        isHeadless: () => false
      }

      const options = { test: 'option' }
      const result = Location.create(options, mockContext as any)

      // The first parameter (options) is not used in the current implementation
      // but we verify the method is called correctly
      expect(mockMakeBrowserLocationProp).toHaveBeenCalledTimes(1)
      expect(result).toBe(mockBrowserProp)
    })

    it('should handle complex context objects', () => {
      const mockHeadlessProp = { value: { pathname: '/complex', search: {}, hash: undefined } }
      mockMakeHeadlessLocationProp.mockReturnValue(mockHeadlessProp)

      const mockContext = {
        isBrowser: () => false,
        isHeadless: () => true,
        // Additional properties that might exist on real context
        element: document.createElement('div'),
        dispose: vi.fn(),
        addClasses: vi.fn(),
        removeClasses: vi.fn()
      }

      const result = Location.create(undefined, mockContext as any)

      expect(mockMakeHeadlessLocationProp).toHaveBeenCalledTimes(1)
      expect(mockMakeHeadlessLocationProp).toHaveBeenCalledWith(mockContext)
      expect(result).toBe(mockHeadlessProp)
    })
  })

  describe('Location Provider mark', () => {
    it('should have a unique provider mark', () => {
      expect(typeof Location.mark).toBe('symbol')

      // Each call should return the same mark
      const mark1 = Location.mark
      const mark2 = Location.mark
      expect(mark1).toBe(mark2)
    })

    it('should have a descriptive mark name', () => {
      const markString = Location.mark.toString()
      expect(markString).toContain('LocationProvider')
    })
  })

  // Note: Full integration tests with actual location providers are not included
  // due to the complexity of the browser/headless environment setup. The Location
  // provider requires:
  // - Proper DOMContext implementation
  // - Browser environment detection
  // - History API integration (for browser)
  // - URL parsing and state management
  //
  // The current tests cover:
  // - Provider structure validation
  // - Context detection logic (lines 83-89)
  // - Error handling for unknown contexts
  // - Proper delegation to browser/headless implementations
  //
  // The remaining uncovered functionality is in the browser-location.ts and
  // headless-location.ts files, which handle the actual location management.
})
