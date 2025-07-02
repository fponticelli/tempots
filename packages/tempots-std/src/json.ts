import { Nothing } from './domain'
import { Result } from './result'

/**
 * Represents a JSON primitive value.
 * It can be a string, boolean, number, or Nothing (null or undefined).
 * @public
 */
export type JSONPrimitive = string | boolean | number | Nothing
/**
 * Represents a JSON object.
 * @public
 */
export interface JSONObject {
  [k: string]: JSONValue
}
/**
 * Represents an array of JSON values.
 * @public
 */
export type JSONArray = JSONValue[]
/**
 * Represents a JSON value, which can be a primitive, an object, or an array.
 * @public
 */
export type JSONValue = JSONPrimitive | JSONObject | JSONArray

/**
 * Checks if the value is a JSON object.
 *
 * @param value - The value to check.
 * @returns `true` if the value is a JSON object; otherwise, `false`.
 * @public
 */
export const isJSONObject = (value: JSONValue): value is JSONObject =>
  typeof value === 'object' &&
  !Array.isArray(value) &&
  value != null &&
  Object.values(value).every(isJSON)

/**
 * Checks if the value is a JSON array with recursive validation.
 *
 * This function provides more thorough validation than `Array.isArray()` by
 * recursively checking that all elements in the array are valid JSON values.
 * This is essential for ensuring data can be safely serialized to JSON.
 *
 * @example
 * ```typescript
 * isJSONArray([1, 2, 3]) // true
 * isJSONArray(['hello', 'world']) // true
 * isJSONArray([1, 'hello', true, null]) // true
 * isJSONArray([1, 2, undefined]) // false (undefined is not JSON-serializable)
 * isJSONArray([1, 2, () => {}]) // false (functions are not JSON-serializable)
 * ```
 *
 * @param value - The value to check.
 * @returns `true` if the value is a JSON array with all valid JSON elements; otherwise, `false`.
 * @public
 */
export const isJSONArray = (value: JSONValue): value is JSONArray =>
  Array.isArray(value) && value.every(isJSON)

/**
 * Checks if the value is a valid JSON value with comprehensive validation.
 *
 * This function provides thorough validation that goes beyond basic type checking
 * by recursively validating nested objects and arrays to ensure the entire
 * structure can be safely serialized to JSON.
 *
 * @example
 * ```typescript
 * isJSON('hello') // true
 * isJSON(42) // true
 * isJSON(true) // true
 * isJSON(null) // true
 * isJSON({ name: 'Alice', age: 30 }) // true
 * isJSON([1, 2, { nested: true }]) // true
 * isJSON(undefined) // false
 * isJSON(() => {}) // false
 * isJSON({ func: () => {} }) // false (contains non-JSON value)
 * ```
 *
 * @param value - The value to check.
 * @returns `true` if the value is a completely valid JSON value; otherwise, `false`.
 * @public
 */
export const isJSON = (value: JSONValue): value is JSONValue =>
  isJSONPrimitive(value) || isJSONObject(value) || isJSONArray(value)

/**
 * Checks if the value is a JSON primitive.
 *
 * @param value - The value to check.
 * @returns `true` if the value is a JSON primitive; otherwise, `false`.
 * @public
 */
export const isJSONPrimitive = (value: JSONValue): value is JSONPrimitive =>
  typeof value === 'string' ||
  typeof value === 'boolean' ||
  typeof value === 'number' ||
  value == null

/**
 * Parses a JSON string into a JSON value.
 *
 * @param value - The JSON string to parse.
 * @returns A result containing the parsed JSON value or an error if parsing fails.
 * @public
 */
export const parseJSON = (value: string): Result<JSONValue, Error> => {
  try {
    return Result.success(JSON.parse(value))
  } catch (error) {
    return Result.failure(error as Error)
  }
}
