import { clampInt } from './math'

export class RGB {
  static fromString(s: string): RGB {
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

  static fromRGB(r: number, g: number, b: number): RGB {
    return new RGB(
      (clampInt(Math.round(r), 0, 255) << 16) |
        (clampInt(Math.round(g), 0, 255) << 8) |
        clampInt(Math.round(b), 0, 255)
    )
  }

  static ofChannels([r, g, b]: [r: number, g: number, b: number]): RGB {
    return RGB.fromRGB(r * 255, g * 255, b * 255)
  }

  constructor(readonly value: number) {}

  get red(): number {
    return (this.value >> 16) & 0xff
  }

  get green(): number {
    return (this.value >> 8) & 0xff
  }

  get blue(): number {
    return this.value & 0xff
  }

  toChannels(): [number, number, number] {
    return [this.red / 255, this.green / 255, this.blue / 255]
  }

  toString(): string {
    return `#${this.red.toString(16).padStart(2, '0')}${this.green
      .toString(16)
      .padStart(2, '0')}${this.blue.toString(16).padStart(2, '0')}`
  }

  equals(other: RGB): boolean {
    return this.value === other.value
  }
}
