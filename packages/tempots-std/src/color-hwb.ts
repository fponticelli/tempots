/**
 * HWB color parsing, conversion, and serialization.
 *
 * @public
 */

import { ParsingError } from './error'
import { clamp, wrapCircular } from './number'
import { type RGB8A, type HWBA, rgb8a, hwba, parseAlpha } from './color'

// ---------------------------------------------------------------------------
// Regex patterns
// ---------------------------------------------------------------------------

const HWB_RE =
  /^hwb\(\s*(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)%\s+(\d+(?:\.\d+)?)%\s*(?:\/\s*([\d.]+%?)\s*)?\)$/i

// ---------------------------------------------------------------------------
// Parsing
// ---------------------------------------------------------------------------

/**
 * Returns `true` if the string can be parsed as an `hwb()` CSS Level 4 color.
 *
 * Only the modern space-separated syntax is supported:
 * `hwb(h w% b%)` or `hwb(h w% b% / alpha)`.
 *
 * @param s - The string to test.
 * @returns `true` if the string is a valid HWB functional notation.
 * @public
 * @example
 * ```ts
 * canParseHwb('hwb(0 0% 0%)') // true
 * canParseHwb('hwb(180 20% 30% / 0.5)') // true
 * canParseHwb('rgb(255, 0, 0)') // false
 * ```
 */
export const canParseHwb = (s: string): boolean => HWB_RE.test(s.trim())

/**
 * Parses an `hwb()` CSS Level 4 color string into an HWBA color.
 *
 * Only the modern space-separated syntax is supported:
 * `hwb(h w% b%)` or `hwb(h w% b% / alpha)`.
 *
 * @param s - The string to parse.
 * @returns An HWBA color.
 * @throws ParsingError if the string is not a valid HWB color.
 * @public
 * @example
 * ```ts
 * parseHwb('hwb(0 0% 0%)') // hwba(0, 0, 0)
 * parseHwb('hwb(180 20% 30%)') // hwba(180, 20, 30)
 * parseHwb('hwb(90 10% 20% / 0.5)') // hwba(90, 10, 20, 0.5)
 * ```
 */
export const parseHwb = (s: string): HWBA => {
  const trimmed = s.trim()
  const m = HWB_RE.exec(trimmed)
  if (!m) throw new ParsingError(`Invalid hwb color: '${s}'`)
  return hwba(
    parseFloat(m[1]),
    parseFloat(m[2]),
    parseFloat(m[3]),
    parseAlpha(m[4])
  )
}

// ---------------------------------------------------------------------------
// Conversion: RGB8A -> HWBA
// ---------------------------------------------------------------------------

/**
 * Converts an RGB8A color to an HWBA color.
 *
 * The conversion derives hue, whiteness, and blackness from the RGB channels.
 * Whiteness is the minimum channel value and blackness is one minus the maximum
 * channel value.
 *
 * @param c - The RGB8A color to convert.
 * @returns An HWBA color.
 * @public
 * @example
 * ```ts
 * rgb8aToHwba(rgb8a(255, 0, 0)) // hwba(0, 0, 0)
 * rgb8aToHwba(rgb8a(0, 0, 0)) // hwba(0, 0, 100)
 * rgb8aToHwba(rgb8a(255, 255, 255)) // hwba(0, 100, 0)
 * ```
 */
export const rgb8aToHwba = (c: RGB8A): HWBA => {
  const rn = c.r / 255
  const gn = c.g / 255
  const bn = c.b / 255

  const max = Math.max(rn, gn, bn)
  const min = Math.min(rn, gn, bn)
  const delta = max - min

  let h: number
  if (delta === 0) {
    h = 0
  } else if (max === rn) {
    h = ((gn - bn) / delta) * 60
  } else if (max === gn) {
    h = ((bn - rn) / delta + 2) * 60
  } else {
    h = ((rn - gn) / delta + 4) * 60
  }
  if (h < 0) h += 360

  const w = min * 100
  const b = (1 - max) * 100

  return hwba(h, w, b, c.alpha)
}

// ---------------------------------------------------------------------------
// Conversion: HWBA -> RGB8A
// ---------------------------------------------------------------------------

/**
 * Converts an HWBA color to an RGB8A color.
 *
 * When whiteness plus blackness exceed 100%, they are proportionally scaled
 * so that their sum equals 100%. The pure hue color is then blended between
 * white and black according to the whiteness and blackness values.
 *
 * @param c - The HWBA color to convert.
 * @returns An RGB8A color.
 * @public
 * @example
 * ```ts
 * hwbaToRgb8a(hwba(0, 0, 0)) // rgb8a(255, 0, 0)
 * hwbaToRgb8a(hwba(0, 100, 0)) // rgb8a(255, 255, 255)
 * hwbaToRgb8a(hwba(0, 0, 100)) // rgb8a(0, 0, 0)
 * ```
 */
export const hwbaToRgb8a = (c: HWBA): RGB8A => {
  let w = c.w / 100
  let b = c.b / 100

  if (w + b >= 1) {
    const scale = 1 / (w + b)
    w *= scale
    b *= scale
  }

  // Pure hue color via sector logic
  const hNorm = wrapCircular(c.h, 360) / 60
  const i = Math.floor(hNorm) % 6
  const f = hNorm - Math.floor(hNorm)

  let r1: number
  let g1: number
  let b1: number

  switch (i) {
    case 0:
      r1 = 1
      g1 = f
      b1 = 0
      break
    case 1:
      r1 = 1 - f
      g1 = 1
      b1 = 0
      break
    case 2:
      r1 = 0
      g1 = 1
      b1 = f
      break
    case 3:
      r1 = 0
      g1 = 1 - f
      b1 = 1
      break
    case 4:
      r1 = f
      g1 = 0
      b1 = 1
      break
    default:
      r1 = 1
      g1 = 0
      b1 = 1 - f
      break
  }

  // Blend: channel = channel * (1 - w - b) + w
  const factor = 1 - w - b
  const r = clamp(Math.round((r1 * factor + w) * 255), 0, 255)
  const g = clamp(Math.round((g1 * factor + w) * 255), 0, 255)
  const bl = clamp(Math.round((b1 * factor + w) * 255), 0, 255)

  return rgb8a(r, g, bl, c.alpha)
}

// ---------------------------------------------------------------------------
// Serialization
// ---------------------------------------------------------------------------

/**
 * Serializes an HWBA color to a CSS `hwb()` string.
 *
 * Produces `hwb(h w% b%)` when alpha is 1, or `hwb(h w% b% / alpha)`
 * otherwise.
 *
 * @param c - The HWBA color to serialize.
 * @returns A CSS `hwb()` color string.
 * @public
 * @example
 * ```ts
 * hwbaToHwbString(hwba(0, 0, 0)) // 'hwb(0 0% 0%)'
 * hwbaToHwbString(hwba(180, 20, 30, 0.5)) // 'hwb(180 20% 30% / 0.5)'
 * ```
 */
export const hwbaToHwbString = (c: HWBA): string => {
  if (c.alpha >= 1) return `hwb(${c.h} ${c.w}% ${c.b}%)`
  return `hwb(${c.h} ${c.w}% ${c.b}% / ${c.alpha})`
}
