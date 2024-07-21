import { lpad } from './string'

/**
 * Constant value employed to see if two `number` values are very close.
 * @public
 */
export const EPSILON = 1e-9

/**
 * Calculates the minimum difference between two angles in degrees.
 *
 * @param a - The first angle in degrees.
 * @param b - The second angle in degrees.
 * @param turn - The total number of degrees in a full turn. Default is 360.0.
 * @returns The difference between the two angles.
 * @public
 * @example
 * ```ts
 * angleDifference(0, 90) // returns 90
 * angleDifference(90, 0) // returns -90
 * angleDifference(0, 270) // returns -90
 * angleDifference(270, 0) // returns 90
 * ```
 */
export const angleDifference = (a: number, b: number, turn = 360.0): number => {
  let r = (b - a) % turn
  if (r < 0) r += turn
  if (r > turn / 2) r -= turn
  return r
}

/**
 * Rounds a number up to the specified number of decimals.
 *
 * @param v - The number to round up.
 * @param decimals - The number of decimals to round up to.
 * @returns The rounded up number.
 * @public
 * @example
 * ```ts
 * ceilTo(1.234, 2) // returns 1.24
 * ceilTo(1.234, 1) // returns 1.3
 * ceilTo(1.234, 0) // returns 2
 * ```
 */
export const ceilTo = (v: number, decimals: number): number => {
  const p = Math.pow(10, decimals)
  return Math.ceil(v * p) / p
}

/**
 * `clamp` restricts a value within the specified range.
 *
 * @param value - The value to clamp.
 * @param min - The minimum value.
 * @param max - The maximum value.
 * @returns The clamped value.
 * @public
 * @example
 * ```ts
 * clamp(1.3, 0, 1) // returns 1
 * clamp(0.8, 0, 1) // returns 0.8
 * clamp(-0.5, 0, 1) // returns 0.0
 * ```
 **/
export const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max)

/**
 * Clamps a number to a specified range and returns an integer value.
 *
 * @param value - The number to clamp.
 * @param min - The minimum value of the range.
 * @param max - The maximum value of the range.
 * @returns The clamped integer value.
 * @public
 * @example
 * ```ts
 * clampInt(5, 0, 10) // returns 5
 * clampInt(15, 0, 10) // returns 10
 * clampInt(-5, 0, 10) // returns 0
 * ```
 **/
export const clampInt = (value: number, min: number, max: number): number =>
  Math.trunc(clamp(value, min, max))

/**
 * Like clamp but you only pass one argument (`max`) that is used as the upper limit
 * and the opposite (additive inverse or `-max`) as the lower limit.
 *
 * @param v - The value to clamp.
 * @param max - The maximum value.
 * @returns The clamped value.
 * @public
 * @example
 * ```ts
 * clampSym(5, 10) // returns 5
 * clampSym(15, 10) // returns 10
 * clampSym(-5, 10) // returns -5
 * clampSym(-15, 10) // returns -10
 * ```
 **/
export const clampSym = (v: number, max: number): number => clamp(v, -max, max)

/**
 * It returns the comparison value (an integer number) between two `float` values.
 *
 * @param a - The first value to compare.
 * @param b - The second value to compare.
 * @returns A number indicating the relative order of the two values.
 * @public
 * @example
 * ```ts
 * compare(5, 10) // returns -1
 * compare(10, 5) // returns 1
 * compare(5, 5) // returns 0
 * ```
 **/
export const compareNumbers = (a: number, b: number): number =>
  a < b ? -1 : a > b ? 1 : 0

/**
 * Rounds a number down to the specified number of decimals.
 *
 * @param v - The number to round down.
 * @param decimals - The number of decimals to round down to.
 * @returns The rounded down number.
 * @public
 * @example
 * ```ts
 * floorTo(1.234, 2) // returns 1.23
 * floorTo(1.234, 1) // returns 1.2
 * floorTo(1.234, 0) // returns 1
 * ```
 **/
export const floorTo = (v: number, decimals: number): number => {
  const p = Math.pow(10, decimals)
  return Math.floor(v * p) / p
}

/**
 * Converts a number to its hexadecimal representation.
 *
 * @param num - The number to convert.
 * @param length - The desired length of the hexadecimal string. Defaults to 0.
 * @returns The hexadecimal representation of the number.
 * @public
 * @example
 * ```ts
 * toHex(255) // returns 'ff'
 * toHex(255, 4) // returns '00ff'
 * toHex(255, 8) // returns '000000ff'
 * ```
 */
export const toHex = (num: number, length = 0): string =>
  lpad(num.toString(16), '0', length)

/**
 * `interpolate` returns a value between `a` and `b` for any value of `t` (normally between 0 and 1).
 *
 * @param a - The first value.
 * @param b - The second value.
 * @param t - The interpolation value.
 * @returns The interpolated value.
 * @public
 * @example
 * ```ts
 * interpolate(0, 10, 0.5) // returns 5
 * interpolate(0, 10, 0.25) // returns 2.5
 * interpolate(0, 10, 0.75) // returns 7.5
 * ```
 **/
