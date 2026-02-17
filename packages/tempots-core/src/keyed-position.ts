import type { Prop, Signal } from './signal'
import { computed } from './signal'

/**
 * Represents the position of an element in a keyed collection.
 *
 * Unlike {@link ElementPosition} where `index` and derived fields are static,
 * `KeyedPosition` makes **all fields reactive**. When an item moves to a new
 * position (e.g., due to array reordering in `KeyedForEach`), all derived
 * fields (`counter`, `isFirst`, `isEven`, `isOdd`, `isLast`) update
 * automatically.
 *
 * Derived fields are created lazily — only when first accessed — to avoid
 * unnecessary signal overhead when they are not used.
 *
 * @public
 */
export class KeyedPosition {
  #counterSignal: Signal<number> | undefined
  #isFirstSignal: Signal<boolean> | undefined
  #isEvenSignal: Signal<boolean> | undefined
  #isOddSignal: Signal<boolean> | undefined
  #isLastSignal: Signal<boolean> | undefined

  /**
   * Creates a new instance of `KeyedPosition`.
   * @param index - A reactive signal representing the current index of the element.
   * @param total - A reactive signal representing the total number of elements in the collection.
   */
  constructor(
    /**
     * The reactive index of the element.
     */
    readonly index: Signal<number>,
    /**
     * The reactive total number of elements in the collection.
     */
    readonly total: Signal<number>
  ) {}

  /**
   * The 1-based counter (index + 1).
   */
  get counter(): Signal<number> {
    if (this.#counterSignal == null) {
      this.#counterSignal = this.index.map(i => i + 1)
    }
    return this.#counterSignal
  }

  /**
   * Whether this is the first element in the collection.
   */
  get isFirst(): Signal<boolean> {
    if (this.#isFirstSignal == null) {
      this.#isFirstSignal = this.index.map(i => i === 0)
    }
    return this.#isFirstSignal
  }

  /**
   * Whether the counter is even.
   */
  get isEven(): Signal<boolean> {
    if (this.#isEvenSignal == null) {
      this.#isEvenSignal = this.index.map(i => i % 2 === 1)
    }
    return this.#isEvenSignal
  }

  /**
   * Whether the counter is odd.
   */
  get isOdd(): Signal<boolean> {
    if (this.#isOddSignal == null) {
      this.#isOddSignal = this.index.map(i => i % 2 === 0)
    }
    return this.#isOddSignal
  }

  /**
   * Whether this is the last element in the collection.
   */
  get isLast(): Signal<boolean> {
    if (this.#isLastSignal == null) {
      this.#isLastSignal = computed(
        () =>
          (this.index as Prop<number>).value + 1 ===
          (this.total as Prop<number>).value,
        [this.index, this.total]
      )
    }
    return this.#isLastSignal
  }

  /**
   * Disposes the internal signals created by this position.
   *
   * **Note:** With automatic signal disposal, this method is typically a no-op
   * when used within a disposal scope (e.g., inside a renderable). Kept for
   * backward compatibility and edge cases.
   */
  readonly dispose = () => {
    this.#counterSignal?.dispose()
    this.#isFirstSignal?.dispose()
    this.#isEvenSignal?.dispose()
    this.#isOddSignal?.dispose()
    this.#isLastSignal?.dispose()
  }
}
