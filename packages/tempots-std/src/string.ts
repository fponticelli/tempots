import {
  allElements,
  anyElement,
  createFilledArray,
  generateArray,
} from './array'
import { mapRegExp as mapR } from './regexp'

/**
 * Utility functions to manipulate string values.
 *
 * Use by importing the desired utility from "@tempots/std" or directly from "@tempots/std/string".
 * @public
 */

/**
 * Replaces all occurrances of `placeholder` in `subject` with the value `replacement`.
 * @param subject - The string to search in.
 * @param placeholder - The string to search for.
 * @param replacement - The string to replace `placeholder` with.
 * @returns The string with all occurrances of `placeholder` replaced by `replacement`.
 * @public
 */
export function replaceAll(
  subject: string,
  placeholder: string,
  replacement: string
): string {
  return subject.split(placeholder).join(replacement)
}

/**
 * `substringAfter` searches for the first occurrance of `searchFor` and returns the text after that.
 * If `searchFor` is not found, an empty string is returned.
 *
 * @param value - The string to search in.
 * @param searchFor - The string to search for.
 * @returns The text after the first occurrance of `searchFor` or an empty string if `searchFor` is not found.
 * @public
 */
export function substringAfter(value: string, searchFor: string): string {
  const pos = value.indexOf(searchFor)
  if (pos < 0) return ''
  else return value.substring(pos + searchFor.length)
}

/**
 * `substringAfterLast` searches for the last occurrance of `searchFor` and returns the text after that.
 * If `searchFor` is not found, an empty string is returned.
 *
 * @param value - The string to search in.
 * @param searchFor - The string to search for.
 * @returns The text after the last occurrance of `searchFor` or an empty string if `searchFor` is not found.
 * @public
 */
export function substringAfterLast(value: string, searchFor: string): string {
  const pos = value.lastIndexOf(searchFor)
  if (pos < 0) return ''
  else return value.substring(pos + searchFor.length)
}

/**
 * `substringBefore` searches for the first occurrance of `searchFor` and returns the text before that.
 * If `searchFor` is not found, an empty string is returned.
 *
 * @param value - The string to search in.
 * @param searchFor - The string to search for.
 * @returns The text before the first occurrance of `searchFor` or an empty string if `searchFor` is not found.
 * @public
 */
export function substringBefore(value: string, searchFor: string): string {
  const pos = value.indexOf(searchFor)
  if (pos < 0) return ''
  else return value.substring(0, pos)
}

/**
 * `substringBeforeLast` searches for the last occurrance of `searchFor` and returns the text before that.
 * If `searchFor` is not found, an empty string is returned.
 *
 * @param value - The string to search in.
 * @param searchFor - The string to search for.
 * @returns The text before the last occurrance of `searchFor` or an empty string if `searchFor` is not found.
 * @public
 */
export function substringBeforeLast(value: string, searchFor: string): string {
  const pos = value.lastIndexOf(searchFor)
  if (pos < 0) return ''
  else return value.substring(0, pos)
}

/**
 * `capitalize` returns a string with the first character convert to upper case.
 *
 * @param s - The string to capitalize.
 * @returns The capitalized string.
 * @public
 */
export function capitalize(s: string): string {
  return s.substring(0, 1).toUpperCase() + s.substring(1)
}

const upperMatch = (s: string): string => s.toUpperCase()

/**
 * Capitalize the first letter of every word in `value`. If `whiteSpaceOnly` is set to `true`
 * the process is limited to whitespace separated words.
 *
 * @param value - The string to capitalize.
 * @param whiteSpaceOnly - If `true`, only whitespace separated words will be capitalized.
 * @returns The string with the first letter of each word capitalized.
 * @public
 */
export function capitalizeWords(value: string, whiteSpaceOnly = false): string {
  if (whiteSpaceOnly) {
    return mapR(capitalize(value), UCWORDSWS, upperMatch)
  } else {
    return mapR(capitalize(value), UCWORDS, upperMatch)
  }
}

/**
 * Replaces occurrances of `\r\n`, `\n\r`, `\r` with `\n`
 *
 * @param value - The string to normalize.
 * @returns The string with normalized line endings.
 * @public
 */
export function canonicalizeNewlines(value: string): string {
  return value.replace(CANONICALIZE_LINES, '\n')
}

/**
 * Compares two strings ignoring their case.
 *
 * @param a - The first string to compare.
 * @param b - The second string to compare.
 * @returns A negative number if `a` is less than `b`, zero if they are equal, or a positive number if `a` is greater than `b`.
 * @public
 */
