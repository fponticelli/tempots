/**
 * Utility functions to manipulate string values.
 */

import { range, any, all, fill } from './array'
import { map as mapR } from './regexp'

/**
 * Replaces all occurrances of `placeholder` in `subject` with the value `replacement`.
 * @param subject
 * @param placeholder
 * @param replacement
 */
export function replace(
  subject: string,
  placeholder: string,
  replacement: string
): string {
  return subject.split(placeholder).join(replacement)
}

/**
 * `after` searches for the first occurrance of `searchFor` and returns the text after that.
 * If `searchFor` is not found, an empty string is returned.
 */
export function after(value: string, searchFor: string): string {
  const pos = value.indexOf(searchFor)
  if (pos < 0) return ''
  else return value.substring(pos + searchFor.length)
}

/**
 * `afterLast` searches for the last occurrance of `searchFor` and returns the text after that.
 * If `searchFor` is not found, an empty string is returned.
 */
export function afterLast(value: string, searchFor: string): string {
  const pos = value.lastIndexOf(searchFor)
  if (pos < 0) return ''
  else return value.substring(pos + searchFor.length)
}

/**
 * `before` searches for the first occurrance of `searchFor` and returns the text before that.
 * If `searchFor` is not found, an empty string is returned.
 */
export function before(value: string, searchFor: string): string {
  const pos = value.indexOf(searchFor)
  if (pos < 0) return ''
  else return value.substring(0, pos)
}

/**
 * `beforeLast` searches for the last occurrance of `searchFor` and returns the text before that.
 * If `searchFor` is not found, an empty string is returned.
 */
export function beforeLast(value: string, searchFor: string): string {
  const pos = value.lastIndexOf(searchFor)
  if (pos < 0) return ''
  else return value.substring(0, pos)
}

/**
 * `capitalize` returns a string with the first character convert to upper case.
 */
export function capitalize(s: string): string {
  return s.substring(0, 1).toUpperCase() + s.substring(1)
}

const upperMatch = (s: string): string => s.toUpperCase()

/**
 * Capitalize the first letter of every word in `value`. If `whiteSpaceOnly` is set to `true`
 * the process is limited to whitespace separated words.
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
 */
export function canonicalizeNewlines(value: string): string {
  return value.replace(CANONICALIZE_LINES, '\n')
}

/**
 * Compares two strings ignoring their case.
 */
export function compareCaseInsensitive(a: string, b: string): number {
  if (a == null && b == null) return 0
  if (a == null) return -1
  else if (b == null) return 1
  return compare(a.toLowerCase(), b.toLowerCase())
}

export function endsWith(s: string, end: string): boolean {
  return s.substring(0, s.length - end.length) === end
}

export function endsWithCaseInsensitive(s: string, end: string): boolean {
  return (
    s.substring(0, s.length - end.length).toLowerCase() === end.toLowerCase()
  )
}

export function startsWith(s: string, start: string): boolean {
  return s.substring(0, start.length) === start
}

export function startsWithCaseInsensitive(s: string, start: string): boolean {
  return s.substring(0, start.length).toLowerCase() === start.toLowerCase()
}

/**
 * Compares a string `s` with many `values` and see if one of them matches its end ignoring their case.
 */
export function endsWithAnyCaseInsensitive(
  s: string,
  values: string[]
): boolean {
  return endsWithAny(
    s.toLowerCase(),
    values.map(v => v.toLowerCase())
  )
}

/**
 * Compares a string `s` with many `values` and see if one of them matches its beginning ignoring their case.
 */
export function startsWithAnyCaseInsensitive(
  s: string,
  values: string[]
): boolean {
  return startsWithAny(
    s.toLowerCase(),
    values.map(v => v.toLowerCase())
  )
}

/**
 * It cleans up all the whitespaces in the passed `value`. `collapse` does the following:
 * - remove trailing/leading whitespaces
 * - within the string, it collapses seqeunces of whitespaces into a single space character
 * For whitespaces in this description, it is intended to be anything that is matched by the regular expression `\s`.
 */
export function collapse(value: string): string {
  return value.trim().replace(WSG, ' ')
}

/**
 * It compares to string and it returns a negative number if `a` is inferior to `b`, zero if they are the same,
 * or otherwise a positive non-sero number.
 */
export function compare(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0
}

/**
 * `contains` returns `true` if `s` contains one or more occurrences of `test` regardless of the text case.
 */
