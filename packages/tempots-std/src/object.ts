import { IndexKey, Merge, TupleToUnion } from './domain'

/**
 * Returns an array of keys from the given object.
 *
 * @param obj - The object from which to extract keys.
 * @returns An array of keys from the object.
 */
export function keys<T extends object>(obj: T): Array<keyof T> {
  return Object.keys(obj) as Array<keyof T>
}

/**
 * Checks if two objects have the same keys.
 *
 * @param a - The first object.
 * @param b - The second object.
 * @returns `true` if both objects have the same keys, `false` otherwise.
 */
export function sameKeys<T extends object>(a: T, b: T): boolean {
  const ak = keys(a)
  const bk = keys(b)
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
 */
export function isObject(obj: unknown): obj is Record<IndexKey, unknown> {
  return obj != null && Object.getPrototypeOf(obj) === Object.prototype
}

/**
 * Removes specified fields from an object and returns a new object without those fields.
 *
 * @param ob - The object from which fields will be removed.
 * @param fields - The fields to be removed from the object.
 * @returns A new object without the specified fields.
 */
export function removeFields<T extends object, F extends Array<keyof T>>(
  ob: T,
  ...fields: F
): Omit<T, TupleToUnion<F>> {
  const ks = keys(ob)
  return ks.reduce((acc: Record<IndexKey, unknown>, key) => {
    if (!fields.includes(key)) acc[key] = ob[key]
    return acc
  }, {}) as Omit<T, TupleToUnion<F>>
}

/**
 * Merges two objects together.
 *
 * @template A - The type of the first object.
 * @template B - The type of the second object.
 * @param {A} a - The first object to merge.
 * @param {B} b - The second object to merge.
 * @returns {Merge<A, B>} - The merged object.
 */
export function merge<
  A extends Record<IndexKey, unknown>,
  B extends Record<IndexKey, unknown>,
>(a: A, b: B): Merge<A, B> {
  return Object.assign({}, a, b) as Merge<A, B>
}

/**
 * Checks if an object is empty.
 * An object is considered empty if it has no own enumerable properties.
 *
 * @param obj - The object to check.
 * @returns `true` if the object is empty, `false` otherwise.
 */
export function isEmpty(obj: object): boolean {
  return Object.keys(obj).length === 0
}