export function compareCaseInsensitive(a: string, b: string): number {
  if (a == null && b == null) return 0
  if (a == null) return -1
  else if (b == null) return 1
  return compareStrings(a.toLowerCase(), b.toLowerCase())
}

/**
 * Checks if a string ends with a specified suffix.
 *
 * @param s - The string to check.
 * @param end - The suffix to check against.
 * @returns `true` if the string ends with the specified suffix, `false` otherwise.
 * @public
 */
export function stringEndsWith(s: string, end: string): boolean {
  return s.substring(0, s.length - end.length) === end
}

/**
 * Checks if a string ends with another string in a case-insensitive manner.
 *
 * @param s - The string to check.
 * @param end - The string to check if it is the ending of `s`.
 * @returns `true` if `s` ends with `end` (case-insensitive), otherwise `false`.
 * @public
 */
export function textEndsWithCaseInsensitive(s: string, end: string): boolean {
  return (
    s.substring(0, s.length - end.length).toLowerCase() === end.toLowerCase()
  )
}

/**
 * Checks if a string starts with a specified substring.
 *
 * @param s - The string to check.
 * @param start - The substring to check for at the beginning of the string.
 * @returns `true` if the string starts with the specified substring, `false` otherwise.
 * @public
 */
export function stringStartsWith(s: string, start: string): boolean {
  return s.substring(0, start.length) === start
}

/**
 * Checks if a string starts with another string in a case-insensitive manner.
 *
 * @param s - The string to check.
 * @param start - The string to compare with the start of `s`.
 * @returns `true` if `s` starts with `start` (case-insensitive), `false` otherwise.
 * @public
 */
export function textStartsWithCaseInsensitive(
  s: string,
  start: string
): boolean {
  return s.substring(0, start.length).toLowerCase() === start.toLowerCase()
}

/**
 * Compares a string `s` with many `values` and see if one of them matches its end ignoring their case.
 *
 * @param s - The string to compare.
 * @param values - The values to compare with the end of `s`.
 * @returns `true` if `s` ends with any of the values in `values` (case-insensitive), `false` otherwise.
 * @public
 */
export function textEndsWithAnyCaseInsensitive(
  s: string,
  values: string[]
): boolean {
  return stringEndsWithAny(
    s.toLowerCase(),
    values.map(v => v.toLowerCase())
  )
}

/**
 * Compares a string `s` with many `values` and see if one of them matches its beginning ignoring their case.
 *
 * @param s - The string to compare.
 * @param values - The values to compare with the start of `s`.
 * @returns `true` if `s` starts with any of the values in `values` (case-insensitive), `false` otherwise.
 * @public
 */
export function textStartsWithAnyCaseInsensitive(
  s: string,
  values: string[]
): boolean {
  return stringStartsWithAny(
    s.toLowerCase(),
    values.map(v => v.toLowerCase())
  )
}

/**
 * It cleans up all the whitespaces in the passed `value`. `collapse` does the following:
 * - remove trailing/leading whitespaces
 * - within the string, it collapses seqeunces of whitespaces into a single space character
 * For whitespaces in this description, it is intended to be anything that is matched by the regular expression `\s`.
 *
 * @param value - The string to collapse.
 * @returns The string with all whitespaces collapsed.
 * @public
 */
export function collapseText(value: string): string {
  return value.trim().replace(WSG, ' ')
}

/**
 * It compares to string and it returns a negative number if `a` is inferior to `b`, zero if they are the same,
 * or otherwise a positive non-sero number.
 *
 * @param a - The first string to compare.
 * @param b - The second string to compare.
 * @returns A negative number if `a` is less than `b`, zero if they are equal, or a positive number if `a` is greater than `b`.
 * @public
 */
export function compareStrings(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0
}

/**
 * `textContainsCaseInsensitive` returns `true` if `s` contains one or more occurrences of `test` regardless of the text case.
 *
 * @param s - The string to search in.
 * @param test - The string to search for.
 * @returns `true` if `s` contains `test` (case-insensitive), `false` otherwise.
 * @public
 */
export function textContainsCaseInsensitive(s: string, test: string): boolean {
  return s.toLowerCase().includes(test.toLowerCase())
}

/**
 * `textContains` returns `true` if `s` contains one or more occurrences of `test`.
 *
 * @param s - The string to search in.
 * @param test - The string to search for.
 * @returns `true` if `s` contains `test`, `false` otherwise.
 * @public
 */
