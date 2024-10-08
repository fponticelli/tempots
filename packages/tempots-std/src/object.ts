import { IndexKey, Merge, TupleToUnion } from './domain'

/**
 * Returns an array of keys from the given object.
 *
 * @param obj - The object from which to extract keys.
 * @returns An array of keys from the object.
 * @public
 */
export const objectKeys = <T extends object>(obj: T): Array<keyof T> =>
  Object.keys(obj) as Array<keyof T>

/**
 * Returns an array of values from the given object.
 *
 * @param obj - The object from which to extract values.
 * @returns An array of values from the object.
 * @public
 */
export const objectValues = <T extends object>(obj: T): Array<T[keyof T]> =>
  Object.values(obj) as Array<T[keyof T]>

/**
 * Returns an array of entries (key-value pairs) from the given object.
 *
 * @param obj - The object from which to extract entries.
 * @returns An array of tuples, where each tuple contains a key and its corresponding value from the object.
 * @public
 */
export const objectEntries = <T extends object>(
  obj: T
): [keyof T, T[keyof T]][] => Object.entries(obj) as [keyof T, T[keyof T]][]

/**
 * Creates an object from an array of entries.
 *
 * @param entries - The array of entries to create an object from.
 * @returns The created object.
 * @public
 */
export const objectFromEntries = <T extends object>(
  entries: [keyof T, T[keyof T]][]
): T => Object.fromEntries(entries) as T

/**
 * Checks if two objects have the same keys.
 *
 * @param a - The first object.
 * @param b - The second object.
 * @returns `true` if both objects have the same keys, `false` otherwise.
 * @public
 */
export const sameObjectKeys = <T extends object>(a: T, b: T): boolean => {
  const ak = objectKeys(a)
  const bk = objectKeys(b)
  if (ak.length !== bk.length) return false
  for (const k of ak) {
    if (!(k in b)) return false
  }
  return true
}

/**
 * Checks if the given value is an object.
 *
 * @param obj - The value to check.
 * @returns `true` if the value is an object, `false` otherwise.
 * @public
 */
export const isObject = (obj: unknown): obj is Record<IndexKey, unknown> =>
  obj != null && Object.getPrototypeOf(obj) === Object.prototype

/**
 * Removes specified fields from an object and returns a new object without those fields.
 *
 * @param ob - The object from which fields will be removed.
 * @param fields - The fields to be removed from the object.
 * @returns A new object without the specified fields.
 * @public
 */
export const removeObjectFields = <T extends object, F extends Array<keyof T>>(
  ob: T,
  ...fields: F
): Omit<T, TupleToUnion<F>> => {
  const ks = objectKeys(ob)
  return ks.reduce((acc: Record<IndexKey, unknown>, key) => {
    if (!fields.includes(key)) acc[key] = ob[key]
    return acc
  }, {}) as Omit<T, TupleToUnion<F>>
}

/**
 * Merges two objects together.
 *
 * @typeParam A - The type of the first object.
 * @typeParam B - The type of the second object.
 * @param a - The first object to merge.
 * @param b - The second object to merge.
 * @returns The merged object.
 * @public
 */
export const mergeObjects = <
  A extends Record<IndexKey, unknown>,
  B extends Record<IndexKey, unknown>,
>(
  a: A,
  b: B
): Merge<A, B> => Object.assign({}, a, b) as Merge<A, B>

/**
 * Checks if an object is empty.
 * An object is considered empty if it has no own enumerable properties.
 *
 * @param obj - The object to check.
 * @returns `true` if the object is empty, `false` otherwise.
 * @public
 */
export const isEmptyObject = (obj: object): boolean =>
  Object.keys(obj).length === 0
