/**
 * Color mixing and interpolation utilities.
 *
 * @public
 */

import {
  type Color,
  type ColorSpace,
  type RGBA,
  type RGB8A,
  type HSLA,
  type HSVA,
  type HWBA,
  type LABA,
  type LCHA,
  type OKLABA,
  type OKLCHA,
  convertColor,
  rgba,
  rgb8a,
  hsla,
  hsva,
  hwba,
  laba,
  lcha,
  oklaba,
  oklcha,
} from './color'
import { interpolate, interpolateAngle } from './number'

const lerp = interpolate
const lerpHue = interpolateAngle

const mixInSpace = (
  a: Color,
  b: Color,
  t: number,
  space: ColorSpace
): Color => {
  const ca = convertColor(a, space)
  const cb = convertColor(b, space)

  switch (space) {
    case 'rgb': {
      const x = ca as RGBA
      const y = cb as RGBA
      return rgba(
        lerp(x.r, y.r, t),
        lerp(x.g, y.g, t),
        lerp(x.b, y.b, t),
        lerp(x.alpha, y.alpha, t)
      )
    }
    case 'rgb8': {
      const x = ca as RGB8A
      const y = cb as RGB8A
      return rgb8a(
        Math.round(lerp(x.r, y.r, t)),
        Math.round(lerp(x.g, y.g, t)),
        Math.round(lerp(x.b, y.b, t)),
        lerp(x.alpha, y.alpha, t)
      )
    }
    case 'hsl': {
      const x = ca as HSLA
      const y = cb as HSLA
      return hsla(
        lerpHue(x.h, y.h, t),
        lerp(x.s, y.s, t),
        lerp(x.l, y.l, t),
        lerp(x.alpha, y.alpha, t)
      )
    }
    case 'hsv': {
      const x = ca as HSVA
      const y = cb as HSVA
      return hsva(
        lerpHue(x.h, y.h, t),
        lerp(x.s, y.s, t),
        lerp(x.v, y.v, t),
        lerp(x.alpha, y.alpha, t)
      )
    }
    case 'hwb': {
      const x = ca as HWBA
      const y = cb as HWBA
      return hwba(
        lerpHue(x.h, y.h, t),
        lerp(x.w, y.w, t),
        lerp(x.b, y.b, t),
        lerp(x.alpha, y.alpha, t)
      )
    }
    case 'lab': {
      const x = ca as LABA
      const y = cb as LABA
      return laba(
        lerp(x.l, y.l, t),
        lerp(x.a, y.a, t),
        lerp(x.b, y.b, t),
        lerp(x.alpha, y.alpha, t)
      )
    }
    case 'lch': {
      const x = ca as LCHA
      const y = cb as LCHA
      return lcha(
        lerp(x.l, y.l, t),
        lerp(x.c, y.c, t),
        lerpHue(x.h, y.h, t),
        lerp(x.alpha, y.alpha, t)
      )
    }
    case 'oklab': {
      const x = ca as OKLABA
      const y = cb as OKLABA
      return oklaba(
        lerp(x.l, y.l, t),
        lerp(x.a, y.a, t),
        lerp(x.b, y.b, t),
        lerp(x.alpha, y.alpha, t)
      )
    }
    case 'oklch': {
      const x = ca as OKLCHA
      const y = cb as OKLCHA
      return oklcha(
        lerp(x.l, y.l, t),
        lerp(x.c, y.c, t),
        lerpHue(x.h, y.h, t),
        lerp(x.alpha, y.alpha, t)
      )
    }
  }
}

/**
 * Blends two colors together in the specified color space.
 *
 * Converts both colors to the target space, linearly
 * interpolates each channel (using shortest-path hue
 * interpolation for polar spaces), and returns the result
 * in the target space.
 *
 * @param a - The first color.
 * @param b - The second color.
 * @param t - The blend factor (0 = fully `a`, 1 = fully `b`).
 *   Defaults to 0.5.
 * @param space - The color space to blend in.
 *   Defaults to `'oklch'`.
 * @returns The blended color in the specified space.
 * @public
 * @example
 * ```ts
 * import { rgb8a } from './color'
 * mixColors(rgb8a(255, 0, 0), rgb8a(0, 0, 255))
 * // blended in oklch at t=0.5
 * mixColors(rgb8a(255, 0, 0), rgb8a(0, 0, 255), 0.25, 'lab')
 * // 25% blend in LAB space
 * ```
 */
export const mixColors = (
  a: Color,
  b: Color,
  t = 0.5,
  space: ColorSpace = 'oklch'
): Color => mixInSpace(a, b, t, space)

/**
 * Generates an array of evenly spaced colors between two
 * endpoints (inclusive).
 *
 * If `steps` is less than 2, returns a single-element array
 * containing the midpoint blend of `a` and `b`.
 *
 * @param a - The start color.
 * @param b - The end color.
 * @param steps - The number of colors to generate (inclusive
 *   of both endpoints).
 * @param space - The color space to interpolate in.
 *   Defaults to `'oklch'`.
 * @returns An array of interpolated colors.
 * @public
 * @example
 * ```ts
 * import { rgb8a } from './color'
 * interpolateColors(rgb8a(255, 0, 0), rgb8a(0, 0, 255), 5)
 * // [red, ..., blue] — 5 evenly spaced colors in oklch
 * ```
 */
export const interpolateColors = (
  a: Color,
  b: Color,
  steps: number,
  space: ColorSpace = 'oklch'
): Color[] => {
  if (steps < 2) {
    return [mixColors(a, b, 0.5, space)]
  }
  const result: Color[] = []
  for (let i = 0; i < steps; i++) {
    const t = i / (steps - 1)
    result.push(mixColors(a, b, t, space))
  }
  return result
}
