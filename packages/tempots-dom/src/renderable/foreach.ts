import type { TNode, Renderable } from '../types/domain'
import { DOMContext } from '../dom/dom-context'
import { Signal } from '../std/signal'
import { ElementPosition } from '../std/element-position'
import { Repeat } from './repeat'
import { Fragment } from './fragment'
import { renderableOfTNode } from './element'
import { Empty } from './empty'
import { OnUnmount } from './onunmount'
import { Value } from '../std/value'
import { When } from './when'

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
  item: (value: Signal<T>, position: ElementPosition) => TNode,
  separator?: (pos: ElementPosition) => TNode
): Renderable => {
  if (separator != null) {
    return ForEach(value, (v, pos) => {
      const sepPos = new ElementPosition(
        pos.index,
        pos.total.map(v => v - 1)
      )
      return Fragment([
        OnUnmount(sepPos.dispose),
        renderableOfTNode(item(v, pos)),
        When(pos.isLast, Empty, separator(sepPos)),
      ])
    })
  } else {
    return (ctx: DOMContext) => {
      const times = Value.map(value, arr => arr.length)
      const arr = Value.toSignal(value)
      return Repeat(times, pos => {
        const signal = arr.map(arr => arr[pos.index])
        return Fragment(
          OnUnmount(signal.dispose),
          renderableOfTNode(item(signal, pos))
        )
      })(ctx)
    }
  }
}