export function stringContains(s: string, test: string): boolean {
  return s.includes(test)
}

/**
 * Return the number of occurrences of `test` in `s`.
 *
 * @param s - The string to search in.
 * @param test - The string to search for.
 * @returns The number of occurrences of `test` in `s`.
 * @public
 */
export function countStringOccurrences(s: string, test: string): number {
  return s.split(test).length - 1
}

/**
 * `containsAnyTextCaseInsensitive` returns `true` if `s` contains any of the strings in `tests` regardless of the text case
 *
 * @param s - The string to search in.
 * @param tests - The strings to search for.
 * @returns `true` if `s` contains any of the strings in `tests` (case-insensitive), `false` otherwise.
 * @public
 */
export function containsAnyTextCaseInsensitive(
  s: string,
  tests: string[]
): boolean {
  return anyElement(tests, t => textContainsCaseInsensitive(s, t))
}

/**
 * `containsAnyText` returns `true` if `s` contains any of the strings in `tests`
 *
 * @param s - The string to search in.
 * @param tests - The strings to search for.
 * @returns `true` if `s` contains any of the strings in `tests`, `false` otherwise.
 * @public
 */
export function containsAnyText(s: string, tests: string[]): boolean {
  return anyElement(tests, t => stringContains(s, t))
}

/**
 * `containsAllTextCaseInsensitive` returns `true` if `s` contains all of the strings in `tests` regardless of the text case
 *
 * @param s - The string to search in.
 * @param tests - The strings to search for.
 * @returns `true` if `s` contains all of the strings in `tests` (case-insensitive), `false` otherwise.
 * @public
 */
export function containsAllTextCaseInsensitive(
  s: string,
  tests: string[]
): boolean {
  return allElements(tests, t => textContainsCaseInsensitive(s, t))
}

/**
 * `containsAllText` returns `true` if `s` contains all of the strings in `tests`
 *
 * @param s - The string to search in.
 * @param tests - The strings to search for.
 * @returns `true` if `s` contains all of the strings in `tests`, `false` otherwise.
 * @public
 */
export function containsAllText(s: string, tests: string[]): boolean {
  return allElements(tests, t => stringContains(s, t))
}

/**
 * `dasherize` replaces all the occurrances of `_` with `-`
 *
 * @param s - The string to dasherize.
 * @returns The dasherized string.
 * @public
 */
export function dasherize(s: string): string {
  return s.replace('_', '-')
}

/**
 * Compares strings `a` and `b` and returns the position where they differ.
 * If the strings are equal, it returns `-1`.
 *
 * @remarks
 * @example
 * ```ts
 * stringsDifferAtIndex('abcdef', 'abc123') // returns 3
 * ```
 * @public
 *
 * @param a - The first string to compare.
 * @param b - The second string to compare.
 * @returns The position where the strings differ, or `-1` if they are equal.
 *
 */
export function stringsDifferAtIndex(a: string, b: string): number {
  if (a === b) return -1
  const min = Math.min(a.length, b.length)
  for (let i = 0; i < min; i++) {
    if (a.substring(i, i + 1) !== b.substring(i, i + 1)) return i
  }
  return min
}

/**
 * `ellipsis` truncates `s` at len `maxlen` replaces the last characters with the content
 * of `symbol`.
 *
 * @remarks
 * @example
 * ```ts
 * ellipsis('tempo is a nice library', 9) // returns 'tempo is …'
 * ```
 *
 * @param s - The string to truncate.
 * @param maxlen - The maximum length of the string.
 * @param symbol - The symbol to replace the truncated characters with.
 * @returns The truncated string.
 * @public
 */
export function ellipsis(s: string, maxlen = 20, symbol = '…'): string {
  const sl = s.length
  const symboll = symbol.length
  if (sl > maxlen) {
    if (maxlen < symboll) {
      return symbol.slice(symboll - maxlen, maxlen)
    } else {
      return s.slice(0, maxlen - symboll) + symbol
    }
  } else return s
}

/**
 * Same as `ellipsis` but puts the symbol in the middle of the string and not to the end.
 *
 * @remarks
 * @example
 * ```ts
 * ellipsisMiddle('tempo is a nice library', 18) // returns 'tempo is … library'
 * ```
 *
 * @param s - The string to truncate.
 * @param maxlen - The maximum length of the string.
 * @param symbol - The symbol to replace the truncated characters with.
 * @returns The truncated string.
 * @public
 */
