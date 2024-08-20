import type { TNode, Renderable, Value } from '../types/domain'
import { DOMContext } from '../dom/dom-context'
import { Signal, makeComputedOf } from '../std/signal'
import { ElementPosition } from '../std/position'
import { Repeat } from './repeat'
import { Fragment } from './fragment'
import { renderableOfTNode } from './element'
import { Empty } from './empty'
import { OnUnmount } from './onunmount'
import { OneOfValue } from './oneof'

/**
 * Renders a list of items based on a signal of arrays.
 *
 * @typeParam T - The type of items in the array.
 * @param value - The signal of arrays to iterate over.
 * @param item - The function that renders each item in the array.
 * @param separator - The function that renders the separator between items.
 * @returns - The renderable function that renders the list of items.
 * @public
 */
export const ForEach = <T>(
  value: Value<T[]>,
  item: (value: Signal<T>, position: Signal<ElementPosition>) => TNode,
  separator?: (pos: Signal<ElementPosition>) => TNode
): Renderable => {
  if (separator != null) {
    return ForEach(value, (v, pos) => {
      const sepPos = pos.map(p => new ElementPosition(p.index, p.total - 1))
      const last = pos.map(p => (p.isLast ? 'last' : 'other'))
      return Fragment([
        OnUnmount(() => {
          last.dispose()
          sepPos.dispose()
        }),
        renderableOfTNode(item(v, pos)),
        OneOfValue(last, {
          last: () => Empty,
          other: () => separator(sepPos),
        }),
      ])
    })
  } else {
    return (ctx: DOMContext) => {
      const times = Signal.map(value, arr => arr.length)
      return Repeat(times, pos => {
        const signal = makeComputedOf(
          pos,
          value
        )((pos, value) => value[pos.index])
        return Fragment(
          OnUnmount(() => signal.dispose()),
          renderableOfTNode(item(signal, pos))
        )
      })(ctx)
    }
  }
}
