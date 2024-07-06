import { lpad } from './strings'

export const TOLERANCE = 10e-5

/**
  Constant value employed to see if two `number` values are very close.
**/
export const EPSILON = 1e-9

/**
Returns the angular distance between 2 angles.
**/
export function angleDifference(a: number, b: number, turn = 360.0) {
  let r = (b - a) % turn
  if (r < 0) r += turn
  if (r > turn / 2) r -= turn
  return r
}

/**
Rounds a number up to the specified number of decimals.
**/
export function ceilTo(v: number, decimals: number): number {
  const p = Math.pow(10, decimals)
  return Math.ceil(v * p) / p
}

/**
`clamp` restricts a value within the specified range.
```ts
log(clamp(1.3, 0, 1)) // prints 1
log(clamp(0.8, 0, 1)) // prints 0.8
log(clamp(-0.5, 0, 1)) // prints 0.0
```
**/
export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

export function clampInt(value: number, min: number, max: number) {
  return Math.trunc(clamp(value, min, max))
}

/**
Like clamp but you only pass one argument (`max`) that is used as the upper limit
and the opposite (additive inverse or `-max`) as the lower limit.
**/
export function clampSym(v: number, max: number): number {
  return clamp(v, -max, max)
}

/**
It returns the comparison value (an integer number) between two `float` values.
**/
export function compare(a: number, b: number): number {
  return a < b ? -1 : a > b ? 1 : 0
}

/**
Rounds a number down to the specified number of decimals.
**/
export function floorTo(v: number, decimals: number): number {
  const p = Math.pow(10, decimals)
  return Math.floor(v * p) / p
}

/**
`normalize` clamps the passwed value between 0 and 1.
**/
export function normalize(value: number): number {
  return clamp(value, 0, 1)
}

export function toHex(num: number, length = 0): string {
  return lpad(num.toString(16), '0', length)
}

/**
`interpolate` returns a value between `a` and `b` for any value of `t` (normally between 0 and 1).
**/
export function interpolate(a: number, b: number, t: number): number {
  return (b - a) * t + a
}

/**
Interpolates values in a polar coordinate system looking for the narrowest delta angle.
It can be either clock-wise or counter-clock-wise.
**/
export function interpolateAngle(
  a: number,
  b: number,
  t: number,
  turn = 360.0
) {
  return wrapCircular(interpolate(a, a + angleDifference(a, b, turn), t), turn)
}

/**
Interpolates values in a polar coordinate system looking for the wideset delta angle.
It can be either clock-wise or counter-clock-wise.
**/
export function interpolateAngleWidest(
  a: number,
  b: number,
  t: number,
  turn = 360
) {
  return wrapCircular(interpolateAngle(a, b, t, turn) - turn / 2, turn)
}

/**
Interpolates values in a polar coordinate system always in clock-wise direction.
**/
export function interpolateAngleCW(
  a: number,
  b: number,
  t: number,
  turn = 360
) {
  a = wrapCircular(a, turn)
  b = wrapCircular(b, turn)
  if (b < a) b += turn
  return wrapCircular(interpolate(a, b, t), turn)
}

/**
Interpolates values in a polar coordinate system always in counter-clock-wise direction.
**/
export function interpolateAngleCCW(
  a: number,
  b: number,
  t: number,
  turn = 360
) {
  a = wrapCircular(a, turn)
  b = wrapCircular(b, turn)
  if (b > a) b -= turn
  return wrapCircular(interpolate(a, b, t), turn)
}

/**
number numbers can sometime introduce tiny errors even for simple operations.
`nearEquals` compares two floats using a tiny tollerance (last optional
argument). By default it is defined as `EPSILON`.
**/
export function nearEquals(a: number, b: number, tollerance = EPSILON) {
  if (isFinite(a)) {
    if (!isFinite(b)) return false
    return Math.abs(a - b) <= tollerance
  }
  if (isNaN(a)) return isNaN(b)
  if (isNaN(b)) return false
  if (!isFinite(b)) return a > 0 == b > 0
  // a is Infinity and b is finite
  return false
}

/**
number numbers can sometime introduce tiny errors even for simple operations.
`nearEqualAngles` compares two angles (default is 360deg) using a tiny
tollerance (last optional argument). By default the tollerance is defined as
`EPSILON`.
**/
export function nearEqualAngles(
  a: number,
  b: number,
  turn = 360.0,
  tollerance = EPSILON
) {
  return Math.abs(angleDifference(a, b, turn)) <= tollerance
}

/**
`nearZero` finds if the passed number is zero or very close to it. By default
`EPSILON` is used as the tollerance value.
**/
export function nearZero(n: number, tollerance = EPSILON) {
  return Math.abs(n) <= tollerance
}

/**
Computes the nth root (`index`) of `base`.
**/
export function root(base: number, index: number) {
  return Math.pow(base, 1 / index)
}

/**
Rounds a number to the specified number of decimals.
**/
export function roundTo(f: number, decimals: number): number {
  const p = Math.pow(10, decimals)
  return Math.fround(f * p) / p
}

/**
`sign` returns `-1` if `value` is a negative number, `1` otherwise.
*/
export function sign<T extends number>(value: T): number {
  return value < 0 ? -1 : 1
}

/**
Passed two boundaries values (`min`, `max`), `wrap` ensures that the passed value `v` will
be included in the boundaries. If the value exceeds `max`, the value is reduced by `min`
repeatedely until it falls within the range. Similar and inverted treatment is performed if
the value is below `min`.
**/
export function wrap(v: number, min: number, max: number): number {
  const range = max - min + 1
  if (v < min) v += range * ((min - v) / range + 1)
  return min + ((v - min) % range)
}

/**
Similar to `wrap`, it works for numbers between 0 and `max`.
**/
export function wrapCircular(v: number, max: number): number {
  v = v % max
  if (v < 0) v += max
  return v
}