export function ellipsisMiddle(s: string, maxlen = 20, symbol = '…'): string {
  const sl = s.length
  const symboll = symbol.length
  if (sl > maxlen) {
    if (maxlen <= symboll) {
      return ellipsis(s, maxlen, symbol)
    }
    const hll = Math.ceil((maxlen - symboll) / 2)
    const hlr = Math.floor((maxlen - symboll) / 2)
    return s.slice(0, hll) + symbol + s.slice(sl - hlr)
  } else return s
}

/**
 * Returns `true` if `s` ends with any of the values in `values`.
 *
 * @param s - The string to compare.
 * @param values - The values to compare with the end of `s`.
 * @returns `true` if `s` ends with any of the values in `values`, `false` otherwise.
 * @public
 */
export function stringEndsWithAny(s: string, values: string[]): boolean {
  return anyElement(values, end => stringEndsWith(s, end))
}

/**
 * `filterString` applies `predicate` character by character to `s` and it returns a filtered
 * version of the string.
 *
 * @param s - The string to filter.
 * @param predicate - The function to apply to each character in the string.
 * @returns The filtered string.
 * @public
 */
export function filterChars(
  s: string,
  predicate: (s: string) => boolean
): string {
  return stringToChars(s).filter(predicate).join('')
}

/**
 * Same as `filterCharcodes` but `predicate` operates on integer char codes instead of string characters.
 *
 * @param s - The string to filter.
 * @param predicate - The function to apply to each character code in the string.
 * @returns The filtered string.
 * @public
 */
export function filterCharcodes(
  s: string,
  predicate: (n: number) => boolean
): string {
  const codes: number[] = stringToCharcodes(s).filter(predicate)
  return codes.map((i: number) => String.fromCharCode(i)).join('')
}

/**
 * Calculates the hash code for a given string.
 *
 * @param value - The string to calculate the hash code for.
 * @param seed - The seed value for the hash code calculation. Default is 0x811c9dc5.
 * @returns The calculated hash code as a number.
 * @public
 */
export function stringHashCode(value: string, seed = 0x811c9dc5): number {
  let hval = seed
  for (let i = 0, l = value.length; i < l; i++) {
    hval ^= value.charCodeAt(i)
    hval += (hval << 1) + (hval << 4) + (hval << 7) + (hval << 8) + (hval << 24)
  }
  return hval >>> 0
}

/**
 * Returns `true` if `value` is not `null` and contains at least one character.
 *
 * @param value - The string to check.
 * @returns `true` if the string is not `null` and contains at least one character, `false` otherwise.
 * @public
 */
export function stringHasContent(value: string): boolean {
  return value != null && value.length > 0
}

/**
 * Works the same as `underscore` but also replaces underscores with whitespaces.
 *
 * @param s - The string to convert.
 * @returns The converted string.
 * @public
 */
export function humanize(s: string): string {
  return replaceAll(underscore(s), '_', ' ')
}

/**
 * Checks if `s` contains only (and at least one) alphabetical characters.
 *
 * @param s - The string to check.
 * @returns `true` if the string contains only alphabetical characters, `false` otherwise.
 * @public
 */
export function isAlpha(s: string): boolean {
  return s.length > 0 && !IS_ALPHA.test(s)
}

/**
 * `isAlphaNum` returns `true` if the string only contains alpha-numeric characters.
 *
 * @param value - The string to check.
 * @returns `true` if the string contains only alpha-numeric characters, `false` otherwise.
 * @public
 */
export function isAlphaNum(value: string): boolean {
  return ALPHANUM.test(value)
}

/**
 * Checks if a string contains any breaking whitespace characters.
 *
 * @param value - The string to check.
 * @returns `true` if the string contains breaking whitespace characters, `false` otherwise.
 * @public
 */
export function isBreakingWhitespace(value: string): boolean {
  return !IS_BREAKINGWHITESPACE.test(value)
}

/**
 * Returns `true` if the value string is composed of only lower cased characters
 * or case neutral characters.
 *
 * @param value - The string to check.
 * @returns `true` if the string contains only lower case characters, `false` otherwise.
 * @public
 */
export function isLowerCase(value: string): boolean {
  return value.toLowerCase() === value
}

/**
 * Returns `true` if the value string is composed of only upper cased characters
 * or case neutral characters.
 *
 * @param value - The string to check.
 * @returns `true` if the string contains only upper case characters, `false` otherwise.
 * @public
 */
