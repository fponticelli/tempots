import { clamp, nearEquals } from './math'

const TOLLERANCE = 0.0001

/**
 * Represents a color in the HSL (Hue, Saturation, Lightness) color model.
 *
 * @public
 */
export class HSL {
  /**
   * Creates an HSL color object from a string representation.
   * The string should be in the format "hsl(h, s%, l%)".
   * @param s - The string representation of the HSL color.
   * @returns An HSL color object.
   * @throws Error If the input string is not a valid HSL color string.
   */
  static readonly fromString = (s: string): HSL => {
    const m = s.match(
      /^hsl\((\d+)(deg)?, ?(\d+(?:\.\d+)?)%?, ?(\d+(?:\.\d+)?)%?\)$/
    )
    if (m != null) {
      const [, h, , s, l] = m
      return new HSL(parseFloat(h), parseFloat(s), parseFloat(l))
    } else {
      throw new Error(`Invalid HSL string: ${s}`)
    }
  }

  /**
   * Creates an HSL color instance from individual channel values.
   * @param hue - The hue value (0-360).
   * @param saturation - The saturation value (0-100).
   * @param lightness - The lightness value (0-100).
   * @returns An instance of the HSL color.
   */
  static readonly ofChannels = ([hue, saturation, lightness]: [
    hue: number,
    saturation: number,
    lightness: number,
  ]): HSL => new HSL(hue, saturation * 100, lightness * 100)

  /**
   * The hue value of the HSL color.
   */
  readonly hue: number
  /**
   * The saturation value of an HSL color.
   */
  readonly saturation: number
  /**
   * Represents the lightness value in the HSL color model.
   */
  readonly lightness: number
  /**
   *
   * @param hue - Angle in degrees (0-360)
   * @param saturation - Percentage (0-100)
   * @param lightness - Percentage (0-100)
   */
  constructor(hue: number, saturation = 50, lightness = 50) {
    this.hue = hue % 360.0
    this.saturation = clamp(saturation, 0, 100)
    this.lightness = clamp(lightness, 0, 100)
  }

  /**
   * Returns a new HSL color with the specified hue.
   * @param hue - The hue value to set.
   * @returns A new HSL color with the specified hue.
   */
  readonly withHue = (hue: number): HSL =>
    new HSL(hue, this.saturation, this.lightness)

  /**
   * Returns a new HSL color with the specified saturation.
   * @param saturation - The saturation value to set.
   * @returns A new HSL color with the specified saturation.
   */
  readonly withSaturation = (saturation: number): HSL =>
    new HSL(this.hue, saturation, this.lightness)

  /**
   * Returns a new HSL color with the specified lightness.
   *
   * @param lightness - The lightness value to set.
   * @returns A new HSL color with the specified lightness.
   */
  readonly withLightness = (lightness: number): HSL =>
    new HSL(this.hue, this.saturation, lightness)

  /**
   * Converts the HSL color values to an array of channels.
   * @returns An array containing the hue, saturation, and lightness values.
   */
  readonly toChannels = (): [number, number, number] => [
    this.hue,
    this.saturation / 100,
    this.lightness / 100,
  ]

  /**
   * Returns a string representation of the HSL color in the format "hsl(hue, saturation%, lightness%)".
   *
   * @returns The string representation of the HSL color.
   */
  readonly toString = (): string =>
    `hsl(${this.hue}deg, ${this.saturation}%, ${this.lightness}%)`

  /**
   * Checks if the current HSL color is equal to another HSL color.
   * @param other - The other HSL color to compare with.
   * @param tollerance - The tolerance value for comparing the color components. Default is TOLLERANCE.
   * @returns True if the colors are equal, false otherwise.
   */
  readonly equals = (other: HSL, tollerance = TOLLERANCE): boolean => {
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
