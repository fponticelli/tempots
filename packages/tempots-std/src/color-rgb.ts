/**
 * RGB and Hex color parsing, validation, and serialization.
 *
 * @public
 */

import { ParsingError } from './error'
import { clampInt, toHex } from './number'
import { type RGB8A, type RGBA, rgb8a, parseAlpha } from './color'
import { NAMED_COLORS } from './color-named'

// ---------------------------------------------------------------------------
// Regex patterns
// ---------------------------------------------------------------------------

const HEX_RE = /^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i

// Integer values: rgb(255, 0, 0) or rgba(255, 0, 0, 0.5)
const RGB_LEGACY_RE =
  /^rgba?\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*(?:,\s*([\d.]+%?)\s*)?\)$/i

// Integer values: rgb(255 0 0) or rgb(255 0 0 / 0.5)
const RGB_MODERN_RE =
  /^rgba?\(\s*(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)\s*(?:\/\s*([\d.]+%?)\s*)?\)$/i

// Percentage values: rgb(100%, 0%, 0%) or rgba(100%, 0%, 0%, 0.5)
const RGB_PCT_LEGACY_RE =
  /^rgba?\(\s*(\d+(?:\.\d+)?)%\s*,\s*(\d+(?:\.\d+)?)%\s*,\s*(\d+(?:\.\d+)?)%\s*(?:,\s*([\d.]+%?)\s*)?\)$/i

// Percentage values: rgb(100% 0% 0%) or rgb(100% 0% 0% / 0.5)
const RGB_PCT_MODERN_RE =
  /^rgba?\(\s*(\d+(?:\.\d+)?)%\s+(\d+(?:\.\d+)?)%\s+(\d+(?:\.\d+)?)%\s*(?:\/\s*([\d.]+%?)\s*)?\)$/i

// ---------------------------------------------------------------------------
// Hex
// ---------------------------------------------------------------------------

/**
 * Returns `true` if the string can be parsed as a hex color.
 *
 * @param s - The string to test.
 * @returns `true` if the string is a valid hex color.
 * @public
 * @example
 * ```ts
 * canParseHex('#ff0000') // true
 * canParseHex('#f00') // true
 * canParseHex('red') // false
 * ```
 */
export const canParseHex = (s: string): boolean => HEX_RE.test(s.trim())

/**
 * Parses a hex color string into an RGB8A color.
 *
 * Supports `#RGB`, `#RGBA`, `#RRGGBB`, and `#RRGGBBAA` formats.
 *
 * @param s - The hex string to parse.
 * @returns An RGB8A color.
 * @throws ParsingError if the string is not a valid hex color.
 * @public
 * @example
 * ```ts
 * parseHex('#ff0000') // rgb8a(255, 0, 0)
 * parseHex('#f00') // rgb8a(255, 0, 0)
 * parseHex('#ff000080') // rgb8a(255, 0, 0, ~0.502)
 * ```
 */
export const parseHex = (s: string): RGB8A => {
  const trimmed = s.trim()
  const m = HEX_RE.exec(trimmed)
  if (!m) throw new ParsingError(`Invalid hex color: '${s}'`)
  const hex = m[1]
  if (hex.length === 3) {
    return rgb8a(
      parseInt(hex[0] + hex[0], 16),
      parseInt(hex[1] + hex[1], 16),
      parseInt(hex[2] + hex[2], 16)
    )
  }
  if (hex.length === 4) {
    return rgb8a(
      parseInt(hex[0] + hex[0], 16),
      parseInt(hex[1] + hex[1], 16),
      parseInt(hex[2] + hex[2], 16),
      parseInt(hex[3] + hex[3], 16) / 255
    )
  }
  if (hex.length === 6) {
    return rgb8a(
      parseInt(hex.slice(0, 2), 16),
      parseInt(hex.slice(2, 4), 16),
      parseInt(hex.slice(4, 6), 16)
    )
  }
  // length === 8
  return rgb8a(
    parseInt(hex.slice(0, 2), 16),
    parseInt(hex.slice(2, 4), 16),
    parseInt(hex.slice(4, 6), 16),
    parseInt(hex.slice(6, 8), 16) / 255
  )
}

// ---------------------------------------------------------------------------
// rgb() / rgba()
// ---------------------------------------------------------------------------

/**
 * Returns `true` if the string can be parsed as an `rgb()` or `rgba()` color.
 *
 * @param s - The string to test.
 * @returns `true` if the string is a valid RGB functional notation.
 * @public
 * @example
 * ```ts
 * canParseRgb('rgb(255, 0, 0)') // true
 * canParseRgb('rgb(255 0 0 / 0.5)') // true
 * canParseRgb('rgb(100% 0% 0%)') // true
 * canParseRgb('#ff0000') // false
 * ```
 */
export const canParseRgb = (s: string): boolean => {
  const trimmed = s.trim()
  return (
    RGB_LEGACY_RE.test(trimmed) ||
    RGB_MODERN_RE.test(trimmed) ||
    RGB_PCT_LEGACY_RE.test(trimmed) ||
    RGB_PCT_MODERN_RE.test(trimmed)
  )
}

