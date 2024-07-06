import { clamp, nearEquals } from './math'

const TOLLERANCE = 0.0001

export class HSL {
  static fromString(s: string): HSL {
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

  static ofChannels([hue, saturation, lightness]: [
    hue: number,
    saturation: number,
    lightness: number,
  ]): HSL {
    return new HSL(hue, saturation * 100, lightness * 100)
  }

  readonly hue: number
  readonly saturation: number
  readonly lightness: number
  /**
   *
   * @param hue Angle in degrees (0-360)
   * @param saturation Percentage (0-100)
   * @param lightness Percentage (0-100)
   */
  constructor(hue: number, saturation = 50, lightness = 50) {
    this.hue = hue % 360.0
    this.saturation = clamp(saturation, 0, 100)
    this.lightness = clamp(lightness, 0, 100)
  }

  withHue(hue: number): HSL {
    return new HSL(hue, this.saturation, this.lightness)
  }

  withSaturation(saturation: number): HSL {
    return new HSL(this.hue, saturation, this.lightness)
  }

  withLightness(lightness: number): HSL {
    return new HSL(this.hue, this.saturation, lightness)
  }

  toChannels(): [number, number, number] {
    return [this.hue, this.saturation / 100, this.lightness / 100]
  }

  toString(): string {
    return `hsl(${this.hue}deg, ${this.saturation}%, ${this.lightness}%)`
  }

  equals(other: HSL, tollerance = TOLLERANCE): boolean {
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
