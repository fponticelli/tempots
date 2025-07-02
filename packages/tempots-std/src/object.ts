import { IndexKey, Merge, TupleToUnion } from './domain'

/**
 * Returns an array of keys from the given object with proper type inference.
 *
 * This function provides better type safety than `Object.keys()` by returning
 * `Array<keyof T>` instead of `string[]`, ensuring type correctness when working
 * with the keys in TypeScript.
 *
 * @example
 * ```typescript
 * const user = { id: 1, name: 'Alice', active: true }
 * const keys = objectKeys(user)
 * // Type: Array<'id' | 'name' | 'active'>
 * // Result: ['id', 'name', 'active']
 *
 * // Type-safe iteration
 * keys.forEach(key => {
 *   console.log(user[key]) // TypeScript knows this is valid
 * })
 * ```
 *
 * @param obj - The object from which to extract keys.
 * @returns An array of keys from the object with proper typing.
 * @public
 */
export const objectKeys = <T extends object>(obj: T): Array<keyof T> =>
  Object.keys(obj) as Array<keyof T>

/**
 * Returns an array of values from the given object with proper type inference.
 *
 * This function provides better type safety than `Object.values()` by returning
 * `Array<T[keyof T]>` instead of `unknown[]`, preserving the union type of all
 * possible values in the object.
 *
 * @example
 * ```typescript
 * const user = { id: 1, name: 'Alice', active: true }
 * const values = objectValues(user)
 * // Type: Array<number | string | boolean>
 * // Result: [1, 'Alice', true]
 *
 * // Type-safe processing
 * values.forEach(value => {
 *   // TypeScript knows value can be number | string | boolean
 *   if (typeof value === 'string') {
 *     console.log(value.toUpperCase())
 *   }
 * })
 * ```
 *
 * @param obj - The object from which to extract values.
 * @returns An array of values from the object with proper typing.
 * @public
 */
export const objectValues = <T extends object>(obj: T): Array<T[keyof T]> =>
  Object.values(obj) as Array<T[keyof T]>

/**
 * Returns an array of entries (key-value pairs) from the given object with proper type inference.
 *
 * This function provides better type safety than `Object.entries()` by returning
 * `[keyof T, T[keyof T]][]` instead of `[string, unknown][]`, preserving both
 * key and value types for type-safe destructuring and iteration.
 *
 * @example
 * ```typescript
 * const user = { id: 1, name: 'Alice', active: true }
 * const entries = objectEntries(user)
 * // Type: Array<['id' | 'name' | 'active', number | string | boolean]>
 * // Result: [['id', 1], ['name', 'Alice'], ['active', true]]
 *
 * // Type-safe destructuring
 * entries.forEach(([key, value]) => {
 *   // TypeScript knows key is 'id' | 'name' | 'active'
 *   // TypeScript knows value is number | string | boolean
 *   console.log(`${key}: ${value}`)
 * })
 * ```
 *
 * @param obj - The object from which to extract entries.
 * @returns An array of tuples with proper typing, where each tuple contains a key and its corresponding value.
 * @public
 */
export const objectEntries = <T extends object>(
  obj: T
): [keyof T, T[keyof T]][] => Object.entries(obj) as [keyof T, T[keyof T]][]

/**
 * Creates an object from an array of entries with proper type inference.
 *
 * This function provides better type safety than `Object.fromEntries()` by
 * accepting properly typed entries and returning a typed object instead of
 * `{ [k: string]: unknown }`.
 *
 * @example
 * ```typescript
 * const entries: [string, number][] = [['a', 1], ['b', 2], ['c', 3]]
 * const obj = objectFromEntries(entries)
 * // Type: { [x: string]: number }
 * // Result: { a: 1, b: 2, c: 3 }
 *
 * // Works with union types
 * const mixedEntries: Array<['id' | 'name', number | string]> = [
 *   ['id', 123],
 *   ['name', 'Alice']
 * ]
 * const user = objectFromEntries(mixedEntries)
 * // Type: { [x: string]: number | string }
 * ```
 *
 * @param entries - The array of entries to create an object from.
 * @returns The created object with proper typing.
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

/**
 * Creates a new object with only the specified keys from the source object.
 *
 * This function provides type-safe property selection, ensuring that only
 * valid keys can be picked and the result type reflects the selected properties.
 *
 * @example
 * ```typescript
 * const user = { id: 1, name: 'Alice', email: 'alice@example.com', password: 'secret' }
 * const publicUser = pick(user, ['id', 'name', 'email'])
 * // Result: { id: 1, name: 'Alice', email: 'alice@example.com' }
 * // Type: Pick<typeof user, 'id' | 'name' | 'email'>
 * ```
 *
 * @param obj - The source object
 * @param keys - Array of keys to pick
 * @returns A new object containing only the specified keys
 * @public
 */
export const pick = <T extends object, K extends keyof T>(
  obj: T,
  keys: readonly K[]
): Pick<T, K> => {
  const result = {} as Pick<T, K>
  for (const key of keys) {
    if (key in obj) {
      result[key] = obj[key]
    }
  }
  return result
}

/**
 * Creates a new object with all keys except the specified ones from the source object.
 *
 * This function provides type-safe property exclusion, ensuring that only
 * valid keys can be omitted and the result type reflects the remaining properties.
 *
 * @example
 * ```typescript
 * const user = { id: 1, name: 'Alice', email: 'alice@example.com', password: 'secret' }
 * const publicUser = omit(user, ['password'])
 * // Result: { id: 1, name: 'Alice', email: 'alice@example.com' }
 * // Type: Omit<typeof user, 'password'>
 * ```
 *
 * @param obj - The source object
 * @param keys - Array of keys to omit
 * @returns A new object without the specified keys
 * @public
 */
export const omit = <T extends object, K extends keyof T>(
  obj: T,
  keys: readonly K[]
): Omit<T, K> => {
  const result = { ...obj } as Omit<T, K>
  for (const key of keys) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (result as any)[key]
  }
  return result
}

/**
 * Creates a deep clone of an object.
 *
 * This function recursively clones objects, arrays, and primitive values.
 * It handles Date objects specially and avoids infinite recursion.
 *
 * @example
 * ```typescript
 * const original = {
 *   name: 'Alice',
 *   settings: { theme: 'dark', notifications: true },
 *   tags: ['user', 'admin']
 * }
 * const cloned = deepClone(original)
 * cloned.settings.theme = 'light' // Original remains unchanged
 * ```
 *
 * @param obj - The object to clone
 * @returns A deep clone of the object
 * @public
 */
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as T
  }

  if (obj instanceof Array) {
    return obj.map(item => deepClone(item)) as T
  }

  if (typeof obj === 'object') {
    const cloned = {} as T
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        cloned[key] = deepClone(obj[key])
      }
    }
    return cloned
  }

  return obj
}
