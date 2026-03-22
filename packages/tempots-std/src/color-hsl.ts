/**
 * HSL color parsing, conversion, and serialization.
 *
 * @public
 */

import { ParsingError } from './error'
import { clamp, wrapCircular } from './number'
import { type RGB8A, type HSLA, rgb8a, hsla, parseAlpha } from './color'

// ---------------------------------------------------------------------------
// Regex patterns
// ---------------------------------------------------------------------------

const HSL_LEGACY_RE =
  /^hsla?\(\s*(-?\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)%\s*,\s*(\d+(?:\.\d+)?)%\s*(?:,\s*([\d.]+%?)\s*)?\)$/i

const HSL_MODERN_RE =
  /^hsla?\(\s*(-?\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)%\s+(\d+(?:\.\d+)?)%\s*(?:\/\s*([\d.]+%?)\s*)?\)$/i

// ---------------------------------------------------------------------------
// Parsing
// ---------------------------------------------------------------------------

/**
 * Returns `true` if the string can be parsed as an `hsl()` or `hsla()` color.
 *
 * Supports both legacy comma-separated and modern space-separated syntax.
 *
 * @param s - The string to test.
 * @returns `true` if the string is a valid HSL functional notation.
 * @public
 * @example
 * ```ts
 * canParseHsl('hsl(0, 100%, 50%)') // true
 * canParseHsl('hsl(120 50% 50% / 0.5)') // true
 * canParseHsl('#ff0000') // false
 * ```
 */
export const canParseHsl = (s: string): boolean => {
  const trimmed = s.trim()
  return HSL_LEGACY_RE.test(trimmed) || HSL_MODERN_RE.test(trimmed)
}

/**
 * Parses an `hsl()` or `hsla()` color string into an HSLA color.
 *
 * Supports both legacy comma-separated and modern space-separated syntax.
 *
 * @param s - The string to parse.
 * @returns An HSLA color.
 * @throws ParsingError if the string is not a valid HSL color.
 * @public
 * @example
 * ```ts
 * parseHsl('hsl(0, 100%, 50%)') // hsla(0, 1, 0.5)
 * parseHsl('hsla(120, 50%, 75%, 0.8)') // hsla(120, 0.5, 0.75, 0.8)
 * parseHsl('hsl(240 100% 50% / 50%)') // hsla(240, 1, 0.5, 0.5)
 * ```
 */
export const parseHsl = (s: string): HSLA => {
  const trimmed = s.trim()
  const m = HSL_LEGACY_RE.exec(trimmed) ?? HSL_MODERN_RE.exec(trimmed)
  if (!m) throw new ParsingError(`Invalid hsl color: '${s}'`)
  return hsla(
    parseFloat(m[1]),
    clamp(parseFloat(m[2]) / 100, 0, 1),
    clamp(parseFloat(m[3]) / 100, 0, 1),
    parseAlpha(m[4])
  )
}

// ---------------------------------------------------------------------------
// Conversion: RGB8A -> HSLA
// ---------------------------------------------------------------------------

/**
 * Converts an RGB8A color to an HSLA color using the standard min/max/delta
 * algorithm.
 *
 * @param c - The RGB8A color to convert.
 * @returns The equivalent HSLA color.
 * @public
 * @example
 * ```ts
 * rgb8aToHsla(rgb8a(255, 0, 0)) // hsla(0, 1, 0.5)
 * rgb8aToHsla(rgb8a(0, 128, 0)) // hsla(120, 1, ~0.251)
 * rgb8aToHsla(rgb8a(0, 0, 0)) // hsla(0, 0, 0)
 * ```
 */
export const rgb8aToHsla = (c: RGB8A): HSLA => {
  const rn = c.r / 255
  const gn = c.g / 255
  const bn = c.b / 255

  const max = Math.max(rn, gn, bn)
  const min = Math.min(rn, gn, bn)
  const delta = max - min

  const l = (max + min) / 2

  if (delta === 0) {
    return hsla(0, 0, l, c.alpha)
  }

  const s = delta / (1 - Math.abs(2 * l - 1))

  let h: number
  if (max === rn) {
    h = ((gn - bn) / delta) % 6
  } else if (max === gn) {
    h = (bn - rn) / delta + 2
  } else {
    h = (rn - gn) / delta + 4
  }

  h *= 60
  if (h < 0) h += 360

  return hsla(h, s, l, c.alpha)
}

// ---------------------------------------------------------------------------
// Conversion: HSLA -> RGB8A
// ---------------------------------------------------------------------------

/**
 * Converts an HSLA color to an RGB8A color using sector-based hue-to-RGB
 * conversion.
 *
 * @param c - The HSLA color to convert.
 * @returns The equivalent RGB8A color.
 * @public
 * @example
 * ```ts
 * hslaToRgb8a(hsla(0, 1, 0.5)) // rgb8a(255, 0, 0)
 * hslaToRgb8a(hsla(120, 1, 0.5)) // rgb8a(0, 255, 0)
 * hslaToRgb8a(hsla(240, 1, 0.5)) // rgb8a(0, 0, 255)
 * ```
 */
export const hslaToRgb8a = (c: HSLA): RGB8A => {
  const s = c.s
  const l = c.l
  const h = wrapCircular(c.h, 360)

  const ch = (1 - Math.abs(2 * l - 1)) * s
  const x = ch * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = l - ch / 2

  let r1: number
  let g1: number
  let b1: number

  if (h < 60) {
    r1 = ch
    g1 = x
    b1 = 0
  } else if (h < 120) {
    r1 = x
    g1 = ch
    b1 = 0
  } else if (h < 180) {
    r1 = 0
    g1 = ch
    b1 = x
  } else if (h < 240) {
    r1 = 0
    g1 = x
    b1 = ch
  } else if (h < 300) {
    r1 = x
    g1 = 0
    b1 = ch
  } else {
    r1 = ch
    g1 = 0
    b1 = x
  }

  return rgb8a(
    Math.round((r1 + m) * 255),
    Math.round((g1 + m) * 255),
    Math.round((b1 + m) * 255),
    c.alpha
  )
}

// ---------------------------------------------------------------------------
// Serialization
// ---------------------------------------------------------------------------

/**
 * Serializes an HSLA color to an `hsl()` or `hsla()` CSS string.
 *
 * Produces `hsl(h, s%, l%)` when alpha is 1, or `hsla(h, s%, l%, alpha)`
 * otherwise. Hue, saturation, and lightness are rounded to two decimal
 * places for readability.
 *
 * @param c - The HSLA color to serialize.
 * @returns A CSS color string.
 * @public
 * @example
 * ```ts
 * hslaToHslString(hsla(0, 1, 0.5)) // 'hsl(0, 100%, 50%)'
 * hslaToHslString(hsla(120, 0.5, 0.75, 0.5)) // 'hsla(120, 50%, 75%, 0.5)'
 * ```
 */
export const hslaToHslString = (c: HSLA): string => {
  const h = round2(c.h)
  const s = round2(c.s * 100)
  const l = round2(c.l * 100)
  if (c.alpha >= 1) return `hsl(${h}, ${s}%, ${l}%)`
  return `hsla(${h}, ${s}%, ${l}%, ${c.alpha})`
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

const round2 = (v: number): number => Math.round(v * 100) / 100
