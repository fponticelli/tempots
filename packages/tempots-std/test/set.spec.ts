import { describe, test, expect } from 'vitest'
import {
  setUnion,
  setIntersection,
  setDifference,
  setSymmetricDifference,
  setIsSubset,
  setIsSuperset,
  setFilter,
  setMap,
  setIsEmpty,
  setToArray,
  setFromArray
} from '../src/set'

describe('Set utilities', () => {
  describe('setUnion', () => {
    test('creates union of multiple Sets', () => {
      const setA = new Set([1, 2, 3])
      const setB = new Set([3, 4, 5])
      const setC = new Set([5, 6, 7])
      
      const union = setUnion(setA, setB, setC)
      
      expect(union).toEqual(new Set([1, 2, 3, 4, 5, 6, 7]))
    })

    test('works with empty Sets', () => {
      const setA = new Set([1, 2])
      const setB = new Set<number>()
      
      const union = setUnion(setA, setB)
      
      expect(union).toEqual(new Set([1, 2]))
    })

    test('works with no Sets', () => {
      const union = setUnion()
      expect(union.size).toBe(0)
    })
  })

  describe('setIntersection', () => {
    test('finds intersection of two Sets', () => {
      const setA = new Set([1, 2, 3, 4])
      const setB = new Set([3, 4, 5, 6])
      
      const intersection = setIntersection(setA, setB)
      
      expect(intersection).toEqual(new Set([3, 4]))
    })

    test('returns empty Set when no common elements', () => {
      const setA = new Set([1, 2])
      const setB = new Set([3, 4])
      
      const intersection = setIntersection(setA, setB)
      
      expect(intersection.size).toBe(0)
    })

    test('works with empty Sets', () => {
      const setA = new Set([1, 2])
      const setB = new Set<number>()
      
      const intersection = setIntersection(setA, setB)
      
      expect(intersection.size).toBe(0)
    })
  })

  describe('setDifference', () => {
    test('finds difference between two Sets', () => {
      const setA = new Set([1, 2, 3, 4])
      const setB = new Set([3, 4, 5, 6])
      
      const difference = setDifference(setA, setB)
      
      expect(difference).toEqual(new Set([1, 2]))
    })

    test('returns original Set when no common elements', () => {
      const setA = new Set([1, 2])
      const setB = new Set([3, 4])
      
      const difference = setDifference(setA, setB)
      
      expect(difference).toEqual(new Set([1, 2]))
    })

    test('returns empty Set when first is subset of second', () => {
      const setA = new Set([1, 2])
      const setB = new Set([1, 2, 3, 4])
      
      const difference = setDifference(setA, setB)
      
      expect(difference.size).toBe(0)
    })
  })

  describe('setSymmetricDifference', () => {
    test('finds symmetric difference between two Sets', () => {
      const setA = new Set([1, 2, 3, 4])
      const setB = new Set([3, 4, 5, 6])
      
      const symDiff = setSymmetricDifference(setA, setB)
      
      expect(symDiff).toEqual(new Set([1, 2, 5, 6]))
    })

    test('returns union when no common elements', () => {
      const setA = new Set([1, 2])
      const setB = new Set([3, 4])
      
      const symDiff = setSymmetricDifference(setA, setB)
      
      expect(symDiff).toEqual(new Set([1, 2, 3, 4]))
    })

    test('returns empty Set when Sets are identical', () => {
      const setA = new Set([1, 2, 3])
      const setB = new Set([1, 2, 3])
      
      const symDiff = setSymmetricDifference(setA, setB)
      
      expect(symDiff.size).toBe(0)
    })
  })

  describe('setIsSubset', () => {
    test('returns true when first Set is subset of second', () => {
      const subset = new Set([1, 2])
      const superset = new Set([1, 2, 3, 4])
      
      expect(setIsSubset(subset, superset)).toBe(true)
    })

    test('returns false when first Set is not subset of second', () => {
      const notSubset = new Set([1, 5])
      const superset = new Set([1, 2, 3, 4])
      
      expect(setIsSubset(notSubset, superset)).toBe(false)
    })

    test('returns true for empty Set (empty set is subset of any set)', () => {
      const emptySet = new Set<number>()
      const anySet = new Set([1, 2, 3])
      
      expect(setIsSubset(emptySet, anySet)).toBe(true)
    })

    test('returns true when Sets are identical', () => {
      const setA = new Set([1, 2, 3])
      const setB = new Set([1, 2, 3])
      
      expect(setIsSubset(setA, setB)).toBe(true)
    })
  })

  describe('setIsSuperset', () => {
    test('returns true when first Set is superset of second', () => {
      const superset = new Set([1, 2, 3, 4])
      const subset = new Set([1, 2])
      
      expect(setIsSuperset(superset, subset)).toBe(true)
    })

    test('returns false when first Set is not superset of second', () => {
      const notSuperset = new Set([1, 2])
      const subset = new Set([1, 5])
      
      expect(setIsSuperset(notSuperset, subset)).toBe(false)
    })
  })

  describe('setFilter', () => {
    test('filters Set elements by predicate', () => {
      const numbers = new Set([1, 2, 3, 4, 5, 6])
      const evens = setFilter(numbers, n => n % 2 === 0)
      
      expect(evens).toEqual(new Set([2, 4, 6]))
    })

    test('returns empty Set when no elements match', () => {
      const numbers = new Set([1, 3, 5])
      const evens = setFilter(numbers, n => n % 2 === 0)
      
      expect(evens.size).toBe(0)
    })

    test('works with empty Set', () => {
      const emptySet = new Set<number>()
      const filtered = setFilter(emptySet, n => n > 0)
      
      expect(filtered.size).toBe(0)
    })
  })

  describe('setMap', () => {
    test('transforms Set elements', () => {
      const numbers = new Set([1, 2, 3])
      const doubled = setMap(numbers, n => n * 2)
      
      expect(doubled).toEqual(new Set([2, 4, 6]))
    })

    test('removes duplicates in result', () => {
      const numbers = new Set([1, 2, 3, 4])
      const modulo = setMap(numbers, n => n % 2)
      
      expect(modulo).toEqual(new Set([0, 1]))
    })

    test('works with empty Set', () => {
      const emptySet = new Set<number>()
      const mapped = setMap(emptySet, n => n * 2)
      
      expect(mapped.size).toBe(0)
    })
  })

  describe('setIsEmpty', () => {
    test('returns true for empty Set', () => {
      const emptySet = new Set()
      expect(setIsEmpty(emptySet)).toBe(true)
    })

    test('returns false for non-empty Set', () => {
      const nonEmptySet = new Set([1, 2, 3])
      expect(setIsEmpty(nonEmptySet)).toBe(false)
    })
  })

  describe('setToArray', () => {
    test('converts Set to array', () => {
      const set = new Set([3, 1, 4, 1, 5]) // Note: duplicates are removed
      const array = setToArray(set)
      
      expect(array).toEqual([3, 1, 4, 5])
    })

    test('works with empty Set', () => {
      const emptySet = new Set()
      const array = setToArray(emptySet)
      
      expect(array).toEqual([])
    })
  })

  describe('setFromArray', () => {
    test('creates Set from array, removing duplicates', () => {
      const array = [1, 2, 2, 3, 3, 3, 4]
      const set = setFromArray(array)
      
      expect(set).toEqual(new Set([1, 2, 3, 4]))
    })

    test('works with empty array', () => {
      const emptyArray: number[] = []
      const set = setFromArray(emptyArray)
      
      expect(set.size).toBe(0)
    })

    test('preserves order for unique elements', () => {
      const array = ['a', 'b', 'c']
      const set = setFromArray(array)
      const backToArray = setToArray(set)
      
      expect(backToArray).toEqual(['a', 'b', 'c'])
    })
  })
})