export function isUpperCase(value: string): boolean {
  return value.toUpperCase() === value
}

/**
 * `ifEmpty` returns `value` if it is neither `null` or empty, otherwise it returns `alt`
 *
 * @param value - The string to check.
 * @param alt - The alternative value to return if `value` is `null` or empty.
 * @returns The original string if it is not `null` or empty, otherwise the alternative value.
 * @public
 */
export function ifEmptyString(value: string, alt: string): string {
  return value != null && value !== '' ? value : alt
}

/**
 * `isDigitsOnly` returns `true` if the string only contains digits.
 *
 * @param value - The string to check.
 * @returns `true` if the string contains only digits, `false` otherwise.
 * @public
 */
export function isDigitsOnly(value: string): boolean {
  return DIGITS.test(value)
}

/**
 * `isEmpty` returns true if either `value` is null or is an empty string.
 *
 * @param value - The string to check.
 * @returns `true` if the string is `null` or empty, `false` otherwise.
 * @public
 */
export function isEmptyString(value: string): boolean {
  return value == null || value === ''
}

/**
 * Convert first letter in `value` to lower case.
 *
 * @param value - The string to convert.
 * @returns The string with the first letter in lower case.
 * @public
 */
export function lowerCaseFirst(value: string): string {
  return value.substring(0, 1).toLowerCase() + value.substring(1)
}

/**
 * Returns a random substring from the `value` argument. The length of such value is by default `1`.
 *
 * @param value - The string to extract the random substring from.
 * @param length - The length of the random substring to extract.
 * @returns The random substring.
 * @public
 */
export function randomString(value: string, length = 1): string {
  return value.substring(
    Math.floor((value.length - length + 1) * Math.random()),
    length
  )
}

/**
 * Returns a random sampling of the specified length from the seed string.
 *
 * @param alphabet - The seed string to sample from.
 * @param length - The length of the random string to generate.
 * @returns The random string.
 * @public
 */
export function randomStringSequence(alphabet: string, length: number): string {
  return generateArray(length, () => randomString(alphabet)).join('')
}

/**
 * Like `randomSequence`, but automatically uses the base64 sequence as the seed string.
 *
 * @param length - The length of the random string to generate.
 * @returns The random string.
 * @public
 */
export function randomStringSequenceBase64(length: number): string {
  return randomStringSequence(BASE64_ALPHABET, length)
}

/**
 * It maps a string character by character using `callback`.
 *
 * @param callback - The function to apply to each character in the string.
 * @param value - The string to map.
 * @returns An array of the mapped characters.
 * @public
 */
export function mapChars<T>(callback: (c: string) => T, value: string): T[] {
  return stringToChars(value).map(callback)
}

/**
 * If present, it removes all the occurrences of `toremove` from `value`.
 *
 * @param value - The string to remove the occurrences from.
 * @param toremove - The string to remove from `value`.
 * @returns The string with all occurrences of `toremove` removed.
 * @public
 */
export function deleteSubstring(value: string, toremove: string): string {
  return replaceAll(value, toremove, '')
}

/**
 * If present, it removes the `toremove` text from the end of `value`.
 *
 * @param value - The string to remove the text from.
 * @param toremove - The text to remove from the end of `value`.
 * @returns The string with the text removed.
 * @public
 */
export function deleteStringAfter(value: string, toremove: string): string {
  return stringEndsWith(value, toremove)
    ? value.substring(0, value.length - toremove.length)
    : value
}

/**
 * Removes a slice from `index` to `index + length` from `value`.
 *
 * @param value - The string to remove the slice from.
 * @param index - The starting index of the slice to remove.
 * @param length - The length of the slice to remove.
 * @returns The string with the slice removed.
 * @public
 */
export function trimStringSlice(
  value: string,
  index: number,
  length: number
): string {
  return value.substring(0, index) + value.substring(index + length)
}

/**
 * If present, it removes the `toremove` text from the beginning of `value`.
 *
 * @param value - The string to remove the text from.
 * @param toremove - The text to remove from the beginning of `value`.
 * @returns The string with the text removed.
 * @public
 */
export function deleteStringBefore(value: string, toremove: string): string {
  return stringStartsWith(value, toremove)
    ? value.substring(toremove.length)
    : value
}

/**
 * If present, it removes the first occurrence of `toremove` from `value`.
 *
 * @param value - The string to remove the text from.
 * @param toremove - The text to remove from `value`.
 * @returns The string with the text removed.
 * @public
 */
