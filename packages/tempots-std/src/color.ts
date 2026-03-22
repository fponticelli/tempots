/**
 * Core color types, construction helpers, type guards, and orchestration
 * functions for parsing, converting, and serializing colors across 9 color
 * spaces.
 *
 * @public
 */

import { clamp, clampInt, wrapCircular } from './number'
import { ParsingError } from './error'
import { NAMED_COLORS } from './color-named'
import {
  canParseHex,
  canParseRgb,
  canParseNamedColor,
  parseHex,
  parseRgb,
  parseNamedColor,
  rgb8aToHexString,
  rgb8aToRgbString,
} from './color-rgb'
import {
  canParseHsl,
  parseHsl,
  rgb8aToHsla,
  hslaToRgb8a,
  hslaToHslString,
} from './color-hsl'
import {
  canParseHsv,
  parseHsv,
  rgb8aToHsva,
  hsvaToRgb8a,
  hsvaToHsvString,
} from './color-hsv'
import {
  canParseHwb,
  parseHwb,
  rgb8aToHwba,
  hwbaToRgb8a,
  hwbaToHwbString,
} from './color-hwb'
import {
  canParseLab,
  canParseLch,
  parseLab,
  parseLch,
  rgb8aToLaba,
  labaToRgb8a,
  rgb8aToLcha,
  lchaToRgb8a,
  labaToLabString,
  lchaToLchString,
} from './color-lab'
import {
  canParseOklab,
  canParseOklch,
  parseOklab,
  parseOklch,
  rgb8aToOklaba,
  oklabaToRgb8a,
  rgb8aToOklcha,
  oklchaToRgb8a,
  oklabaToOklabString,
  oklchaToOklchString,
} from './color-oklab'

/**
 * String literal union of all supported color spaces.
 *
 * @public
 */
export type ColorSpace =
  | 'rgb'
  | 'rgb8'
  | 'hsl'
  | 'hsv'
  | 'hwb'
  | 'lab'
  | 'lch'
  | 'oklab'
  | 'oklch'

/**
 * An RGBA color with channels `r` (0–1), `g` (0–1), `b` (0–1), and
 * `alpha` (0–1).
 *
 * @public
 */
export interface RGBA {
  readonly space: 'rgb'
  readonly r: number
  readonly g: number
  readonly b: number
  readonly alpha: number
}

/**
 * An 8-bit RGBA color with channels `r` (0–255), `g` (0–255), `b` (0–255),
 * and `alpha` (0–1). This is the format used by CSS `rgb()` and hex notation.
 *
 * @public
 */
export interface RGB8A {
  readonly space: 'rgb8'
  readonly r: number
  readonly g: number
  readonly b: number
  readonly alpha: number
}

/**
 * An HSLA color with `h` (0–360), `s` (0–1), `l` (0–1), and `alpha`
 * (0–1).
 *
 * @public
 */
export interface HSLA {
  readonly space: 'hsl'
  readonly h: number
  readonly s: number
  readonly l: number
  readonly alpha: number
}

/**
 * An HSVA color with `h` (0–360), `s` (0–1), `v` (0–1), and `alpha`
 * (0–1).
 *
 * @public
 */
export interface HSVA {
  readonly space: 'hsv'
  readonly h: number
  readonly s: number
  readonly v: number
  readonly alpha: number
}

/**
 * An HWBA color with `h` (0–360), `w` (0–1), `b` (0–1), and `alpha`
 * (0–1).
 *
 * @public
 */
export interface HWBA {
  readonly space: 'hwb'
  readonly h: number
  readonly w: number
  readonly b: number
  readonly alpha: number
}

/**
 * A CIE LAB color with `l` (0–1), `a` (~-125 to 125), `b` (~-125 to 125),
 * and `alpha` (0–1).
 *
 * @public
 */
export interface LABA {
  readonly space: 'lab'
  readonly l: number
  readonly a: number
  readonly b: number
  readonly alpha: number
}

/**
 * A CIE LCH color with `l` (0–1), `c` (0–150+), `h` (0–360), and `alpha`
 * (0–1).
 *
 * @public
 */
