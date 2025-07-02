/**
 * Utilities for working with URLs and paths.
 *
 * This module provides comprehensive URL manipulation, query parameter handling,
 * and path utilities. Functions are designed to work safely with both absolute
 * and relative URLs, and handle edge cases gracefully.
 *
 * @public
 */

/**
 * Safely parses a URL string into a URL object.
 *
 * This function provides better error handling than the URL constructor
 * by returning null for invalid URLs instead of throwing.
 *
 * @example
 * ```typescript
 * const url = parseUrl('https://example.com/path?param=value')
 * // Result: URL object
 *
 * const invalid = parseUrl('not-a-url')
 * // Result: null
 * ```
 *
 * @param url - The URL string to parse
 * @returns A URL object if valid, null otherwise
 * @public
 */
export const parseUrl = (url: string): URL | null => {
  try {
    return new URL(url)
  } catch {
    return null
  }
}

/**
 * Builds a URL from a base URL and query parameters.
 *
 * This function safely constructs URLs with query parameters,
 * handling encoding and existing parameters properly.
 *
 * @example
 * ```typescript
 * const url = buildUrl('https://api.example.com/users', {
 *   page: '1',
 *   limit: '10',
 *   search: 'john doe'
 * })
 * // Result: 'https://api.example.com/users?page=1&limit=10&search=john%20doe'
 * ```
 *
 * @param base - The base URL
 * @param params - Query parameters to add
 * @returns The constructed URL string
 * @public
 */
export const buildUrl = (
  base: string,
  params?: Record<string, string>
): string => {
  if (!params || Object.keys(params).length === 0) {
    return base
  }

  const url = new URL(base)
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value)
  }
  return url.toString()
}

/**
 * Extracts query parameters from a URL as an object.
 *
 * This function parses the query string and returns all parameters
 * as a plain object with string values.
 *
 * @example
 * ```typescript
 * const params = getQueryParams('https://example.com/path?name=john&age=30&active=true')
 * // Result: { name: 'john', age: '30', active: 'true' }
 *
 * const empty = getQueryParams('https://example.com/path')
 * // Result: {}
 * ```
 *
 * @param url - The URL to extract parameters from
 * @returns An object containing all query parameters
 * @public
 */
export const getQueryParams = (url: string): Record<string, string> => {
  try {
    const urlObj = new URL(url)
    const params: Record<string, string> = {}
    for (const [key, value] of urlObj.searchParams) {
      params[key] = value
    }
    return params
  } catch {
    return {}
  }
}

/**
 * Sets a query parameter in a URL.
 *
 * This function adds or updates a single query parameter in a URL,
 * preserving all other parameters and URL components.
 *
 * @example
 * ```typescript
 * const url = setQueryParam('https://example.com/path?existing=value', 'new', 'param')
 * // Result: 'https://example.com/path?existing=value&new=param'
 *
 * const updated = setQueryParam('https://example.com/path?existing=old', 'existing', 'new')
 * // Result: 'https://example.com/path?existing=new'
 * ```
 *
 * @param url - The base URL
 * @param key - The parameter key
 * @param value - The parameter value
 * @returns The URL with the parameter set
 * @public
 */
export const setQueryParam = (
  url: string,
  key: string,
  value: string
): string => {
  try {
    const urlObj = new URL(url)
    urlObj.searchParams.set(key, value)
    return urlObj.toString()
  } catch {
    return url
  }
}

/**
 * Removes a query parameter from a URL.
 *
 * This function removes a specific query parameter from a URL,
 * preserving all other parameters and URL components.
 *
 * @example
 * ```typescript
 * const url = removeQueryParam('https://example.com/path?keep=this&remove=that', 'remove')
 * // Result: 'https://example.com/path?keep=this'
 * ```
 *
 * @param url - The base URL
 * @param key - The parameter key to remove
 * @returns The URL with the parameter removed
 * @public
 */
export const removeQueryParam = (url: string, key: string): string => {
  try {
    const urlObj = new URL(url)
    urlObj.searchParams.delete(key)
    return urlObj.toString()
  } catch {
    return url
  }
}

/**
 * Checks if a string is a valid URL.
 *
 * This function validates URLs more safely than using the URL constructor
 * directly, as it doesn't throw exceptions.
 *
 * @example
 * ```typescript
 * isValidUrl('https://example.com') // true
 * isValidUrl('http://localhost:3000/path') // true
 * isValidUrl('ftp://files.example.com') // true
 * isValidUrl('not-a-url') // false
 * isValidUrl('') // false
 * ```
 *
 * @param url - The string to validate
 * @returns true if the string is a valid URL, false otherwise
 * @public
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Joins multiple path segments into a single path.
 *
 * This function properly handles leading and trailing slashes,
 * ensuring a clean path without double slashes or missing separators.
 *
 * @example
 * ```typescript
 * const path = joinPaths('api', 'v1', 'users', '123')
 * // Result: 'api/v1/users/123'
 *
 * const withSlashes = joinPaths('/api/', '/v1/', 'users/')
 * // Result: '/api/v1/users/'
 *
 * const empty = joinPaths('', 'path', '', 'file')
 * // Result: 'path/file'
 * ```
 *
 * @param paths - Path segments to join
 * @returns The joined path
 * @public
 */
