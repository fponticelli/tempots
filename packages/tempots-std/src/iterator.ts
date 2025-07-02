/**
 * Utilities for working with iterators and iterables.
 *
 * This module provides functional utilities for iterator manipulation,
 * allowing for lazy evaluation and memory-efficient processing of sequences.
 * All functions work with any iterable, including arrays, sets, maps, and custom iterators.
 *
 * @public
 */

/**
 * Takes the first n elements from an iterable.
 *
 * This function creates a new array containing the first n elements
 * from the iterable. It's useful for limiting results or sampling data.
 *
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
 * const first3 = take(numbers, 3) // [1, 2, 3]
 *
 * const firstUsers = take(userGenerator(), 5) // First 5 users from generator
 * ```
 *
 * @param iterable - The iterable to take elements from
 * @param count - The number of elements to take
 * @returns An array containing the first count elements
 * @public
 */
export const take = <T>(iterable: Iterable<T>, count: number): T[] => {
  if (count <= 0) {
    return []
  }

  const result: T[] = []
  let taken = 0

  for (const item of iterable) {
    if (taken >= count) {
      break
    }
    result.push(item)
    taken++
  }

  return result
}

/**
 * Skips the first n elements and returns an iterable of the remaining elements.
 *
 * This function creates a new iterable that yields all elements after
 * skipping the specified number of initial elements.
 *
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4, 5]
 * const afterFirst2 = [...skip(numbers, 2)] // [3, 4, 5]
 *
 * // Use with other iterator functions
 * const result = take(skip(largeDataset, 100), 10) // Skip 100, take next 10
 * ```
 *
 * @param iterable - The iterable to skip elements from
 * @param count - The number of elements to skip
 * @returns An iterable that yields remaining elements
 * @public
 */
export const skip = <T>(iterable: Iterable<T>, count: number): Iterable<T> => {
  return {
    *[Symbol.iterator]() {
      let skipped = 0
      for (const item of iterable) {
        if (skipped < count) {
          skipped++
          continue
        }
        yield item
      }
    },
  }
}

/**
 * Filters an iterable, yielding only elements that satisfy the predicate.
 *
 * This function creates a new iterable that yields only elements
 * for which the predicate returns true. It's lazy and memory-efficient.
 *
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4, 5, 6]
 * const evens = [...filter(numbers, n => n % 2 === 0)] // [2, 4, 6]
 *
 * // Chain with other operations
 * const result = take(filter(largeDataset, isValid), 100)
 * ```
 *
 * @param iterable - The iterable to filter
 * @param predicate - Function that tests each element
 * @returns An iterable that yields filtered elements
 * @public
 */
export const filter = <T>(
  iterable: Iterable<T>,
  predicate: (item: T) => boolean
): Iterable<T> => {
  return {
    *[Symbol.iterator]() {
      for (const item of iterable) {
        if (predicate(item)) {
          yield item
        }
      }
    },
  }
}

/**
 * Maps an iterable, transforming each element with the mapper function.
 *
 * This function creates a new iterable that yields transformed elements.
 * It's lazy and memory-efficient, processing elements on-demand.
 *
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4, 5]
 * const doubled = [...map(numbers, n => n * 2)] // [2, 4, 6, 8, 10]
 *
 * const users = [{ name: 'Alice' }, { name: 'Bob' }]
 * const names = [...map(users, user => user.name)] // ['Alice', 'Bob']
 * ```
 *
 * @param iterable - The iterable to map
 * @param mapper - Function that transforms each element
 * @returns An iterable that yields transformed elements
 * @public
 */
export const map = <T, U>(
  iterable: Iterable<T>,
  mapper: (item: T) => U
): Iterable<U> => {
  return {
    *[Symbol.iterator]() {
      for (const item of iterable) {
        yield mapper(item)
      }
    },
  }
}

/**
 * Reduces an iterable to a single value using the reducer function.
 *
 * This function processes all elements in the iterable, accumulating
 * a result using the reducer function and initial value.
 *
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4, 5]
 * const sum = reduce(numbers, (acc, n) => acc + n, 0) // 15
 *
 * const words = ['hello', 'world', 'foo', 'bar']
 * const longest = reduce(words, (acc, word) => word.length > acc.length ? word : acc, '')
 * ```
 *
 * @param iterable - The iterable to reduce
 * @param reducer - Function that combines accumulator with each element
 * @param initial - Initial value for the accumulator
 * @returns The final accumulated value
 * @public
 */
