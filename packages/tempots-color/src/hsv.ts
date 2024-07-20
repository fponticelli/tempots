import { clamp, nearEquals } from './math'

const TOLLERANCE = 0.0001

/**
 * Represents a color in the HSV (Hue, Saturation, Value) color model.
 *
 * @public
 */
export class HSV {
  /**
   * Creates an HSV color object from a string representation.
   * The string should be in the format "hsv(h, s%, v%)" where h, s, and v are numeric values.
   * @param s - The string representation of the HSV color.
   * @returns An HSV color object.
   * @throws Error If the string is not a valid HSV color representation.
   */
  static readonly fromString = (s: string): HSV => {
    const m = s.match(
      /^hsv\((\d+(?:\.\d+)?)%, ?(\d+(?:\.\d+)?)%, ?(\d+(?:\.\d+)?)%\)$/i
    )
    if (m != null) {
      const [, h, s, v] = m
      return new HSV(parseFloat(h), parseFloat(s), parseFloat(v))
    } else {
      throw new Error(`Invalid HSV string: ${s}`)
    }
  }

  /**
   * Creates an HSV color from individual channel values.
   * @param hue - The hue value in degrees.
   * @param saturation - The saturation value between 0 and 1.
   * @param value - The value (brightness) between 0 and 1.
   * @returns An HSV color object.
   */
  static readonly ofChannels = ([hue, saturation, value]: [
    hue: number,
    saturation: number,
    value: number,
  ]): HSV =>
    new HSV(
      hue % 360.0,
      clamp(saturation * 100, 0, 100),
      clamp(value * 100, 0, 100)
    )

  /**
   * Represents the hue value in the HSV color model.
   */
  readonly hue: number
  /**
   * The saturation value of the HSV color model.
   */
  readonly saturation: number
  /**
   * The value component of the HSV color model.
   */
  readonly value: number
  /**
   *
   * @param hue - Angle in degrees (0-360)
   * @param saturation - Percentage (0-100)
   * @param value - Percentage (0-100)
   */
  constructor(hue: number, saturation: number, value: number) {
    this.hue = hue
    this.saturation = saturation
    this.value = value
  }

  /**
   * Returns a new HSV color with the specified hue value.
   *
   * @param h - The hue value to set.
   * @returns A new HSV color with the specified hue value.
   */
  readonly withHue = (h: number): HSV => new HSV(h, this.saturation, this.value)

  /**
   * Returns a new HSV color with the specified saturation.
   * @param s - The saturation value to set.
   * @returns A new HSV color with the specified saturation.
   */
  readonly withSaturation = (s: number): HSV => new HSV(this.hue, s, this.value)

  /**
   * Returns a new HSV color with the specified value.
   *
   * @param v - The new value for the color.
   * @returns A new HSV color with the specified value.
   */
  readonly withValue = (v: number): HSV => new HSV(this.hue, this.saturation, v)

  /**
   * Converts the HSV color representation to an array of channels.
   * @returns An array containing the hue, saturation, and value channels.
   */
  readonly toChannels = (): [number, number, number] => [
    this.hue,
    this.saturation / 100,
    this.value / 100,
  ]

  /**
   * Returns a string representation of the HSV color.
   * The format of the string is "hsv(hue, saturation, value)".
   *
   * @returns The string representation of the HSV color.
   */
  readonly toString = (): string =>
    `hsv(${this.hue}, ${this.saturation}, ${this.value})`

  /**
   * Checks if the current HSV color is equal to another HSV color.
   * @param other - The other HSV color to compare with.
   * @param tollerance - The tolerance value for comparing the color components. Default is TOLLERANCE.
   * @returns `true` if the colors are equal, `false` otherwise.
   */
  readonly equals = (other: HSV, tollerance = TOLLERANCE): boolean => {
    if (
      nearEquals(this.value, other.value, tollerance) &&
      (nearEquals(this.saturation, 0, tollerance) ||
        nearEquals(this.saturation, 100, tollerance))
    ) {
      return true
    }
    return (
      nearEquals(this.hue, other.hue, tollerance) &&
      nearEquals(this.saturation, other.saturation, tollerance) &&
      nearEquals(this.value, other.value, tollerance)
    )
  }
}
