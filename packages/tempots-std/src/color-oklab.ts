/**
 * OKLAB and OKLCH color parsing, conversion, and serialization.
 *
 * @public
 */

import { ParsingError } from './error'
import { clamp, roundTo } from './number'
import {
  type RGB8A,
  type OKLABA,
  type OKLCHA,
  rgb8a,
  oklaba,
  oklcha,
  parseAlpha,
} from './color'

// ---------------------------------------------------------------------------
// Regex patterns
// ---------------------------------------------------------------------------

const OKLAB_RE =
  /^oklab\(\s*([\d.]+%?)\s+([-\d.]+)\s+([-\d.]+)\s*(?:\/\s*([\d.]+%?)\s*)?\)$/i

const OKLCH_RE =
  /^oklch\(\s*([\d.]+%?)\s+([\d.]+)\s+([\d.]+)\s*(?:\/\s*([\d.]+%?)\s*)?\)$/i

// ---------------------------------------------------------------------------
// Internal helpers — gamma
// ---------------------------------------------------------------------------

const srgbToLinear = (v: number): number =>
  v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)

const linearToSrgb = (v: number): number =>
  v <= 0.0031308 ? v * 12.92 : 1.055 * Math.pow(v, 1 / 2.4) - 0.055

// ---------------------------------------------------------------------------
// Internal helpers — linear sRGB <-> OKLAB
// ---------------------------------------------------------------------------

const linearSrgbToOklab = (
  r: number,
  g: number,
  b: number
): [number, number, number] => {
  const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b
  const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b
  const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b

  const l_ = Math.cbrt(l)
  const m_ = Math.cbrt(m)
  const s_ = Math.cbrt(s)

  const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_
  const a = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_
  const B = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_
  return [L, a, B]
}

const oklabToLinearSrgb = (
  L: number,
  a: number,
  b: number
): [number, number, number] => {
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b
  const s_ = L - 0.0894841775 * a - 1.291485548 * b

  const l = l_ * l_ * l_
  const m = m_ * m_ * m_
  const s = s_ * s_ * s_

  const r = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s
  const g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s
  const b_ = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s
  return [r, g, b_]
}

// ---------------------------------------------------------------------------
// Internal helpers — OKLAB <-> OKLCH
// ---------------------------------------------------------------------------

const oklabToOklch = (
  l: number,
  a: number,
  b: number
): [number, number, number] => {
  const c = Math.sqrt(a * a + b * b)
  let h = (Math.atan2(b, a) * 180) / Math.PI
  if (h < 0) h += 360
  return [l, c, h]
}

const oklchToOklab = (
  l: number,
  c: number,
  h: number
): [number, number, number] => {
  const rad = (h * Math.PI) / 180
  const a = c * Math.cos(rad)
  const b = c * Math.sin(rad)
  return [l, a, b]
}

// ---------------------------------------------------------------------------
// Internal helpers — lightness parsing
// ---------------------------------------------------------------------------

const parseLightness = (s: string): number =>
  s.endsWith('%') ? parseFloat(s) / 100 : parseFloat(s)

// ---------------------------------------------------------------------------
// Parsing
// ---------------------------------------------------------------------------

/**
 * Returns `true` if the string can be parsed as an `oklab()` color.
 *
 * @param s - The string to test.
 * @returns `true` if the string matches the `oklab()` format.
 * @public
 * @example
 * ```ts
 * canParseOklab('oklab(0.5 -0.1 0.1)') // true
 * canParseOklab('red') // false
 * ```
 */
export const canParseOklab = (s: string): boolean => OKLAB_RE.test(s.trim())

/**
 * Parses an `oklab()` color string into an OKLABA color.
 *
 * L may be a percentage (0–100% mapped to 0–1) or a decimal (0–1). The `a`
 * and `b` channels are decimals that may be negative.
 *
 * @param s - The string to parse.
 * @returns An OKLABA color.
 * @throws ParsingError if the string is not a valid OKLAB color.
 * @public
 * @example
 * ```ts
 * parseOklab('oklab(0.5 -0.1 0.1)') // oklaba(0.5, -0.1, 0.1)
 * parseOklab('oklab(50% -0.1 0.1 / 0.8)') // oklaba(0.5, -0.1, 0.1, 0.8)
 * ```
 */
export const parseOklab = (s: string): OKLABA => {
  const m = OKLAB_RE.exec(s.trim())
  if (!m) throw new ParsingError(`Invalid oklab color: '${s}'`)
  return oklaba(
    parseLightness(m[1]),
    parseFloat(m[2]),
    parseFloat(m[3]),
    parseAlpha(m[4])
  )
}

/**
 * Returns `true` if the string can be parsed as an `oklch()` color.
 *
 * @param s - The string to test.
 * @returns `true` if the string matches the `oklch()` format.
 * @public
 * @example
 * ```ts
 * canParseOklch('oklch(0.5 0.15 326)') // true
 * canParseOklch('red') // false
 * ```
 */
export const canParseOklch = (s: string): boolean => OKLCH_RE.test(s.trim())

/**
 * Parses an `oklch()` color string into an OKLCHA color.
 *
 * L may be a percentage (0–100% mapped to 0–1) or a decimal (0–1). C is a
 * non-negative decimal and H is an angle in degrees.
 *
 * @param s - The string to parse.
 * @returns An OKLCHA color.
 * @throws ParsingError if the string is not a valid OKLCH color.
 * @public
 * @example
 * ```ts
 * parseOklch('oklch(0.5 0.15 326)') // oklcha(0.5, 0.15, 326)
 * parseOklch('oklch(50% 0.15 326 / 0.8)') // oklcha(0.5, 0.15, 326, 0.8)
 * ```
 */
