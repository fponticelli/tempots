import { nearEquals } from './math'

const TOLLERANCE = 0.0001

/**
 * Represents a color in the LCH color space.
 *
 * @public
 */
export class LCH {
  static readonly ofChannels = ([l, c, h]: [
    l: number,
    c: number,
    h: number,
  ]): LCH => new LCH(l, c, h)

  /**
   * The luminance value of the color in the LCH color space.
   */
  readonly luminance: number
  /**
   * The chroma value of the LCH color.
   */
  readonly chroma: number
  /**
   * The hue value of the LCH color.
   */
  readonly hue: number

  /**
   * Creates a new instance of the LCH color.
   * @param luminance - Luminance in cd/m^2
   * @param chroma - Chroma value
   * @param hue - Hue angle in degrees (0-360)
   */
  constructor(luminance: number, chroma: number, hue: number) {
    this.luminance = luminance < 0 ? 0 : luminance
    this.chroma = chroma
    this.hue = hue % 360
  }

  /**
   * Returns a new LCH color with the specified lightness value.
   *
   * @param l - The lightness value for the new color.
   * @returns A new LCH color with the specified lightness value.
   */
  readonly withLightness = (l: number): LCH => new LCH(l, this.chroma, this.hue)

  /**
   * Creates a new LCH color with the specified chroma value.
   *
   * @param c - The chroma value for the new LCH color.
   * @returns A new LCH color with the specified chroma value.
   */
  readonly withChroma = (c: number): LCH => new LCH(this.luminance, c, this.hue)

  /**
   * Sets the hue value of the LCH color and returns a new LCH color instance.
   * @param h - The hue value to set.
   * @returns A new LCH color instance with the specified hue value.
   */
  readonly withHue = (h: number): LCH => new LCH(this.luminance, this.chroma, h)

  /**
   * Converts the LCH color to an array of channels.
   * @returns An array of channels [luminance, chroma, hue].
   */
  readonly toChannels = (): [number, number, number] => [
    this.luminance,
    this.chroma,
    this.hue,
  ]

  /**
   * Returns a string representation of the LCH color.
   * @returns A string in the format "lch(luminance, chroma, hue)".
   */
  readonly toString = (): string =>
    `lch(${this.luminance}, ${this.chroma}, ${this.hue})`

  /**
   * Checks if the LCH color is equal to another LCH color.
   * @param other - The other LCH color to compare.
   * @param tollerance - The tolerance value for comparison (default: TOLLERANCE).
   * @returns True if the colors are equal within the specified tolerance, false otherwise.
   */
  readonly equals = (other: LCH, tollerance = TOLLERANCE): boolean => {
    if (
      nearEquals(this.luminance, other.luminance, tollerance) &&
      (nearEquals(this.luminance, 100, tollerance) ||
        nearEquals(this.luminance, 0, tollerance))
    ) {
      return true
    }
    return (
      nearEquals(this.luminance, other.luminance, tollerance) &&
      nearEquals(this.chroma, other.chroma, tollerance) &&
      nearEquals(this.hue, other.hue, tollerance)
    )
  }
}
