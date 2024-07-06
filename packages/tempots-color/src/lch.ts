import { nearEquals } from './math'

const TOLLERANCE = 0.0001

export class LCH {
  static ofChannels([l, c, h]: [l: number, c: number, h: number]): LCH {
    return new LCH(l, c, h)
  }

  readonly luminance: number
  readonly chroma: number
  readonly hue: number
  /**
   *
   * @param luminance Luminance in cd/m^2
   * @param chroma
   * @param hue Angle in degrees (0-360)
   */
  constructor(luminance: number, chroma: number, hue: number) {
    this.luminance = luminance < 0 ? 0 : luminance
    this.chroma = chroma
    this.hue = hue % 360
  }

  withLightness(l: number): LCH {
    return new LCH(l, this.chroma, this.hue)
  }

  withChroma(c: number): LCH {
    return new LCH(this.luminance, c, this.hue)
  }

  withHue(h: number): LCH {
    return new LCH(this.luminance, this.chroma, h)
  }

  toChannels(): [number, number, number] {
    return [this.luminance, this.chroma, this.hue]
  }

  toString(): string {
    return `lch(${this.luminance}, ${this.chroma}, ${this.hue})`
  }

  equals(other: LCH, tollerance = TOLLERANCE): boolean {
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
