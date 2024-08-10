import { Nothing } from './domain'

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
  typeof value === 'object' && !Array.isArray(value) && value != null

/**
 * Checks if the value is a JSON array.
 *
 * @param value - The value to check.
 * @returns `true` if the value is a JSON array; otherwise, `false`.
 * @public
 */
export const isJSONArray = (value: JSONValue): value is JSONArray =>
  Array.isArray(value)

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
