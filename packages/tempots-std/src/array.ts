/**
 * Utility functions to manipulate `Array` values.
 */

import type { Compare, Maybe, Nothing, Primitive } from './domain'
import { objectKeys } from './object'

/**
 * Applies a function to each element of an array and returns a new array with the results.
 *
 * @typeParam A - The type of the elements in the input array.
 * @typeParam B - The type of the elements in the output array.
 * @param arr - The input array.
 * @param f - The function to apply to each element.
 * @returns The new array with the results of applying the function to each element.
 * @public
 */
export const mapArray = <A, B>(arr: A[], f: (a: A, index: number) => B): B[] =>
  Array.from({ length: arr.length }, (_, i) => f(arr[i], i))

/**
 * Applies a mapping function to each element of an array and flattens the result.
 *
 * @param arr - The input array.
 * @param f - The mapping function to apply to each element of the array.
 * @returns A new array with the flattened result of applying the mapping function to each element of the input array.
 * @typeParam A - The type of the elements in the input array.
 * @typeParam B - The type of the elements in the resulting flattened array.
 * @public
 */
export const flatMapArray = <A, B>(arr: A[], f: (a: A) => B[]): B[] => {
  const buff: B[] = []
  for (const el of arr) {
    buff.push(...f(el))
  }
  return buff
}

/**
 * Returns the first element of an array, or `undefined` if the array is empty.
 *
 * @param arr - The input array.
 * @returns The first element of the array, or `undefined` if the array is empty.
 * @typeParam A - The type of elements in the array.
 * @public
 */
export const arrayHead = <A>(arr: A[]): Maybe<A> =>
  arr.length > 0 ? arr[0] : undefined

/**
 * Returns a new array containing all elements of the input array except for the first element.
 *
 * @param arr - The input array.
 * @returns A new array containing all elements of the input array except for the first element.
 * @public
 */
export const arrayTail = <A>(arr: A[]): A[] => arr.slice(1)

/**
 * Checks if two arrays are equal based on a custom equality function.
 *
 * @typeParam T - The type of elements in the arrays.
 * @param a - The first array.
 * @param b - The second array.
 * @param equality - The custom equality function to compare elements.
 * @returns Returns `true` if the arrays are equal, `false` otherwise.
 * @public
 */
export const areArraysEqual = <T>(
  a: T[],
  b: T[],
  equality: (a: T, b: T) => boolean
): boolean => {
  if (a.length !== b.length) return false
  else {
    for (let i = 0; i < a.length; i++) {
      if (!equality(a[i], b[i])) return false
    }
    return true
  }
}

/**
 * Checks if an array is empty.
 *
 * @param arr - The array to check.
 * @returns `true` if the array is empty, `false` otherwise.
 * @public
 */
export const isArrayEmpty = <T>(arr: T[]): arr is [] => arr.length === 0

/**
 * Checks if an array has values.
 *
 * @param arr - The array to check.
 * @returns `true` if the array has values, `false` otherwise.
 * @public
 */
export const arrayHasValues = <T>(arr: T[]): arr is [T, ...T[]] =>
  arr.length > 0

/**
 * Filters the elements of an array based on a predicate function.
 *
 * @typeParam T - The type of the elements in the array.
 * @param arr - The array to filter.
 * @param predicate - The predicate function used to filter the elements.
 * @returns The filtered array.
 * @public
 */
export const filterArray = <T>(arr: T[], predicate: (v: T) => boolean): T[] => {
  const buff = [] as T[]
  for (const a of arr) if (predicate(a)) buff.push(a)
  return buff
}

/**
 * Applies a mapping function to each element of an array and returns a new array
 * containing the mapped values, excluding any `null` or `undefined` values.
 *
 * @typeParam A - The type of the elements in the input array.
 * @typeParam B - The type of the elements in the output array.
 * @param arr - The input array.
 * @param f - The mapping function to apply to each element.
 * @returns The new array containing the mapped values.
 * @public
 */
export const filterMapArray = <A, B>(
  arr: A[],
  f: (a: A, index: number) => Maybe<B>
): B[] => {
  const buff = [] as B[]
  for (let i = 0; i < arr.length; i++) {
    const v = f(arr[i], i)
    if (v != null) {
      buff.push(v)
    }
  }
  return buff
}

/**
 * Filters out null and undefined values from an array.
 *
 * @typeParam T - The type of elements in the array.
 * @param arr - The array to filter.
 * @returns The filtered array.
 * @public
 */
export const filterNullsFromArray = <T>(arr: Array<T | Nothing>): T[] =>
  filterArray(arr, v => v != null) as T[]

