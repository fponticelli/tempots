/**
 * Utility functions for comparing, generating, and
 * identifying colors.
 *
 * @public
 */

import { nearEqual } from './number'
import { randomFloat } from './random'
import {
  type Color,
  type ColorSpace,
  type LABA,
  type RGB8A,
  convertColor,
  rgb8a,
  rgba,
  hsla,
  hsva,
  hwba,
  laba,
  lcha,
  oklaba,
  oklcha,
} from './color'
import { NAMED_COLORS } from './color-named'
import { colorDistanceSimple } from './color-distance'

/**
 * Checks whether two colors are perceptually equal within
 * a given tolerance, by comparing their CIELAB channels.
 *
 * Both colors are first converted to the LAB color space.
 * The `l`, `a`, and `b` channels are compared using the
 * supplied tolerance, while alpha is compared with a fixed
 * tolerance of 0.01.
 *
 * @param a - The first color.
 * @param b - The second color.
 * @param tolerance - Maximum allowed difference per LAB
 *   channel. Defaults to 0.01.
 * @returns `true` when every channel is within tolerance.
 * @public
 * @example
 * ```ts
 * import { rgb8a } from './color'
 * equalColors(rgb8a(255, 0, 0), rgb8a(254, 0, 0)) // true
 * equalColors(rgb8a(255, 0, 0), rgb8a(0, 0, 255))  // false
 * ```
 */
export const equalColors = (a: Color, b: Color, tolerance = 0.01): boolean => {
  const labA = convertColor(a, 'lab') as LABA
  const labB = convertColor(b, 'lab') as LABA
  return (
    nearEqual(labA.l, labB.l, tolerance) &&
    nearEqual(labA.a, labB.a, tolerance) &&
    nearEqual(labA.b, labB.b, tolerance) &&
    nearEqual(labA.alpha, labB.alpha, 0.01)
  )
}

/**
 * Generates a random color in the specified color space
 * with fully opaque alpha.
 *
 * Each channel is randomised within its natural range for
 * the target space. Alpha is always set to 1.
 *
 * @param space - The color space to generate in.
 *   Defaults to `'rgb8'`.
 * @returns A random {@link Color} in the requested space.
 * @public
 * @example
 * ```ts
 * const c = randomColor('hsl')
 * c.space // 'hsl'
 * ```
 */
export const randomColor = (space: ColorSpace = 'rgb8'): Color => {
  switch (space) {
    case 'rgb':
      return rgba(randomFloat(0, 1), randomFloat(0, 1), randomFloat(0, 1))
    case 'rgb8':
      return rgb8a(
        Math.round(randomFloat(0, 255)),
        Math.round(randomFloat(0, 255)),
        Math.round(randomFloat(0, 255))
      )
    case 'hsl':
      return hsla(randomFloat(0, 360), randomFloat(0, 1), randomFloat(0, 1))
    case 'hsv':
      return hsva(randomFloat(0, 360), randomFloat(0, 1), randomFloat(0, 1))
    case 'hwb':
      return hwba(randomFloat(0, 360), randomFloat(0, 1), randomFloat(0, 1))
    case 'lab':
      return laba(
        randomFloat(0, 1),
        randomFloat(-125, 125),
        randomFloat(-125, 125)
      )
    case 'lch':
      return lcha(randomFloat(0, 1), randomFloat(0, 150), randomFloat(0, 360))
    case 'oklab':
      return oklaba(
        randomFloat(0, 1),
        randomFloat(-0.4, 0.4),
        randomFloat(-0.4, 0.4)
      )
    case 'oklch':
      return oklcha(randomFloat(0, 1), randomFloat(0, 0.4), randomFloat(0, 360))
  }
}

/**
 * Finds the CSS named color closest to the given color
 * using CIE76 (simple Euclidean) distance in CIELAB space.
 *
 * @param c - The color to match against.
 * @returns The lowercase CSS color name that is
 *   perceptually closest to `c`.
 * @public
 * @example
 * ```ts
 * import { rgb8a } from './color'
 * closestNamedColor(rgb8a(255, 0, 0)) // 'red'
 * ```
 */
export const closestNamedColor = (c: Color): string => {
  let bestName = ''
  let bestDist = Infinity

  for (const name of Object.keys(NAMED_COLORS)) {
    const [r, g, b] = NAMED_COLORS[name]
    const namedColor: RGB8A = rgb8a(r, g, b)
    const dist = colorDistanceSimple(c, namedColor)
    if (dist < bestDist) {
      bestDist = dist
      bestName = name
    }
  }

  return bestName
}