export const joinPaths = (...paths: string[]): string => {
  if (paths.length === 0) return ''

  const nonEmptyPaths = paths.filter(path => path.length > 0)
  if (nonEmptyPaths.length === 0) return ''

  const startsWithSlash = nonEmptyPaths[0].startsWith('/')
  const endsWithSlash = nonEmptyPaths[nonEmptyPaths.length - 1].endsWith('/')

  const cleanPaths = nonEmptyPaths.map(path => path.replace(/^\/+|\/+$/g, ''))
  const joined = cleanPaths.filter(path => path.length > 0).join('/')

  return (startsWithSlash ? '/' : '') + joined + (endsWithSlash ? '/' : '')
}

/**
 * Normalizes a path by removing redundant segments.
 *
 * This function resolves '..' and '.' segments in paths,
 * similar to path.normalize in Node.js but for web contexts.
 *
 * @example
 * ```typescript
 * const path = normalizePath('/api/../users/./123/../456')
 * // Result: '/users/456'
 *
 * const relative = normalizePath('../../parent/child')
 * // Result: '../../parent/child'
 * ```
 *
 * @param path - The path to normalize
 * @returns The normalized path
 * @public
 */
export const normalizePath = (path: string): string => {
  if (!path) return ''

  const isAbsolute = path.startsWith('/')
  const segments = path.split('/').filter(segment => segment.length > 0)
  const normalized: string[] = []

  for (const segment of segments) {
    if (segment === '.') {
      continue
    } else if (segment === '..') {
      if (normalized.length > 0 && normalized[normalized.length - 1] !== '..') {
        normalized.pop()
      } else if (!isAbsolute) {
        normalized.push('..')
      }
    } else {
      normalized.push(segment)
    }
  }

  const result = normalized.join('/')
  return isAbsolute ? '/' + result : result
}

/**
 * Extracts the file extension from a path.
 *
 * This function returns the file extension including the dot,
 * or an empty string if no extension is found.
 *
 * @example
 * ```typescript
 * getFileExtension('/path/to/file.txt') // '.txt'
 * getFileExtension('image.jpeg') // '.jpeg'
 * getFileExtension('README') // ''
 * getFileExtension('.hidden') // ''
 * getFileExtension('file.tar.gz') // '.gz'
 * ```
 *
 * @param path - The path to extract extension from
 * @returns The file extension including the dot, or empty string
 * @public
 */
export const getFileExtension = (path: string): string => {
  const fileName = getFileName(path)
  const lastDotIndex = fileName.lastIndexOf('.')

  if (lastDotIndex === -1 || lastDotIndex === 0) {
    return ''
  }

  return fileName.substring(lastDotIndex)
}

/**
 * Extracts the file name from a path.
 *
 * This function returns the last segment of a path,
 * which is typically the file name.
 *
 * @example
 * ```typescript
 * getFileName('/path/to/file.txt') // 'file.txt'
 * getFileName('file.txt') // 'file.txt'
 * getFileName('/path/to/directory/') // ''
 * getFileName('/path/to/directory') // 'directory'
 * ```
 *
 * @param path - The path to extract file name from
 * @returns The file name
 * @public
 */
export const getFileName = (path: string): string => {
  if (!path) return ''

  // If path ends with slash(es), it's a directory, return empty string
  if (path.match(/\/+$/)) return ''

  const lastSlashIndex = path.lastIndexOf('/')

  return lastSlashIndex === -1 ? path : path.substring(lastSlashIndex + 1)
}

/**
 * Extracts the base name (file name without extension) from a path.
 *
 * This function returns the file name without its extension.
 *
 * @example
 * ```typescript
 * getBaseName('/path/to/file.txt') // 'file'
 * getBaseName('image.jpeg') // 'image'
 * getBaseName('README') // 'README'
 * getBaseName('.hidden') // '.hidden'
 * getBaseName('file.tar.gz') // 'file.tar'
 * ```
 *
 * @param path - The path to extract base name from
 * @returns The base name without extension
 * @public
 */
export const getBaseName = (path: string): string => {
  const fileName = getFileName(path)
  const extension = getFileExtension(path)

  if (!extension) {
    return fileName
  }

  return fileName.substring(0, fileName.length - extension.length)
}