export function deleteFirstFromString(value: string, toremove: string): string {
  const pos = value.indexOf(toremove)
  if (pos < 0) return value
  return value.substring(0, pos) + value.substring(pos + toremove.length)
}

/**
 * `repeatString` builds a new string by repeating the argument `s`, n `times`.
 *
 * @remarks
 * @example
 * ```ts
 * repeatString('Xy', 3) // generates 'XyXyXy'
 * ```
 *
 * @param s - The string to repeat.
 * @param times - The number of times to repeat the string.
 * @returns The repeated string.
 * @public
 */
export function repeatString(s: string, times: number): string {
  return createFilledArray(times, s).join('')
}

/**
 * Returns a new string whose characters are in reverse order.
 *
 * @param s - The string to reverse.
 * @returns The reversed string.
 * @public
 */
export function reverseString(s: string): string {
  const arr = stringToChars(s)
  arr.reverse()
  return arr.join('')
}

/**
 * Converts a string in a quoted string.
 *
 * @param s - The string to quote.
 * @param prefer - The preferred quote character. Defaults to single quote (`'`).
 * @returns The quoted string.
 * @public
 */
export function smartQuote(s: string, prefer = "'"): string {
  if (prefer === "'") {
    if (!s.includes("'")) return "'" + s + "'"
    else if (!s.includes('"')) return '"' + s + '"'
    else return "'" + replaceAll(s, "'", "\\'") + "'"
  } else {
    if (!s.includes('"')) return '"' + s + '"'
    else if (!s.includes("'")) return "'" + s + "'"
    else return '"' + replaceAll(s, '"', '\\"') + '"'
  }
}

/**
 * Returns a quoted version of the input string.
 *
 * @param s - The input string to be quoted.
 * @param quoteChar - The character used for quoting. Defaults to single quote (').
 * @returns The quoted string.
 * @public
 */
export function quote(s: string, quoteChar = "'"): string {
  return quoteChar + replaceAll(s, quoteChar, '\\' + quoteChar) + quoteChar
}

/**
 * Quotes a string for use in JavaScript code.
 * If the string contains a newline character, it will be quoted using backticks.
 * Otherwise, it will be quoted using single quotes (`'`) or double quotes (`"`) based on the `prefer` parameter.
 *
 * @param s - The string to be quoted.
 * @param prefer - The preferred quote character. Defaults to single quote (`'`).
 * @returns The quoted string.
 * @public
 */
export function jsQuote(s: string, prefer = "'"): string {
  if (s.indexOf('\n') >= 0) {
    return quote(s, '`')
  } else {
    return smartQuote(s, prefer)
  }
}

/**
 * It only splits on the first occurrance of separator.
 *
 * @param s - The string to split.
 * @param separator - The separator to split the string on.
 * @returns An array with the split string.
 * @public
 */
export function splitStringOnce(
  s: string,
  separator: string
): [string] | [string, string] {
  const pos = s.indexOf(separator)
  if (pos < 0) return [s]
  return [s.substring(0, pos), s.substring(pos + separator.length)]
}

/**
 * Returns `true` if `s` starts with any of the values in `values`.
 *
 * @param s - The string to compare.
 * @param values - The values to compare with the start of `s`.
 * @returns `true` if `s` starts with any of the values in `values`, `false` otherwise.
 * @public
 */
export function stringStartsWithAny(s: string, values: string[]): boolean {
  return anyElement(values, start => s.startsWith(start))
}

/**
 * Surrounds a string with the contents of `left` and `right`. If `right` is omitted,
 * `left` will be used on both sides
 *
 * @param s - The string to surround.
 * @param left - The left side of the surrounding text.
 * @param right - The right side of the surrounding text. Defaults to `left`.
 * @returns The surrounded string.
 * @public
 */
export function surroundString(s: string, left: string, right = left): string {
  return `${left}${s}${right}`
}

/**
 * It transforms a string into an `Array` of characters.
 *
 * @param s - The string to transform.
 * @returns An array of characters.
 * @public
 */
export function stringToChars(s: string): string[] {
  return s.split('')
}

/**
 * It transforms a string into an `Array` of char codes in integer format.
 *
 * @param s - The string to transform.
 * @returns An array of char codes.
 * @public
 */
export function stringToCharcodes(s: string): number[] {
  return generateArray(s.length, i => s.charCodeAt(i))
}

