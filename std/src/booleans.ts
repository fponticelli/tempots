import { none, some, Option } from './option'

/**
 * Returns a comparison value (`Int`) from two boolean values.
 */
export function compare(a: boolean, b: boolean) {
  return a === b ? 0 : (a ? -1 : 1)
}

/**
 * Converts a boolean to an integer value (`true` => `1`, `false` => `0`).
 */
export function toInt(v: boolean) {
  return v ? 1 : 0
}

/**
 * Returns `true` if the passed value is either `true` or `false` (case insensitive).
 */
export function canParse(v: string) {
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
 * Returns `true`/`false` if the passed value is `true`/`false` (case insensitive) with any other value it will return null.
 */
export function parse(v: string): boolean {
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
      throw `unable to parse '${v}'`
  }
}

/**
 * Returns `true` when arguments are different.
 */
export function xor(a: boolean, b: boolean): boolean {
  return a !== b
}

/**
 * Depending upon the condition, return the provided value wrapped
 * in a `some`, or `none` if the condition is false.
 */
export function option<A>(cond: boolean, a: A): Option<A> {
  return cond ? some(a) : none
}