import { describe, it, expect, vi } from 'vitest'
import {
  areLocationsEqual,
  locationFromURL,
  urlFromLocation,
  type LocationData,
} from '../src/renderables/router/location-data'
// Mock getWindow
const mockWindow = {
  location: {
    toString: () => 'http://localhost:3000/'
  }
}

vi.mock('@tempots/dom', async () => {
  const actual = await vi.importActual('@tempots/dom')
  return {
    ...actual,
    getWindow: () => mockWindow
  }
})

describe('location-data.ts', () => {
  describe('areLocationsEqual', () => {
    it('should return true for identical locations', () => {
      const location1: LocationData = {
        pathname: '/test',
        search: { param: 'value' },
        hash: 'section'
      }
      const location2: LocationData = {
        pathname: '/test',
        search: { param: 'value' },
        hash: 'section'
      }

      expect(areLocationsEqual(location1, location2)).toBe(true)
    })

    it('should return false for different pathnames', () => {
      const location1: LocationData = {
        pathname: '/test1',
        search: {},
        hash: undefined
      }
      const location2: LocationData = {
        pathname: '/test2',
        search: {},
        hash: undefined
      }

      expect(areLocationsEqual(location1, location2)).toBe(false)
    })

    it('should return false for different search parameters', () => {
      const location1: LocationData = {
        pathname: '/test',
        search: { param1: 'value1' },
        hash: undefined
      }
      const location2: LocationData = {
        pathname: '/test',
        search: { param2: 'value2' },
        hash: undefined
      }

      expect(areLocationsEqual(location1, location2)).toBe(false)
    })

    it('should return false for different hash values', () => {
      const location1: LocationData = {
        pathname: '/test',
        search: {},
        hash: 'section1'
      }
      const location2: LocationData = {
        pathname: '/test',
        search: {},
        hash: 'section2'
      }

      expect(areLocationsEqual(location1, location2)).toBe(false)
    })

    it('should handle undefined hash values', () => {
      const location1: LocationData = {
        pathname: '/test',
        search: {},
        hash: undefined
      }
      const location2: LocationData = {
        pathname: '/test',
        search: {},
        hash: undefined
      }

      expect(areLocationsEqual(location1, location2)).toBe(true)
    })

    it('should return false when one hash is undefined and other is not', () => {
      const location1: LocationData = {
        pathname: '/test',
        search: {},
        hash: undefined
      }
      const location2: LocationData = {
        pathname: '/test',
        search: {},
        hash: 'section'
      }

      expect(areLocationsEqual(location1, location2)).toBe(false)
    })

    it('should handle complex search parameters', () => {
      const location1: LocationData = {
        pathname: '/test',
        search: { param1: 'value1', param2: 'value2' },
        hash: undefined
      }
      const location2: LocationData = {
        pathname: '/test',
        search: { param1: 'value1', param2: 'value2' },
        hash: undefined
      }

      expect(areLocationsEqual(location1, location2)).toBe(true)
    })

    it('should be sensitive to search parameter order in JSON comparison', () => {
      const location1: LocationData = {
        pathname: '/test',
        search: { a: '1', b: '2' },
        hash: undefined
      }
      const location2: LocationData = {
        pathname: '/test',
        search: { b: '2', a: '1' },
        hash: undefined
      }

      // This depends on JSON.stringify behavior - object property order matters
      expect(areLocationsEqual(location1, location2)).toBe(false)
    })
  })

  describe('locationFromURL', () => {
    it('should parse a simple URL', () => {
      const result = locationFromURL('http://example.com/test')
      
      expect(result).toEqual({
        pathname: '/test',
        search: {},
        hash: undefined
      })
    })

    it('should parse URL with search parameters', () => {
      const result = locationFromURL('http://example.com/test?param1=value1&param2=value2')
      
      expect(result).toEqual({
        pathname: '/test',
        search: { param1: 'value1', param2: 'value2' },
        hash: undefined
      })
    })

    it('should parse URL with hash', () => {
      const result = locationFromURL('http://example.com/test#section')
      
      expect(result).toEqual({
        pathname: '/test',
        search: {},
        hash: 'section'
      })
    })

    it('should parse URL with both search and hash', () => {
      const result = locationFromURL('http://example.com/test?param=value#section')
      
      expect(result).toEqual({
        pathname: '/test',
        search: { param: 'value' },
        hash: 'section'
      })
    })

    it('should handle empty hash', () => {
      const result = locationFromURL('http://example.com/test#')
      
      expect(result).toEqual({
        pathname: '/test',
        search: {},
        hash: undefined
      })
    })

    it('should handle relative URLs with base URL', () => {
      const result = locationFromURL('/test?param=value', 'http://example.com')
      
      expect(result).toEqual({
        pathname: '/test',
        search: { param: 'value' },
        hash: undefined
      })
    })

    it('should use window location as base when no base URL provided', () => {
      const result = locationFromURL('/test')
      
      expect(result).toEqual({
        pathname: '/test',
        search: {},
        hash: undefined
      })
    })

    it('should handle URLs with encoded parameters', () => {
      const result = locationFromURL('http://example.com/test?param=hello%20world')
      
      expect(result).toEqual({
        pathname: '/test',
        search: { param: 'hello world' },
        hash: undefined
      })
    })

    it('should handle complex pathnames', () => {
      const result = locationFromURL('http://example.com/path/to/resource')
      
      expect(result).toEqual({
        pathname: '/path/to/resource',
        search: {},
        hash: undefined
      })
    })
  })

  describe('urlFromLocation', () => {
    it('should create URL from simple location', () => {
      const location: LocationData = {
        pathname: '/test',
        search: {},
        hash: undefined
      }

      const result = urlFromLocation(location)
      expect(result).toBe('/test')
    })

    it('should create URL with search parameters', () => {
      const location: LocationData = {
        pathname: '/test',
        search: { param1: 'value1', param2: 'value2' },
        hash: undefined
      }

      const result = urlFromLocation(location)
      expect(result).toBe('/test?param1=value1&param2=value2')
    })

    it('should create URL with hash', () => {
      const location: LocationData = {
        pathname: '/test',
        search: {},
        hash: 'section'
      }

      const result = urlFromLocation(location)
      expect(result).toBe('/test#section')
    })

    it('should create URL with both search and hash', () => {
      const location: LocationData = {
        pathname: '/test',
        search: { param: 'value' },
        hash: 'section'
      }

      const result = urlFromLocation(location)
      expect(result).toBe('/test?param=value#section')
    })

    it('should handle empty search object', () => {
      const location: LocationData = {
        pathname: '/test',
        search: {},
        hash: undefined
      }

      const result = urlFromLocation(location)
      expect(result).toBe('/test')
    })

    it('should handle undefined hash', () => {
      const location: LocationData = {
        pathname: '/test',
        search: { param: 'value' },
        hash: undefined
      }

      const result = urlFromLocation(location)
      expect(result).toBe('/test?param=value')
    })

    it('should handle special characters in search parameters', () => {
      const location: LocationData = {
        pathname: '/test',
        search: { param: 'hello world', special: 'a&b=c' },
        hash: undefined
      }

      const result = urlFromLocation(location)
      expect(result).toContain('param=hello+world')
      expect(result).toContain('special=a%26b%3Dc')
    })

    it('should handle root pathname', () => {
      const location: LocationData = {
        pathname: '/',
        search: {},
        hash: undefined
      }

      const result = urlFromLocation(location)
      expect(result).toBe('/')
    })
  })
})
