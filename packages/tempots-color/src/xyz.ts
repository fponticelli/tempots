import { nearEquals } from './math'

const TOLLERANCE = 0.0001

export class XYZ {
  static ofChannels([x, y, z]: [x: number, y: number, z: number]): XYZ {
    return new XYZ(x, y, z)
  }

  readonly x: number
  readonly y: number
  readonly z: number
  /**
   *
   * @param x
   * @param y 100 is the brightest white
   * @param z
   */
  constructor(x: number, y: number, z: number) {
    this.x = x
    this.y = y
    this.z = z
  }

  withX(x: number): XYZ {
    return new XYZ(x, this.y, this.z)
  }

  withY(y: number): XYZ {
    return new XYZ(this.x, y, this.z)
  }

  withZ(z: number): XYZ {
    return new XYZ(this.x, this.y, z)
  }

  toString(): string {
    return `XYZ(${this.x}, ${this.y}, ${this.z})`
  }

  toChannels(): [number, number, number] {
    return [this.x, this.y, this.z]
  }

  equals(other: XYZ, tollerance = TOLLERANCE): boolean {
    return (
      nearEquals(this.x, other.x, tollerance) &&
      nearEquals(this.y, other.y, tollerance) &&
      nearEquals(this.z, other.z, tollerance)
    )
  }
}