/**
 * Returns an array of `string` whose elements are equally long (using `len`). If the string `s`
 * is not exactly divisible by `len` the last element of the array will be shorter.
 *
 * @param s - The string to chunk.
 * @param len - The length of each chunk.
 * @returns An array of chunks.
 * @public
 */
export function chunkString(s: string, len: number): string[] {
  const chunks: string[] = []
  while (s.length > 0) {
    chunks.push(s.substring(0, len))
    s = s.substring(len, s.length - len)
  }
  return chunks
}

/**
 * Returns an array of `string` split by line breaks.
 *
 * @param s - The string to split.
 * @returns An array of lines.
 * @public
 */
export function textToLines(s: string): string[] {
  return s.split(SPLIT_LINES)
}

/**
 * `trimChars` removes from the beginning and the end of the string any character that is present in `charlist`.
 *
 * @param value - The string to trim.
 * @param charlist - The characters to remove from the beginning and end of the string.
 * @returns The trimmed string.
 * @public
 */
export function trimChars(value: string, charlist: string): string {
  return trimCharsRight(trimCharsLeft(value, charlist), charlist)
}

/**
 * `trimCharsLeft` removes from the beginning of the string any character that is present in `charlist`.
 *
 * @param value - The string to trim.
 * @param charlist - The characters to remove from the beginning of the string.
 * @returns The trimmed string.
 * @public
 */
export function trimCharsLeft(value: string, charlist: string): string {
  let pos = 0
  for (let i = 0; i < value.length; i++) {
    if (stringContains(charlist, value.charAt(i))) pos++
    else break
  }
  return value.substring(pos)
}

/**
 * `trimCharsRight` removes from the end of the string any character that is present in `charlist`.
 *
 * @param value - The string to trim.
 * @param charlist - The characters to remove from the end of the string.
 * @returns The trimmed string.
 * @public
 */
export function trimCharsRight(value: string, charlist: string): string {
  const len = value.length
  let pos = len
  let i
  for (let j = 0; j < len; j++) {
    i = len - j - 1
    if (stringContains(charlist, value.charAt(i))) pos = i
    else break
  }
  return value.substring(0, pos)
}

/**
 * `underscore` finds UpperCase characters and turns them into LowerCase and prepends them with a whtiespace.
 * Sequences of more than one UpperCase character are left untouched.
 *
 * @param s - The string to underscore.
 * @returns The underscored string.
 * @public
 */
export function underscore(s: string): string {
  s = s.replace(/::/g, '/')
  s = s.replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
  s = s.replace(/([a-z\d])([A-Z])/g, '$1_$2')
  s = s.replace(/-/g, '_')
  return s.toLowerCase()
}

/**
 * Convert first letter in `value` to upper case.
 *
 * @param value - The string to convert.
 * @returns The string with the first letter in upper case.
 * @public
 */
export function upperCaseFirst(value: string): string {
  return value.substring(0, 1).toUpperCase() + value.substring(1)
}

/**
 * `wrapColumns` splits a long string into lines that are at most `columns` long.
 * Individual words whose length exceeds `columns` are not split.
 *
 * @param s - The string to wrap.
 * @param columns - The number of columns per line.
 * @param indent - The indentation string to prepend to each line.
 * @param newline - The newline character to use for line breaks.
 * @returns The wrapped string.
 * @public
 */
export function wrapColumns(
  s: string,
  columns = 78,
  indent = '',
  newline = '\n'
): string {
  return s
    .split(SPLIT_LINES)
    .map(part =>
      wrapLine(part.replace(WSG, ' ').trim(), columns, indent, newline)
    )
    .join(newline)
}

/**
 * Checks if the character at the specified position in a string is a whitespace character.
 *
 * @param s - The input string.
 * @param pos - The position of the character to check.
 * @returns A boolean indicating whether the character at the specified position is a whitespace character.
 * @public
 */
export function isSpaceAt(s: string, pos: number): boolean {
  if (pos < 0 || pos >= s.length) return false
  const char = s.charCodeAt(pos)
  return (
    char === 9 ||
    char === 10 ||
    char === 11 ||
    char === 12 ||
    char === 13 ||
    char === 32
  )
}

/**
 * Encodes a string to base64.
 *
 * @param s - The string to encode.
 * @returns The base64 encoded string.
 * @throws Error if no implementation is found for base64 encoding.
 * @public
 */
export function encodeBase64(s: string): string {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(s).toString('base64')
  } else if (typeof btoa !== 'undefined') {
    return btoa(s)
  } else {
    throw new Error('no implementation found for base64 encoding')
  }
}

