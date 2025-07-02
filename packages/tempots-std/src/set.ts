/**
 * Utilities for working with Set objects.
 *
 * This module provides mathematical set operations and functional utilities
 * for Set manipulation, including union, intersection, difference, and
 * various predicates and transformations.
 *
 * @public
 */

/**
 * Creates the union of multiple Sets.
 *
 * The union contains all unique elements that appear in any of the input Sets.
 * This is equivalent to the mathematical union operation (A ∪ B ∪ C...).
 *
 * @example
 * ```typescript
 * const setA = new Set([1, 2, 3])
 * const setB = new Set([3, 4, 5])
 * const setC = new Set([5, 6, 7])
 * const union = setUnion(setA, setB, setC)
 * // Result: Set { 1, 2, 3, 4, 5, 6, 7 }
 * ```
 *
 * @param sets - Sets to union
 * @returns A new Set containing all unique elements from input Sets
 * @public
 */
export const setUnion = <T>(...sets: Set<T>[]): Set<T> => {
  const result = new Set<T>()
  for (const set of sets) {
    for (const item of set) {
      result.add(item)
    }
  }
  return result
}

/**
 * Creates the intersection of two Sets.
 *
 * The intersection contains only elements that appear in both Sets.
 * This is equivalent to the mathematical intersection operation (A ∩ B).
 *
 * @example
 * ```typescript
 * const setA = new Set([1, 2, 3, 4])
 * const setB = new Set([3, 4, 5, 6])
 * const intersection = setIntersection(setA, setB)
 * // Result: Set { 3, 4 }
 * ```
 *
 * @param setA - First Set
 * @param setB - Second Set
 * @returns A new Set containing elements present in both input Sets
 * @public
 */
export const setIntersection = <T>(setA: Set<T>, setB: Set<T>): Set<T> => {
  const result = new Set<T>()
  for (const item of setA) {
    if (setB.has(item)) {
      result.add(item)
    }
  }
  return result
}

/**
 * Creates the difference between two Sets.
 *
 * The difference contains elements that are in the first Set but not in the second.
 * This is equivalent to the mathematical difference operation (A - B).
 *
 * @example
 * ```typescript
 * const setA = new Set([1, 2, 3, 4])
 * const setB = new Set([3, 4, 5, 6])
 * const difference = setDifference(setA, setB)
 * // Result: Set { 1, 2 }
 * ```
 *
 * @param setA - Set to subtract from
 * @param setB - Set to subtract
 * @returns A new Set containing elements in setA but not in setB
 * @public
 */
export const setDifference = <T>(setA: Set<T>, setB: Set<T>): Set<T> => {
  const result = new Set<T>()
  for (const item of setA) {
    if (!setB.has(item)) {
      result.add(item)
    }
  }
  return result
}

/**
 * Creates the symmetric difference between two Sets.
 *
 * The symmetric difference contains elements that are in either Set but not in both.
 * This is equivalent to (A - B) ∪ (B - A) or (A ∪ B) - (A ∩ B).
 *
 * @example
 * ```typescript
 * const setA = new Set([1, 2, 3, 4])
 * const setB = new Set([3, 4, 5, 6])
 * const symDiff = setSymmetricDifference(setA, setB)
 * // Result: Set { 1, 2, 5, 6 }
 * ```
 *
 * @param setA - First Set
 * @param setB - Second Set
 * @returns A new Set containing elements in either Set but not both
 * @public
 */
export const setSymmetricDifference = <T>(
  setA: Set<T>,
  setB: Set<T>
): Set<T> => {
  const result = new Set<T>()

  // Add elements from setA that are not in setB
  for (const item of setA) {
    if (!setB.has(item)) {
      result.add(item)
    }
  }

  // Add elements from setB that are not in setA
  for (const item of setB) {
    if (!setA.has(item)) {
      result.add(item)
    }
  }

  return result
}

/**
 * Checks if one Set is a subset of another.
 *
 * A Set is a subset if all of its elements are contained in the other Set.
 * An empty Set is considered a subset of any Set.
 *
 * @example
 * ```typescript
 * const subset = new Set([1, 2])
 * const superset = new Set([1, 2, 3, 4])
 * const notSubset = new Set([1, 5])
 *
 * setIsSubset(subset, superset) // true
 * setIsSubset(notSubset, superset) // false
 * setIsSubset(new Set(), superset) // true (empty set)
 * ```
 *
 * @param subset - Set to check if it's a subset
 * @param superset - Set to check against
 * @returns true if subset is a subset of superset, false otherwise
 * @public
 */
