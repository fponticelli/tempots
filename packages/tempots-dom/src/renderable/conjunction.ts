import { Empty } from './empty'
import { Signal } from '../std/signal'
import { TNode } from '../types/domain'
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
export const Conjunction = (
  separator: TNode,
  options: ConjunctionOptions = {}
) => {
  return (pos: Signal<ElementPosition>) => {
    const firstSeparator = options?.firstSeparator ?? Empty
    const lastSeparator = options?.lastSeparator ?? Empty
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
}