export interface LCHA {
  readonly space: 'lch'
  readonly l: number
  readonly c: number
  readonly h: number
  readonly alpha: number
}

/**
 * An OKLAB color with `l` (0–1), `a` (~-0.4 to 0.4), `b` (~-0.4 to 0.4),
 * and `alpha` (0–1).
 *
 * @public
 */
export interface OKLABA {
  readonly space: 'oklab'
  readonly l: number
  readonly a: number
  readonly b: number
  readonly alpha: number
}

/**
 * An OKLCH color with `l` (0–1), `c` (0–0.4+), `h` (0–360), and `alpha`
 * (0–1).
 *
 * @public
 */
export interface OKLCHA {
  readonly space: 'oklch'
  readonly l: number
  readonly c: number
  readonly h: number
  readonly alpha: number
}

/**
 * A color value in any of the supported color spaces.
 *
 * @public
 */
export type Color =
  | RGBA
  | RGB8A
  | HSLA
  | HSVA
  | HWBA
  | LABA
  | LCHA
  | OKLABA
  | OKLCHA

// ---------------------------------------------------------------------------
// Construction helpers
// ---------------------------------------------------------------------------

/**
 * Creates an RGBA color with channels in the 0–1 range.
 *
 * @param r - Red channel (0–1).
 * @param g - Green channel (0–1).
 * @param b - Blue channel (0–1).
 * @param alpha - Alpha channel (0–1). Defaults to 1.
 * @returns An RGBA color.
 * @public
 * @example
 * ```ts
 * rgba(1, 0, 0) // { space: 'rgb', r: 1, g: 0, b: 0, alpha: 1 }
 * rgba(1, 0, 0, 0.5) // { space: 'rgb', r: 1, g: 0, b: 0, alpha: 0.5 }
 * ```
 */
export const rgba = (r: number, g: number, b: number, alpha = 1): RGBA => ({
  space: 'rgb',
  r: clamp(r, 0, 1),
  g: clamp(g, 0, 1),
  b: clamp(b, 0, 1),
  alpha: clamp(alpha, 0, 1),
})

/**
 * Creates an 8-bit RGB8A color with channels in the 0–255 range.
 *
 * @param r - Red channel (0–255).
 * @param g - Green channel (0–255).
 * @param b - Blue channel (0–255).
 * @param alpha - Alpha channel (0–1). Defaults to 1.
 * @returns An RGB8A color.
 * @public
 * @example
 * ```ts
 * rgb8a(255, 0, 0) // { space: 'rgb8', r: 255, g: 0, b: 0, alpha: 1 }
 * rgb8a(255, 0, 0, 0.5) // { space: 'rgb8', r: 255, g: 0, b: 0, alpha: 0.5 }
 * ```
 */
export const rgb8a = (r: number, g: number, b: number, alpha = 1): RGB8A => ({
  space: 'rgb8',
  r: clampInt(r, 0, 255),
  g: clampInt(g, 0, 255),
  b: clampInt(b, 0, 255),
  alpha: clamp(alpha, 0, 1),
})

/**
 * Creates an HSLA color, wrapping hue and clamping other channels.
 *
 * @param h - Hue (0–360, wraps).
 * @param s - Saturation (0–1).
 * @param l - Lightness (0–1).
 * @param alpha - Alpha channel (0–1). Defaults to 1.
 * @returns An HSLA color.
 * @public
 * @example
 * ```ts
 * hsla(0, 1, 0.5) // { space: 'hsl', h: 0, s: 1, l: 0.5, alpha: 1 }
 * ```
 */
export const hsla = (h: number, s: number, l: number, alpha = 1): HSLA => ({
  space: 'hsl',
  h: wrapCircular(h, 360),
  s: clamp(s, 0, 1),
  l: clamp(l, 0, 1),
  alpha: clamp(alpha, 0, 1),
})