/**
 * Decodes a base64 encoded string.
 *
 * @param s - The base64 encoded string to decode.
 * @returns The decoded string.
 * @throws An error if no implementation is found for base64 decoding.
 * @public
 */
export function decodeBase64(s: string): string {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(s, 'base64').toString('utf8')
  } else if (typeof atob !== 'undefined') {
    return atob(s)
  } else {
    throw new Error('no implementation found for base64 decoding')
  }
}

/**
 * Wraps a string into multiple lines based on the specified number of columns,
 * indentation, and newline character.
 *
 * @param s - The string to wrap.
 * @param columns - The number of columns per line.
 * @param indent - The indentation string to prepend to each line.
 * @param newline - The newline character to use for line breaks.
 * @returns The wrapped string.
 * @public
 */
export function wrapLine(
  s: string,
  columns: number,
  indent: string,
  newline: string
): string {
  const parts: string[] = []
  const len = s.length
  const ilen = indent.length
  let pos = 0
  columns -= ilen

  while (true) {
    if (pos + columns >= len - ilen) {
      parts.push(s.substring(pos))
      break
    }

    let i = 0
    while (!isSpaceAt(s, pos + columns - i) && i < columns) i++
    if (i === columns) {
      // search ahead
      i = 0
      while (!isSpaceAt(s, pos + columns + i) && pos + columns + i < len) i++
      parts.push(s.substring(pos, pos + columns + i))
      pos += columns + i + 1
    } else {
      parts.push(s.substring(pos, pos + columns - i))
      pos += columns - i + 1
    }
  }

  return indent + parts.join(newline + indent)
}

/**
 * Pads a string on the left with a specified character until it reaches a specified length.
 * If the string is already longer than the specified length, it is returned as is.
 *
 * @param s - The string to pad.
 * @param char - The character to use for padding.
 * @param length - The desired length of the padded string.
 * @returns The padded string.
 * @public
 */
export function lpad(s: string, char: string, length: number): string {
  const diff = length - s.length
  if (diff > 0) {
    return repeatString(char, diff) + s
  } else {
    return s
  }
}

/**
 * Pads a string on the right with a specified character until it reaches a specified length.
 * If the string is already longer than the specified length, it is returned as is.
 *
 * @param s - The string to pad.
 * @param char - The character to use for padding.
 * @param length - The desired length of the padded string.
 * @returns The padded string.
 * @public
 */
export function rpad(s: string, char: string, length: number): string {
  const diff = length - s.length
  if (diff > 0) {
    return s + repeatString(char, diff)
  } else {
    return s
  }
}

/**
 * Splits a string into two parts at the last occurrence of a specified substring.
 * If the substring is found, the function returns an array with two elements:
 * the part of the string before the substring and the part after the substring.
 * If the substring is not found, the function returns an array with a single element,
 * which is the original string.
 *
 * @param s - The string to split.
 * @param find - The substring to search for.
 * @returns An array containing the split parts of the string.
 * @public
 */
export function splitStringOnLast(
  s: string,
  find: string
): [string] | [string, string] {
  const x = s.lastIndexOf(find)
  if (x >= 0) {
    return [s.substring(0, x), s.substring(x + find.length)]
  } else {
    return [s]
  }
}

/**
 * Splits a string into two parts based on the first occurrence of a specified substring.
 * If the substring is found, returns an array with two elements: the part of the string before the substring and the part after the substring.
 * If the substring is not found, returns an array with a single element: the original string.
 *
 * @param s - The string to split.
 * @param find - The substring to search for.
 * @returns An array containing the split parts of the string.
 * @public
 */
export function splitStringOnFirst(
  s: string,
  find: string
): [string] | [string, string] {
  const x = s.indexOf(find)
  if (x >= 0) {
    return [s.substring(0, x), s.substring(x + find.length)]
  } else {
    return [s]
  }
}

const BASE64_ALPHABET =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
const UCWORDS = /[^a-zA-Z]([a-z])/g
const IS_BREAKINGWHITESPACE = /[^\t\n\r ]/
const IS_ALPHA = /[^a-zA-Z]/
const UCWORDSWS = /[ \t\r\n][a-z]/g
const ALPHANUM = /^[a-z0-9]+$/i
const DIGITS = /^[0-9]+$/
const WSG = /[ \t\r\n]+/g
const SPLIT_LINES = /\r\n|\n\r|\n|\r/g
const CANONICALIZE_LINES = /\r\n|\n\r|\r/g
