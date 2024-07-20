import { nearEquals } from './math'

const TOLLERANCE = 0.0001

/**
 * Represents a color in the XYZ color space.
 *
 * @public
 */
export class XYZ {
  /**
   * Creates a new XYZ instance from an array of channel values.
   * @param channels - An array of channel values [x, y, z].
   * @returns A new XYZ instance.
   */
  static readonly ofChannels = ([x, y, z]: [
    x: number,
    y: number,
    z: number,
  ]): XYZ => new XYZ(x, y, z)

  /**
   * Represents the x-coordinate.
   */
  readonly x: number
  /**
   * Represents the y coordinate.
   */
  readonly y: number
  /**
   * Represents the z-coordinate.
   */
  readonly z: number

  /**
   * Creates a new instance of the XYZ class.
   * @param x - The X component of the color.
   * @param y - The Y component of the color. 100 is the brightest white.
   * @param z - The Z component of the color.
   */
  constructor(x: number, y: number, z: number) {
    this.x = x
    this.y = y
    this.z = z
  }

  /**
   * Returns a new XYZ instance with the specified x-coordinate.
   * @param x - The new x-coordinate value.
   * @returns A new XYZ instance with the updated x-coordinate.
   */
  readonly withX = (x: number): XYZ => new XYZ(x, this.y, this.z)

  /**
   * Returns a new XYZ instance with the specified y coordinate.
   *
   * @param y - The y coordinate for the new XYZ instance.
   * @returns A new XYZ instance with the specified y coordinate.
   */
  readonly withY = (y: number): XYZ => new XYZ(this.x, y, this.z)

  /**
   * Returns a new XYZ instance with the specified z-coordinate.
   *
   * @param z - The z-coordinate for the new XYZ instance.
   * @returns A new XYZ instance with the specified z-coordinate.
   */
  readonly withZ = (z: number): XYZ => new XYZ(this.x, this.y, z)

  /**
   * Returns a string representation of the XYZ object.
   * The string is formatted as "XYZ(x, y, z)".
   *
   * @returns A string representation of the XYZ object.
   */
  readonly toString = (): string => `XYZ(${this.x}, ${this.y}, ${this.z})`

  /**
   * Converts the XYZ color values to an array of channels.
   * @returns An array of three numbers representing the X, Y, and Z channels.
   */
  readonly toChannels = (): [number, number, number] => [this.x, this.y, this.z]

  /**
   * Checks if the current XYZ object is equal to another XYZ object.
   * @param other - The other XYZ object to compare with.
   * @param tollerance - The tolerance value for comparing the XYZ values. Defaults to TOLLERANCE.
   * @returns True if the XYZ objects are equal, false otherwise.
   */
  readonly equals = (other: XYZ, tollerance = TOLLERANCE): boolean =>
    nearEquals(this.x, other.x, tollerance) &&
    nearEquals(this.y, other.y, tollerance) &&
    nearEquals(this.z, other.z, tollerance)
}
