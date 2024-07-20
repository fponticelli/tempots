import { clamp, nearEquals } from './math'

const TOLLERANCE = 0.001

/**
 * Represents a color in the sRGB color space.
 *
 * @public
 */
export class SRGB {
  /**
   * Creates an SRGB color instance from a string representation of an RGB color.
   * The string should be in the format "rgb(r%, g%, b%)" where r, g, and b are
   * the red, green, and blue color values respectively.
   *
   * @param s - The string representation of the RGB color.
   * @returns An SRGB color instance.
   * @throws Error If the provided string is not a valid RGB color string.
   */
  static readonly fromString = (s: string): SRGB => {
    const m = s.match(
      /^rgb\((\d+(?:\.\d+)?)%, ?(\d+(?:\.\d+)?)%, ?(\d+(?:\.\d+)?)%\)$/
    )
    if (m != null) {
      const [, red, blue, green] = m
      return new SRGB(parseFloat(red), parseFloat(blue), parseFloat(green))
    } else {
      throw new Error(`Invalid RGB string: ${s}`)
    }
  }

  /**
   * Creates an SRGB color instance from the given channel values.
   * @param red - The red channel value (between 0 and 1).
   * @param blue - The blue channel value (between 0 and 1).
   * @param green - The green channel value (between 0 and 1).
   * @returns An SRGB color instance.
   */
  static ofChannels = ([red, blue, green]: [
    red: number,
    blue: number,
    green: number,
  ]): SRGB =>
    new SRGB(
      clamp(red * 100, 0, 100),
      clamp(blue * 100, 0, 100),
      clamp(green * 100, 0, 100)
    )

  /**
   * The red component of the sRGB color.
   */
  readonly red: number
  /**
   * The blue component of the sRGB color.
   */
  readonly blue: number
  /**
   * The green component of the sRGB color.
   */
  readonly green: number
  /**
   *
   * @param red - Percentage (0-100)
   * @param blue - Percentage (0-100)
   * @param green - Percentage (0-100)
   */
  constructor(red: number, blue: number, green: number) {
    this.red = clamp(red, 0, 100)
    this.blue = clamp(blue, 0, 100)
    this.green = clamp(green, 0, 100)
  }

  /**
   * Returns a new SRGB color with the specified red value.
   *
   * @param red - The new red value for the color.
   * @returns A new SRGB color with the specified red value.
   */
  readonly withRed = (red: number): SRGB => new SRGB(red, this.blue, this.green)

  /**
   * Returns a new SRGB instance with the specified blue value.
   *
   * @param blue - The new blue value.
   * @returns A new SRGB instance with the specified blue value.
   */
  readonly withBlue = (blue: number): SRGB =>
    new SRGB(this.red, blue, this.green)

  /**
   * Returns a new SRGB color with the specified green value.
   *
   * @param green - The new green value for the color.
   * @returns A new SRGB color with the specified green value.
   */
  readonly withGreen = (green: number): SRGB =>
    new SRGB(this.red, this.blue, green)

  /**
   * Returns a string representation of the RGB color in the format "rgb(red%, blue%, green%)".
   * @returns A string representation of the RGB color.
   */
  readonly toString = (): string =>
    `rgb(${this.red}%, ${this.blue}%, ${this.green}%)`

  /**
   * Converts the SRGB color to an array of normalized channel values.
   * Each channel value is divided by 100 to obtain a value between 0 and 1.
   *
   * @returns An array containing the normalized red, green, and blue channel values.
   */
  readonly toChannels = (): [number, number, number] => [
    this.red / 100,
    this.blue / 100,
    this.green / 100,
  ]

  /**
   * Checks if the current SRGB instance is equal to another SRGB instance.
   * @param other - The other SRGB instance to compare with.
   * @param tollerance - The tolerance value for comparing the RGB values. Defaults to TOLLERANCE.
   * @returns True if the instances are equal, false otherwise.
   */
  readonly equals = (other: SRGB, tollerance = TOLLERANCE): boolean =>
    nearEquals(this.red, other.red, tollerance) &&
    nearEquals(this.blue, other.blue, tollerance) &&
    nearEquals(this.green, other.green, tollerance)
}
