/**
 * Represents a function that interpolates between two values.
 *
 * @typeParam T - The type of the values being interpolated.
 * @param start - The starting value.
 * @param end - The ending value.
 * @param delta - The interpolation factor between 0 and 1.
 * @returns The interpolated value.
 * @public
 */
export type Interpolate<T> = (start: T, end: T, delta: number) => T

/**
 * Interpolates a number between a start and end value based on a delta.
 *
 * @param start - The starting value.
 * @param end - The ending value.
 * @param delta - The delta value between 0 and 1.
 * @returns The interpolated number.
 * @public
 */
export const interpolateNumber: Interpolate<number> = (
  start: number,
  end: number,
  delta: number
) => start + (end - start) * delta

const altCharCode = 'a'.charCodeAt(0)

/**
 * Interpolates between two strings based on a delta value.
 *
 * @param start - The starting string.
 * @param end - The ending string.
 * @param delta - The delta value between 0 and 1.
 * @returns The interpolated string.
 * @public
 */
export const interpolateString: Interpolate<string> = (
  start: string,
  end: string,
  delta: number
) => {
  const length = Math.max(start.length, end.length)
  let result = ''
  for (let i = 0; i < length; i++) {
    let a = start.charCodeAt(i)
    if (isNaN(a)) {
      a = altCharCode
    }
    let b = end.charCodeAt(i)
    if (isNaN(b)) {
      b = altCharCode
    }
    result += String.fromCharCode(a + (b - a) * delta)
  }
  return result
}

/**
 * Interpolates between two dates based on a delta value.
 *
 * @param start - The starting date.
 * @param end - The ending date.
 * @param delta - The delta value between 0 and 1.
 * @returns The interpolated date.
 * @public
 */
export const interpolateDate: Interpolate<Date> = (
  start: Date,
  end: Date,
  delta: number
) => new Date(start.getTime() + (end.getTime() - start.getTime()) * delta)

/**
 * A fake interpolate function that always returns the end value.
 *
 * @public
 */
export const endInterpolate = <T>(_start: T, end: T) => end

/**
 * Returns an interpolation function based on the type of the value.
 *
 * @typeParam T - The type of the value.
 * @param value - The value to be interpolated.
 * @returns An interpolation function that takes a start value, an end value, and a delta, and returns an interpolated value.
 * @public
 */
export const guessInterpolate = <T>(value: T): Interpolate<T> => {
  if (typeof value === 'number') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return interpolateNumber as any
  } else if (typeof value === 'string') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return interpolateString as any
  } else if (value instanceof Date) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return interpolateDate as any
  } else {
    return endInterpolate
  }
}
