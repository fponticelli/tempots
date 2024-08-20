import { Signal } from '../std/signal'
import { Renderable, TNode } from '../types/domain'
import { ElementPosition } from '../std/position'
import { OneOfValue } from './oneof'

/**
 * Options for configuring a conjunction.
 * @public
 */
export type ConjunctionOptions = {
  /**
   * The separator to use for the last element.
   */
  lastSeparator?: TNode
  /**
   * The separator to use for the first element.
   */
  firstSeparator?: TNode
}

/**
 * Creates a Renderable that returns the appropriate separator based on the element position.
 *
 * @param separator - The default separator to use.
 * @param options - The options for configuring the conjunction.
 * @returns A function that returns the appropriate separator based on the element position.
 * @public
 */
export const Conjunction =
  (separator: TNode, options: ConjunctionOptions = {}) =>
  (pos: Signal<ElementPosition>): Renderable => {
    const firstSeparator = options?.firstSeparator ?? separator
    const lastSeparator = options?.lastSeparator ?? separator
    return OneOfValue(
      pos.map(v => {
        if (v.isFirst) {
          return 'first'
        } else if (v.isLast) {
          return 'last'
        } else {
          return 'other'
        }
      }),
      {
        first: () => firstSeparator,
        last: () => lastSeparator,
        other: () => separator,
      }
    )
  }