/**
 * Flattens a two-dimensional array into a one-dimensional array.
 *
 * @param arr - The two-dimensional array to flatten.
 * @returns The flattened one-dimensional array.
 * @typeParam T - The type of elements in the array.
 * @public
 */
export const flattenArray = <T>(arr: T[][]): T[] => ([] as T[]).concat(...arr)

/**
 * Applies a function to each element of an array, accumulating the result from left to right.
 *
 * @typeParam T - The type of the array elements.
 * @typeParam B - The type of the accumulator.
 * @param arr - The array to iterate over.
 * @param f - The function to apply to each element.
 * @param b - The initial value of the accumulator.
 * @returns The accumulated result.
 * @public
 */
export const foldLeftArray = <T, B>(
  arr: T[],
  f: (acc: B, curr: T) => B,
  b: B
): B => {
  for (const a of arr) {
    b = f(b, a)
  }
  return b
}

/**
 * Checks if all elements in an array satisfy a given predicate.
 *
 * @param arr - The array to check.
 * @param predicate - The predicate function to apply to each element.
 * @returns `true` if all elements satisfy the predicate, `false` otherwise.
 * @typeParam T - The type of elements in the array.
 * @public
 */
export const allElements = <T>(
  arr: T[],
  predicate: (v: T) => boolean
): boolean => {
  for (const a of arr) {
    if (!predicate(a)) {
      return false
    }
  }
  return true
}

/**
 * Checks if any element in the array satisfies the given predicate.
 *
 * @param arr - The array to check.
 * @param predicate - The predicate function to apply to each element.
 * @returns `true` if any element satisfies the predicate, `false` otherwise.
 * @typeParam T - The type of elements in the array.
 * @public
 */
export const anyElement = <T>(
  arr: T[],
  predicate: (v: T) => boolean
): boolean => {
  for (const a of arr) {
    if (predicate(a)) {
      return true
    }
  }
  return false
}

/**
 * Applies a function to each element in an array.
 *
 * @typeParam T - The type of elements in the array.
 * @param arr - The array to iterate over.
 * @param f - The function to apply to each element.
 * @public
 */
export const forEachElement = <T>(arr: T[], f: (v: T) => void): void => {
  for (const a of arr) f(a)
}

/**
 * Concatenates multiple arrays into a single array.
 *
 * @param arrs - The arrays to concatenate.
 * @returns The concatenated array.
 * @typeParam A - The type of elements in the arrays.
 * @public
 */
export const concatArrays = <A>(...arrs: A[][]): A[] =>
  ([] as A[]).concat(...arrs)

/**
 * Compares two arrays based on their lengths and element values.
 *
 * @typeParam A - The type of elements in the arrays.
 * @param a - The first array to compare.
 * @param b - The second array to compare.
 * @param comparef - The compare function to use for comparing the elements of the arrays.
 * @param shorterFirst - Specifies whether shorter arrays should be considered smaller. Defaults to true.
 * @returns A compare function that can be used to compare arrays.
 * @public
 */
export const compareArrays = <A>(
  a: A[],
  b: A[],
  comparef: Compare<A>,
  shorterFirst = true
) => {
  if (a.length < b.length) {
    return -1 * (shorterFirst ? 1 : -1)
  } else if (a.length > b.length) {
    return 1 * (shorterFirst ? 1 : -1)
  }
  for (let i = 0; i < a.length; i++) {
    const ord = comparef(a[i], b[i])
    if (ord !== 0) return ord
  }
  return 0
}

/**
 * Sorts an array in place using the provided compare function.
 *
 * @typeParam A - The type of elements in the array.
 * @param arr - The array to be sorted.
 * @param compare - The compare function used to determine the order of the elements.
 * @returns The sorted array.
 * @public
 */
export const sortArray = <A>(arr: A[], compare: Compare<A>): A[] =>
  arr.slice().sort(compare)

/**
 * Generates an array of values by applying a function to each index.
 *
 * @param length - The length of the resulting array.
 * @param f - The function to apply to each index. It takes the index as a parameter and returns the corresponding value.
 * @returns An array of values generated by applying the function to each index.
 * @public
 */
export const generateArray = <A>(
  length: number,
  f: (index: number) => A
): A[] => Array.from({ length }, (_, i) => f(i))

/**
 * Generates an array of numbers in a specified range.
 *
 * @param length - The length of the array to generate.
 * @param startAt - The starting value of the range. Default is 0.
 * @returns An array of numbers in the specified range.
 * @public
 */
export const generateSequenceArray = (length: number, startAt = 0): number[] =>
  generateArray(length, i => startAt + i)

