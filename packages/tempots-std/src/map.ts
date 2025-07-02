/**
 * Utilities for working with Map objects.
 *
 * This module provides functional utilities for Map manipulation that go beyond
 * the native Map methods, offering type-safe operations for filtering, mapping,
 * merging, and converting Maps.
 *
 * @public
 */

/**
 * Creates a Map from an array of key-value pairs.
 *
 * This function provides better type inference than the Map constructor
 * when working with typed key-value pairs.
 *
 * @example
 * ```typescript
 * const entries: [string, number][] = [['a', 1], ['b', 2], ['c', 3]]
 * const map = mapFromEntries(entries)
 * // Result: Map { 'a' => 1, 'b' => 2, 'c' => 3 }
 * ```
 *
 * @param entries - Array of key-value pairs
 * @returns A new Map containing the entries
 * @public
 */
export const mapFromEntries = <K, V>(entries: readonly [K, V][]): Map<K, V> =>
  new Map(entries)

/**
 * Converts a Map with string keys to a plain object.
 *
 * This is useful for serialization or when you need to work with APIs
 * that expect plain objects instead of Maps.
 *
 * @example
 * ```typescript
 * const map = new Map([['name', 'Alice'], ['age', '30']])
 * const obj = mapToObject(map)
 * // Result: { name: 'Alice', age: '30' }
 * ```
 *
 * @param map - The Map to convert
 * @returns A plain object with the same key-value pairs
 * @public
 */
export const mapToObject = <V>(map: Map<string, V>): Record<string, V> => {
  const result: Record<string, V> = {}
  for (const [key, value] of map) {
    result[key] = value
  }
  return result
}

/**
 * Creates a new Map containing only entries that satisfy the predicate.
 *
 * This provides a functional approach to filtering Maps, similar to
 * Array.prototype.filter but for Map objects.
 *
 * @example
 * ```typescript
 * const map = new Map([['a', 1], ['b', 2], ['c', 3], ['d', 4]])
 * const evenValues = mapFilter(map, (value) => value % 2 === 0)
 * // Result: Map { 'b' => 2, 'd' => 4 }
 * ```
 *
 * @param map - The Map to filter
 * @param predicate - Function that tests each entry
 * @returns A new Map with entries that satisfy the predicate
 * @public
 */
export const mapFilter = <K, V>(
  map: Map<K, V>,
  predicate: (value: V, key: K) => boolean
): Map<K, V> => {
  const result = new Map<K, V>()
  for (const [key, value] of map) {
    if (predicate(value, key)) {
      result.set(key, value)
    }
  }
  return result
}

/**
 * Creates a new Map with values transformed by the mapper function.
 *
 * This provides a functional approach to transforming Map values,
 * similar to Array.prototype.map but for Map objects.
 *
 * @example
 * ```typescript
 * const map = new Map([['a', 1], ['b', 2], ['c', 3]])
 * const doubled = mapMap(map, (value) => value * 2)
 * // Result: Map { 'a' => 2, 'b' => 4, 'c' => 6 }
 * ```
 *
 * @param map - The Map to transform
 * @param mapper - Function that transforms each value
 * @returns A new Map with transformed values
 * @public
 */
export const mapMap = <K, V, U>(
  map: Map<K, V>,
  mapper: (value: V, key: K) => U
): Map<K, U> => {
  const result = new Map<K, U>()
  for (const [key, value] of map) {
    result.set(key, mapper(value, key))
  }
  return result
}

/**
 * Merges multiple Maps into a single Map.
 *
 * Later Maps take precedence over earlier ones for duplicate keys.
 * This is useful for combining configuration objects or merging data.
 *
 * @example
 * ```typescript
 * const map1 = new Map([['a', 1], ['b', 2]])
 * const map2 = new Map([['b', 3], ['c', 4]])
 * const merged = mapMerge(map1, map2)
 * // Result: Map { 'a' => 1, 'b' => 3, 'c' => 4 }
 * ```
 *
 * @param maps - Maps to merge
 * @returns A new Map containing all entries from input Maps
 * @public
 */
