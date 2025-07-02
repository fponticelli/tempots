import { describe, test, expect } from 'vitest'
import {
  parseUrl,
  buildUrl,
  getQueryParams,
  setQueryParam,
  removeQueryParam,
  isValidUrl,
  joinPaths,
  normalizePath,
  getFileExtension,
  getFileName,
  getBaseName
} from '../src/url'

describe('URL utilities', () => {
  describe('parseUrl', () => {
    test('parses valid URLs', () => {
      const url = parseUrl('https://example.com/path?param=value')
      
      expect(url).toBeInstanceOf(URL)
      expect(url?.hostname).toBe('example.com')
      expect(url?.pathname).toBe('/path')
      expect(url?.searchParams.get('param')).toBe('value')
    })

    test('returns null for invalid URLs', () => {
      expect(parseUrl('not-a-url')).toBeNull()
      expect(parseUrl('')).toBeNull()
      expect(parseUrl('://invalid')).toBeNull()
    })
  })

  describe('buildUrl', () => {
    test('builds URL with query parameters', () => {
      const url = buildUrl('https://api.example.com/users', {
        page: '1',
        limit: '10',
        search: 'john doe'
      })
      
      expect(url).toBe('https://api.example.com/users?page=1&limit=10&search=john+doe')
    })

    test('returns base URL when no parameters', () => {
      const url = buildUrl('https://example.com/path')
      expect(url).toBe('https://example.com/path')
    })

    test('returns base URL when empty parameters', () => {
      const url = buildUrl('https://example.com/path', {})
      expect(url).toBe('https://example.com/path')
    })

    test('handles special characters in parameters', () => {
      const url = buildUrl('https://example.com', {
        query: 'hello world & more',
        special: '!@#$%'
      })
      
      expect(url).toContain('query=hello+world+%26+more')
      expect(url).toContain('special=%21%40%23%24%25')
    })
  })

  describe('getQueryParams', () => {
    test('extracts query parameters', () => {
      const params = getQueryParams('https://example.com/path?name=john&age=30&active=true')
      
      expect(params).toEqual({
        name: 'john',
        age: '30',
        active: 'true'
      })
    })

    test('returns empty object for URL without parameters', () => {
      const params = getQueryParams('https://example.com/path')
      expect(params).toEqual({})
    })

    test('returns empty object for invalid URL', () => {
      const params = getQueryParams('not-a-url')
      expect(params).toEqual({})
    })

    test('handles encoded parameters', () => {
      const params = getQueryParams('https://example.com?search=hello%20world&special=%21%40%23')
      
      expect(params.search).toBe('hello world')
      expect(params.special).toBe('!@#')
    })
  })

  describe('setQueryParam', () => {
    test('adds new query parameter', () => {
      const url = setQueryParam('https://example.com/path?existing=value', 'new', 'param')
      
      expect(url).toContain('existing=value')
      expect(url).toContain('new=param')
    })

    test('updates existing query parameter', () => {
      const url = setQueryParam('https://example.com/path?existing=old', 'existing', 'new')
      
      expect(url).toBe('https://example.com/path?existing=new')
    })

    test('handles special characters', () => {
      const url = setQueryParam('https://example.com', 'query', 'hello world')
      
      expect(url).toContain('query=hello+world')
    })

    test('returns original URL for invalid input', () => {
      const invalidUrl = 'not-a-url'
      const result = setQueryParam(invalidUrl, 'key', 'value')
      
      expect(result).toBe(invalidUrl)
    })
  })

  describe('removeQueryParam', () => {
    test('removes existing query parameter', () => {
      const url = removeQueryParam('https://example.com/path?keep=this&remove=that', 'remove')
      
      expect(url).toBe('https://example.com/path?keep=this')
    })

    test('does nothing when parameter does not exist', () => {
      const original = 'https://example.com/path?keep=this'
      const url = removeQueryParam(original, 'nonexistent')
      
      expect(url).toBe(original)
    })

    test('returns original URL for invalid input', () => {
      const invalidUrl = 'not-a-url'
      const result = removeQueryParam(invalidUrl, 'key')
      
      expect(result).toBe(invalidUrl)
    })
  })

  describe('isValidUrl', () => {
    test('returns true for valid URLs', () => {
      expect(isValidUrl('https://example.com')).toBe(true)
      expect(isValidUrl('http://localhost:3000/path')).toBe(true)
      expect(isValidUrl('ftp://files.example.com')).toBe(true)
      expect(isValidUrl('mailto:test@example.com')).toBe(true)
    })

    test('returns false for invalid URLs', () => {
      expect(isValidUrl('not-a-url')).toBe(false)
      expect(isValidUrl('')).toBe(false)
      expect(isValidUrl('://invalid')).toBe(false)
      expect(isValidUrl('just-text')).toBe(false)
    })
  })

  describe('joinPaths', () => {
    test('joins multiple path segments', () => {
      const path = joinPaths('api', 'v1', 'users', '123')
      expect(path).toBe('api/v1/users/123')
    })

    test('handles leading and trailing slashes', () => {
      const path = joinPaths('/api/', '/v1/', 'users/')
      expect(path).toBe('/api/v1/users/')
    })

    test('filters out empty segments', () => {
      const path = joinPaths('', 'path', '', 'file')
      expect(path).toBe('path/file')
    })

    test('returns empty string for no paths', () => {
      const path = joinPaths()
      expect(path).toBe('')
    })

    test('returns empty string for all empty paths', () => {
      const path = joinPaths('', '', '')
      expect(path).toBe('')
    })

    test('preserves leading slash from first segment', () => {
      const path = joinPaths('/absolute', 'path')
      expect(path).toBe('/absolute/path')
    })

    test('preserves trailing slash from last segment', () => {
      const path = joinPaths('path', 'to', 'directory/')
      expect(path).toBe('path/to/directory/')
    })
  })

  describe('normalizePath', () => {
    test('resolves .. and . segments', () => {
      const path = normalizePath('/api/../users/./123/../456')
      expect(path).toBe('/users/456')
    })

    test('handles relative paths', () => {
      const path = normalizePath('../../parent/child')
      expect(path).toBe('../../parent/child')
    })

    test('handles absolute paths', () => {
      const path = normalizePath('/absolute/../path/./file')
      expect(path).toBe('/path/file')
    })

    test('returns empty string for empty input', () => {
      const path = normalizePath('')
      expect(path).toBe('')
    })

    test('handles complex navigation', () => {
      const path = normalizePath('/a/b/c/../../d/./e/../f')
      expect(path).toBe('/a/d/f')
    })
  })

  describe('getFileExtension', () => {
    test('extracts file extension', () => {
      expect(getFileExtension('/path/to/file.txt')).toBe('.txt')
      expect(getFileExtension('image.jpeg')).toBe('.jpeg')
      expect(getFileExtension('document.pdf')).toBe('.pdf')
    })

    test('returns empty string for no extension', () => {
      expect(getFileExtension('README')).toBe('')
      expect(getFileExtension('/path/to/file')).toBe('')
    })

    test('returns empty string for hidden files', () => {
      expect(getFileExtension('.hidden')).toBe('')
      expect(getFileExtension('.gitignore')).toBe('')
    })

    test('handles multiple dots', () => {
      expect(getFileExtension('file.tar.gz')).toBe('.gz')
      expect(getFileExtension('backup.2023.01.15.sql')).toBe('.sql')
    })
  })

  describe('getFileName', () => {
    test('extracts file name from path', () => {
      expect(getFileName('/path/to/file.txt')).toBe('file.txt')
      expect(getFileName('file.txt')).toBe('file.txt')
      expect(getFileName('/path/to/directory')).toBe('directory')
    })

    test('returns empty string for directory paths', () => {
      expect(getFileName('/path/to/directory/')).toBe('')
      expect(getFileName('/path/to/directory///')).toBe('')
    })

    test('returns empty string for empty input', () => {
      expect(getFileName('')).toBe('')
    })

    test('handles root path', () => {
      expect(getFileName('/')).toBe('')
    })
  })

  describe('getBaseName', () => {
    test('extracts base name without extension', () => {
      expect(getBaseName('/path/to/file.txt')).toBe('file')
      expect(getBaseName('image.jpeg')).toBe('image')
      expect(getBaseName('document.pdf')).toBe('document')
    })

    test('returns full name for files without extension', () => {
      expect(getBaseName('README')).toBe('README')
      expect(getBaseName('/path/to/file')).toBe('file')
    })

    test('returns hidden file name as-is', () => {
      expect(getBaseName('.hidden')).toBe('.hidden')
      expect(getBaseName('.gitignore')).toBe('.gitignore')
    })

    test('handles multiple dots', () => {
      expect(getBaseName('file.tar.gz')).toBe('file.tar')
      expect(getBaseName('backup.2023.01.15.sql')).toBe('backup.2023.01.15')
    })
  })
})