export const reduce = <T, U>(
  iterable: Iterable<T>,
  reducer: (acc: U, item: T) => U,
  initial: U
): U => {
  let accumulator = initial
  for (const item of iterable) {
    accumulator = reducer(accumulator, item)
  }
  return accumulator
}

/**
 * Finds the first element in an iterable that satisfies the predicate.
 *
 * This function returns the first element for which the predicate returns true,
 * or undefined if no such element is found.
 *
 * @example
 * ```typescript
 * const numbers = [1, 3, 5, 8, 9, 12]
 * const firstEven = find(numbers, n => n % 2 === 0) // 8
 *
 * const users = [{ name: 'Alice', age: 25 }, { name: 'Bob', age: 30 }]
 * const adult = find(users, user => user.age >= 18) // { name: 'Alice', age: 25 }
 * ```
 *
 * @param iterable - The iterable to search
 * @param predicate - Function that tests each element
 * @returns The first matching element, or undefined if none found
 * @public
 */
export const find = <T>(
  iterable: Iterable<T>,
  predicate: (item: T) => boolean
): T | undefined => {
  for (const item of iterable) {
    if (predicate(item)) {
      return item
    }
  }
  return undefined
}

/**
 * Tests whether all elements in an iterable satisfy the predicate.
 *
 * This function returns true if the predicate returns true for all elements,
 * or false otherwise. It short-circuits on the first false result.
 *
 * @example
 * ```typescript
 * const numbers = [2, 4, 6, 8]
 * const allEven = every(numbers, n => n % 2 === 0) // true
 *
 * const users = [{ age: 25 }, { age: 30 }, { age: 17 }]
 * const allAdults = every(users, user => user.age >= 18) // false
 * ```
 *
 * @param iterable - The iterable to test
 * @param predicate - Function that tests each element
 * @returns true if all elements satisfy the predicate, false otherwise
 * @public
 */
export const every = <T>(
  iterable: Iterable<T>,
  predicate: (item: T) => boolean
): boolean => {
  for (const item of iterable) {
    if (!predicate(item)) {
      return false
    }
  }
  return true
}

/**
 * Tests whether at least one element in an iterable satisfies the predicate.
 *
 * This function returns true if the predicate returns true for any element,
 * or false if no elements satisfy the predicate. It short-circuits on the first true result.
 *
 * @example
 * ```typescript
 * const numbers = [1, 3, 5, 8, 9]
 * const hasEven = some(numbers, n => n % 2 === 0) // true
 *
 * const users = [{ age: 15 }, { age: 16 }, { age: 17 }]
 * const hasAdult = some(users, user => user.age >= 18) // false
 * ```
 *
 * @param iterable - The iterable to test
 * @param predicate - Function that tests each element
 * @returns true if any element satisfies the predicate, false otherwise
 * @public
 */
export const some = <T>(
  iterable: Iterable<T>,
  predicate: (item: T) => boolean
): boolean => {
  for (const item of iterable) {
    if (predicate(item)) {
      return true
    }
  }
  return false
}

/**
 * Converts an iterable to an array.
 *
 * This function creates a new array containing all elements from the iterable.
 * It's equivalent to [...iterable] but more explicit in intent.
 *
 * @example
 * ```typescript
 * const set = new Set([1, 2, 3, 2, 1])
 * const array = toArray(set) // [1, 2, 3]
 *
 * const mapped = map([1, 2, 3], n => n * 2)
 * const result = toArray(mapped) // [2, 4, 6]
 * ```
 *
 * @param iterable - The iterable to convert
 * @returns A new array containing all elements from the iterable
 * @public
 */
export const toArray = <T>(iterable: Iterable<T>): T[] => {
  return Array.from(iterable)
}

/**
 * Chains multiple iterables into a single iterable.
 *
 * This function creates a new iterable that yields all elements
 * from the input iterables in sequence.
 *
 * @example
 * ```typescript
 * const first = [1, 2, 3]
 * const second = [4, 5, 6]
 * const third = [7, 8, 9]
 * const chained = [...chain(first, second, third)] // [1, 2, 3, 4, 5, 6, 7, 8, 9]
 *
 * // Works with different iterable types
 * const mixed = [...chain([1, 2], new Set([3, 4]), 'ab')] // [1, 2, 3, 4, 'a', 'b']
 * ```
 *
 * @param iterables - The iterables to chain
 * @returns An iterable that yields all elements in sequence
 * @public
 */
export const chain = <T>(...iterables: Iterable<T>[]): Iterable<T> => {
  return {
    *[Symbol.iterator]() {
      for (const iterable of iterables) {
        yield* iterable
      }
    },
  }
}
