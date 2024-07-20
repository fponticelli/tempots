/**
 * Constant value employed to see if two `number` values are very close.
 * @public
 **/
export const EPSILON = 1e-9

/**
 * number numbers can sometime introduce tiny errors even for simple operations.
 * `nearEquals` compares two floats using a tiny tollerance (last optional
 * argument). By default it is defined as `EPSILON`.
 *
 * @param a - The first number to compare.
 * @param b - The second number to compare.
 * @param tollerance - The tollerance value for comparing the two numbers.
 * @returns `true` if the two numbers are very close, `false` otherwise.
 * @public
 **/
export function nearEquals(
  a: number,
  b: number,
  tollerance = EPSILON
): boolean {
  if (isFinite(a)) {
    if (!isFinite(b)) return false
    return Math.abs(a - b) <= tollerance
  }
  if (isNaN(a)) return isNaN(b)
  if (isNaN(b)) return false
  if (!isFinite(b)) return a > 0 === b > 0
  // a is Infinity and b is finite
  return false
}

/**
 * `clamp` restricts a value within the specified range.
 *
 * @remarks
 * @example
 * ```ts
 * log(clamp(1.3, 0, 1)) // prints 1
 * log(clamp(0.8, 0, 1)) // prints 0.8
 * log(clamp(-0.5, 0, 1)) // prints 0.0
 * ```
 * @param value - The value to clamp.
 * @param min - The minimum value.
 * @param max - The maximum value.
 * @returns The clamped value.
 * @public
 **/
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/**
 * `clampInt` restricts a value within the specified range and returns an integer.
 *
 * @param value - The value to clamp.
 * @param min - The minimum value.
 * @param max - The maximum value.
 * @returns The clamped value as an integer.
 * @public
 **/
export function clampInt(value: number, min: number, max: number): number {
  return Math.trunc(clamp(value, min, max))
}

/**
 * `lerp` performs a linear interpolation between two values.
 *
 * @param a - The first value.
 * @param b - The second value.
 * @param t - The interpolation factor.
 * @returns The interpolated value.
 * @public
 **/
export function distanceFromOriginAngle(
  slope: number,
  intercept: number,
  angle: number
): number {
  const d = intercept / (Math.sin(angle) - slope * Math.cos(angle))
  if (d < 0) {
    return Infinity
  } else {
    return d
  }
}

/**
 * @internal
 */
export const _kappa = 24389 / 27
/**
 * @internal
 */
export const _epsilon = 216 / 24389

const mR0 = 3.240969941904521
const mR1 = -1.537383177570093
const mR2 = -0.498610760293
const mG0 = -0.96924363628087
const mG1 = 1.87596750150772
const mG2 = 0.041555057407175
const mB0 = 0.055630079696993
const mB1 = -0.20397695888897
const mB2 = 1.056971514242878

/**
 * @internal
 */
export function _calculateBoundingLines(
  l: number
): [
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
] {
  const sub1 = (l + 16) ** 3 / 1560896
  const sub2 = sub1 > _epsilon ? sub1 : l / _kappa
  const s1r = sub2 * (284517 * mR0 - 94839 * mR2)
  const s2r = sub2 * (838422 * mR2 + 769860 * mR1 + 731718 * mR0)
  const s3r = sub2 * (632260 * mR2 - 126452 * mR1)
  const s1g = sub2 * (284517 * mG0 - 94839 * mG2)
  const s2g = sub2 * (838422 * mG2 + 769860 * mG1 + 731718 * mG0)
  const s3g = sub2 * (632260 * mG2 - 126452 * mG1)
  const s1b = sub2 * (284517 * mB0 - 94839 * mB2)
  const s2b = sub2 * (838422 * mB2 + 769860 * mB1 + 731718 * mB0)
  const s3b = sub2 * (632260 * mB2 - 126452 * mB1)
  const r0s = s1r / s3r
  const r0i = (s2r * l) / s3r
  const r1s = s1r / (s3r + 126452)
  const r1i = ((s2r - 769860) * l) / (s3r + 126452)
  const g0s = s1g / s3g
  const g0i = (s2g * l) / s3g
  const g1s = s1g / (s3g + 126452)
  const g1i = ((s2g - 769860) * l) / (s3g + 126452)
  const b0s = s1b / s3b
  const b0i = (s2b * l) / s3b
  const b1s = s1b / (s3b + 126452)
  const b1i = ((s2b - 769860) * l) / (s3b + 126452)
  return [r0s, r0i, r1s, r1i, g0s, g0i, g1s, g1i, b0s, b0i, b1s, b1i]
}

/**
 * @internal
 */
export function _calculateMaxChromaHsluv(
  h: number,
  r0s: number,
  r0i: number,
  r1s: number,
  r1i: number,
  g0s: number,
  g0i: number,
  g1s: number,
  g1i: number,
  b0s: number,
  b0i: number,
  b1s: number,
  b1i: number
): number {
  const hueRad = (h / 180) * Math.PI
  const r0 = distanceFromOriginAngle(r0s, r0i, hueRad)
  const r1 = distanceFromOriginAngle(r1s, r1i, hueRad)
  const g0 = distanceFromOriginAngle(g0s, g0i, hueRad)
  const g1 = distanceFromOriginAngle(g1s, g1i, hueRad)
  const b0 = distanceFromOriginAngle(b0s, b0i, hueRad)
  const b1 = distanceFromOriginAngle(b1s, b1i, hueRad)
  return Math.min(r0, r1, g0, g1, b0, b1)
}

/**
 * @public
 */
export const WHITE_REFERENCE: [number, number, number] = [0.95047, 1, 1.08883]
