import { clampInt } from './math'

/**
 * Represents a color in the RGB color model.
 *
 * @public
 */
export class RGB {
  /**
   * Creates an `RGB` instance from a string representation of a color in the format "#RRGGBB".
   * @param s - The string representation of the color.
   * @returns An `RGB` instance representing the color.
   * @throws An error if the string representation is invalid.
   */
  static readonly fromString = (s: string): RGB => {
    const m = s.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i)
    if (m != null) {
      const r = parseInt(m[1], 16)
      const g = parseInt(m[2], 16)
      const b = parseInt(m[3], 16)
      return RGB.fromRGB(r, g, b)
    } else {
      throw new Error(`Invalid RGB string: ${s}`)
    }
  }

  /**
   * Creates an `RGB` instance from individual RGB channel values.
   * @param r - The red channel value (0-255).
   * @param g - The green channel value (0-255).
   * @param b - The blue channel value (0-255).
   * @returns An `RGB` instance representing the color.
   */
  static readonly fromRGB = (r: number, g: number, b: number): RGB =>
    new RGB(
      (clampInt(Math.round(r), 0, 255) << 16) |
        (clampInt(Math.round(g), 0, 255) << 8) |
        clampInt(Math.round(b), 0, 255)
    )

  /**
   * Creates an `RGB` instance from an array of normalized RGB channel values.
   * @param channels - An array containing the red, green, and blue channel values (0-1).
   * @returns An `RGB` instance representing the color.
   */
  static readonly ofChannels = ([r, g, b]: [
    r: number,
    g: number,
    b: number,
  ]): RGB => RGB.fromRGB(r * 255, g * 255, b * 255)

  /**
   * Creates a new `RGB` instance.
   * @param value - The numeric value representing the color.
   */
  constructor(readonly value: number) {}

  /**
   * Gets the red channel value of the color.
   * @returns The red channel value (0-255).
   */
  get red(): number {
    return (this.value >> 16) & 0xff
  }

  /**
   * Gets the green channel value of the color.
   * @returns The green channel value (0-255).
   */
  get green(): number {
    return (this.value >> 8) & 0xff
  }

  /**
   * Gets the blue channel value of the color.
   * @returns The blue channel value (0-255).
   */
  get blue(): number {
    return this.value & 0xff
  }

  /**
   * Converts the color to an array of normalized RGB channel values.
   * @returns An array containing the red, green, and blue channel values (0-1).
   */
  readonly toChannels = (): [number, number, number] => [
    this.red / 255,
    this.green / 255,
    this.blue / 255,
  ]

  /**
   * Converts the color to a string representation in the format "#RRGGBB".
   * @returns The string representation of the color.
   */
  readonly toString = (): string =>
    `#${this.red.toString(16).padStart(2, '0')}${this.green
      .toString(16)
      .padStart(2, '0')}${this.blue.toString(16).padStart(2, '0')}`

  /**
   * Checks if the color is equal to another `RGB` instance.
   * @param other - The `RGB` instance to compare.
   * @returns `true` if the colors are equal, `false` otherwise.
   */
  readonly equals = (other: RGB): boolean => this.value === other.value
}