/**
 * Creates an HSVA color, wrapping hue and clamping other channels.
 *
 * @param h - Hue (0–360, wraps).
 * @param s - Saturation (0–1).
 * @param v - Value (0–1).
 * @param alpha - Alpha channel (0–1). Defaults to 1.
 * @returns An HSVA color.
 * @public
 * @example
 * ```ts
 * hsva(0, 1, 1) // { space: 'hsv', h: 0, s: 1, v: 1, alpha: 1 }
 * ```
 */
export const hsva = (h: number, s: number, v: number, alpha = 1): HSVA => ({
  space: 'hsv',
  h: wrapCircular(h, 360),
  s: clamp(s, 0, 1),
  v: clamp(v, 0, 1),
  alpha: clamp(alpha, 0, 1),
})

/**
 * Creates an HWBA color, wrapping hue and clamping other channels.
 *
 * @param h - Hue (0–360, wraps).
 * @param w - Whiteness (0–1).
 * @param b - Blackness (0–1).
 * @param alpha - Alpha channel (0–1). Defaults to 1.
 * @returns An HWBA color.
 * @public
 * @example
 * ```ts
 * hwba(0, 0, 0) // { space: 'hwb', h: 0, w: 0, b: 0, alpha: 1 }
 * ```
 */
export const hwba = (h: number, w: number, b: number, alpha = 1): HWBA => ({
  space: 'hwb',
  h: wrapCircular(h, 360),
  w: clamp(w, 0, 1),
  b: clamp(b, 0, 1),
  alpha: clamp(alpha, 0, 1),
})

/**
 * Creates a CIE LAB color.
 *
 * @param l - Lightness (0–1).
 * @param a - Green-red axis (~-125 to 125).
 * @param b - Blue-yellow axis (~-125 to 125).
 * @param alpha - Alpha channel (0–1). Defaults to 1.
 * @returns A LABA color.
 * @public
 * @example
 * ```ts
 * laba(0.5, -20, 30) // { space: 'lab', l: 0.5, a: -20, b: 30, alpha: 1 }
 * ```
 */
export const laba = (l: number, a: number, b: number, alpha = 1): LABA => ({
  space: 'lab',
  l: clamp(l, 0, 1),
  a,
  b,
  alpha: clamp(alpha, 0, 1),
})

/**
 * Creates a CIE LCH color.
 *
 * @param l - Lightness (0–1).
 * @param c - Chroma (0–150+).
 * @param h - Hue (0–360).
 * @param alpha - Alpha channel (0–1). Defaults to 1.
 * @returns A LCHA color.
 * @public
 * @example
 * ```ts
 * lcha(0.5, 36, 326) // { space: 'lch', l: 0.5, c: 36, h: 326, alpha: 1 }
 * ```
 */
export const lcha = (l: number, c: number, h: number, alpha = 1): LCHA => ({
  space: 'lch',
  l: clamp(l, 0, 1),
  c: Math.max(0, c),
  h: wrapCircular(h, 360),
  alpha: clamp(alpha, 0, 1),
})

/**
 * Creates an OKLAB color.
 *
 * @param l - Lightness (0–1).
 * @param a - Green-red axis (~-0.4 to 0.4).
 * @param b - Blue-yellow axis (~-0.4 to 0.4).
 * @param alpha - Alpha channel (0–1). Defaults to 1.
 * @returns An OKLABA color.
 * @public
 * @example
 * ```ts
 * oklaba(0.5, -0.1, 0.1) // { space: 'oklab', l: 0.5, a: -0.1, b: 0.1, alpha: 1 }
 * ```
 */
export const oklaba = (l: number, a: number, b: number, alpha = 1): OKLABA => ({
  space: 'oklab',
  l: clamp(l, 0, 1),
  a,
  b,
  alpha: clamp(alpha, 0, 1),
})

/**
 * Creates an OKLCH color.
 *
 * @param l - Lightness (0–1).
 * @param c - Chroma (0–0.4+).
 * @param h - Hue (0–360).
 * @param alpha - Alpha channel (0–1). Defaults to 1.
 * @returns An OKLCHA color.
 * @public
 * @example
 * ```ts
 * oklcha(0.5, 0.15, 326) // { space: 'oklch', l: 0.5, c: 0.15, h: 326, alpha: 1 }
 * ```
 */