/**
 * Creates a new array with the specified length and fills it with the provided value.
 *
 * @typeParam A - The type of the elements in the array.
 * @param length - The length of the new array.
 * @param value - The value to fill the array with.
 * @returns A new array filled with the specified value.
 * @public
 */
export const createFilledArray = <A>(length: number, value: A): A[] =>
  generateArray(length, () => value)

/**
 * Returns an array containing only the distinct primitive values from the input array.
 *
 * @typeParam T - The type of the input array elements.
 * @param values - The input array.
 * @returns An array containing only the distinct primitive values from the input array.
 * @public
 */
export const uniquePrimitives = <T extends Primitive>(values: T[]): T[] =>
  Array.from(new Set(values))

/**
 * Returns an array of distinct elements from the input array based on the provided predicate.
 *
 * @typeParam T - The type of elements in the input array.
 * @param values - The input array.
 * @param predicate - The predicate function used to determine uniqueness.
 * @returns An array of distinct elements.
 * @public
 */
export const uniqueByPrimitive = <T>(
  values: T[],
  predicate: (a: T) => string | number | symbol
): T[] => {
  const map: Record<string | number | symbol, T> = {}
  values.forEach(v => {
    map[predicate(v)] = v
  })
  return objectKeys(map).map(k => map[k])
}

/**
 * Removes the first occurrence of an item from an array.
 *
 * @typeParam A - The type of the array elements.
 * @param arr - The array from which to remove the item.
 * @param item - The item to remove from the array.
 * @returns `true` if the item was found and removed, `false` otherwise.
 * @public
 */
export const removeOneFromArray = <A>(arr: A[], item: A): boolean => {
  const index = arr.indexOf(item)
  if (index < 0) {
    return false
  } else {
    arr.splice(index, 1)
    return true
  }
}

/**
 * Removes all occurrences of an item from an array.
 *
 * @typeParam A - The type of the array elements.
 * @param arr - The array from which to remove the item.
 * @param item - The item to remove from the array.
 * @returns `true` if at least one occurrence was found and removed, `false` otherwise.
 * @public
 */
export const removeAllFromArray = <A>(arr: A[], item: A): boolean => {
  let removed = false
  while (removeOneFromArray(arr, item)) {
    removed = true
  }
  return removed
}

/**
 * Removes the first occurrence in an array that satisfy the given predicate.
 *
 * @typeParam A - The type of elements in the array.
 * @param arr - The array from which elements will be removed.
 * @param predicate - The predicate function used to determine which elements to remove.
 * @returns `true` if at least one element was removed, `false` otherwise.
 * @public
 */
export const removeOneFromArrayByPredicate = <A>(
  arr: A[],
  predicate: (a: A) => boolean
): boolean => {
  const index = arr.findIndex(predicate)
  if (index < 0) {
    return false
  } else {
    arr.splice(index, 1)
    return true
  }
}

/**
 * Removes all occurrences in an array that satisfy the given predicate.
 *
 * @typeParam A - The type of elements in the array.
 * @param arr - The array from which elements will be removed.
 * @param predicate - The predicate function used to determine which elements to remove.
 * @returns `true` if at least one element was removed, `false` otherwise.
 * @public
 */
export const removeAllFromArrayByPredicate = <A>(
  arr: A[],
  predicate: (a: A) => boolean
): boolean => {
  let removed = false
  while (removeOneFromArrayByPredicate(arr, predicate)) {
    removed = true
  }
  return removed
}

/**
 * Converts an IterableIterator to an array.
 *
 * @param it - The IterableIterator to convert.
 * @returns An array containing the values from the IterableIterator.
 * @public
 */
export const arrayOfIterableIterator = <A>(it: IterableIterator<A>): A[] => {
  const buff = [] as A[]
  for (let r = it.next(); !(r.done ?? false); r = it.next()) {
    buff.push(r.value)
  }
  return buff
}

/**
 * Represents the different operations that can be performed on an array.
 *
 * @public
 */
export type ArrayDiffOperations<T> = {
  removals: Array<{ at: number; qt: number }>
  swaps: Array<{ from: number; to: number }>
  inserts: Array<{ at: number; values: T[] }>
}

/**
 * Calculates the difference operations between two arrays based on a key function.
 *
 * @typeParam T - The type of elements in the arrays.
 * @typeParam K - The type of the key used to compare elements.
 * @param from - The source array.
 * @param to - The target array.
 * @param getKey - The key function used to compare elements.
 * @returns The difference operations between the two arrays.
 * @public
 */
