import { describe, test, expect } from 'vitest'
import {
  take,
  skip,
  filter,
  map,
  reduce,
  find,
  every,
  some,
  toArray,
  chain
} from '../src/iterator'

describe('Iterator utilities', () => {
  describe('take', () => {
    test('takes first n elements from array', () => {
      const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
      const result = take(numbers, 3)

      expect(result).toEqual([1, 2, 3])
    })

    test('takes all elements when count exceeds length', () => {
      const numbers = [1, 2, 3]
      const result = take(numbers, 10)

      expect(result).toEqual([1, 2, 3])
    })

    test('returns empty array for count 0', () => {
      const numbers = [1, 2, 3]
      const result = take(numbers, 0)

      expect(result).toEqual([])
    })

    test('returns empty array for negative count', () => {
      const numbers = [1, 2, 3]
      const result = take(numbers, -5)

      expect(result).toEqual([])
    })

    test('works with Set', () => {
      const set = new Set([1, 2, 3, 4, 5])
      const result = take(set, 3)

      expect(result).toHaveLength(3)
      result.forEach(item => expect(set.has(item)).toBe(true))
    })

    test('works with generator', () => {
      function* numberGenerator() {
        let i = 1
        while (true) {
          yield i++
        }
      }

      const result = take(numberGenerator(), 5)
      expect(result).toEqual([1, 2, 3, 4, 5])
    })
  })

  describe('skip', () => {
    test('skips first n elements', () => {
      const numbers = [1, 2, 3, 4, 5]
      const result = [...skip(numbers, 2)]

      expect(result).toEqual([3, 4, 5])
    })

    test('returns empty when skipping all elements', () => {
      const numbers = [1, 2, 3]
      const result = [...skip(numbers, 5)]

      expect(result).toEqual([])
    })

    test('returns all elements when skipping 0', () => {
      const numbers = [1, 2, 3]
      const result = [...skip(numbers, 0)]

      expect(result).toEqual([1, 2, 3])
    })

    test('works with other iterables', () => {
      const set = new Set([1, 2, 3, 4, 5])
      const result = [...skip(set, 2)]

      expect(result).toHaveLength(3)
    })
  })

  describe('filter', () => {
    test('filters elements by predicate', () => {
      const numbers = [1, 2, 3, 4, 5, 6]
      const result = [...filter(numbers, n => n % 2 === 0)]

      expect(result).toEqual([2, 4, 6])
    })

    test('returns empty for no matches', () => {
      const numbers = [1, 3, 5]
      const result = [...filter(numbers, n => n % 2 === 0)]

      expect(result).toEqual([])
    })

    test('returns all elements when all match', () => {
      const numbers = [2, 4, 6]
      const result = [...filter(numbers, n => n % 2 === 0)]

      expect(result).toEqual([2, 4, 6])
    })

    test('works with strings', () => {
      const words = ['apple', 'banana', 'cherry', 'date']
      const result = [...filter(words, word => word.length > 5)]

      expect(result).toEqual(['banana', 'cherry'])
    })
  })

  describe('map', () => {
    test('transforms elements', () => {
      const numbers = [1, 2, 3, 4, 5]
      const result = [...map(numbers, n => n * 2)]

      expect(result).toEqual([2, 4, 6, 8, 10])
    })

    test('works with different types', () => {
      const numbers = [1, 2, 3]
      const result = [...map(numbers, n => `number: ${n}`)]

      expect(result).toEqual(['number: 1', 'number: 2', 'number: 3'])
    })

    test('works with objects', () => {
      const users = [{ name: 'Alice' }, { name: 'Bob' }]
      const result = [...map(users, user => user.name)]

      expect(result).toEqual(['Alice', 'Bob'])
    })

    test('works with empty iterable', () => {
      const empty: number[] = []
      const result = [...map(empty, n => n * 2)]

      expect(result).toEqual([])
    })
  })

  describe('reduce', () => {
    test('reduces to single value', () => {
      const numbers = [1, 2, 3, 4, 5]
      const result = reduce(numbers, (acc, n) => acc + n, 0)

      expect(result).toBe(15)
    })

    test('works with different accumulator type', () => {
      const words = ['hello', 'world', 'foo', 'bar']
      const result = reduce(words, (acc, word) => word.length > acc.length ? word : acc, '')

      expect(result).toBe('hello')
    })

    test('works with empty iterable', () => {
      const empty: number[] = []
      const result = reduce(empty, (acc, n) => acc + n, 10)

      expect(result).toBe(10)
    })

    test('builds object from array', () => {
      const pairs = [['a', 1], ['b', 2], ['c', 3]] as const
      const result = reduce(pairs, (acc, [key, value]) => ({ ...acc, [key]: value }), {} as Record<string, number>)

      expect(result).toEqual({ a: 1, b: 2, c: 3 })
    })
  })

  describe('find', () => {
    test('finds first matching element', () => {
      const numbers = [1, 3, 5, 8, 9, 12]
      const result = find(numbers, n => n % 2 === 0)

      expect(result).toBe(8)
    })

    test('returns undefined when no match', () => {
      const numbers = [1, 3, 5, 7, 9]
      const result = find(numbers, n => n % 2 === 0)

      expect(result).toBeUndefined()
    })

    test('works with objects', () => {
      const users = [{ name: 'Alice', age: 25 }, { name: 'Bob', age: 30 }]
      const result = find(users, user => user.age >= 30)

      expect(result).toEqual({ name: 'Bob', age: 30 })
    })

    test('works with empty iterable', () => {
      const empty: number[] = []
      const result = find(empty, n => n > 0)

      expect(result).toBeUndefined()
    })
  })

  describe('every', () => {
    test('returns true when all elements match', () => {
      const numbers = [2, 4, 6, 8]
      const result = every(numbers, n => n % 2 === 0)

      expect(result).toBe(true)
    })

    test('returns false when some elements do not match', () => {
      const numbers = [2, 4, 5, 8]
      const result = every(numbers, n => n % 2 === 0)

      expect(result).toBe(false)
    })

    test('returns true for empty iterable', () => {
      const empty: number[] = []
      const result = every(empty, n => n > 0)

      expect(result).toBe(true)
    })

    test('short-circuits on first false', () => {
      let callCount = 0
      const numbers = [2, 4, 5, 8, 10]

      every(numbers, n => {
        callCount++
        return n % 2 === 0
      })

      expect(callCount).toBe(3) // Should stop at the third element (5)
    })
  })

  describe('some', () => {
    test('returns true when at least one element matches', () => {
      const numbers = [1, 3, 5, 8, 9]
      const result = some(numbers, n => n % 2 === 0)

      expect(result).toBe(true)
    })

    test('returns false when no elements match', () => {
      const numbers = [1, 3, 5, 7, 9]
      const result = some(numbers, n => n % 2 === 0)

      expect(result).toBe(false)
    })

    test('returns false for empty iterable', () => {
      const empty: number[] = []
      const result = some(empty, n => n > 0)

      expect(result).toBe(false)
    })

    test('short-circuits on first true', () => {
      let callCount = 0
      const numbers = [1, 3, 8, 10, 12]

      some(numbers, n => {
        callCount++
        return n % 2 === 0
      })

      expect(callCount).toBe(3) // Should stop at the third element (8)
    })
  })

  describe('toArray', () => {
    test('converts Set to array', () => {
      const set = new Set([1, 2, 3, 2, 1])
      const result = toArray(set)

      expect(result).toEqual([1, 2, 3])
    })

    test('converts Map keys to array', () => {
      const map = new Map([['a', 1], ['b', 2], ['c', 3]])
      const result = toArray(map.keys())

      expect(result).toEqual(['a', 'b', 'c'])
    })

    test('converts string to array of characters', () => {
      const result = toArray('hello')

      expect(result).toEqual(['h', 'e', 'l', 'l', 'o'])
    })

    test('works with generator', () => {
      function* numberGenerator() {
        yield 1
        yield 2
        yield 3
      }

      const result = toArray(numberGenerator())
      expect(result).toEqual([1, 2, 3])
    })
  })

  describe('chain', () => {
    test('chains multiple arrays', () => {
      const first = [1, 2, 3]
      const second = [4, 5, 6]
      const third = [7, 8, 9]
      const result = [...chain(first, second, third)]

      expect(result).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9])
    })

    test('works with different iterable types', () => {
      const array = [1, 2] as (string | number)[]
      const set = new Set([3, 4])
      const string = 'ab'
      const result = [...chain(array, set, string)]

      expect(result).toEqual([1, 2, 3, 4, 'a', 'b'])
    })

    test('works with empty iterables', () => {
      const first = [1, 2]
      const empty: number[] = []
      const third = [3, 4]
      const result = [...chain(first, empty, third)]

      expect(result).toEqual([1, 2, 3, 4])
    })

    test('works with no arguments', () => {
      const result = [...chain()]

      expect(result).toEqual([])
    })
  })

  describe('chaining operations', () => {
    test('can chain multiple operations', () => {
      const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

      // Skip first 2, filter evens, double them, take first 3
      const result = take(
        map(
          filter(
            skip(numbers, 2),
            n => n % 2 === 0
          ),
          n => n * 2
        ),
        3
      )

      expect(result).toEqual([8, 12, 16]) // [4, 6, 8] -> [8, 12, 16]
    })

    test('lazy evaluation works correctly', () => {
      let processedCount = 0

      function* numberGenerator() {
        let i = 1
        while (i <= 1000) {
          processedCount++
          yield i++
        }
      }

      // Only take 3 elements, so generator should only process 5 elements
      // (skip 2, then take 3)
      const result = take(skip(numberGenerator(), 2), 3)

      expect(result).toEqual([3, 4, 5])
      expect(processedCount).toBe(6) // Generator processes one extra to know when to stop
    })
  })
})
