import { nearEquals } from './math'

const TOLLERANCE = 0.0001

/**
 * Represents a color in the HSLuv color space.
 *
 * @public
 */
export class HSLuv {
  /**
   * Creates a new HSLuv color instance from a string representation.
   * The string should be in the format "hsluv(h, s%, l%)".
   * @param s - The string representation of the HSLuv color.
   * @returns A new HSLuv color instance.
   * @throws Error If the provided string is not a valid HSLuv color representation.
   */
  static readonly fromString = (s: string): HSLuv => {
    const m = s.match(
      /^hsluv\((\d+)(deg)?, ?(\d+(?:\.\d+)?)%?, ?(\d+(?:\.\d+)?)%?\)$/
    )
    if (m != null) {
      const [, h, , s, l] = m
      return new HSLuv(parseFloat(h), parseFloat(s), parseFloat(l))
    } else {
      throw new Error(`Invalid HSLuv string: ${s}`)
    }
  }

  /**
   * Creates a new HSLuv color instance from the given channel values.
   *
   * @param hue - The hue value.
   * @param saturation - The saturation value.
   * @param lightness - The lightness value.
   * @returns A new HSLuv color instance.
   */
  static readonly ofChannels = ([hue, saturation, lightness]: [
    hue: number,
    saturation: number,
    lightness: number,
  ]): HSLuv => new HSLuv(hue, saturation, lightness)

  /**
   * The hue value of the color in degrees.
   */
  readonly hue: number
  /**
   * The saturation value of the color in the HSLuv color space.
   */
  readonly saturation: number
  /**
   * The lightness value of the color in the HSLuv color space.
   */
  readonly lightness: number
  /**
   *
   * @param hue - Angle in degrees (0-360)
   * @param saturation - Percentage (0-100)
   * @param lightness - Percentage (0-100)
   */
  constructor(hue: number, saturation: number, lightness: number) {
    this.hue = hue % 360.0
    this.saturation = saturation
    this.lightness = lightness
  }

  /**
   * Returns a new `HSLuv` instance with the specified hue value.
   *
   * @param hue - The hue value to set.
   * @returns A new `HSLuv` instance with the specified hue.
   */
  readonly withHue = (hue: number): HSLuv =>
    new HSLuv(hue, this.saturation, this.lightness)

  /**
   * Returns a new `HSLuv` instance with the specified saturation value.
   *
   * @param saturation - The new saturation value.
   * @returns A new `HSLuv` instance with the updated saturation value.
   */
  readonly withSaturation = (saturation: number): HSLuv =>
    new HSLuv(this.hue, saturation, this.lightness)

  /**
   * Returns a new HSLuv color with the specified lightness.
   *
   * @param lightness - The lightness value for the new color.
   * @returns A new HSLuv color with the specified lightness.
   */
  readonly withLightness = (lightness: number): HSLuv =>
    new HSLuv(this.hue, this.saturation, lightness)

  /**
   * Converts the HSLuv color to an array of channels.
   * @returns An array of three numbers representing the hue, saturation, and lightness channels.
   */
  readonly toChannels = (): [number, number, number] => [
    this.hue,
    this.saturation,
    this.lightness,
  ]

  /**
   * Returns a string representation of the HSLUV color in the format "hsluv(hue, saturation%, lightness%)"
   * @returns The string representation of the HSLUV color.
   */
  readonly toString = (): string =>
    `hsluv(${this.hue}deg, ${this.saturation}%, ${this.lightness}%)`

  /**
   * Checks if the current HSLuv object is equal to another HSLuv object.
   * @param other - The other HSLuv object to compare with.
   * @param tollerance - The tolerance value for comparing the HSLuv values. Default is TOLLERANCE.
   * @returns True if the HSLuv objects are equal, false otherwise.
   */
  readonly equals = (other: HSLuv, tollerance = TOLLERANCE): boolean => {
    if (
      (nearEquals(this.lightness, other.lightness, tollerance) &&
        nearEquals(this.saturation, 0, tollerance)) ||
      nearEquals(this.saturation, 100, tollerance)
    ) {
      return true
    }
    return (
      nearEquals(this.hue, other.hue, tollerance) &&
      nearEquals(this.saturation, other.saturation, tollerance) &&
      nearEquals(this.lightness, other.lightness, tollerance)
    )
  }
}
