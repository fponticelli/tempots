/**
 * Utility functions to manipulate `boolean` values.
 */

import { ParsingError } from './error'

/**
 * Returns a comparison value (`Int`) from two boolean values.
 *
 * @param a - The first boolean value.
 * @param b - The second boolean value.
 * @returns A comparison value.
 * @public
 */
export function compareBooleans(a: boolean, b: boolean): number {
  return a === b ? 0 : a ? -1 : 1
}

/**
 * Converts a boolean to an integer value (`true` => `1`, `false` => `0`).
 *
 * @param v - The boolean value.
 * @returns The integer value.
 * @public
 */
export function booleanToInt(v: boolean): number {
  return v ? 1 : 0
}

/**
 * Returns `true` if the passed value can be parsed as a boolean. The following values are considered parsable:
 *
 * - `'true'` / `'false'`
 * - `'0'` / `'1'`
 * - `'on'` / `'off'`
 *
 * The comparison is case insensitive.
 *
 * @param v - The value to check.
 * @returns `true` if the value can be parsed; otherwise, `false`.
 * @public
 */
export function canParseBoolean(v: string): boolean {
  if (v == null) return false
  switch (v.toLowerCase()) {
    case 'true':
    case 'false':
    case '0':
    case '1':
    case 'on':
    case 'off':
      return true
    default:
      return false
  }
}

/**
 * Returns `true`/`false` if the passed value can be parsed. The following values are considered parsable:
 *
 * - `'true'` / `'false'`
 * - `'0'` / `'1'`
 * - `'on'` / `'off'`
 *
 * @param v - The value to parse.
 * @returns The parsed boolean value.
 * @public
 */
export function parseBoolean(v: string): boolean {
  switch (v.toLowerCase()) {
    case 'true':
    case '1':
    case 'on':
      return true
    case 'false':
    case '0':
    case 'off':
      return false
    default:
      throw new ParsingError(`unable to parse '${v}' to boolean`)
  }
}

/**
 * Returns `true` when arguments are different.
 *
 * @param a - The first boolean value.
 * @param b - The second boolean value.
 * @returns The result of the XOR operation.
 * @public
 */
export function xorBoolean(a: boolean, b: boolean): boolean {
  return a !== b
}
