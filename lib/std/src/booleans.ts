/*
Copyright 2019 Google LLC
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    https://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

/**
 * Utility functions to manipulate `boolean` values.
 */

/**
 * Returns a comparison value (`Int`) from two boolean values.
 */
export function compare(a: boolean, b: boolean) {
  return a === b ? 0 : a ? -1 : 1
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