export function containsCaseInsensitive(s: string, test: string): boolean {
  return s.toLowerCase().includes(test.toLowerCase())
}

/**
 * `contains` returns `true` if `s` contains one or more occurrences of `test`.
 */
export function contains(s: string, test: string): boolean {
  return s.includes(test)
}

/**
 * Return the number of occurances of `test` in `s`.
 */
export function count(s: string, test: string): number {
  return s.split(test).length - 1
}

/**
 * `contains` returns `true` if `s` contains any of the strings in `tests` regardless of the text case
 */
export function containsAnyCaseInsensitive(
  s: string,
  tests: string[]
): boolean {
  return any(tests, t => containsCaseInsensitive(s, t))
}

/**
 * `contains` returns `true` if `s` contains any of the strings in `tests`
 */
export function containsAny(s: string, tests: string[]): boolean {
  return any(tests, t => contains(s, t))
}

/**
 * `contains` returns `true` if `s` contains all of the strings in `tests` regardless of the text case
 */
export function containsAllCaseInsensitive(
  s: string,
  tests: string[]
): boolean {
  return all(tests, t => containsCaseInsensitive(s, t))
}

/**
 * `contains` returns `true` if `s` contains all of the strings in `tests`
 */
export function containsAll(s: string, tests: string[]): boolean {
  return all(tests, t => contains(s, t))
}

/**
 * `dasherize` replaces all the occurrances of `_` with `-`
 */
export function dasherize(s: string): string {
  return s.replace('_', '-')
}

/**
 * Compares strings `a` and `b` and returns the position where they differ.
 * ```ts
 * diffIndex('abcdef', 'abc123') // returns 3
 * ```
 */
export function diffIndex(a: string, b: string): number {
  const min = Math.min(a.length, b.length)
  for (let i = 0; i < min; i++) {
    if (a.substring(i, i + 1) !== b.substring(i, i + 1)) return i
  }
  return min
}

/**
 * `ellipsis` truncates `s` at len `maxlen` replaces the last characters with the content
 * of `symbol`.
 * ```ts
 * ellipsis('tempo is a nice library', 9) // returns 'tempo is …'
 * ```
 */
export function ellipsis(s: string, maxlen = 20, symbol = '…'): string {
  const sl = s.length
  const symboll = symbol.length
  if (sl > maxlen) {
    if (maxlen < symboll) {
      return symbol.substr(symboll - maxlen, maxlen)
    } else {
      return s.substr(0, maxlen - symboll) + symbol
    }
  } else return s
}

/**
 * Same as `ellipsis` but puts the symbol in the middle of the string and not to the end.
 * ```ts
 * ellipsisMiddle('tempo is a nice library', 18) // returns 'tempo is … library'
 * ```
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
    return s.substr(0, hll) + symbol + s.substr(sl - hlr, hlr)
  } else return s
}

/**
 * Returns `true` if `s` ends with any of the values in `values`.
 */
export function endsWithAny(s: string, values: string[]): boolean {
  return any(values, end => endsWith(s, end))
}

/**
 * `filter` applies `predicate` character by character to `s` and it returns a filtered
 * version of the string.
 */
export function filter(s: string, predicate: (s: string) => boolean): string {
  return toArray(s).filter(predicate).join('')
}

/**
 * Same as `filter` but `predicate` operates on integer char codes instead of string characters.
 */
export function filterCharcode(
  s: string,
  predicate: (n: number) => boolean
): string {
  const codes: number[] = toCharcodes(s).filter(predicate)
  return codes.map((i: number) => String.fromCharCode(i)).join('')
}

/**
 * `from` searches for the first occurrance of `searchFor` and returns the text from that point on.
 * If `searchFor` is not found, an empty string is returned.
 */
export function from(value: string, searchFor: string): string {
  const pos = value.indexOf(searchFor)
  if (pos < 0) return ''
  else return value.substring(pos)
}

export function hashCode(value: string, seed = 0x811c9dc5): number {
  let hval = seed
  for (let i = 0, l = value.length; i < l; i++) {
    hval ^= value.charCodeAt(i)
    hval += (hval << 1) + (hval << 4) + (hval << 7) + (hval << 8) + (hval << 24)
  }
  return hval >>> 0
}

/**
 * Returns `true` if `value` is not `null` and contains at least one character.
 */
export function hasContent(value: string): boolean {
  return value != null && value.length > 0
}

/**
 * Works the same as `underscore` but also replaces underscores with whitespaces.
 */