export const interpolate = (a: number, b: number, t: number): number => {
  return (b - a) * t + a
}

/**
 * Interpolates values in a polar coordinate system looking for the narrowest delta angle.
 * It can be either clock-wise or counter-clock-wise.
 *
 * @param a - The first angle in degrees.
 * @param b - The second angle in degrees.
 * @param t - The interpolation value.
 * @param turn - The total number of degrees in a full turn. Default is 360.0.
 * @returns The interpolated angle.
 * @public
 * @example
 * ```ts
 * interpolateAngle(0, 90, 0.5) // returns 45
 * interpolateAngle(0, 270, 0.5) // returns 315
 * interpolateAngle(0, 90, 0.25) // returns 22.5
 * interpolateAngle(0, 270, 0.25) // returns 337.5
 * ```
 **/
export const interpolateAngle = (
  a: number,
  b: number,
  t: number,
  turn = 360.0
): number =>
  wrapCircular(interpolate(a, a + angleDifference(a, b, turn), t), turn)

/**
 * Calculates the widest angle difference between two angles.
 *
 * @param a - The first angle in degrees.
 * @param b - The second angle in degrees.
 * @param turn - The total angle of a full turn. Defaults to 360 degrees.
 * @returns The widest angle difference between `a` and `b`.
 * @public
 * @example
 * ```ts
 * widestAngleDifference(0, 90) // returns 90
 * widestAngleDifference(90, 0) // returns -90
 * widestAngleDifference(0, 270) // returns -90
 * widestAngleDifference(270, 0) // returns 90
 * ```
 */
export const widestAngleDifference = (
  a: number,
  b: number,
  turn = 360.0
): number => {
  let r = (b - a) % turn
  if (r < 0) r += turn
  if (r > turn / 2) r -= turn
  return r
}

/**
 * Interpolates values in a polar coordinate system looking for the wideset delta angle.
 * It can be either clock-wise or counter-clock-wise.
 *
 * @param a - The first angle in degrees.
 * @param b - The second angle in degrees.
 * @param t - The interpolation value.
 * @param turn - The total number of degrees in a full turn. Default is 360.0.
 * @returns The interpolated angle.
 * @public
 * @example
 * ```ts
 * interpolateWidestAngle(0, 90, 0.5) // returns 45
 * interpolateWidestAngle(0, 270, 0.5) // returns 315
 * interpolateWidestAngle(0, 90, 0.25) // returns 22.5
 * interpolateWidestAngle(0, 270, 0.25) // returns 337.5
 * ```
 **/
export const interpolateWidestAngle = (
  a: number,
  b: number,
  t: number,
  turn = 360
): number =>
  wrapCircular(interpolate(a, a + widestAngleDifference(a, b, turn), t), turn)

/**
 * Interpolates values in a polar coordinate system always in clock-wise direction.
 *
 * @param a - The first angle in degrees.
 * @param b - The second angle in degrees.
 * @param t - The interpolation value.
 * @param turn - The total number of degrees in a full turn. Default is 360.0.
 * @returns The interpolated angle.
 * @public
 * @example
 * ```ts
 * interpolateAngleCW(0, 90, 0.5) // returns 45
 * interpolateAngleCW(0, 270, 0.5) // returns 315
 * interpolateAngleCW(0, 90, 0.25) // returns 22.5
 * interpolateAngleCW(0, 270, 0.25) // returns 337.5
 * ```
 **/
export const interpolateAngleCW = (
  a: number,
  b: number,
  t: number,
  turn = 360
): number => {
  a = wrapCircular(a, turn)
  b = wrapCircular(b, turn)
  if (b < a) b += turn
  return wrapCircular(interpolate(a, b, t), turn)
}

/**
 * Interpolates values in a polar coordinate system always in counter-clock-wise direction.
 *
 * @param a - The first angle in degrees.
 * @param b - The second angle in degrees.
 * @param t - The interpolation value.
 * @param turn - The total number of degrees in a full turn. Default is 360.0.
 * @returns The interpolated angle.
 * @public
 * @example
 * ```ts
 * interpolateAngleCCW(0, 90, 0.5) // returns 45
 * interpolateAngleCCW(0, 270, 0.5) // returns 315
 * interpolateAngleCCW(0, 90, 0.25) // returns 22.5
 * interpolateAngleCCW(0, 270, 0.25) // returns 337.5
 * ```
 **/
export const interpolateAngleCCW = (
  a: number,
  b: number,
  t: number,
  turn = 360
): number => {
  a = wrapCircular(a, turn)
  b = wrapCircular(b, turn)
  if (b > a) b -= turn
  return wrapCircular(interpolate(a, b, t), turn)
}

