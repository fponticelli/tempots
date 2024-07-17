import { clamp, nearEquals } from './math'

const TOLLERANCE = 0.001

export class SRGB {
  static fromString(s: string): SRGB {
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

  static ofChannels([red, blue, green]: [
    red: number,
    blue: number,
    green: number,
  ]): SRGB {
    return new SRGB(
      clamp(red * 100, 0, 100),
      clamp(blue * 100, 0, 100),
      clamp(green * 100, 0, 100)
    )
  }

  readonly red: number
  readonly blue: number
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

  withRed(red: number): SRGB {
    return new SRGB(red, this.blue, this.green)
  }

  withBlue(blue: number): SRGB {
    return new SRGB(this.red, blue, this.green)
  }

  withGreen(green: number): SRGB {
    return new SRGB(this.red, this.blue, green)
  }

  toString(): string {
    return `rgb(${this.red}%, ${this.blue}%, ${this.green}%)`
  }

  toChannels(): [number, number, number] {
    return [this.red / 100, this.blue / 100, this.green / 100]
  }

  equals(other: SRGB, tollerance = TOLLERANCE): boolean {
    return (
      nearEquals(this.red, other.red, tollerance) &&
      nearEquals(this.blue, other.blue, tollerance) &&
      nearEquals(this.green, other.green, tollerance)
    )
  }
}
