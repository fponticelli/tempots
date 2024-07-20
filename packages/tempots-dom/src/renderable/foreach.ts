import type { TNode, Renderable } from '../types/domain'
import { DOMContext } from '../dom/dom-context'
import { Signal, useComputed } from '../std/signal'
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
 * @param signal - The signal of arrays to iterate over.
 * @param item - The function that renders each item in the array.
 * @param separator - Optional. The function that renders the separator between items.
 * @returns - The renderable function that renders the list of items.
 * @public
 */
export const ForEach = <T>(
  signal: Signal<T[]>,
  item: (value: Signal<T>, position: Signal<ElementPosition>) => TNode,
  separator?: (pos: Signal<ElementPosition>) => TNode
): Renderable => {
  if (separator != null) {
    return ForEach(signal, (v, p) => {
      const last = p.map(v => (v.isLast ? 'last' : 'other'))
      return Fragment([
        OnUnmount(() => last.dispose()),
        renderableOfTNode(item(v, p)),
        OneOfValue(last, {
          last: () => Empty,
          other: () => separator(p),
        }),
      ])
    })
  } else {
    return (ctx: DOMContext) => {
      const times = signal.map(arr => arr.length)
      return Repeat(times, pos => {
        const value = useComputed(
          () => signal.value[pos.value.index],
          [pos, signal]
        )
        return Fragment(
          OnUnmount(() => value.dispose()),
          renderableOfTNode(item(value, pos))
        )
      })(ctx)
    }
  }
}
