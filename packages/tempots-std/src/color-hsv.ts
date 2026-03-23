/**
 * HSV color parsing, conversion, and serialization.
 *
 * HSV (Hue, Saturation, Value) is a non-standard CSS color space commonly
 * used in design tools such as Figma, Sketch, and Adobe products.
 *
 * @public
 */

import { ParsingError } from './error'
import { clamp, wrapCircular } from './number'
import {
  type RGB8A,
  type HSVA,
  type HSLA,
  rgb8a,
  hsva,
  hsla,
  parseAlpha,
} from './color'

// ---------------------------------------------------------------------------
// Regex patterns
// ---------------------------------------------------------------------------

const HSV_LEGACY_RE =
  /^hsva?\(\s*([\d.]+)\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%\s*(?:,\s*([\d.]+%?)\s*)?\)$/i

const HSV_MODERN_RE =
  /^hsva?\(\s*([\d.]+)\s+([\d.]+)%\s+([\d.]+)%\s*(?:\/\s*([\d.]+%?)\s*)?\)$/i

// ---------------------------------------------------------------------------
// Parsing
// ---------------------------------------------------------------------------

/**
 * Returns `true` if the string can be parsed as an `hsv()` or `hsva()` color.
 *
 * This is a non-standard format commonly used in design tools such as Figma
 * and Sketch. Supports both legacy comma-separated and modern
 * space-separated syntax.
 *
 * @param s - The string to test.
 * @returns `true` if the string is a valid HSV functional notation.
 * @public
 * @example
 * ```ts
 * canParseHsv('hsv(0, 100%, 100%)') // true
 * canParseHsv('hsv(120 50% 80% / 0.5)') // true
 * canParseHsv('hsl(0, 100%, 50%)') // false
 * ```
 */
export const canParseHsv = (s: string): boolean => {
  const trimmed = s.trim()
  return HSV_LEGACY_RE.test(trimmed) || HSV_MODERN_RE.test(trimmed)
}

/**
 * Parses an `hsv()` or `hsva()` color string into an HSVA color.
 *
 * Supports both legacy comma-separated and modern space-separated syntax.
 *
 * @param s - The string to parse.
 * @returns An HSVA color.
 * @throws ParsingError if the string is not a valid HSV color.
 * @public
 * @example
 * ```ts
 * parseHsv('hsv(0, 100%, 100%)') // hsva(0, 1, 1)
 * parseHsv('hsva(120, 50%, 80%, 0.5)') // hsva(120, 0.5, 0.8, 0.5)
 * parseHsv('hsv(240 25% 90% / 50%)') // hsva(240, 0.25, 0.9, 0.5)
 * ```
 */
export const parseHsv = (s: string): HSVA => {
  const trimmed = s.trim()
  const m = HSV_LEGACY_RE.exec(trimmed) ?? HSV_MODERN_RE.exec(trimmed)
  if (!m) throw new ParsingError(`Invalid hsv color: '${s}'`)
  return hsva(
    wrapCircular(parseFloat(m[1]), 360),
    clamp(parseFloat(m[2]) / 100, 0, 1),
    clamp(parseFloat(m[3]) / 100, 0, 1),
    parseAlpha(m[4])
  )
}

// ---------------------------------------------------------------------------
// Conversions
// ---------------------------------------------------------------------------

/**
 * Converts an RGB8A color to an HSVA color.
 *
 * Uses the standard RGB-to-HSV algorithm where Value is the maximum channel
 * and Saturation is the ratio of chroma to Value.
 *
 * @param c - The RGB8A color to convert.
 * @returns An HSVA color.
 * @public
 * @example
 * ```ts
 * rgb8aToHsva(rgb8a(255, 0, 0)) // hsva(0, 1, 1)
 * rgb8aToHsva(rgb8a(0, 0, 0)) // hsva(0, 0, 0)
 * rgb8aToHsva(rgb8a(128, 128, 128)) // hsva(0, 0, ~0.502)
 * ```
 */
export const rgb8aToHsva = (c: RGB8A): HSVA => {
  const rn = c.r / 255
  const gn = c.g / 255
  const bn = c.b / 255
  const max = Math.max(rn, gn, bn)
  const min = Math.min(rn, gn, bn)
  const delta = max - min

  const v = max
  const s = max === 0 ? 0 : delta / max

  let h = 0
  if (delta !== 0) {
    if (max === rn) {
      h = ((gn - bn) / delta) % 6
    } else if (max === gn) {
      h = (bn - rn) / delta + 2
    } else {
      h = (rn - gn) / delta + 4
    }
    h *= 60
    if (h < 0) h += 360
  }

  return hsva(h, s, v, c.alpha)
}