export const oklcha = (l: number, c: number, h: number, alpha = 1): OKLCHA => ({
  space: 'oklch',
  l: clamp(l, 0, 1),
  c: Math.max(0, c),
  h: wrapCircular(h, 360),
  alpha: clamp(alpha, 0, 1),
})

// ---------------------------------------------------------------------------
// Type guards
// ---------------------------------------------------------------------------

/**
 * Returns `true` if the color is an RGBA color (0–1 channels).
 *
 * @param c - The color to check.
 * @returns `true` if the color is RGBA.
 * @public
 */
export const isRgba = (c: Color): c is RGBA => c.space === 'rgb'

/**
 * Returns `true` if the color is an RGB8A color (0–255 channels).
 *
 * @param c - The color to check.
 * @returns `true` if the color is RGB8A.
 * @public
 */
export const isRgb8a = (c: Color): c is RGB8A => c.space === 'rgb8'

/**
 * Returns `true` if the color is an HSLA color.
 *
 * @param c - The color to check.
 * @returns `true` if the color is HSLA.
 * @public
 */
export const isHsla = (c: Color): c is HSLA => c.space === 'hsl'

/**
 * Returns `true` if the color is an HSVA color.
 *
 * @param c - The color to check.
 * @returns `true` if the color is HSVA.
 * @public
 */
export const isHsva = (c: Color): c is HSVA => c.space === 'hsv'

/**
 * Returns `true` if the color is an HWBA color.
 *
 * @param c - The color to check.
 * @returns `true` if the color is HWBA.
 * @public
 */
export const isHwba = (c: Color): c is HWBA => c.space === 'hwb'

/**
 * Returns `true` if the color is a LABA color.
 *
 * @param c - The color to check.
 * @returns `true` if the color is LABA.
 * @public
 */
export const isLaba = (c: Color): c is LABA => c.space === 'lab'

/**
 * Returns `true` if the color is a LCHA color.
 *
 * @param c - The color to check.
 * @returns `true` if the color is LCHA.
 * @public
 */
export const isLcha = (c: Color): c is LCHA => c.space === 'lch'

/**
 * Returns `true` if the color is an OKLABA color.
 *
 * @param c - The color to check.
 * @returns `true` if the color is OKLABA.
 * @public
 */
export const isOklaba = (c: Color): c is OKLABA => c.space === 'oklab'

/**
 * Returns `true` if the color is an OKLCHA color.
 *
 * @param c - The color to check.
 * @returns `true` if the color is OKLCHA.
 * @public
 */
export const isOklcha = (c: Color): c is OKLCHA => c.space === 'oklch'

// ---------------------------------------------------------------------------
// Alpha parsing helper (shared across sub-modules)
// ---------------------------------------------------------------------------

/**
 * Parses an alpha value from a CSS string. Supports both decimal (`0.5`) and
 * percentage (`50%`) forms. Returns 1 when the value is `undefined`.
 *
 * @param s - The alpha string to parse.
 * @returns A number between 0 and 1.
 * @public
 */
export const parseAlpha = (s: string | undefined): number =>
  s == null
    ? 1
    : s.endsWith('%')
      ? clamp(parseFloat(s) / 100, 0, 1)
      : clamp(parseFloat(s), 0, 1)

// ---------------------------------------------------------------------------
// RGB <-> RGB8 conversion
// ---------------------------------------------------------------------------

/**
 * Converts an RGBA color (0–1) to an RGB8A color (0–255).
 *
 * @param c - The RGBA color to convert.
 * @returns An RGB8A color.
 * @public
 * @example
 * ```ts
 * rgbaToRgb8a(rgba(1, 0, 0)) // rgb8a(255, 0, 0)
 * ```
 */
export const rgbaToRgb8a = (c: RGBA): RGB8A =>
  rgb8a(
    Math.round(c.r * 255),
    Math.round(c.g * 255),
    Math.round(c.b * 255),
    c.alpha
  )

