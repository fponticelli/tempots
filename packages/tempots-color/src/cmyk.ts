import { clamp, nearEquals } from './math'

const TOLLERANCE = 0.0001

/**
 * Represents a color in the CMYK color model.
 *
 * @public
 */
export class CMYK {
  /**
   * Creates a CMYK color instance from a string representation.
   * The string should be in the format "cmyk(c%, m%, y%, k%)".
   * @param s - The string representation of the CMYK color.
   * @returns A new CMYK color instance.
   * @throws Error If the provided string is not a valid CMYK color representation.
   */
  static readonly fromString = (s: string): CMYK => {
    const m = s.match(
      /^cmyk\((\d+(?:\.\d+)?)%, ?(\d+(?:\.\d+)?)%, ?(\d+(?:\.\d+)?)%, ?(\d+(?:\.\d+)?)%\)$/
    )
    if (m != null) {
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

  /**
   * Creates a new CMYK color instance from the given channel values.
   * @param channels - An array of channel values in the order [cyan, magenta, yellow, black].
   * @returns A new CMYK color instance.
   */
  static readonly ofChannels = ([cyan, magenta, yellow, black]: [
    cyan: number,
    magenta: number,
    yellow: number,
    black: number,
  ]): CMYK =>
    new CMYK(
      clamp(cyan * 100, 0, 100),
      clamp(magenta * 100, 0, 100),
      clamp(yellow * 100, 0, 100),
      clamp(black * 100, 0, 100)
    )

  /**
   * Represents the cyan component in the CMYK color model.
   */
  readonly cyan: number
  /**
   * Represents the cyan component in the CMYK color model.
   */
  readonly magenta: number
  /**
   * Represents the cyan component in the CMYK color model.
   */
  readonly yellow: number
  /**
   * Represents the cyan component in the CMYK color model.
   */
  readonly black: number

  /**
   * Represents a CMYK color.
   */
  constructor(cyan: number, magenta: number, yellow: number, black: number) {
    this.cyan = clamp(cyan, 0, 100)
    this.magenta = clamp(magenta, 0, 100)
    this.yellow = clamp(yellow, 0, 100)
    this.black = clamp(black, 0, 100)
  }

  /**
   * Returns a new CMYK color with the specified cyan value.
   *
   * @param cyan - The cyan value for the new CMYK color.
   * @returns CMYK - A new CMYK color with the specified cyan value.
   */
  readonly withCyan = (cyan: number): CMYK =>
    new CMYK(cyan, this.magenta, this.yellow, this.black)

  /**
   * Returns a new CMYK color with the specified magenta value.
   * @param magenta - The magenta value to set.
   * @returns A new CMYK color with the specified magenta value.
   */
  readonly withMagenta = (magenta: number): CMYK =>
    new CMYK(this.cyan, magenta, this.yellow, this.black)

  /**
   * Returns a new CMYK color with the specified yellow value.
   *
   * @param yellow - The yellow value for the new CMYK color.
   * @returns A new CMYK color with the specified yellow value.
   */
  readonly withYellow = (yellow: number): CMYK =>
    new CMYK(this.cyan, this.magenta, yellow, this.black)

  /**
   * Creates a new CMYK color with the specified black value.
   *
   * @param black - The black value for the new CMYK color.
   * @returns A new CMYK color with the specified black value.
   */
  readonly withBlack = (black: number): CMYK =>
    new CMYK(this.cyan, this.magenta, this.yellow, black)

  /**
   * Converts the CMYK color values to an array of channels.
   * @returns An array containing the cyan, magenta, yellow, and black channels.
   */
  readonly toChannels = (): [number, number, number, number] => [
    this.cyan / 100,
    this.magenta / 100,
    this.yellow / 100,
    this.black / 100,
  ]

  /**
   * Returns a string representation of the CMYK color in the format "cmyk(cyan%, magenta%, yellow%, black%)".
   *
   * @returns The string representation of the CMYK color.
   */
  readonly toString = (): string =>
    `cmyk(${this.cyan}%, ${this.magenta}%, ${this.yellow}%, ${this.black}%)`

  /**
   * Checks if the current CMYK color is equal to another CMYK color.
   * @param other - The CMYK color to compare with.
   * @param tollerance - The tolerance value for comparing each color component. Default is TOLLERANCE.
   * @returns `true` if the colors are equal within the specified tolerance, `false` otherwise.
   */
  readonly equals = (other: CMYK, tollerance = TOLLERANCE): boolean =>
    nearEquals(this.cyan, other.cyan, tollerance) &&
    nearEquals(this.magenta, other.magenta, tollerance) &&
    nearEquals(this.yellow, other.yellow, tollerance) &&
    nearEquals(this.black, other.black, tollerance)
}