/**
 * number numbers can sometime introduce tiny errors even for simple operations.
 * `nearEquals` compares two floats using a tiny tollerance (last optional
 * argument). By default it is defined as `EPSILON`.
 *
 * @param a - The first number to compare.
 * @param b - The second number to compare.
 * @param tollerance - The tollerance value. Default is `EPSILON`.
 * @returns `true` if the numbers are very close, `false` otherwise.
 * @public
 * @example
 * ```ts
 * nearEquals(5, 5.000000000000001) // returns true
 * nearEquals(5, 5.000000000001) // returns false
 * nearEquals(5, 5.000000000001, 1e-9) // returns true
 * ```
 **/
export const nearEquals = (
  a: number,
  b: number,
  tollerance = EPSILON
): boolean => {
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
 * number numbers can sometime introduce tiny errors even for simple operations.
 * `nearEqualAngles` compares two angles (default is 360deg) using a tiny
 * tollerance (last optional argument). By default the tollerance is defined as
 * `EPSILON`.
 *
 * @param a - The first angle in degrees.
 * @param b - The second angle in degrees.
 * @param turn - The total number of degrees in a full turn. Default is 360.0.
 * @param tollerance - The tollerance value. Default is `EPSILON`.
 * @returns `true` if the angles are very close, `false` otherwise.
 * @public
 * @example
 * ```ts
 * nearEqualAngles(0, 360) // returns true
 * nearEqualAngles(0, 361) // returns false
 * nearEqualAngles(0, 360.000000000001) // returns true
 * nearEqualAngles(0, 361, 360, 1) // returns true
 * ```
 **/
export const nearEqualAngles = (
  a: number,
  b: number,
  turn = 360.0,
  tollerance = EPSILON
): boolean => Math.abs(angleDifference(a, b, turn)) <= tollerance

/**
 * `nearZero` finds if the passed number is zero or very close to it. By default
 * `EPSILON` is used as the tollerance value.
 *
 * @param n - The number to check.
 * @param tollerance - The tollerance value. Default is `EPSILON`.
 * @returns `true` if the number is zero or very close to it, `false` otherwise.
 * @public
 * @example
 * ```ts
 * nearZero(0.000000000000001) // returns true
 * nearZero(0.000000001) // returns false
 * nearZero(0.000000001, 1e-9) // returns true
 * ```
 **/
export const nearZero = (n: number, tollerance = EPSILON): boolean => {
  return Math.abs(n) <= tollerance
}

/**
 * Computes the nth root (`index`) of `base`.
 *
 * @param base - The base number.
 * @param index - The index of the root.
 * @returns The nth root of the base number.
 * @public
 * @example
 * ```ts
 * root(8, 3) // returns 2
 * root(27, 3) // returns 3
 * root(16, 4) // returns 2
 * ```
 **/
export const root = (base: number, index: number): number => {
  return Math.pow(base, 1 / index)
}

/**
 * Rounds a number to the specified number of decimals.
 *
 * @param f - The number to round.
 * @param decimals - The number of decimals to round to.
 * @returns The rounded number.
 * @public
 * @example
 * ```ts
 * roundTo(1.234, 2) // returns 1.23
 * roundTo(1.234, 1) // returns 1.2
 * roundTo(1.234, 0) // returns 1
 * ```
 **/
export const roundTo = (f: number, decimals: number): number => {
  const p = Math.pow(10, decimals)
  return Math.round(f * p) / p
}

/**
 * `sign` returns `-1` if `value` is a negative number, `1` otherwise.
 *
 * @param value - The number to check.
 * @returns `-1` if the number is negative, `1` otherwise.
 * @public
 * @example
 * ```ts
 * sign(-5) // returns -1
 * sign(5) // returns 1
 * ```
 */
export const sign = <T extends number>(value: T): number => {
  return value < 0 ? -1 : 1
}

/**
 * Passed two boundaries values (`min`, `max`), `wrap` ensures that the passed value `v` will
 * be included in the boundaries. If the value exceeds `max`, the value is reduced by `min`
 * repeatedely until it falls within the range. Similar and inverted treatment is performed if
 * the value is below `min`.
 *
 * @param v - The value to wrap.
 * @param min - The minimum value of the range.
 * @param max - The maximum value of the range.
 * @returns The wrapped value.
 * @public
 * @example
 * ```ts
 * wrap(5, 0, 10) // returns 5
 * wrap(15, 0, 10) // returns 5
 * wrap(-5, 0, 10) // returns 5
 * ```
 **/
export const wrap = (v: number, min: number, max: number): number => {
  const range = max - min + 1
  if (v < min) v += range * ((min - v) / range + 1)
  return min + ((v - min) % range)
}

/**
 * Similar to `wrap`, it works for numbers between 0 and `max`.
 *
 * @param v - The value to wrap.
 * @param max - The maximum value of the range.
 * @returns The wrapped value.
 * @public
 * @example
 * ```ts
 * wrapCircular(5, 10) // returns 5
 * wrapCircular(15, 10) // returns 5
 * wrapCircular(-5, 10) // returns 5
 * ```
 **/
export const wrapCircular = (v: number, max: number): number => {
  v = v % max
  if (v < 0) v += max
  return v
}