/**
 * Converts an HSVA color to an RGB8A color.
 *
 * Uses the standard HSV-to-RGB algorithm with chroma, hue sectors, and an
 * offset to produce final channel values.
 *
 * @param c - The HSVA color to convert.
 * @returns An RGB8A color.
 * @public
 * @example
 * ```ts
 * hsvaToRgb8a(hsva(0, 1, 1)) // rgb8a(255, 0, 0)
 * hsvaToRgb8a(hsva(120, 1, 1)) // rgb8a(0, 255, 0)
 * hsvaToRgb8a(hsva(0, 0, 0)) // rgb8a(0, 0, 0)
 * ```
 */
export const hsvaToRgb8a = (c: HSVA): RGB8A => {
  const s = c.s
  const v = c.v
  const ch = v * s
  const x = ch * (1 - Math.abs(((c.h / 60) % 2) - 1))
  const m = v - ch

  let r1 = 0
  let g1 = 0
  let b1 = 0

  const h = c.h
  if (h < 60) {
    r1 = ch
    g1 = x
  } else if (h < 120) {
    r1 = x
    g1 = ch
  } else if (h < 180) {
    g1 = ch
    b1 = x
  } else if (h < 240) {
    g1 = x
    b1 = ch
  } else if (h < 300) {
    r1 = x
    b1 = ch
  } else {
    r1 = ch
    b1 = x
  }

  return rgb8a(
    Math.round((r1 + m) * 255),
    Math.round((g1 + m) * 255),
    Math.round((b1 + m) * 255),
    c.alpha
  )
}

/**
 * Converts an HSLA color to an HSVA color using a direct formula that
 * avoids an intermediate RGB conversion.
 *
 * @param c - The HSLA color to convert.
 * @returns An HSVA color.
 * @public
 * @example
 * ```ts
 * hslaToHsva(hsla(0, 1, 0.5)) // hsva(0, 1, 1)
 * hslaToHsva(hsla(0, 0, 0)) // hsva(0, 0, 0)
 * hslaToHsva(hsla(120, 0.5, 0.75)) // hsva(120, ~0.333, ~0.875)
 * ```
 */
export const hslaToHsva = (c: HSLA): HSVA => {
  const s = c.s
  const l = c.l
  const v = l + s * Math.min(l, 1 - l)
  const sv = v === 0 ? 0 : 2 * (1 - l / v)
  return hsva(c.h, sv, v, c.alpha)
}

/**
 * Converts an HSVA color to an HSLA color using a direct formula that
 * avoids an intermediate RGB conversion.
 *
 * @param c - The HSVA color to convert.
 * @returns An HSLA color.
 * @public
 * @example
 * ```ts
 * hsvaToHsla(hsva(0, 1, 1)) // hsla(0, 1, 0.5)
 * hsvaToHsla(hsva(0, 0, 0)) // hsla(0, 0, 0)
 * hsvaToHsla(hsva(120, 0.5, 0.8)) // hsla(120, ~0.471, 0.6)
 * ```
 */
export const hsvaToHsla = (c: HSVA): HSLA => {
  const s = c.s
  const v = c.v
  const l = v * (1 - s / 2)
  const sl = l === 0 || l === 1 ? 0 : (v - l) / Math.min(l, 1 - l)
  return hsla(c.h, sl, l, c.alpha)
}

// ---------------------------------------------------------------------------
// Serialization
// ---------------------------------------------------------------------------

/**
 * Serializes an HSVA color to an `hsv()` or `hsva()` string.
 *
 * Produces `hsv(h, s%, v%)` when alpha is 1, or `hsva(h, s%, v%, a)`
 * otherwise.
 *
 * @param c - The HSVA color to serialize.
 * @returns An HSV color string.
 * @public
 * @example
 * ```ts
 * hsvaToHsvString(hsva(0, 1, 1)) // 'hsv(0, 100%, 100%)'
 * hsvaToHsvString(hsva(120, 0.5, 0.8, 0.5)) // 'hsva(120, 50%, 80%, 0.5)'
 * ```
 */
export const hsvaToHsvString = (c: HSVA): string => {
  const h = c.h
  const s = Math.round(c.s * 10000) / 100
  const v = Math.round(c.v * 10000) / 100
  if (c.alpha >= 1) return `hsv(${h} ${s}% ${v}%)`
  return `hsv(${h} ${s}% ${v}% / ${c.alpha})`
}
