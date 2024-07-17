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