export const mapMerge = <K, V>(...maps: Map<K, V>[]): Map<K, V> => {
  const result = new Map<K, V>()
  for (const map of maps) {
    for (const [key, value] of map) {
      result.set(key, value)
    }
  }
  return result
}

/**
 * Groups an array of items by a key function into a Map.
 *
 * This is more flexible than object-based grouping as it supports
 * any key type, not just strings and symbols.
 *
 * @example
 * ```typescript
 * const users = [
 *   { name: 'Alice', department: 'Engineering' },
 *   { name: 'Bob', department: 'Engineering' },
 *   { name: 'Carol', department: 'Marketing' }
 * ]
 * const byDepartment = mapGroupBy(users, user => user.department)
 * // Result: Map {
 * //   'Engineering' => [{ name: 'Alice', ... }, { name: 'Bob', ... }],
 * //   'Marketing' => [{ name: 'Carol', ... }]
 * // }
 * ```
 *
 * @param array - Array of items to group
 * @param keyFn - Function that extracts the grouping key from each item
 * @returns A Map where keys are group identifiers and values are arrays of items
 * @public
 */
export const mapGroupBy = <T, K>(
  array: readonly T[],
  keyFn: (item: T) => K
): Map<K, T[]> => {
  const result = new Map<K, T[]>()
  for (const item of array) {
    const key = keyFn(item)
    const existing = result.get(key)
    if (existing) {
      existing.push(item)
    } else {
      result.set(key, [item])
    }
  }
  return result
}

/**
 * Checks if a Map is empty.
 *
 * This provides a semantic way to check for empty Maps,
 * making code more readable than checking size === 0.
 *
 * @example
 * ```typescript
 * const emptyMap = new Map()
 * const nonEmptyMap = new Map([['a', 1]])
 *
 * mapIsEmpty(emptyMap) // true
 * mapIsEmpty(nonEmptyMap) // false
 * ```
 *
 * @param map - The Map to check
 * @returns true if the Map has no entries, false otherwise
 * @public
 */
export const mapIsEmpty = <K, V>(map: Map<K, V>): boolean => map.size === 0

/**
 * Gets all keys from a Map as an array.
 *
 * This provides a convenient way to get Map keys as an array
 * for further processing with array methods.
 *
 * @example
 * ```typescript
 * const map = new Map([['a', 1], ['b', 2], ['c', 3]])
 * const keys = mapKeys(map)
 * // Result: ['a', 'b', 'c']
 * ```
 *
 * @param map - The Map to extract keys from
 * @returns An array of all keys in the Map
 * @public
 */
export const mapKeys = <K, V>(map: Map<K, V>): K[] => Array.from(map.keys())

/**
 * Gets all values from a Map as an array.
 *
 * This provides a convenient way to get Map values as an array
 * for further processing with array methods.
 *
 * @example
 * ```typescript
 * const map = new Map([['a', 1], ['b', 2], ['c', 3]])
 * const values = mapValues(map)
 * // Result: [1, 2, 3]
 * ```
 *
 * @param map - The Map to extract values from
 * @returns An array of all values in the Map
 * @public
 */
export const mapValues = <K, V>(map: Map<K, V>): V[] => Array.from(map.values())

/**
 * Gets all entries from a Map as an array of key-value pairs.
 *
 * This provides a convenient way to get Map entries as an array
 * for further processing or serialization.
 *
 * @example
 * ```typescript
 * const map = new Map([['a', 1], ['b', 2], ['c', 3]])
 * const entries = mapEntries(map)
 * // Result: [['a', 1], ['b', 2], ['c', 3]]
 * ```
 *
 * @param map - The Map to extract entries from
 * @returns An array of all key-value pairs in the Map
 * @public
 */
export const mapEntries = <K, V>(map: Map<K, V>): [K, V][] =>
  Array.from(map.entries())
