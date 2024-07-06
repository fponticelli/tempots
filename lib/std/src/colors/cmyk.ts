import { clamp, nearEquals } from '../numbers'

const TOLLERANCE = 0.0001

export class CMYK {
  static fromString(s: string): CMYK {
    const m = s.match(
      /^cmyk\((\d+(?:\.\d+)?)%, ?(\d+(?:\.\d+)?)%, ?(\d+(?:\.\d+)?)%, ?(\d+(?:\.\d+)?)%\)$/
    )
    if (m) {
      const [, cyan, magenta, y, k] = m
      return new CMYK(
        parseFloat(cyan),
        parseFloat(magenta),
        parseFloat(y),
        parseFloat(k)
      )
    }
    throw new Error(`Invalid CMYK string: ${s}`)
  }
  static ofChannels([cyan, magenta, yellow, black]: [
    cyan: number,
    magenta: number,
    yellow: number,
    black: number
  ]): CMYK {
    return new CMYK(
      clamp(cyan * 100, 0, 100),
      clamp(magenta * 100, 0, 100),
      clamp(yellow * 100, 0, 100),
      clamp(black * 100, 0, 100)
    )
  }

  readonly cyan: number
  readonly magenta: number
  readonly yellow: number
  readonly black: number
  constructor(cyan: number, magenta: number, yellow: number, black: number) {
    this.cyan = clamp(cyan, 0, 100)
    this.magenta = clamp(magenta, 0, 100)
    this.yellow = clamp(yellow, 0, 100)
    this.black = clamp(black, 0, 100)
  }

  withCyan(cyan: number): CMYK {
    return new CMYK(cyan, this.magenta, this.yellow, this.black)
  }
  withMagenta(magenta: number): CMYK {
    return new CMYK(this.cyan, magenta, this.yellow, this.black)
  }
  withYellow(yellow: number): CMYK {
    return new CMYK(this.cyan, this.magenta, yellow, this.black)
  }
  withBlack(black: number): CMYK {
    return new CMYK(this.cyan, this.magenta, this.yellow, black)
  }

  toChannels(): [number, number, number, number] {
    return [
      this.cyan / 100,
      this.magenta / 100,
      this.yellow / 100,
      this.black / 100
    ]
  }

  toString() {
    return `cmyk(${this.cyan}%, ${this.magenta}%, ${this.yellow}%, ${this.black}%)`
  }

  equals(other: CMYK, tollerance = TOLLERANCE): boolean {
    return (
      nearEquals(this.cyan, other.cyan, tollerance) &&
      nearEquals(this.magenta, other.magenta, tollerance) &&
      nearEquals(this.yellow, other.yellow, tollerance) &&
      nearEquals(this.black, other.black, tollerance)
    )
  }
}
