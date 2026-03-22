/**
 * CIE LAB and LCH color parsing, conversion, and serialization.
 *
 * @public
 */

import { ParsingError } from './error'
import { clamp, wrapCircular, roundTo } from './number'
import {
  type RGB8A,
  type LABA,
  type LCHA,
  rgb8a,
  laba,
  lcha,
  parseAlpha,
} from './color'

// ---------------------------------------------------------------------------
// Regex patterns
// ---------------------------------------------------------------------------

const LAB_RE =
  /^lab\(\s*([\d.]+%?)\s+([-\d.]+)\s+([-\d.]+)\s*(?:\/\s*([\d.]+%?)\s*)?\)$/i

const LCH_RE =
  /^lch\(\s*([\d.]+%?)\s+([\d.]+)\s+([\d.]+)\s*(?:\/\s*([\d.]+%?)\s*)?\)$/i

// ---------------------------------------------------------------------------
// Internal helpers — gamma
// ---------------------------------------------------------------------------

const srgbToLinear = (v: number): number =>
  v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)

const linearToSrgb = (v: number): number =>
  v <= 0.0031308 ? v * 12.92 : 1.055 * Math.pow(v, 1 / 2.4) - 0.055

// ---------------------------------------------------------------------------
// Internal helpers — linear RGB <-> XYZ (D65)
// ---------------------------------------------------------------------------

const linearRgbToXyz = (
  r: number,
  g: number,
  b: number
): [number, number, number] => [
  0.4124564 * r + 0.3575761 * g + 0.1804375 * b,
  0.2126729 * r + 0.7151522 * g + 0.072175 * b,
  0.0193339 * r + 0.119192 * g + 0.9503041 * b,
]

const xyzToLinearRgb = (
  x: number,
  y: number,
  z: number
): [number, number, number] => [
  3.2404542 * x - 1.5371385 * y - 0.4985314 * z,
  -0.969266 * x + 1.8760108 * y + 0.041556 * z,
  0.0556434 * x - 0.2040259 * y + 1.0572252 * z,
]

// ---------------------------------------------------------------------------
// Internal helpers — XYZ <-> LAB
// ---------------------------------------------------------------------------

const D65_Xn = 0.95047
const D65_Yn = 1.0
const D65_Zn = 1.08883

const DELTA = 6 / 29
const DELTA_CUBED = DELTA ** 3
const DELTA_SQ_3 = 3 * DELTA ** 2

const xyzToLab = (
  x: number,
  y: number,
  z: number
): [number, number, number] => {
  const f = (t: number): number =>
    t > DELTA_CUBED ? Math.cbrt(t) : t / DELTA_SQ_3 + 4 / 29

  const fx = f(x / D65_Xn)
  const fy = f(y / D65_Yn)
  const fz = f(z / D65_Zn)

  return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)]
}

const labToXyz = (
  l: number,
  a: number,
  b: number
): [number, number, number] => {
  const fInv = (t: number): number =>
    t > DELTA ? t ** 3 : DELTA_SQ_3 * (t - 4 / 29)

  const fy = (l + 16) / 116
  const fx = a / 500 + fy
  const fz = fy - b / 200

  return [D65_Xn * fInv(fx), D65_Yn * fInv(fy), D65_Zn * fInv(fz)]
}

// ---------------------------------------------------------------------------
// Internal helpers — LAB <-> LCH
// ---------------------------------------------------------------------------

const labToLch = (
  l: number,
  a: number,
  b: number
): [number, number, number] => {
  const c = Math.sqrt(a * a + b * b)
  let h = (Math.atan2(b, a) * 180) / Math.PI
  if (h < 0) h += 360
  return [l, c, h]
}

const lchToLab = (
  l: number,
  c: number,
  h: number
): [number, number, number] => {
  const rad = (h * Math.PI) / 180
  return [l, c * Math.cos(rad), c * Math.sin(rad)]
}

// ---------------------------------------------------------------------------
// Internal helpers — Lightness parsing
// ---------------------------------------------------------------------------

const parseLightness = (raw: string): number => {
  if (raw.endsWith('%')) {
    return clamp(parseFloat(raw), 0, 100)
  }
  return clamp(parseFloat(raw), 0, 100)
}

// ---------------------------------------------------------------------------
// Parsing
// ---------------------------------------------------------------------------

