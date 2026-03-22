/**
 * Gamut checking and clamping utilities for colors.
 *
 * @public
 */

import {
  type Color,
  type RGB8A,
  type OKLCHA,
  convertColor,
  rgb8a,
  oklcha,
} from './color'

// ---------------------------------------------------------------------------
// Internal helpers — duplicated from color-lab.ts / color-oklab.ts
// since they are not exported and we need unclamped sRGB values.
// ---------------------------------------------------------------------------

const linearToSrgb = (v: number): number =>
  v <= 0.0031308 ? v * 12.92 : 1.055 * Math.pow(v, 1 / 2.4) - 0.055

// XYZ D65 -> linear sRGB
const xyzToLinearRgb = (
  x: number,
  y: number,
  z: number
): [number, number, number] => [
  3.2404542 * x - 1.5371385 * y - 0.4985314 * z,
  -0.969266 * x + 1.8760108 * y + 0.041556 * z,
  0.0556434 * x - 0.2040259 * y + 1.0572252 * z,
]

// XYZ <-> LAB
const D65_Xn = 0.95047
const D65_Yn = 1.0
const D65_Zn = 1.08883
const DELTA = 6 / 29
const DELTA_SQ_3 = 3 * DELTA ** 2

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

// OKLAB -> linear sRGB
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
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ]
}

// OKLCH -> OKLAB
const oklchToOklab = (
  l: number,
  c: number,
  h: number
): [number, number, number] => {
  const rad = (h * Math.PI) / 180
  return [l, c * Math.cos(rad), c * Math.sin(rad)]
}

// LCH -> LAB
const lchToLab = (
  l: number,
  c: number,
  h: number
): [number, number, number] => {
  const rad = (h * Math.PI) / 180
  return [l, c * Math.cos(rad), c * Math.sin(rad)]
}

/**
 * Computes unclamped sRGB values (0–1 range when in gamut) for any color.
 * Values outside 0–1 indicate the color is out of the sRGB gamut.
 */
const toUnclampedSrgb = (c: Color): [number, number, number, number] => {
  switch (c.space) {
    case 'rgb':
      return [c.r, c.g, c.b, c.alpha]
    case 'rgb8':
      return [c.r / 255, c.g / 255, c.b / 255, c.alpha]
    case 'oklab': {
      const [rl, gl, bl] = oklabToLinearSrgb(c.l, c.a, c.b)
      return [linearToSrgb(rl), linearToSrgb(gl), linearToSrgb(bl), c.alpha]
    }
    case 'oklch': {
      const [ol, oa, ob] = oklchToOklab(c.l, c.c, c.h)
      const [rl, gl, bl] = oklabToLinearSrgb(ol, oa, ob)
      return [linearToSrgb(rl), linearToSrgb(gl), linearToSrgb(bl), c.alpha]
    }
    case 'lab': {
      const [x, y, z] = labToXyz(c.l, c.a, c.b)
      const [rl, gl, bl] = xyzToLinearRgb(x, y, z)
      return [linearToSrgb(rl), linearToSrgb(gl), linearToSrgb(bl), c.alpha]
    }
    case 'lch': {
      const [ll, la, lb] = lchToLab(c.l, c.c, c.h)
      const [x, y, z] = labToXyz(ll, la, lb)
      const [rl, gl, bl] = xyzToLinearRgb(x, y, z)
      return [linearToSrgb(rl), linearToSrgb(gl), linearToSrgb(bl), c.alpha]
    }
    default: {
      // HSL, HSV, HWB — these are defined within sRGB so convert
      // via the hub (clamped, but always in gamut by definition)
      const rgb = convertColor(c, 'rgb8') as RGB8A
      return [rgb.r / 255, rgb.g / 255, rgb.b / 255, rgb.alpha]
    }
  }
}

/**
 * Tests whether a color is within the sRGB gamut.
 *
 * Colors in HSL, HSV, HWB, RGB, and RGB8 spaces are always in gamut by
 * definition. Colors in LAB, LCH, OKLAB, and OKLCH may fall outside sRGB
 * if their chroma is too high.
 *
 * @param c - The color to test.
 * @param tolerance - How far outside 0–1 is still considered in-gamut.
 *   Defaults to 0.002 to account for floating-point imprecision.
 * @returns `true` if the color is representable in sRGB.
 * @public
 * @example
 * ```ts
 * isInGamut(rgb8a(255, 0, 0)) // true
 * isInGamut(oklcha(0.5, 0.4, 150)) // likely false (very high chroma)
 * ```
 */
export const isInGamut = (c: Color, tolerance = 0.002): boolean => {
  const [r, g, b] = toUnclampedSrgb(c)
  return (
    r >= -tolerance &&
    r <= 1 + tolerance &&
    g >= -tolerance &&
    g <= 1 + tolerance &&
    b >= -tolerance &&
    b <= 1 + tolerance
  )
}

/**
 * Clamps a color to the sRGB gamut by clamping RGB channel values.
 *
 * If the color is already in gamut, it is returned unchanged. Otherwise,
 * it is converted to RGB8 (which clamps channels to 0–255) and converted
 * back to the original color space.
 *
 * For perceptually better results on wide-gamut colors, use
 * {@link clampToGamutOklch} which preserves lightness and hue.
 *
 * @param c - The color to clamp.
 * @returns A color within the sRGB gamut in the original color space.
 * @public
 * @example
 * ```ts
 * clampToGamut(rgb8a(255, 0, 0)) // unchanged
 * ```
 */
export const clampToGamut = (c: Color): Color => {
  if (isInGamut(c)) return c
  const original = c.space
  const rgb = convertColor(c, 'rgb8') as RGB8A
  const clamped = rgb8a(rgb.r, rgb.g, rgb.b, rgb.alpha)
  return convertColor(clamped, original)
}

/**
 * Clamps a color to the sRGB gamut by reducing chroma in OKLCH space
 * while preserving lightness and hue.
 *
 * This produces more perceptually pleasing results than simple RGB
 * clamping, as it finds the most saturated version of the color that
 * still fits within sRGB.
 *
 * Uses binary search to find the maximum in-gamut chroma.
 *
 * @param c - The color to clamp.
 * @returns A color within the sRGB gamut in the original color space.
 * @public
 * @example
 * ```ts
 * clampToGamutOklch(oklcha(0.5, 0.4, 150))
 * // Same lightness and hue, reduced chroma to fit sRGB
 * ```
 */
export const clampToGamutOklch = (c: Color): Color => {
  if (isInGamut(c)) return c
  const original = c.space
  const ok = convertColor(c, 'oklch') as OKLCHA

  let lo = 0
  let hi = ok.c
  const epsilon = 0.0001

  for (let i = 0; i < 50 && hi - lo > epsilon; i++) {
    const mid = (lo + hi) / 2
    const candidate = oklcha(ok.l, mid, ok.h, ok.alpha)
    if (isInGamut(candidate)) {
      lo = mid
    } else {
      hi = mid
    }
  }

  const result = oklcha(ok.l, lo, ok.h, ok.alpha)
  return convertColor(result, original)
}
