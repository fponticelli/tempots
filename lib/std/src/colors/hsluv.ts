import { nearEquals } from '../numbers'

const TOLLERANCE = 0.0001

export class HSLuv {
  static fromString(s: string): HSLuv {
    const m = s.match(
      /^hsluv\((\d+)(deg)?, ?(\d+(?:\.\d+)?)%?, ?(\d+(?:\.\d+)?)%?\)$/
    )
    if (m) {
      const [, h, , s, l] = m
      return new HSLuv(parseFloat(h), parseFloat(s), parseFloat(l))
    } else {
      throw new Error(`Invalid HSLuv string: ${s}`)
    }
  }
  static ofChannels([hue, saturation, lightness]: [
    hue: number,
    saturation: number,
    lightness: number
  ]): HSLuv {
    return new HSLuv(hue, saturation, lightness)
  }

  readonly hue: number
  readonly saturation: number
  readonly lightness: number
  /**
   *
   * @param hue Angle in degrees (0-360)
   * @param saturation
   * @param lightness
   */
  constructor(hue: number, saturation: number, lightness: number) {
    this.hue = hue % 360.0
    this.saturation = saturation
    this.lightness = lightness
  }

  withHue(hue: number): HSLuv {
    return new HSLuv(hue, this.saturation, this.lightness)
  }

  withSaturation(saturation: number): HSLuv {
    return new HSLuv(this.hue, saturation, this.lightness)
  }

  withLightness(lightness: number): HSLuv {
    return new HSLuv(this.hue, this.saturation, lightness)
  }

  toChannels(): [number, number, number] {
    return [this.hue, this.saturation, this.lightness]
  }

  toString() {
    return `hsluv(${this.hue}deg, ${this.saturation}%, ${this.lightness}%)`
  }

  equals(other: HSLuv, tollerance = TOLLERANCE): boolean {
    if (
      (nearEquals(this.lightness, other.lightness, tollerance) &&
        nearEquals(this.saturation, 0, tollerance)) ||
      nearEquals(this.saturation, 100, tollerance)
    )
      return true
    return (
      nearEquals(this.hue, other.hue, tollerance) &&
      nearEquals(this.saturation, other.saturation, tollerance) &&
      nearEquals(this.lightness, other.lightness, tollerance)
    )
  }
}
