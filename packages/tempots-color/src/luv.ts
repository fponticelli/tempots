import { nearEquals } from './math'

const TOLLERANCE = 0.0001

export class LUV {
  static ofChannels([l, u, v]: [l: number, u: number, v: number]): LUV {
    return new LUV(l, u, v)
  }

  readonly l: number
  readonly u: number
  readonly v: number
  /**
   *
   * @param l - Lightness in range (0, 1)
   * @param u - range (-1, 1)
   * @param v - range (0, 1)
   */
  constructor(l: number, u: number, v: number) {
    this.l = l
    this.u = u
    this.v = v
  }

  withL(l: number): LUV {
    return new LUV(l, this.u, this.v)
  }

  withU(u: number): LUV {
    return new LUV(this.l, u, this.v)
  }

  withV(v: number): LUV {
    return new LUV(this.l, this.u, v)
  }

  toChannels(): [number, number, number] {
    return [this.l, this.u, this.v]
  }

  toString(): string {
    return `luv(${this.l}, ${this.u}, ${this.v})`
  }

  equals(other: LUV, tollerance = TOLLERANCE): boolean {
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
