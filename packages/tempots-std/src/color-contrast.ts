import { type Color, type RGB8A, convertColor, rgb8a } from './color'

/**
 * WCAG contrast level thresholds.
 *
 * - `'AA'` — 4.5:1 for normal text
 * - `'AAA'` — 7:1 for normal text
 * - `'AA-large'` — 3:1 for large text
 * - `'AAA-large'` — 4.5:1 for large text
 *
 * @public
 */
export type ContrastLevel = 'AA' | 'AAA' | 'AA-large' | 'AAA-large'

const srgbToLinear = (v: number): number =>
  v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)

/**
 * Computes the WCAG relative luminance of a color.
 *
 * Converts the color to sRGB, linearizes each channel,
 * and returns the weighted sum per the WCAG 2.x formula.
 *
 * @param c - The color to measure
 * @returns A number between 0 (darkest) and 1 (lightest)
 *
 * @example
 * ```ts
 * luminance(rgb8a(255, 255, 255)) // 1
 * luminance(rgb8a(0, 0, 0))       // 0
 * ```
 *
 * @public
 */
export const luminance = (c: Color): number => {
  const rgb = convertColor(c, 'rgb8') as RGB8A
  const r = srgbToLinear(rgb.r / 255)
  const g = srgbToLinear(rgb.g / 255)
  const b = srgbToLinear(rgb.b / 255)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/**
 * Computes the WCAG contrast ratio between two colors.
 *
 * The ratio ranges from 1:1 (identical) to 21:1
 * (black vs white).
 *
 * @param a - The first color
 * @param b - The second color
 * @returns A number between 1 and 21
 *
 * @example
 * ```ts
 * contrastRatio(
 *   rgb8a(0, 0, 0),
 *   rgb8a(255, 255, 255)
 * ) // 21
 * ```
 *
 * @public
 */
export const contrastRatio = (a: Color, b: Color): number => {
  const la = luminance(a)
  const lb = luminance(b)
  const l1 = Math.max(la, lb)
  const l2 = Math.min(la, lb)
  return (l1 + 0.05) / (l2 + 0.05)
}

/**
 * Picks whichever of two candidates has better contrast
 * against a reference color.
 *
 * Useful for choosing a readable foreground color for
 * a given background.
 *
 * @param c - The reference color (e.g. a background)
 * @param dark - The dark candidate (defaults to black)
 * @param light - The light candidate (defaults to white)
 * @returns The candidate with the higher contrast ratio
 *
 * @example
 * ```ts
 * // Returns white for a dark background
 * contrastColor(rgb8a(30, 30, 30))
 *
 * // Returns black for a light background
 * contrastColor(rgb8a(220, 220, 220))
 * ```
 *
 * @public
 */
export const contrastColor = (
  c: Color,
  dark: Color = rgb8a(0, 0, 0),
  light: Color = rgb8a(255, 255, 255)
): Color => {
  const darkRatio = contrastRatio(c, dark)
  const lightRatio = contrastRatio(c, light)
  return darkRatio >= lightRatio ? dark : light
}

const contrastThresholds: Record<ContrastLevel, number> = {
  AA: 4.5,
  AAA: 7,
  'AA-large': 3,
  'AAA-large': 4.5,
}

/**
 * Checks whether two colors meet a WCAG contrast level.
 *
 * @param a - The first color
 * @param b - The second color
 * @param level - The WCAG level to test against
 * @returns `true` if the contrast ratio meets or exceeds
 *   the threshold for the given level
 *
 * @example
 * ```ts
 * meetsContrast(
 *   rgb8a(0, 0, 0),
 *   rgb8a(255, 255, 255),
 *   'AAA'
 * ) // true
 * ```
 *
 * @public
 */
export const meetsContrast = (
  a: Color,
  b: Color,
  level: ContrastLevel
): boolean => contrastRatio(a, b) >= contrastThresholds[level]