export function humanize(s: string): string {
  return replace(underscore(s), '_', ' ')
}

/**
 * Checks if `s` contains only (and at least one) alphabetical characters.
 */
export function isAlpha(s: string): boolean {
  return s.length > 0 && !IS_ALPHA.test(s)
}

/**
 * `isAlphaNum` returns `true` if the string only contains alpha-numeric characters.
 */
export function isAlphaNum(value: string): boolean {
  return ALPHANUM.test(value)
}

export function isBreakingWhitespace(value: string): boolean {
  return !IS_BREAKINGWHITESPACE.test(value)
}

/**
 * Returns `true` if the value string is composed of only lower cased characters
 * or case neutral characters.
 */
export function isLowerCase(value: string): boolean {
  return value.toLowerCase() === value
}

/**
 * Returns `true` if the value string is composed of only upper cased characters
 * or case neutral characters.
 */
export function isUpperCase(value: string): boolean {
  return value.toUpperCase() === value
}

/**
 * `ifEmpty` returns `value` if it is neither `null` or empty, otherwise it returns `alt`
 */
export function ifEmpty(value: string, alt: string): string {
  return value != null && value !== '' ? value : alt
}

/**
 * `isDigitsOnly` returns `true` if the string only contains digits.
 */
export function isDigitsOnly(value: string): boolean {
  return DIGITS.test(value)
}

/**
 * `isEmpty` returns true if either `value` is null or is an empty string.
 */
export function isEmpty(value: string): boolean {
  return value == null || value === ''
}

/**
 * Convert first letter in `value` to lower case.
 */
export function lowerCaseFirst(value: string): string {
  return value.substring(0, 1).toLowerCase() + value.substring(1)
}

/**
 * Returns a random substring from the `value` argument. The length of such value is by default `1`.
 */
export function random(value: string, length = 1): string {
  return value.substring(
    Math.floor((value.length - length + 1) * Math.random()),
    length
  )
}

/**
 * Returns a random sampling of the specified length from the seed string.
 */
export function randomSequence(alphabet: string, length: number): string {
  return range(length, () => random(alphabet)).join('')
}

/**
 * Like `randomSequence`, but automatically uses the base64 sequence as the seed string.
 */
export function randomSequence64(length: number): string {
  return randomSequence(BASE64_ALPHABET, length)
}

/**
 * It maps a string character by character using `callback`.
 */
export function map<T>(callback: (c: string) => T, value: string): T[] {
  return toArray(value).map(callback)
}

/**
 * If present, it removes all the occurrences of `toremove` from `value`.
 */
export function remove(value: string, toremove: string): string {
  return replace(value, toremove, '')
}

/**
 * If present, it removes the `toremove` text from the end of `value`.
 */
export function removeAfter(value: string, toremove: string): string {
  return endsWith(value, toremove)
    ? value.substring(0, value.length - toremove.length)
    : value
}

/**
 * Removes a slice from `index` to `index + length` from `value`.
 */
export function removeAt(value: string, index: number, length: number): string {
  return value.substring(0, index) + value.substring(index + length)
}

/**
 * If present, it removes the `toremove` text from the beginning of `value`.
 */
export function removeBefore(value: string, toremove: string): string {
  return startsWith(value, toremove) ? value.substring(toremove.length) : value
}

/**
 * If present, it removes the first occurrence of `toremove` from `value`.
 */
export function removeOne(value: string, toremove: string): string {
  const pos = value.indexOf(toremove)
  if (pos < 0) return value
  return value.substring(0, pos) + value.substring(pos + toremove.length)
}

/**
 * `repeat` builds a new string by repeating the argument `s`, n `times`.
 * ```ts
 * repeat('Xy', 3) // generates 'XyXyXy'
 * ```
 */
export function repeat(s: string, times: number): string {
  return fill(times, s).join('')
}

/**
 * Returns a new string whose characters are in reverse order.
 */
export function reverse(s: string): string {
  const arr = toArray(s)
  arr.reverse()
  return arr.join('')
}

/**
 * Converts a string in a quoted string.
 */
export function quote(s: string): string {
  if (!s.includes('"')) return '"' + s + '"'
  else if (!s.includes("'")) return "'" + s + "'"
  else return '"' + replace(s, '"', '\\"') + '"'
}

/**
 * It only splits on the first occurrance of separator.
 */
export function splitOnce(
  s: string,
  separator: string
): [string] | [string, string] {
  const pos = s.indexOf(separator)
  if (pos < 0) return [s]
  return [s.substring(0, pos), s.substring(pos + separator.length)]
}