export const parseOklch = (s: string): OKLCHA => {
  const m = OKLCH_RE.exec(s.trim())
  if (!m) throw new ParsingError(`Invalid oklch color: '${s}'`)
  return oklcha(
    parseLightness(m[1]),
    parseFloat(m[2]),
    parseFloat(m[3]),
    parseAlpha(m[4])
  )
}

// ---------------------------------------------------------------------------
// Conversions
// ---------------------------------------------------------------------------

/**
 * Converts an RGB8A color to an OKLABA color.
 *
 * @param c - The RGB8A color to convert.
 * @returns The equivalent OKLABA color.
 * @public
 * @example
 * ```ts
 * rgb8aToOklaba(rgb8a(255, 0, 0)) // oklaba(~0.628, ~0.225, ~0.126)
 * ```
 */
export const rgb8aToOklaba = (c: RGB8A): OKLABA => {
  const rl = srgbToLinear(c.r / 255)
  const gl = srgbToLinear(c.g / 255)
  const bl = srgbToLinear(c.b / 255)
  const [l, a, b] = linearSrgbToOklab(rl, gl, bl)
  return oklaba(l, a, b, c.alpha)
}

/**
 * Converts an OKLABA color to an RGB8A color.
 *
 * @param c - The OKLABA color to convert.
 * @returns The equivalent RGB8A color with channels clamped to 0–255.
 * @public
 * @example
 * ```ts
 * oklabaToRgb8a(oklaba(0.628, 0.225, 0.126)) // rgb8a(~255, ~0, ~0)
 * ```
 */
export const oklabaToRgb8a = (c: OKLABA): RGB8A => {
  const [rl, gl, bl] = oklabToLinearSrgb(c.l, c.a, c.b)
  return rgb8a(
    Math.round(clamp(linearToSrgb(rl), 0, 1) * 255),
    Math.round(clamp(linearToSrgb(gl), 0, 1) * 255),
    Math.round(clamp(linearToSrgb(bl), 0, 1) * 255),
    c.alpha
  )
}

/**
 * Converts an RGB8A color to an OKLCHA color.
 *
 * @param c - The RGB8A color to convert.
 * @returns The equivalent OKLCHA color.
 * @public
 * @example
 * ```ts
 * rgb8aToOklcha(rgb8a(255, 0, 0)) // oklcha(~0.628, ~0.258, ~29.2)
 * ```
 */
export const rgb8aToOklcha = (c: RGB8A): OKLCHA => {
  const rl = srgbToLinear(c.r / 255)
  const gl = srgbToLinear(c.g / 255)
  const bl = srgbToLinear(c.b / 255)
  const [labL, labA, labB] = linearSrgbToOklab(rl, gl, bl)
  const [l, ch, h] = oklabToOklch(labL, labA, labB)
  return oklcha(l, ch, h, c.alpha)
}

/**
 * Converts an OKLCHA color to an RGB8A color.
 *
 * @param c - The OKLCHA color to convert.
 * @returns The equivalent RGB8A color with channels clamped to 0–255.
 * @public
 * @example
 * ```ts
 * oklchaToRgb8a(oklcha(0.628, 0.258, 29.2)) // rgb8a(~255, ~0, ~0)
 * ```
 */
export const oklchaToRgb8a = (c: OKLCHA): RGB8A => {
  const [l, a, b] = oklchToOklab(c.l, c.c, c.h)
  return oklabaToRgb8a(oklaba(l, a, b, c.alpha))
}

// ---------------------------------------------------------------------------
// Serialization
// ---------------------------------------------------------------------------

/**
 * Serializes an OKLABA color to a CSS `oklab()` string.
 *
 * Produces `oklab(L a b)` when alpha is 1, or `oklab(L a b / alpha)`
 * otherwise. Values are rounded to 5 decimal places.
 *
 * @param c - The OKLABA color to serialize.
 * @returns A CSS `oklab()` color string.
 * @public
 * @example
 * ```ts
 * oklabaToOklabString(oklaba(0.5, -0.1, 0.1)) // 'oklab(0.5 -0.1 0.1)'
 * oklabaToOklabString(oklaba(0.5, -0.1, 0.1, 0.8)) // 'oklab(0.5 -0.1 0.1 / 0.8)'
 * ```
 */
export const oklabaToOklabString = (c: OKLABA): string => {
  const l = roundTo(c.l, 5)
  const a = roundTo(c.a, 5)
  const b = roundTo(c.b, 5)
  if (c.alpha >= 1) return `oklab(${l} ${a} ${b})`
  return `oklab(${l} ${a} ${b} / ${c.alpha})`
}

/**
 * Serializes an OKLCHA color to a CSS `oklch()` string.
 *
 * Produces `oklch(L C H)` when alpha is 1, or `oklch(L C H / alpha)`
 * otherwise. L and C are rounded to 5 decimal places, H to 2.
 *
 * @param c - The OKLCHA color to serialize.
 * @returns A CSS `oklch()` color string.
 * @public
 * @example
 * ```ts
 * oklchaToOklchString(oklcha(0.5, 0.15, 326)) // 'oklch(0.5 0.15 326)'
 * oklchaToOklchString(oklcha(0.5, 0.15, 326, 0.8)) // 'oklch(0.5 0.15 326 / 0.8)'
 * ```
 */
export const oklchaToOklchString = (c: OKLCHA): string => {
  const l = roundTo(c.l, 5)
  const ch = roundTo(c.c, 5)
  const h = roundTo(c.h, 2)
  if (c.alpha >= 1) return `oklch(${l} ${ch} ${h})`
  return `oklch(${l} ${ch} ${h} / ${c.alpha})`
}