/**
 * Parses an `rgb()` or `rgba()` color string into an RGB8A color.
 *
 * Supports integer values (0–255), percentage values (0%–100%), both
 * legacy comma-separated and modern space-separated syntax.
 *
 * @param s - The string to parse.
 * @returns An RGB8A color.
 * @throws ParsingError if the string is not a valid RGB color.
 * @public
 * @example
 * ```ts
 * parseRgb('rgb(255, 0, 0)') // rgb8a(255, 0, 0)
 * parseRgb('rgb(255 0 0 / 50%)') // rgb8a(255, 0, 0, 0.5)
 * parseRgb('rgb(100% 0% 0%)') // rgb8a(255, 0, 0)
 * ```
 */
export const parseRgb = (s: string): RGB8A => {
  const trimmed = s.trim()

  // Try integer patterns first
  const m = RGB_LEGACY_RE.exec(trimmed) ?? RGB_MODERN_RE.exec(trimmed)
  if (m) {
    return rgb8a(
      clampInt(parseFloat(m[1]), 0, 255),
      clampInt(parseFloat(m[2]), 0, 255),
      clampInt(parseFloat(m[3]), 0, 255),
      parseAlpha(m[4])
    )
  }

  // Try percentage patterns
  const mp = RGB_PCT_LEGACY_RE.exec(trimmed) ?? RGB_PCT_MODERN_RE.exec(trimmed)
  if (mp) {
    return rgb8a(
      Math.round((parseFloat(mp[1]) / 100) * 255),
      Math.round((parseFloat(mp[2]) / 100) * 255),
      Math.round((parseFloat(mp[3]) / 100) * 255),
      parseAlpha(mp[4])
    )
  }

  throw new ParsingError(`Invalid rgb color: '${s}'`)
}

// ---------------------------------------------------------------------------
// Named colors
// ---------------------------------------------------------------------------

/**
 * Returns `true` if the string is a recognized CSS named color.
 *
 * @param s - The string to test (case-insensitive).
 * @returns `true` if the string is a named color.
 * @public
 * @example
 * ```ts
 * canParseNamedColor('red') // true
 * canParseNamedColor('Red') // true
 * canParseNamedColor('notacolor') // false
 * ```
 */
export const canParseNamedColor = (s: string): boolean =>
  s.trim().toLowerCase() in NAMED_COLORS

/**
 * Parses a CSS named color string into an RGB8A color.
 *
 * @param s - The named color string (case-insensitive).
 * @returns An RGB8A color.
 * @throws ParsingError if the string is not a recognized named color.
 * @public
 * @example
 * ```ts
 * parseNamedColor('red') // rgb8a(255, 0, 0)
 * parseNamedColor('cornflowerblue') // rgb8a(100, 149, 237)
 * ```
 */
export const parseNamedColor = (s: string): RGB8A => {
  const key = s.trim().toLowerCase()
  const rgb = NAMED_COLORS[key]
  if (!rgb) throw new ParsingError(`Unknown named color: '${s}'`)
  return rgb8a(rgb[0], rgb[1], rgb[2])
}

// ---------------------------------------------------------------------------
// Serialization
// ---------------------------------------------------------------------------

/**
 * Serializes an RGB8A color to a hex string.
 *
 * Produces `#rrggbb` when alpha is 1, or `#rrggbbaa` otherwise.
 *
 * @param c - The RGB8A color to serialize.
 * @returns A hex color string.
 * @public
 * @example
 * ```ts
 * rgb8aToHexString(rgb8a(255, 0, 0)) // '#ff0000'
 * rgb8aToHexString(rgb8a(255, 0, 0, 0.5)) // '#ff000080'
 * ```
 */
export const rgb8aToHexString = (c: RGB8A): string => {
  const hex = '#' + toHex(c.r, 2) + toHex(c.g, 2) + toHex(c.b, 2)
  if (c.alpha >= 1) return hex
  return hex + toHex(Math.round(c.alpha * 255), 2)
}

/**
 * Serializes an RGB8A color to an `rgb()` or `rgba()` CSS string.
 *
 * @param c - The RGB8A color to serialize.
 * @returns A CSS color string.
 * @public
 * @example
 * ```ts
 * rgb8aToRgbString(rgb8a(255, 0, 0)) // 'rgb(255 0 0)'
 * rgb8aToRgbString(rgb8a(255, 0, 0, 0.5)) // 'rgb(255 0 0 / 0.5)'
 * ```
 */
export const rgb8aToRgbString = (c: RGB8A): string => {
  if (c.alpha >= 1) return `rgb(${c.r} ${c.g} ${c.b})`
  return `rgb(${c.r} ${c.g} ${c.b} / ${c.alpha})`
}

/**
 * Serializes an RGBA color (0–1) to an `rgb()` CSS string using
 * percentage values.
 *
 * @param c - The RGBA color to serialize.
 * @returns A CSS color string.
 * @public
 * @example
 * ```ts
 * rgbaToRgbString(rgba(1, 0, 0)) // 'rgb(100% 0% 0%)'
 * rgbaToRgbString(rgba(1, 0, 0, 0.5)) // 'rgb(100% 0% 0% / 0.5)'
 * ```
 */
export const rgbaToRgbString = (c: RGBA): string => {
  const r = round2(c.r * 100)
  const g = round2(c.g * 100)
  const b = round2(c.b * 100)
  if (c.alpha >= 1) return `rgb(${r}% ${g}% ${b}%)`
  return `rgb(${r}% ${g}% ${b}% / ${c.alpha})`
}

const round2 = (v: number): number => Math.round(v * 100) / 100