export const arrayDiffOperations = <T, K>(
  from: T[],
  to: T[],
  getKey: (v: T) => K
): ArrayDiffOperations<T> => {
  const ops: ArrayDiffOperations<T> = {
    removals: [],
    swaps: [],
    inserts: [],
  }
  const { removals, inserts, swaps } = ops
  const mapB = new Map<K, number>()
  to.forEach((v, i) => mapB.set(getKey(v), i))

  const indexesOfAThatDoNotExistInB = from
    .map((v, i) => [v, i] as const)
    .filter(([v]) => !mapB.has(getKey(v)))
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .map(([_, i]) => i)
  for (let i = indexesOfAThatDoNotExistInB.length - 1; i >= 0; i--) {
    const p = indexesOfAThatDoNotExistInB[i]
    const last = removals.length > 0 ? removals[removals.length - 1] : undefined
    if (last != null && last.at === p + 1) {
      last.at--
      last.qt++
    } else {
      removals.push({ at: p, qt: 1 })
    }
  }

  const mapA = new Map<K, number>()
  from.forEach((v, i) => mapA.set(getKey(v), i))

  const indexesOfBThatDoNotExistInA = to
    .map((v, i) => [v, i] as const)
    .filter(([v]) => !mapA.has(getKey(v)))
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .map(([_, i]) => i)
  for (const p of indexesOfBThatDoNotExistInA) {
    const last = inserts.length > 0 ? inserts[inserts.length - 1] : undefined
    if (last != null && last.at + last.values.length === p) {
      last.values.push(to[p])
    } else {
      inserts.push({ at: p, values: [to[p]] })
    }
  }

  const ra = from.filter((_, i) => !indexesOfAThatDoNotExistInB.includes(i))
  const mapRA = new Map<K, number>()
  for (let i = 0; i < ra.length; i++) {
    mapRA.set(getKey(ra[i]), i)
  }

  const rb = to.filter((_, i) => !indexesOfBThatDoNotExistInA.includes(i))
  for (let i = 0; i < rb.length; i++) {
    const bk = getKey(rb[i])

    const ai = mapRA.get(bk)!
    if (ai == null || i === ai) continue
    const ak = getKey(ra[i])
    mapRA.delete(ak)
    swaps.push({ from: i, to: ai })
  }
  return ops
}

/**
 * Applies a series of operations to an array and returns the modified array.
 *
 * @typeParam T - The type of elements in the array.
 * @param operations - The operations to apply.
 * @param start - The initial array.
 * @returns The modified array after applying the operations.
 * @public
 */
export const applyArrayDiffOperations = <T>(
  operations: ArrayDiffOperations<T>,
  start: T[]
): T[] => {
  const buff = [...start]
  for (const { at, qt } of operations.removals) {
    buff.splice(at, qt)
  }
  for (const { from, to } of operations.swaps) {
    const t = buff[to]
    buff[to] = buff[from]
    buff[from] = t
  }
  for (const op of operations.inserts) {
    buff.splice(op.at, 0, ...op.values)
  }
  return buff
}

/**
 * Joins an array of values into a string using a conjunction and separator.
 *
 * @param arr - The array of values to join.
 * @param conjunction - The conjunction to use between the second-to-last and last value. Default is ' and '.
 * @param separator - The separator to use between each value. Default is ', '.
 * @returns The joined string.
 * @public
 */
export const joinArrayWithConjunction = <A>(
  arr: A[],
  conjunction = ' and ',
  separator = ', '
): string => {
  if (arr.length === 0) return ''
  if (arr.length === 1) return String(arr[0])
  return `${arr.slice(0, -1).join(separator)}${conjunction}${String(arr[arr.length - 1])}`
}

/**
 * Assigns ranks to the elements in the array based on the provided compare function.
 * The ranks are assigned in ascending order, with the lowest value receiving a rank of 0.
 * If there are duplicate values, the rank of the duplicates can be incremented or not based on the `incrementDuplicates` parameter.
 *
 * @typeParam T - The type of elements in the array.
 * @param array - The array to rank.
 * @param compare - The compare function used to determine the order of elements.
 * @param incrementDuplicates - Whether to increment the rank of duplicate values.
 * @returns An array of ranks corresponding to the elements in the input array.
 * @public
 */
export const rankArray = <T>(
  array: T[],
  compare: (a: T, b: T) => number,
  incrementDuplicates: boolean = true
): number[] => {
  const arr = array.map((v, i): [T, number] => [v, i])
  arr.sort((a, b) => compare(a[0], b[0]))
  const ranks = new Array<number>(arr.length)
  let rank = 0
  let last = arr[0][0]
  for (let i = 0; i < arr.length; i++) {
    const [v, index] = arr[i]
    if (compare(v, last) !== 0) {
      rank = i
      last = v
    }
    ranks[index] = rank
    if (incrementDuplicates) rank++
  }
  return ranks
}