export const setIsSubset = <T>(subset: Set<T>, superset: Set<T>): boolean => {
  for (const item of subset) {
    if (!superset.has(item)) {
      return false
    }
  }
  return true
}

/**
 * Checks if one Set is a superset of another.
 *
 * A Set is a superset if it contains all elements of the other Set.
 * This is the inverse of the subset relationship.
 *
 * @example
 * ```typescript
 * const superset = new Set([1, 2, 3, 4])
 * const subset = new Set([1, 2])
 * const notSubset = new Set([1, 5])
 *
 * setIsSuperset(superset, subset) // true
 * setIsSuperset(superset, notSubset) // false
 * ```
 *
 * @param superset - Set to check if it's a superset
 * @param subset - Set to check against
 * @returns true if superset is a superset of subset, false otherwise
 * @public
 */
export const setIsSuperset = <T>(superset: Set<T>, subset: Set<T>): boolean =>
  setIsSubset(subset, superset)

/**
 * Creates a new Set containing only elements that satisfy the predicate.
 *
 * This provides a functional approach to filtering Sets, similar to
 * Array.prototype.filter but for Set objects.
 *
 * @example
 * ```typescript
 * const numbers = new Set([1, 2, 3, 4, 5, 6])
 * const evenNumbers = setFilter(numbers, n => n % 2 === 0)
 * // Result: Set { 2, 4, 6 }
 * ```
 *
 * @param set - The Set to filter
 * @param predicate - Function that tests each element
 * @returns A new Set with elements that satisfy the predicate
 * @public
 */
export const setFilter = <T>(
  set: Set<T>,
  predicate: (value: T) => boolean
): Set<T> => {
  const result = new Set<T>()
  for (const item of set) {
    if (predicate(item)) {
      result.add(item)
    }
  }
  return result
}

/**
 * Creates a new Set with elements transformed by the mapper function.
 *
 * This provides a functional approach to transforming Set elements,
 * similar to Array.prototype.map but for Set objects.
 *
 * @example
 * ```typescript
 * const numbers = new Set([1, 2, 3])
 * const doubled = setMap(numbers, n => n * 2)
 * // Result: Set { 2, 4, 6 }
 * ```
 *
 * @param set - The Set to transform
 * @param mapper - Function that transforms each element
 * @returns A new Set with transformed elements
 * @public
 */
export const setMap = <T, U>(set: Set<T>, mapper: (value: T) => U): Set<U> => {
  const result = new Set<U>()
  for (const item of set) {
    result.add(mapper(item))
  }
  return result
}

/**
 * Checks if a Set is empty.
 *
 * This provides a semantic way to check for empty Sets,
 * making code more readable than checking size === 0.
 *
 * @example
 * ```typescript
 * const emptySet = new Set()
 * const nonEmptySet = new Set([1, 2, 3])
 *
 * setIsEmpty(emptySet) // true
 * setIsEmpty(nonEmptySet) // false
 * ```
 *
 * @param set - The Set to check
 * @returns true if the Set has no elements, false otherwise
 * @public
 */
export const setIsEmpty = <T>(set: Set<T>): boolean => set.size === 0

/**
 * Converts a Set to an array.
 *
 * This provides a convenient way to convert Sets to arrays
 * for further processing with array methods.
 *
 * @example
 * ```typescript
 * const set = new Set([3, 1, 4, 1, 5]) // Note: duplicates are removed
 * const array = setToArray(set)
 * // Result: [3, 1, 4, 5]
 * ```
 *
 * @param set - The Set to convert
 * @returns An array containing all elements from the Set
 * @public
 */
export const setToArray = <T>(set: Set<T>): T[] => Array.from(set)

/**
 * Creates a Set from an array, removing duplicates.
 *
 * This provides a semantic way to deduplicate arrays using Sets.
 *
 * @example
 * ```typescript
 * const array = [1, 2, 2, 3, 3, 3, 4]
 * const set = setFromArray(array)
 * // Result: Set { 1, 2, 3, 4 }
 * ```
 *
 * @param array - The array to convert
 * @returns A new Set containing unique elements from the array
 * @public
 */
export const setFromArray = <T>(array: readonly T[]): Set<T> => new Set(array)
