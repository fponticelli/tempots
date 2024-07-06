import { clamp, nearEquals } from './math'
import { HSL } from './hsl'

const TOLLERANCE = 0.0001

export class HSLA extends HSL {
  readonly alpha: number
  /**
   *
   * @param hue Angle in degrees (0-360)
   * @param saturation Percentage (0-100)
   * @param lightness Percentage (0-100)
   * @param alpha Percentage (0-100)
   */
  constructor(hue: number, saturation = 50, lightness = 50, alpha = 100) {
    super(hue, saturation, lightness)
    this.alpha = clamp(0, 1, alpha)
  }

  override withHue(hue: number): HSLA {
    return new HSLA(hue, this.saturation, this.lightness, this.alpha)
  }

  override withSaturation(saturation: number): HSLA {
    return new HSLA(this.hue, saturation, this.lightness, this.alpha)
  }

  override withLightness(lightness: number): HSLA {
    return new HSLA(this.hue, this.saturation, lightness, this.alpha)
  }

  withAlpha(alpha: number): HSLA {
    return new HSLA(this.hue, this.saturation, this.lightness, alpha)
  }

  override toString(): string {
    return `hsla(${this.hue}deg, ${this.saturation}%, ${this.lightness}%, ${
      this.alpha / 100
    })`
  }

  override equals(other: HSLA, tollerance = TOLLERANCE): boolean {
    return (
      super.equals(other, tollerance) &&
      nearEquals(this.alpha, other.alpha, tollerance)
    )
  }
}
