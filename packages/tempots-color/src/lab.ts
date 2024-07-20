import { clamp, nearEquals } from './math'

const TOLLERANCE = 0.0001

/**
 * Represents a color in the CIELAB color space.
 *
 * @public
 */
export class LAB {
  /**
   * Creates an LAB color instance from a string representation.
   * @param s - The string representation of the LAB color in the format "lab(lightness°, a°, b°)".
   * @returns An LAB instance.
   * @throws Error If the string does not match the expected format.
   */
  static readonly fromString = (s: string): LAB => {
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

  /**
   * Creates an LAB color instance from individual channel values.
   * @param lightness - The lightness component of the color.
   * @param a - The a component of the color.
   * @param b - The b component of the color.
   * @returns An LAB instance.
   */
  static readonly ofChannels = ([lightness, a, b]: [
    lightness: number,
    a: number,
    b: number,
  ]): LAB => new LAB(lightness, a, b)

  readonly lightness: number
  readonly a: number
  readonly b: number

  /**
   * Constructs an LAB color instance.
   * @param lightness - Lightness in range (0, 100)
   * @param a - usually in the range (~-150, ~+150) - not clamped
   * @param b - usually in the range (~-150, ~+150) - not clamped
   */
  constructor(lightness: number, a: number, b: number) {
    this.lightness = clamp(lightness, 0, 100)
    this.a = a
    this.b = b
  }

  /**
   * Returns a new LAB instance with the specified lightness.
   * @param l - The new lightness value.
   * @returns A new LAB instance.
   */
  readonly withL = (l: number): LAB => new LAB(l, this.a, this.b)

  /**
   * Returns a new LAB instance with the specified a component.
   * @param a - The new a value.
   * @returns A new LAB instance.
   */
  readonly withA = (a: number): LAB => new LAB(this.lightness, a, this.b)

  /**
   * Returns a new LAB instance with the specified b component.
   * @param b - The new b value.
   * @returns A new LAB instance.
   */
  readonly withB = (b: number): LAB => new LAB(this.lightness, this.a, b)

  /**
   * Returns the LAB color as an array of its components.
   * @returns An array containing the lightness, a, and b components.
   */
  readonly toChannels = (): [number, number, number] => [
    this.lightness,
    this.a,
    this.b,
  ]

  /**
   * Returns a string representation of the LAB color.
   * @returns A string in the format "lab(lightness, a, b)".
   */
  readonly toString = (): string =>
    `lab(${this.lightness}, ${this.a}, ${this.b})`

  /**
   * Compares this LAB color to another for equality, within a tolerance.
   * @param other - The other LAB color to compare to.
   * @param tollerance - The tolerance for the comparison.
   * @returns True if the colors are considered equal within the given tolerance; otherwise, false.
   */
  readonly equals = (other: LAB, tollerance = TOLLERANCE): boolean => {
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