/**
 * Returns `true` if the string can be parsed as a `lab()` color.
 *
 * @param s - The string to test.
 * @returns `true` if the string is a valid LAB functional notation.
 * @public
 * @example
 * ```ts
 * canParseLab('lab(50 -20 30)') // true
 * canParseLab('lab(50% -20 30 / 0.5)') // true
 * canParseLab('#ff0000') // false
 * ```
 */
export const canParseLab = (s: string): boolean => LAB_RE.test(s.trim())

/**
 * Parses a `lab()` color string into a LABA color.
 *
 * Supports `lab(L a b)` and `lab(L a b / alpha)` syntax. The lightness
 * value can be a percentage (0–100%) or a plain number (0–100). The `a`
 * and `b` axes accept any number, including negatives.
 *
 * @param s - The string to parse.
 * @returns A LABA color.
 * @throws ParsingError if the string is not a valid LAB color.
 * @public
 * @example
 * ```ts
 * parseLab('lab(50 -20 30)') // laba(50, -20, 30)
 * parseLab('lab(50% -20 30 / 0.5)') // laba(50, -20, 30, 0.5)
 * ```
 */
export const parseLab = (s: string): LABA => {
  const m = LAB_RE.exec(s.trim())
  if (!m) throw new ParsingError(`Invalid lab color: '${s}'`)
  return laba(
    parseLightness(m[1]),
    parseFloat(m[2]),
    parseFloat(m[3]),
    parseAlpha(m[4])
  )
}

/**
 * Returns `true` if the string can be parsed as an `lch()` color.
 *
 * @param s - The string to test.
 * @returns `true` if the string is a valid LCH functional notation.
 * @public
 * @example
 * ```ts
 * canParseLch('lch(50 36 326)') // true
 * canParseLch('lch(50% 36 326 / 0.8)') // true
 * canParseLch('rgb(0,0,0)') // false
 * ```
 */
export const canParseLch = (s: string): boolean => LCH_RE.test(s.trim())

/**
 * Parses an `lch()` color string into a LCHA color.
 *
 * Supports `lch(L C H)` and `lch(L C H / alpha)` syntax. The lightness
 * value can be a percentage (0–100%) or a plain number (0–100). Chroma
 * must be non-negative, and hue is an angle in degrees.
 *
 * @param s - The string to parse.
 * @returns A LCHA color.
 * @throws ParsingError if the string is not a valid LCH color.
 * @public
 * @example
 * ```ts
 * parseLch('lch(50 36 326)') // lcha(50, 36, 326)
 * parseLch('lch(75% 40 120 / 50%)') // lcha(75, 40, 120, 0.5)
 * ```
 */
export const parseLch = (s: string): LCHA => {
  const m = LCH_RE.exec(s.trim())
  if (!m) throw new ParsingError(`Invalid lch color: '${s}'`)
  return lcha(
    parseLightness(m[1]),
    Math.max(0, parseFloat(m[2])),
    wrapCircular(parseFloat(m[3]), 360),
    parseAlpha(m[4])
  )
}

// ---------------------------------------------------------------------------
// Conversion: RGB8A -> LABA
// ---------------------------------------------------------------------------

/**
 * Converts an RGB8A color to a LABA color through the CIE XYZ intermediate
 * color space.
 *
 * @param c - The RGB8A color to convert.
 * @returns The equivalent LABA color.
 * @public
 * @example
 * ```ts
 * rgb8aToLaba(rgb8a(255, 0, 0)) // laba(~53.23, ~80.11, ~67.22)
 * rgb8aToLaba(rgb8a(0, 0, 0))   // laba(0, 0, 0)
 * ```
 */
export const rgb8aToLaba = (c: RGB8A): LABA => {
  const rl = srgbToLinear(c.r / 255)
  const gl = srgbToLinear(c.g / 255)
  const bl = srgbToLinear(c.b / 255)
  const [x, y, z] = linearRgbToXyz(rl, gl, bl)
  const [l, a, b] = xyzToLab(x, y, z)
  return laba(l, a, b, c.alpha)
}

// ---------------------------------------------------------------------------
// Conversion: LABA -> RGB8A
// ---------------------------------------------------------------------------

/**
 * Converts a LABA color to an RGB8A color through the CIE XYZ intermediate
 * color space.
 *
 * Channel values are clamped to the sRGB gamut before rounding.
 *
 * @param c - The LABA color to convert.
 * @returns The equivalent RGB8A color.
 * @public
 * @example
 * ```ts
 * labaToRgb8a(laba(53.23, 80.11, 67.22)) // rgb8a(~255, ~0, ~0)
 * labaToRgb8a(laba(0, 0, 0))             // rgb8a(0, 0, 0)
 * ```
 */
