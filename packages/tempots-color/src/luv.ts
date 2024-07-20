import { nearEquals } from './math'

const TOLLERANCE = 0.0001

/**
 * Represents a color in the LUV color space.
 *
 * @public
 */
export class LUV {
  static readonly ofChannels = ([l, u, v]: [
    l: number,
    u: number,
    v: number,
  ]): LUV => new LUV(l, u, v)

  /**
   * The lightness component of the Luv color model.
   */
  readonly l: number
  /**
   * The u component of the Luv color model.
   */
  readonly u: number
  /**
   * The v component of the Luv color model.
   */
  readonly v: number

  /**
   * Creates a new instance of the LUV color.
   * @param l - Lightness in the range (0, 1).
   * @param u - U component in the range (-1, 1).
   * @param v - V component in the range (0, 1).
   */
  constructor(l: number, u: number, v: number) {
    this.l = l
    this.u = u
    this.v = v
  }

  /**
   * Creates a new LUV color with the specified lightness value.
   * @param l - The lightness value for the new LUV color.
   * @returns A new LUV color with the specified lightness value.
   */
  readonly withL = (l: number): LUV => new LUV(l, this.u, this.v)

  /**
   * Creates a new `LUV` instance with the specified `u` value.
   *
   * @param u - The `u` value for the new `LUV` instance.
   * @returns A new `LUV` instance with the specified `u` value.
   */
  readonly withU = (u: number): LUV => new LUV(this.l, u, this.v)

  /**
   * Creates a new `LUV` instance with the specified `v` value.
   *
   * @param v - The new `v` value for the `LUV` instance.
   * @returns A new `LUV` instance with the specified `v` value.
   */
  readonly withV = (v: number): LUV => new LUV(this.l, this.u, v)

  /**
   * Converts the LUV color to an array of channels.
   * @returns An array containing the L, U, and V channels.
   */
  readonly toChannels = (): [number, number, number] => [this.l, this.u, this.v]

  /**
   * Returns a string representation of the LUV color.
   * The string is formatted as "luv(l, u, v)".
   *
   * @returns A string representation of the LUV color.
   */
  readonly toString = (): string => `luv(${this.l}, ${this.u}, ${this.v})`

  /**
   * Checks if the current LUV color is equal to another LUV color.
   * @param other - The other LUV color to compare with.
   * @param tollerance - The tolerance value for comparing the color components. Default is TOLLERANCE.
   * @returns True if the colors are equal, false otherwise.
   */
  readonly equals = (other: LUV, tollerance = TOLLERANCE): boolean => {
    if (
      (nearEquals(this.l, other.l, tollerance) &&
        nearEquals(this.l, 1, tollerance)) ||
      nearEquals(this.l, 0, tollerance)
    ) {
      return true
    }
    return (
      nearEquals(this.l, other.l, tollerance) &&
      nearEquals(this.u, other.u, tollerance) &&
      nearEquals(this.v, other.v, tollerance)
    )
  }
}
