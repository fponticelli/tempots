import { clamp, nearEquals } from './math'

const TOLLERANCE = 0.0001

export class LAB {
  static fromString(s: string): LAB {
    const m = s.match(
      /^lab\((\d+(?:\.\d+)?)°, ?(\d+(?:\.\d+)?)°, ?(\d+(?:\.\d+)?)°\)$/
    )
    if (m != null) {
      const [, lightness, a, b] = m
      return new LAB(parseFloat(lightness), parseFloat(a), parseFloat(b))
    } else {
      throw new Error(`Invalid LAB string: ${s}`)
    }
  }

  static ofChannels([lightness, a, b]: [
    lightness: number,
    a: number,
    b: number,
  ]): LAB {
    return new LAB(lightness, a, b)
  }

  readonly lightness: number
  readonly a: number
  readonly b: number
  /**
   *
   * @param lightness - Lightness in range (0, 100)
   * @param a - usually in the range (~-150, ~+150) - not clamped
   * @param b - usually in the range (~-150, ~+150) - not clamped
   */
  constructor(lightness: number, a: number, b: number) {
    this.lightness = clamp(lightness, 0, 100)
    this.a = a
    this.b = b
  }

  withL(l: number): LAB {
    return new LAB(l, this.a, this.b)
  }

  withA(a: number): LAB {
    return new LAB(this.lightness, a, this.b)
  }

  withB(b: number): LAB {
    return new LAB(this.lightness, this.a, b)
  }

  toChannels(): [number, number, number] {
    return [this.lightness, this.a, this.b]
  }

  toString(): string {
    return `lab(${this.lightness}, ${this.a}, ${this.b})`
  }

  equals(other: LAB, tollerance = TOLLERANCE): boolean {
    if (
      nearEquals(this.lightness, other.lightness, tollerance) &&
      (nearEquals(this.lightness, 100, tollerance) ||
        nearEquals(this.lightness, 0, tollerance))
    ) {
      return true
    }
    return (
      nearEquals(this.lightness, other.lightness, tollerance) &&
      nearEquals(this.a, other.a, tollerance) &&
      nearEquals(this.b, other.b, tollerance)
    )
  }
}
