import { clamp, nearEquals } from './math'

const TOLLERANCE = 0.0001

export class HSV {
  static fromString(s: string): HSV {
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

  static ofChannels([hue, saturation, value]: [
    hue: number,
    saturation: number,
    value: number,
  ]): HSV {
    return new HSV(
      hue % 360.0,
      clamp(saturation * 100, 0, 100),
      clamp(value * 100, 0, 100)
    )
  }

  readonly hue: number
  readonly saturation: number
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

  withHue(h: number): HSV {
    return new HSV(h, this.saturation, this.value)
  }

  withSaturation(s: number): HSV {
    return new HSV(this.hue, s, this.value)
  }

  withValue(v: number): HSV {
    return new HSV(this.hue, this.saturation, v)
  }

  toChannels(): [number, number, number] {
    return [this.hue, this.saturation / 100, this.value / 100]
  }

  toString(): string {
    return `hsv(${this.hue}, ${this.saturation}, ${this.value})`
  }

  equals(other: HSV, tollerance = TOLLERANCE): boolean {
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
