import { clampInt } from '../numbers'

const TOLLERANCE = 0.0001

export class RGBA {
  static fromString(s: string): RGBA {
    const m = s.match(
      /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i
    )
    if (m) {
      const r = parseInt(m[1], 16)
      const g = parseInt(m[2], 16)
      const b = parseInt(m[3], 16)
      const a = parseInt(m[4], 16)
      return RGBA.fromRGBA(r, g, b, a)
    } else {
      throw new Error(`Invalid RGBA string: ${s}`)
    }
  }

  static fromRGBA(r: number, g: number, b: number, a: number): RGBA {
    return new RGBA(
      (clampInt(r, 0, 255) << 24) |
        (clampInt(g, 0, 255) << 16) |
        (clampInt(b, 0, 255) << 8) |
        clampInt(a, 0, 255)
    )
  }

  constructor(readonly value: number) {}

  get red(): number {
    return (this.value >> 24) & 0xff
  }

  get green(): number {
    return (this.value >> 16) & 0xff
  }

  get blue(): number {
    return (this.value >> 8) & 0xff
  }

  get alpha(): number {
    return this.value & 0xff
  }

  toString(): string {
    return `rgba(${this.red}, ${this.green}, ${this.blue}, ${this.alpha / 256})`
  }

  equals(other: RGBA): boolean {
    return this.value === other.value
  }
}