export const labaToRgb8a = (c: LABA): RGB8A => {
  const [x, y, z] = labToXyz(c.l, c.a, c.b)
  const [rl, gl, bl] = xyzToLinearRgb(x, y, z)
  return rgb8a(
    Math.round(clamp(linearToSrgb(rl), 0, 1) * 255),
    Math.round(clamp(linearToSrgb(gl), 0, 1) * 255),
    Math.round(clamp(linearToSrgb(bl), 0, 1) * 255),
    c.alpha
  )
}

// ---------------------------------------------------------------------------
// Conversion: RGB8A -> LCHA
// ---------------------------------------------------------------------------

/**
 * Converts an RGB8A color to a LCHA color by converting to LABA first and
 * then applying the polar (cylindrical) transformation.
 *
 * @param c - The RGB8A color to convert.
 * @returns The equivalent LCHA color.
 * @public
 * @example
 * ```ts
 * rgb8aToLcha(rgb8a(255, 0, 0)) // lcha(~53.23, ~104.55, ~40.0)
 * rgb8aToLcha(rgb8a(0, 0, 0))   // lcha(0, 0, 0)
 * ```
 */
export const rgb8aToLcha = (c: RGB8A): LCHA => {
  const lab = rgb8aToLaba(c)
  const [l, ch, h] = labToLch(lab.l, lab.a, lab.b)
  return lcha(l, ch, h, c.alpha)
}

// ---------------------------------------------------------------------------
// Conversion: LCHA -> RGB8A
// ---------------------------------------------------------------------------

/**
 * Converts a LCHA color to an RGB8A color by converting from polar
 * coordinates to rectangular LAB and then to RGB8A.
 *
 * @param c - The LCHA color to convert.
 * @returns The equivalent RGB8A color.
 * @public
 * @example
 * ```ts
 * lchaToRgb8a(lcha(53.23, 104.55, 40.0)) // rgb8a(~255, ~0, ~0)
 * lchaToRgb8a(lcha(0, 0, 0))             // rgb8a(0, 0, 0)
 * ```
 */
export const lchaToRgb8a = (c: LCHA): RGB8A => {
  const [l, a, b] = lchToLab(c.l, c.c, c.h)
  return labaToRgb8a(laba(l, a, b, c.alpha))
}

// ---------------------------------------------------------------------------
// Serialization
// ---------------------------------------------------------------------------

/**
 * Serializes a LABA color to a `lab()` CSS string.
 *
 * Produces `lab(L a b)` when alpha is 1, or `lab(L a b / alpha)` otherwise.
 * Lightness is rounded to 2 decimal places; `a` and `b` axes are rounded
 * to 4 decimal places.
 *
 * @param c - The LABA color to serialize.
 * @returns A CSS `lab()` color string.
 * @public
 * @example
 * ```ts
 * labaToLabString(laba(50, -20, 30))
 * // 'lab(50 -20 30)'
 * labaToLabString(laba(50, -20, 30, 0.5))
 * // 'lab(50 -20 30 / 0.5)'
 * ```
 */
export const labaToLabString = (c: LABA): string => {
  const l = roundTo(c.l, 2)
  const a = roundTo(c.a, 4)
  const b = roundTo(c.b, 4)
  if (c.alpha >= 1) return `lab(${l} ${a} ${b})`
  return `lab(${l} ${a} ${b} / ${c.alpha})`
}

/**
 * Serializes a LCHA color to an `lch()` CSS string.
 *
 * Produces `lch(L C H)` when alpha is 1, or `lch(L C H / alpha)` otherwise.
 * Lightness is rounded to 2 decimal places; chroma and hue are rounded to
 * 4 decimal places.
 *
 * @param c - The LCHA color to serialize.
 * @returns A CSS `lch()` color string.
 * @public
 * @example
 * ```ts
 * lchaToLchString(lcha(50, 36, 326))
 * // 'lch(50 36 326)'
 * lchaToLchString(lcha(50, 36, 326, 0.8))
 * // 'lch(50 36 326 / 0.8)'
 * ```
 */
export const lchaToLchString = (c: LCHA): string => {
  const l = roundTo(c.l, 2)
  const ch = roundTo(c.c, 4)
  const h = roundTo(c.h, 4)
  if (c.alpha >= 1) return `lch(${l} ${ch} ${h})`
  return `lch(${l} ${ch} ${h} / ${c.alpha})`
}