/**
 * Converts an RGB8A color (0–255) to an RGBA color (0–1).
 *
 * @param c - The RGB8A color to convert.
 * @returns An RGBA color.
 * @public
 * @example
 * ```ts
 * rgb8aToRgba(rgb8a(255, 0, 0)) // rgba(1, 0, 0)
 * ```
 */
export const rgb8aToRgba = (c: RGB8A): RGBA =>
  rgba(c.r / 255, c.g / 255, c.b / 255, c.alpha)

// ---------------------------------------------------------------------------
// Detection
// ---------------------------------------------------------------------------

/**
 * Detects the color space of a CSS color string. Returns `undefined` when the
 * format is not recognized.
 *
 * CSS color strings (`#hex`, `rgb()`, named colors) are detected as `'rgb8'`
 * since they use 0–255 integer channels.
 *
 * @param s - The string to inspect.
 * @returns The detected `ColorSpace`, or `undefined`.
 * @public
 * @example
 * ```ts
 * detectColorSpace('#ff0000') // 'rgb8'
 * detectColorSpace('hsl(0, 100%, 50%)') // 'hsl'
 * detectColorSpace('red') // 'rgb8'
 * detectColorSpace('nope') // undefined
 * ```
 */
export const detectColorSpace = (s: string): ColorSpace | undefined => {
  const trimmed = s.trim().toLowerCase()
  if (trimmed.startsWith('#')) return 'rgb8'
  if (trimmed.startsWith('rgba') || trimmed.startsWith('rgb(')) return 'rgb8'
  if (trimmed.startsWith('hsla') || trimmed.startsWith('hsl(')) return 'hsl'
  if (trimmed.startsWith('hsva') || trimmed.startsWith('hsv(')) return 'hsv'
  if (trimmed.startsWith('hwb(')) return 'hwb'
  if (trimmed.startsWith('oklab(')) return 'oklab'
  if (trimmed.startsWith('oklch(')) return 'oklch'
  if (trimmed.startsWith('lab(')) return 'lab'
  if (trimmed.startsWith('lch(')) return 'lch'
  if (trimmed in NAMED_COLORS) return 'rgb8'
  return undefined
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

/**
 * Returns `true` if the string can be parsed as any supported color format.
 *
 * @param s - The string to test.
 * @returns `true` if the string is a valid color.
 * @public
 * @example
 * ```ts
 * canParseColor('#ff0000') // true
 * canParseColor('rgb(255, 0, 0)') // true
 * canParseColor('red') // true
 * canParseColor('nope') // false
 * ```
 */
export const canParseColor = (s: string): boolean => {
  const space = detectColorSpace(s)
  if (space == null) return false
  switch (space) {
    case 'rgb8':
      return canParseHex(s) || canParseRgb(s) || canParseNamedColor(s)
    case 'hsl':
      return canParseHsl(s)
    case 'hsv':
      return canParseHsv(s)
    case 'hwb':
      return canParseHwb(s)
    case 'lab':
      return canParseLab(s)
    case 'lch':
      return canParseLch(s)
    case 'oklab':
      return canParseOklab(s)
    case 'oklch':
      return canParseOklch(s)
    default:
      return false
  }
}

// ---------------------------------------------------------------------------
// Parsing
// ---------------------------------------------------------------------------

/**
 * Parses a CSS color string into a `Color` value, auto-detecting the format.
 *
 * Supports hex, `rgb()`, `hsl()`, `hsv()`, `hwb()`, `lab()`, `lch()`,
 * `oklab()`, `oklch()`, and all 148 CSS named colors. Hex, `rgb()`, and
 * named colors produce `RGB8A` values.
 *
 * @param s - The string to parse.
 * @returns A `Color` value.
 * @throws ParsingError if the format is not recognized.
 * @public
 * @example
 * ```ts
 * parseColor('#ff0000') // RGB8A
 * parseColor('hsl(0, 100%, 50%)') // HSLA
 * parseColor('red') // RGB8A
 * ```
 */
export const parseColor = (s: string): Color => {
  const space = detectColorSpace(s)
  switch (space) {
    case 'rgb8': {
      const trimmed = s.trim()
      if (trimmed.startsWith('#')) return parseHex(s)
      if (/^rgba?\(/i.test(trimmed)) return parseRgb(s)
      return parseNamedColor(s)
    }
    case 'hsl':
      return parseHsl(s)
    case 'hsv':
      return parseHsv(s)
    case 'hwb':
      return parseHwb(s)
    case 'lab':
      return parseLab(s)
    case 'lch':
      return parseLch(s)
    case 'oklab':
      return parseOklab(s)
    case 'oklch':
      return parseOklch(s)
    default:
      throw new ParsingError(`Unrecognized color format: '${s}'`)
  }
}

// ---------------------------------------------------------------------------
// Conversion
// ---------------------------------------------------------------------------

const toRgb8a = (c: Color): RGB8A => {
  switch (c.space) {
    case 'rgb':
      return rgbaToRgb8a(c)
    case 'rgb8':
      return c
    case 'hsl':
      return hslaToRgb8a(c)
    case 'hsv':
      return hsvaToRgb8a(c)
    case 'hwb':
      return hwbaToRgb8a(c)
    case 'lab':
      return labaToRgb8a(c)
    case 'lch':
      return lchaToRgb8a(c)
    case 'oklab':
      return oklabaToRgb8a(c)
    case 'oklch':
      return oklchaToRgb8a(c)
  }
}

const fromRgb8a = (c: RGB8A, to: ColorSpace): Color => {
  switch (to) {
    case 'rgb':
      return rgb8aToRgba(c)
    case 'rgb8':
      return c
    case 'hsl':
      return rgb8aToHsla(c)
    case 'hsv':
      return rgb8aToHsva(c)
    case 'hwb':
      return rgb8aToHwba(c)
    case 'lab':
      return rgb8aToLaba(c)
    case 'lch':
      return rgb8aToLcha(c)
    case 'oklab':
      return rgb8aToOklaba(c)
    case 'oklch':
      return rgb8aToOklcha(c)
  }
}

/**
 * Converts a color from one color space to another.
 *
 * Uses RGB8A as an internal hub — the source color is first converted to
 * RGB8A, then from RGB8A to the target space.
 *
 * @param c - The color to convert.
 * @param to - The target color space.
 * @returns The converted color.
 * @public
 * @example
 * ```ts
 * convertColor(rgb8a(255, 0, 0), 'hsl') // hsla(0, 100, 50)
 * convertColor(hsla(120, 100, 50), 'rgb8') // rgb8a(0, 255, 0)
 * ```
 */
export const convertColor = (c: Color, to: ColorSpace): Color => {
  if (c.space === to) return c
  return fromRgb8a(toRgb8a(c), to)
}

// ---------------------------------------------------------------------------
// Serialization
// ---------------------------------------------------------------------------

/**
 * Serializes a color to a CSS-compatible string based on its color space.
 *
 * RGBA (0–1) colors are first converted to RGB8A for CSS serialization.
 *
 * @param c - The color to serialize.
 * @returns A CSS color string.
 * @public
 * @example
 * ```ts
 * colorToString(rgb8a(255, 0, 0)) // 'rgb(255, 0, 0)'
 * colorToString(hsla(0, 100, 50)) // 'hsl(0, 100%, 50%)'
 * ```
 */
export const colorToString = (c: Color): string => {
  switch (c.space) {
    case 'rgb':
      return rgb8aToRgbString(rgbaToRgb8a(c))
    case 'rgb8':
      return rgb8aToRgbString(c)
    case 'hsl':
      return hslaToHslString(c)
    case 'hsv':
      return hsvaToHsvString(c)
    case 'hwb':
      return hwbaToHwbString(c)
    case 'lab':
      return labaToLabString(c)
    case 'lch':
      return lchaToLchString(c)
    case 'oklab':
      return oklabaToOklabString(c)
    case 'oklch':
      return oklchaToOklchString(c)
  }
}

/**
 * Serializes an RGB8A color to a hex string. Convenience re-export from
 * `color-rgb`.
 *
 * @param c - The color to serialize.
 * @returns A hex color string.
 * @public
 */
export { rgb8aToHexString }
