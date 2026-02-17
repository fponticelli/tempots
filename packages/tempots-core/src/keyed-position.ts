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
 * @public
 */
export class KeyedPosition {
  /**
   * The 1-based counter (index + 1).
   */
  readonly counter: Signal<number>
  /**
   * Whether this is the first element in the collection.
   */
  readonly isFirst: Signal<boolean>
  /**
   * Whether the counter is even.
   */
  readonly isEven: Signal<boolean>
  /**
   * Whether the counter is odd.
   */
  readonly isOdd: Signal<boolean>
  /**
   * Whether this is the last element in the collection.
   */
  readonly isLast: Signal<boolean>

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
  ) {
    this.counter = index.map(i => i + 1)
    this.isFirst = index.map(i => i === 0)
    this.isEven = index.map(i => i % 2 === 1)
    this.isOdd = index.map(i => i % 2 === 0)
    this.isLast = computed(
      () => (index as Prop<number>).value + 1 === (total as Prop<number>).value,
      [index, total]
    )
  }

  /**
   * Disposes the internal signals created by this position.
   *
   * **Note:** With automatic signal disposal, this method is typically a no-op
   * when used within a disposal scope (e.g., inside a renderable). Kept for
   * backward compatibility and edge cases.
   */
  readonly dispose = () => {
    this.counter.dispose()
    this.isFirst.dispose()
    this.isEven.dispose()
    this.isOdd.dispose()
    this.isLast.dispose()
  }
}
