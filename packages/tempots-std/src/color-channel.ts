/**
 * Channel-level access and mutation utilities for colors.
 *
 * @public
 */

import { clamp } from './number'
import {
  type Color,
  type RGBA,
  type RGB8A,
  type HSLA,
  type HSVA,
  type HWBA,
  type LABA,
  type LCHA,
  type OKLABA,
  type OKLCHA,
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

/**
 * Extracts the channel names of a color type, excluding the `space`
 * discriminant.
 *
 * @public
 */
export type ChannelOf<C extends Color> = Exclude<keyof C, 'space'>

/**
 * Returns the value of a single channel from a color.
 *
 * The `channel` parameter is type-safe — only channels that exist on the
 * specific color type are accepted.
 *
 * @param c - The color to read from.
 * @param channel - The channel name.
 * @returns The channel value.
 * @public
 * @example
 * ```ts
 * getChannel(rgb8a(255, 0, 0), 'r') // 255
 * getChannel(hsla(120, 50, 75), 'h') // 120
 * ```
 */
export const getChannel = <C extends Color>(
  c: C,
  channel: ChannelOf<C>
): number => c[channel] as number

/**
 * Returns all channels of a color as a plain object, excluding the `space`
 * discriminant.
 *
 * @param c - The color to extract channels from.
 * @returns An object mapping channel names to values.
 * @public
 * @example
 * ```ts
 * getChannels(rgb8a(255, 0, 0))
 * // { r: 255, g: 0, b: 0, alpha: 1 }
 * ```
 */
export const getChannels = <C extends Color>(c: C): Omit<C, 'space'> => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { space, ...channels } = c
  return channels as Omit<C, 'space'>
}

/**
 * Returns all channel values of a color as a number array.
 *
 * The order is consistent per color space: color-specific channels first,
 * then alpha. For example, RGB8 returns `[r, g, b, alpha]`, HSL returns
 * `[h, s, l, alpha]`.
 *
 * @param c - The color to extract values from.
 * @returns An array of channel values.
 * @public
 * @example
 * ```ts
 * getChannelsAsArray(rgb8a(255, 0, 0)) // [255, 0, 0, 1]
 * getChannelsAsArray(hsla(120, 50, 75, 0.5)) // [120, 50, 75, 0.5]
 * ```
 */
export const getChannelsAsArray = (c: Color): number[] => {
  switch (c.space) {
    case 'rgb':
      return [c.r, c.g, c.b, c.alpha]
    case 'rgb8':
      return [c.r, c.g, c.b, c.alpha]
    case 'hsl':
      return [c.h, c.s, c.l, c.alpha]
    case 'hsv':
      return [c.h, c.s, c.v, c.alpha]
    case 'hwb':
      return [c.h, c.w, c.b, c.alpha]
    case 'lab':
      return [c.l, c.a, c.b, c.alpha]
    case 'lch':
      return [c.l, c.c, c.h, c.alpha]
    case 'oklab':
      return [c.l, c.a, c.b, c.alpha]
    case 'oklch':
      return [c.l, c.c, c.h, c.alpha]
  }
}

/**
 * Creates a new color with one or more channels replaced, applying
 * clamping and hue wrapping via the color's constructor.
 *
 * Returns the same color type as the input.
 *
 * @param c - The source color.
 * @param changes - An object with the channels to change.
 * @returns A new color with the changes applied.
 * @public
 * @example
 * ```ts
 * withColor(rgb8a(255, 0, 0), { g: 255 })
 * // rgb8a(255, 255, 0)
 *
 * withColor(hsla(0, 100, 50), { h: 120 })
 * // hsla(120, 100, 50)
 * ```
 */
export const withColor = <C extends Color>(
  c: C,
  changes: Partial<Omit<C, 'space'>>
): C => {
  switch (c.space) {
    case 'rgb': {
      const m = { ...c, ...changes } as RGBA
      return rgba(m.r, m.g, m.b, m.alpha) as C
    }
    case 'rgb8': {
      const m = { ...c, ...changes } as RGB8A
      return rgb8a(m.r, m.g, m.b, m.alpha) as C
    }
    case 'hsl': {
      const m = { ...c, ...changes } as HSLA
      return hsla(m.h, m.s, m.l, m.alpha) as C
    }
    case 'hsv': {
      const m = { ...c, ...changes } as HSVA
      return hsva(m.h, m.s, m.v, m.alpha) as C
    }
    case 'hwb': {
      const m = { ...c, ...changes } as HWBA
      return hwba(m.h, m.w, m.b, m.alpha) as C
    }
    case 'lab': {
      const m = { ...c, ...changes } as LABA
      return laba(m.l, m.a, m.b, m.alpha) as C
    }
    case 'lch': {
      const m = { ...c, ...changes } as LCHA
      return lcha(m.l, m.c, m.h, m.alpha) as C
    }
    case 'oklab': {
      const m = { ...c, ...changes } as OKLABA
      return oklaba(m.l, m.a, m.b, m.alpha) as C
    }
    case 'oklch': {
      const m = { ...c, ...changes } as OKLCHA
      return oklcha(m.l, m.c, m.h, m.alpha) as C
    }
  }
}

/**
 * Creates a new color with the alpha channel set to the given value.
 *
 * This is a shortcut for `withColor(c, { alpha })`.
 *
 * @param c - The source color.
 * @param alpha - The new alpha value (0–1).
 * @returns A new color with the updated alpha.
 * @public
 * @example
 * ```ts
 * withAlpha(rgb8a(255, 0, 0), 0.5) // rgb8a(255, 0, 0, 0.5)
 * withAlpha(hsla(120, 100, 50), 0) // hsla(120, 100, 50, 0)
 * ```
 */
export const withAlpha = <C extends Color>(c: C, alpha: number): C =>
  ({ ...c, alpha: clamp(alpha, 0, 1) }) as C

/**
 * Returns `true` if the color is fully opaque (alpha >= 1).
 *
 * @param c - The color to check.
 * @returns `true` if opaque.
 * @public
 * @example
 * ```ts
 * isOpaque(rgb8a(255, 0, 0)) // true
 * isOpaque(rgb8a(255, 0, 0, 0.5)) // false
 * ```
 */
export const isOpaque = (c: Color): boolean => c.alpha >= 1

/**
 * Returns `true` if the color is fully transparent (alpha <= 0).
 *
 * @param c - The color to check.
 * @returns `true` if transparent.
 * @public
 * @example
 * ```ts
 * isTransparent(rgb8a(255, 0, 0, 0)) // true
 * isTransparent(rgb8a(255, 0, 0, 0.5)) // false
 * ```
 */
export const isTransparent = (c: Color): boolean => c.alpha <= 0
