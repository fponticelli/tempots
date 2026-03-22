import { wrapCircular } from './number'
import { type Color, type OKLCHA, convertColor, oklcha } from './color'

const rotateHue = (c: Color, degrees: number): Color => {
  const original = c.space
  const ok = convertColor(c, 'oklch') as OKLCHA
  const rotated = oklcha(
    ok.l,
    ok.c,
    wrapCircular(ok.h + degrees, 360),
    ok.alpha
  )
  return convertColor(rotated, original)
}

/**
 * Returns the complementary color by rotating the hue
 * 180 degrees in OKLCH space.
 *
 * @param c - Any color value
 * @returns The complementary color in the same color
 *   space as the input
 * @example
 * ```ts
 * const red = rgba(1, 0, 0, 1)
 * const cyan = complement(red)
 * ```
 * @public
 */
export const complement = (c: Color): Color => rotateHue(c, 180)

/**
 * Returns an analogous color scheme consisting of the
 * original color and two neighbors at the given angle
 * offset.
 *
 * @param c - Any color value
 * @param angle - The hue offset in degrees (default 30)
 * @returns A triple of [original, +angle, -angle] in
 *   the same color space as the input
 * @example
 * ```ts
 * const red = rgba(1, 0, 0, 1)
 * const [base, warm, cool] = analogous(red)
 * ```
 * @public
 */
export const analogous = (c: Color, angle = 30): [Color, Color, Color] => [
  c,
  rotateHue(c, angle),
  rotateHue(c, -angle),
]

/**
 * Returns a triadic color scheme consisting of the
 * original color and two colors evenly spaced at 120
 * degree intervals.
 *
 * @param c - Any color value
 * @returns A triple of [original, +120, +240] in the
 *   same color space as the input
 * @example
 * ```ts
 * const red = rgba(1, 0, 0, 1)
 * const [a, b, c] = triadic(red)
 * ```
 * @public
 */
export const triadic = (c: Color): [Color, Color, Color] => [
  c,
  rotateHue(c, 120),
  rotateHue(c, 240),
]

/**
 * Returns a split-complementary color scheme consisting
 * of the original color and two colors adjacent to its
 * complement at 150 and 210 degree offsets.
 *
 * @param c - Any color value
 * @returns A triple of [original, +150, +210] in the
 *   same color space as the input
 * @example
 * ```ts
 * const red = rgba(1, 0, 0, 1)
 * const [base, left, right] = splitComplementary(red)
 * ```
 * @public
 */
export const splitComplementary = (c: Color): [Color, Color, Color] => [
  c,
  rotateHue(c, 150),
  rotateHue(c, 210),
]

/**
 * Returns a tetradic (rectangular) color scheme
 * consisting of the original color and three colors
 * evenly spaced at 90 degree intervals.
 *
 * @param c - Any color value
 * @returns A quadruple of [original, +90, +180, +270]
 *   in the same color space as the input
 * @example
 * ```ts
 * const red = rgba(1, 0, 0, 1)
 * const [a, b, c, d] = tetradic(red)
 * ```
 * @public
 */
export const tetradic = (c: Color): [Color, Color, Color, Color] => [
  c,
  rotateHue(c, 90),
  rotateHue(c, 180),
  rotateHue(c, 270),
]