/**
 * Returns `true` if `s` starts with any of the values in `values`.
 */
export function startsWithAny(s: string, values: string[]): boolean {
  return any(values, start => s.startsWith(start))
}

/**
 * `stripTags` removes any HTML/XML markup from the string leaving only the concatenation
 * of the existing text nodes.
 */
export function stripTags(s: string): string {
  return s.replace(STRIPTAGS, '')
}

/**
 * Surrounds a string with the contents of `left` and `right`. If `right` is omitted,
 * `left` will be used on both sides
 */
export function surround(s: string, left: string, right = left): string {
  return `${left}${s}${right}`
}

/**
 * It transforms a string into an `Array` of characters.
 */
export function toArray(s: string): string[] {
  return s.split('')
}

/**
 * It transforms a string into an `Array` of char codes in integer format.
 */
export function toCharcodes(s: string): number[] {
  return range(s.length, i => s.charCodeAt(i))
}

/**
 * Returns an array of `string` whose elements are equally long (using `len`). If the string `s`
 * is not exactly divisible by `len` the last element of the array will be shorter.
 */
export function toChunks(s: string, len: number): string[] {
  const chunks: string[] = []
  while (s.length > 0) {
    chunks.push(s.substring(0, len))
    s = s.substr(len, s.length - len)
  }
  return chunks
}

/**
 * Returns an array of `string` split by line breaks.
 */
export function toLines(s: string): string[] {
  return s.split(SPLIT_LINES)
}

/**
 * `trimChars` removes from the beginning and the end of the string any character that is present in `charlist`.
 */
export function trimChars(value: string, charlist: string): string {
  return trimCharsRight(trimCharsLeft(value, charlist), charlist)
}

/**
 * `trimCharsLeft` removes from the beginning of the string any character that is present in `charlist`.
 */
export function trimCharsLeft(value: string, charlist: string): string {
  let pos = 0
  for (let i = 0; i < value.length; i++) {
    if (contains(charlist, value.charAt(i))) pos++
    else break
  }
  return value.substring(pos)
}

/**
 * `trimCharsRight` removes from the end of the string any character that is present in `charlist`.
 */
export function trimCharsRight(value: string, charlist: string): string {
  const len = value.length
  let pos = len
  let i
  for (let j = 0; j < len; j++) {
    i = len - j - 1
    if (contains(charlist, value.charAt(i))) pos = i
    else break
  }
  return value.substring(0, pos)
}

/**
 * `underscore` finds UpperCase characters and turns them into LowerCase and prepends them with a whtiespace.
 * Sequences of more than one UpperCase character are left untouched.
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
 */
export function upperCaseFirst(value: string): string {
  return value.substring(0, 1).toUpperCase() + value.substring(1)
}

/**
 * `upTo` searches for the first occurrance of `searchFor` and returns the text up to that point.
 * If `searchFor` is not found, the entire string is returned.
 */
export function upTo(value: string, searchFor: string): string {
  const pos = value.indexOf(searchFor)
  if (pos < 0) return value
  else return value.substring(0, pos)
}

/**
 * `wrapColumns` splits a long string into lines that are at most `columns` long.
 * Words whose length exceeds `columns` are not split.
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

export function encodeBase64(s: string): string {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(s).toString('base64')
  } else if (typeof btoa !== 'undefined') {
    return btoa(s)
  } else {
    throw new Error('no implementation provided for base64 encoding')
  }
}

export function decodeBase64(s: string): string {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(s, 'base64').toString('utf8')
  } else if (typeof atob !== 'undefined') {
    return atob(s)
  } else {
    throw new Error('no implementation provided for base64 decoding')
  }
}

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

export function lpad(s: string, char: string, length: number): string {
  const diff = length - s.length
  if (diff > 0) {
    return repeat(char, diff) + s
  } else {
    return s
  }
}

export function rpad(s: string, char: string, length: number): string {
  const diff = length - s.length
  if (diff > 0) {
    return s + repeat(char, diff)
  } else {
    return s
  }
}

export function splitOnLast(
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

export function splitOnFirst(
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
const STRIPTAGS = /<\/?[a-z]+[^>]*>/gi
const WSG = /[ \t\r\n]+/g
const SPLIT_LINES = /\r\n|\n\r|\n|\r/g
const CANONICALIZE_LINES = /\r\n|\n\r|\r/g
