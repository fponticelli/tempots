import { Signal } from './signal'

/**
 * Represents the position of an element in a collection.
 *
 * @public
 */
export class ElementPosition {
  /**
   * The counter of the element starting from 1.
   */
  readonly counter: number
  /**
   * Checks if the element is the first element in the collection.
   * @returns `true` if the element is the first element, `false` otherwise.
   */
  readonly isFirst: boolean
  /**
   * Checks if the counter of the element is even.
   * @returns `true` if the counter is even, `false` otherwise.
   */
  readonly isEven: boolean

  /**
   * Checks if the counter of the element is odd.
   * @returns `true` if the counter is odd, `false` otherwise.
   */
  readonly isOdd: boolean
  /**
   * Creates a new instance of `ElementPosition`.
   * @param index - The index of the element.
   * @param total - The total number of elements in the collection.
   */
  constructor(
    /**
     * The index of the element.
     */
    readonly index: number,
    /**
     * The total number of elements in the collection.
     */
    readonly total: Signal<number>
  ) {
    this.counter = index + 1
    this.isFirst = index === 0
    this.isEven = index % 2 === 1
    this.isOdd = index % 2 === 0
  }

  #lastSignal: Signal<boolean> | undefined
  /**
   * Checks if the element is the last element in the collection.
   * @returns `true` if the element is the last element, `false` otherwise.
   */
  get isLast() {
    if (this.#lastSignal == null) {
      this.#lastSignal = this.total.map(total => this.counter === total)
    }
    return this.#lastSignal
  }

  readonly dispose = () => {
    if (this.#lastSignal != null) {
      this.#lastSignal.dispose()
      this.#lastSignal = undefined
    }
  }
}
