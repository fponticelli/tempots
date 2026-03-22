import { clamp } from './number'
import {
  type Color,
  type OKLCHA,
  type RGB8A,
  convertColor,
  rgb8a,
  oklcha,
} from './color'

/**
 * Increases the lightness of a color by the given amount.
 *
 * Operates in OKLCH space and returns the result in the
 * same color space as the input.
 *
 * @param c - The color to lighten.
 * @param amount - A value between 0 and 1 indicating how
 *   much to increase lightness.
 * @returns The lightened color in the original color space.
 * @public
 * @example
 * ```ts
 * const light = lighten(rgb8a(100, 50, 50, 1), 0.2)
 * ```
 */
export const lighten = (c: Color, amount: number): Color => {
  const original = c.space
  const ok = convertColor(c, 'oklch') as OKLCHA
  const adjusted = oklcha(clamp(ok.l + amount, 0, 1), ok.c, ok.h, ok.alpha)
  return convertColor(adjusted, original)
}

/**
 * Decreases the lightness of a color by the given amount.
 *
 * Operates in OKLCH space and returns the result in the
 * same color space as the input.
 *
 * @param c - The color to darken.
 * @param amount - A value between 0 and 1 indicating how
 *   much to decrease lightness.
 * @returns The darkened color in the original color space.
 * @public
 * @example
 * ```ts
 * const dark = darken(rgb8a(200, 150, 150, 1), 0.2)
 * ```
 */
export const darken = (c: Color, amount: number): Color => {
  const original = c.space
  const ok = convertColor(c, 'oklch') as OKLCHA
  const adjusted = oklcha(clamp(ok.l - amount, 0, 1), ok.c, ok.h, ok.alpha)
  return convertColor(adjusted, original)
}

/**
 * Increases the chroma (saturation) of a color by the
 * given amount.
 *
 * Operates in OKLCH space. The amount is scaled by 0.4 to
 * map the 0–1 input range to the typical OKLCH chroma
 * range.
 *
 * @param c - The color to saturate.
 * @param amount - A value between 0 and 1 indicating how
 *   much to increase chroma.
 * @returns The saturated color in the original color space.
 * @public
 * @example
 * ```ts
 * const vivid = saturate(rgb8a(100, 100, 100, 1), 0.5)
 * ```
 */
export const saturate = (c: Color, amount: number): Color => {
  const original = c.space
  const ok = convertColor(c, 'oklch') as OKLCHA
  const adjusted = oklcha(
    ok.l,
    Math.max(0, ok.c + amount * 0.4),
    ok.h,
    ok.alpha
  )
  return convertColor(adjusted, original)
}

/**
 * Decreases the chroma (saturation) of a color by the
 * given amount.
 *
 * Operates in OKLCH space. The amount is scaled by 0.4 to
 * map the 0–1 input range to the typical OKLCH chroma
 * range.
 *
 * @param c - The color to desaturate.
 * @param amount - A value between 0 and 1 indicating how
 *   much to decrease chroma.
 * @returns The desaturated color in the original color
 *   space.
 * @public
 * @example
 * ```ts
 * const muted = desaturate(rgb8a(255, 0, 0, 1), 0.5)
 * ```
 */
export const desaturate = (c: Color, amount: number): Color => {
  const original = c.space
  const ok = convertColor(c, 'oklch') as OKLCHA
  const adjusted = oklcha(
    ok.l,
    Math.max(0, ok.c - amount * 0.4),
    ok.h,
    ok.alpha
  )
  return convertColor(adjusted, original)
}

/**
 * Increases the opacity (alpha) of a color by the given
 * amount.
 *
 * No color space conversion is performed — the alpha
 * channel is adjusted directly.
 *
 * @param c - The color to make more opaque.
 * @param amount - A value between 0 and 1 indicating how
 *   much to increase alpha.
 * @returns The color with increased opacity, in the same
 *   color space.
 * @public
 * @example
 * ```ts
 * const opaque = opacify(rgb8a(100, 50, 50, 0.5), 0.3)
 * // alpha is now 0.8
 * ```
 */
export const opacify = (c: Color, amount: number): Color => {
  return {
    ...c,
    alpha: clamp(c.alpha + amount, 0, 1),
  } as typeof c
}

/**
 * Decreases the opacity (alpha) of a color by the given
 * amount.
 *
 * No color space conversion is performed — the alpha
 * channel is adjusted directly.
 *
 * @param c - The color to make more transparent.
 * @param amount - A value between 0 and 1 indicating how
 *   much to decrease alpha.
 * @returns The color with decreased opacity, in the same
 *   color space.
 * @public
 * @example
 * ```ts
 * const faded = transparentize(rgb8a(100, 50, 50, 1), 0.3)
 * // alpha is now 0.7
 * ```
 */
export const transparentize = (c: Color, amount: number): Color => {
  return {
    ...c,
    alpha: clamp(c.alpha - amount, 0, 1),
  } as typeof c
}

/**
 * Inverts the RGB channels of a color while preserving
 * alpha.
 *
 * Converts to RGB8 space, inverts each channel
 * (`255 - value`), and converts back to the original
 * color space.
 *
 * @param c - The color to invert.
 * @returns The inverted color in the original color space.
 * @public
 * @example
 * ```ts
 * const inv = invert(rgb8a(255, 0, 0, 1))
 * // result is cyan: rgb8a(0, 255, 255, 1)
 * ```
 */
export const invert = (c: Color): Color => {
  const original = c.space
  const rgb = convertColor(c, 'rgb8') as RGB8A
  const inverted = rgb8a(255 - rgb.r, 255 - rgb.g, 255 - rgb.b, rgb.alpha)
  return convertColor(inverted, original)
}

/**
 * Converts a color to grayscale by removing all chroma.
 *
 * Operates in OKLCH space by setting chroma to 0 while
 * preserving lightness and hue. Returns the result in the
 * same color space as the input.
 *
 * @param c - The color to convert to grayscale.
 * @returns The grayscale color in the original color space.
 * @public
 * @example
 * ```ts
 * const gray = grayscale(rgb8a(255, 0, 0, 1))
 * ```
 */
export const grayscale = (c: Color): Color => {
  const original = c.space
  const ok = convertColor(c, 'oklch') as OKLCHA
  const adjusted = oklcha(ok.l, 0, ok.h, ok.alpha)
  return convertColor(adjusted, original)
}
