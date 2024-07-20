import { clampInt } from './math'

/**
 * Represents a color in the RGBA format.
 *
 * @public
 */
export class RGBA {
  /**
   * Creates an `RGBA` instance from a string representation.
   * @param s - The string representation of the color in the format "#RRGGBBAA".
   * @returns An `RGBA` instance representing the color.
   * @throws Error if the string representation is invalid.
   */
  static readonly fromString = (s: string): RGBA => {
    const m = s.match(
      /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i
    )
    if (m != null) {
      const r = parseInt(m[1], 16)
      const g = parseInt(m[2], 16)
      const b = parseInt(m[3], 16)
      const a = parseInt(m[4], 16)
      return RGBA.fromRGBA(r, g, b, a)
    } else {
      throw new Error(`Invalid RGBA string: ${s}`)
    }
  }

  /**
   * Creates an `RGBA` instance from individual RGBA components.
   * @param r - The red component (0-255).
   * @param g - The green component (0-255).
   * @param b - The blue component (0-255).
   * @param a - The alpha component (0-255).
   * @returns An `RGBA` instance representing the color.
   */
  static readonly fromRGBA = (
    r: number,
    g: number,
    b: number,
    a: number
  ): RGBA =>
    new RGBA(
      (clampInt(r, 0, 255) << 24) |
        (clampInt(g, 0, 255) << 16) |
        (clampInt(b, 0, 255) << 8) |
        clampInt(a, 0, 255)
    )

  /**
   * Creates a new `RGBA` instance.
   * @param value - The numeric value representing the color.
   */
  constructor(readonly value: number) {}

  /**
   * Gets the red component of the color.
   * @returns The red component (0-255).
   */
  get red(): number {
    return (this.value >> 24) & 0xff
  }

  /**
   * Gets the green component of the color.
   * @returns The green component (0-255).
   */
  get green(): number {
    return (this.value >> 16) & 0xff
  }

  /**
   * Gets the blue component of the color.
   * @returns The blue component (0-255).
   */
  get blue(): number {
    return (this.value >> 8) & 0xff
  }

  /**
   * Gets the alpha component of the color.
   * @returns The alpha component (0-255).
   */
  get alpha(): number {
    return this.value & 0xff
  }

  /**
   * Returns the string representation of the color.
   * @returns The string representation of the color in the format "rgba(R, G, B, A)".
   */
  readonly toString = (): string =>
    `rgba(${this.red}, ${this.green}, ${this.blue}, ${this.alpha / 256})`

  /**
   * Checks if this `RGBA` instance is equal to another `RGBA` instance.
   * @param other - The other `RGBA` instance to compare.
   * @returns `true` if the instances are equal, `false` otherwise.
   */
  readonly equals = (other: RGBA): boolean => this.value === other.value
}
