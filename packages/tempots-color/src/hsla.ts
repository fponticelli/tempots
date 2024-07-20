import { clamp, nearEquals } from './math'

const TOLLERANCE = 0.0001

/**
 * Represents the HSLA color model.
 *
 * @public
 */
export class HSLA {
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
   * The alpha value of the HSLA color.
   */
  readonly alpha: number
  /**
   *
   * @param hue - Angle in degrees (0-360)
   * @param saturation - Percentage (0-100)
   * @param lightness - Percentage (0-100)
   * @param alpha - Percentage (0-100)
   */
  constructor(hue: number, saturation = 50, lightness = 50, alpha = 100) {
    this.hue = hue % 360.0
    this.saturation = clamp(saturation, 0, 100)
    this.lightness = clamp(lightness, 0, 100)
    this.alpha = clamp(0, 1, alpha)
  }

  /**
   * Returns a new HSLA color with the specified hue.
   * @param hue - The hue value to set.
   * @returns A new HSLA color with the specified hue.
   */
  readonly withHue = (hue: number): HSLA =>
    new HSLA(hue, this.saturation, this.lightness, this.alpha)

  /**
   * Returns a new HSLA color with the specified saturation.
   * @param saturation - The new saturation value.
   * @returns A new HSLA color with the specified saturation.
   */
  readonly withSaturation = (saturation: number): HSLA =>
    new HSLA(this.hue, saturation, this.lightness, this.alpha)

  /**
   * Returns a new HSLA color with the specified lightness.
   * @param lightness - The lightness value to set.
   * @returns A new HSLA color with the specified lightness.
   */
  readonly withLightness = (lightness: number): HSLA =>
    new HSLA(this.hue, this.saturation, lightness, this.alpha)

  /**
   * Returns a new HSLA color with the specified alpha value.
   * @param alpha - The alpha value to set.
   * @returns A new HSLA color with the specified alpha value.
   */
  readonly withAlpha = (alpha: number): HSLA =>
    new HSLA(this.hue, this.saturation, this.lightness, alpha)

  /**
   * Returns a string representation of the HSLA color in the format "hsla(hue, saturation%, lightness%, alpha)".
   * @returns The string representation of the HSLA color.
   */
  readonly toString = (): string =>
    `hsla(${this.hue}deg, ${this.saturation}%, ${this.lightness}%, ${
      this.alpha / 100
    })`

  /**
   * Checks if the current HSLA color is equal to another HSLA color.
   * @param other - The other HSLA color to compare with.
   * @param tollerance - The tolerance value for comparing the color components. Default is TOLLERANCE.
   * @returns True if the colors are equal within the specified tolerance, false otherwise.
   */
  readonly equals = (other: HSLA, tollerance = TOLLERANCE): boolean =>
    nearEquals(this.hue, other.hue, tollerance) &&
    nearEquals(this.saturation, other.saturation, tollerance) &&
    nearEquals(this.lightness, other.lightness, tollerance) &&
    nearEquals(this.alpha, other.alpha, tollerance)
}
