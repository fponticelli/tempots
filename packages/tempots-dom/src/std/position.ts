/**
 * Represents the position of an element in a collection.
 *
 * @public
 */
export class ElementPosition {
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
    readonly total: number
  ) {}

  /**
   * Checks if the element is the first element in the collection.
   * @returns `true` if the element is the first element, `false` otherwise.
   */
  get isFirst() {
    return this.index === 0
  }

  /**
   * Checks if the element is the last element in the collection.
   * @returns `true` if the element is the last element, `false` otherwise.
   */
  get isLast() {
    return this.index === this.total - 1
  }

  /**
   * Checks if the index of the element is even.
   * @returns `true` if the index is even, `false` otherwise.
   */
  get isEven() {
    return this.index % 2 === 0
  }

  /**
   * Checks if the index of the element is odd.
   * @returns `true` if the index is odd, `false` otherwise.
   */
  get isOdd() {
    return this.index % 2 === 1
  }
}
