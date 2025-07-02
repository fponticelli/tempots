import { describe, test, expect } from 'vitest'
import {
  mapFromEntries,
  mapToObject,
  mapFilter,
  mapMap,
  mapMerge,
  mapGroupBy,
  mapIsEmpty,
  mapKeys,
  mapValues,
  mapEntries
} from '../src/map'

describe('Map utilities', () => {
  describe('mapFromEntries', () => {
    test('creates Map from entries array', () => {
      const entries: [string, number][] = [['a', 1], ['b', 2], ['c', 3]]
      const map = mapFromEntries(entries)
      
      expect(map.get('a')).toBe(1)
      expect(map.get('b')).toBe(2)
      expect(map.get('c')).toBe(3)
      expect(map.size).toBe(3)
    })

    test('works with empty array', () => {
      const map = mapFromEntries([])
      expect(map.size).toBe(0)
    })

    test('works with different key types', () => {
      const entries: [number, string][] = [[1, 'one'], [2, 'two']]
      const map = mapFromEntries(entries)
      
      expect(map.get(1)).toBe('one')
      expect(map.get(2)).toBe('two')
    })
  })

  describe('mapToObject', () => {
    test('converts Map to object', () => {
      const map = new Map([['name', 'Alice'], ['age', '30'], ['city', 'NYC']])
      const obj = mapToObject(map)
      
      expect(obj).toEqual({ name: 'Alice', age: '30', city: 'NYC' })
    })

    test('works with empty Map', () => {
      const map = new Map<string, string>()
      const obj = mapToObject(map)
      
      expect(obj).toEqual({})
    })
  })

  describe('mapFilter', () => {
    test('filters Map entries by predicate', () => {
      const map = new Map([['a', 1], ['b', 2], ['c', 3], ['d', 4]])
      const filtered = mapFilter(map, (value) => value % 2 === 0)
      
      expect(filtered.get('b')).toBe(2)
      expect(filtered.get('d')).toBe(4)
      expect(filtered.has('a')).toBe(false)
      expect(filtered.has('c')).toBe(false)
      expect(filtered.size).toBe(2)
    })

    test('predicate receives both value and key', () => {
      const map = new Map([['apple', 5], ['banana', 6], ['cherry', 6]])
      const filtered = mapFilter(map, (value, key) => value === 6 && key.startsWith('b'))
      
      expect(filtered.get('banana')).toBe(6)
      expect(filtered.has('cherry')).toBe(false)
      expect(filtered.size).toBe(1)
    })

    test('returns empty Map when no entries match', () => {
      const map = new Map([['a', 1], ['b', 2]])
      const filtered = mapFilter(map, () => false)
      
      expect(filtered.size).toBe(0)
    })
  })

  describe('mapMap', () => {
    test('transforms Map values', () => {
      const map = new Map([['a', 1], ['b', 2], ['c', 3]])
      const mapped = mapMap(map, (value) => value * 2)
      
      expect(mapped.get('a')).toBe(2)
      expect(mapped.get('b')).toBe(4)
      expect(mapped.get('c')).toBe(6)
      expect(mapped.size).toBe(3)
    })

    test('mapper receives both value and key', () => {
      const map = new Map([['x', 10], ['y', 20]])
      const mapped = mapMap(map, (value, key) => `${key}:${value}`)
      
      expect(mapped.get('x')).toBe('x:10')
      expect(mapped.get('y')).toBe('y:20')
    })

    test('works with empty Map', () => {
      const map = new Map<string, number>()
      const mapped = mapMap(map, (value) => value * 2)
      
      expect(mapped.size).toBe(0)
    })
  })

  describe('mapMerge', () => {
    test('merges multiple Maps', () => {
      const map1 = new Map([['a', 1], ['b', 2]])
      const map2 = new Map([['c', 3], ['d', 4]])
      const map3 = new Map([['e', 5]])
      
      const merged = mapMerge(map1, map2, map3)
      
      expect(merged.get('a')).toBe(1)
      expect(merged.get('c')).toBe(3)
      expect(merged.get('e')).toBe(5)
      expect(merged.size).toBe(5)
    })

    test('later Maps override earlier ones', () => {
      const map1 = new Map([['a', 1], ['b', 2]])
      const map2 = new Map([['b', 20], ['c', 3]])
      
      const merged = mapMerge(map1, map2)
      
      expect(merged.get('a')).toBe(1)
      expect(merged.get('b')).toBe(20) // Overridden
      expect(merged.get('c')).toBe(3)
    })

    test('works with no Maps', () => {
      const merged = mapMerge()
      expect(merged.size).toBe(0)
    })
  })

  describe('mapGroupBy', () => {
    test('groups array elements by key function', () => {
      const users = [
        { name: 'Alice', department: 'Engineering' },
        { name: 'Bob', department: 'Engineering' },
        { name: 'Carol', department: 'Marketing' },
        { name: 'Dave', department: 'Marketing' }
      ]
      
      const grouped = mapGroupBy(users, user => user.department)
      
      expect(grouped.get('Engineering')).toHaveLength(2)
      expect(grouped.get('Engineering')?.[0].name).toBe('Alice')
      expect(grouped.get('Engineering')?.[1].name).toBe('Bob')
      expect(grouped.get('Marketing')).toHaveLength(2)
      expect(grouped.get('Marketing')?.[0].name).toBe('Carol')
    })

    test('works with empty array', () => {
      const grouped = mapGroupBy([], (x: any) => x.key)
      expect(grouped.size).toBe(0)
    })

    test('works with non-string keys', () => {
      const items = [
        { value: 'a', priority: 1 },
        { value: 'b', priority: 2 },
        { value: 'c', priority: 1 }
      ]
      
      const grouped = mapGroupBy(items, item => item.priority)
      
      expect(grouped.get(1)).toHaveLength(2)
      expect(grouped.get(2)).toHaveLength(1)
    })
  })

  describe('mapIsEmpty', () => {
    test('returns true for empty Map', () => {
      const map = new Map()
      expect(mapIsEmpty(map)).toBe(true)
    })

    test('returns false for non-empty Map', () => {
      const map = new Map([['a', 1]])
      expect(mapIsEmpty(map)).toBe(false)
    })
  })

  describe('mapKeys', () => {
    test('returns array of Map keys', () => {
      const map = new Map([['a', 1], ['b', 2], ['c', 3]])
      const keys = mapKeys(map)
      
      expect(keys).toEqual(['a', 'b', 'c'])
    })

    test('works with empty Map', () => {
      const map = new Map()
      const keys = mapKeys(map)
      
      expect(keys).toEqual([])
    })
  })

  describe('mapValues', () => {
    test('returns array of Map values', () => {
      const map = new Map([['a', 1], ['b', 2], ['c', 3]])
      const values = mapValues(map)
      
      expect(values).toEqual([1, 2, 3])
    })

    test('works with empty Map', () => {
      const map = new Map()
      const values = mapValues(map)
      
      expect(values).toEqual([])
    })
  })

  describe('mapEntries', () => {
    test('returns array of Map entries', () => {
      const map = new Map([['a', 1], ['b', 2], ['c', 3]])
      const entries = mapEntries(map)
      
      expect(entries).toEqual([['a', 1], ['b', 2], ['c', 3]])
    })

    test('works with empty Map', () => {
      const map = new Map()
      const entries = mapEntries(map)
      
      expect(entries).toEqual([])
    })
  })
})
