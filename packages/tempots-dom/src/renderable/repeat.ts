import { DOMContext } from '../dom/dom-context'
import { ElementPosition } from '../std/element-position'
import { Signal, makeSignal } from '../std/signal'
import { Value } from '../std/value'
import { TNode, Clear, Renderable } from '../types/domain'
import { renderableOfTNode } from './element'
import { Empty } from './empty'
import { Fragment } from './fragment'
import { OnDispose } from './on-dispose'
import { When } from './when'

/**
 * Creates a renderable function that repeats a given element a specified number of times.
 *
 * @param times - A signal representing the number of times the element should be repeated.
 * @param element - A function that returns the element to be repeated, based on the current index.
 * @param separator - (Optional) A function that returns the separator element to be inserted between repeated elements.
 * @returns A renderable function that renders the repeated elements.
 * @public
 */
export const Repeat = (
  times: Value<number>,
  element: (index: ElementPosition) => TNode,
  separator?: (pos: ElementPosition) => TNode
): Renderable => {
  if (separator != null) {
    return Repeat(times, pos => {
      const sepPos = new ElementPosition(
        pos.index,
        pos.total.map(v => v - 1)
      )
      return Fragment(
        OnDispose(sepPos.dispose),
        renderableOfTNode(element(pos)),
        When(
          pos.isLast,
          () => Empty,
          () => separator(sepPos)
        )
      )
    })
  } else {
    if (Signal.is(times)) {
      return (ctx: DOMContext) => {
        const newCtx = ctx.makeRef()
        const clears: Clear[] = []

        const disposeListener = times.on(newLength => {
          const toRemove = clears.splice(newLength)
          for (const remove of toRemove) {
            remove(true)
          }
          for (let i = clears.length; i < newLength; i++) {
            const pos = new ElementPosition(i, times)
            clears.push(renderableOfTNode(element(pos))(newCtx))
          }
        })

        return (removeTree: boolean) => {
          disposeListener()
          for (const clear of clears) {
            clear(removeTree)
          }
          clears.length = 0
          newCtx.clear(removeTree)
        }
      }
    } else {
      return Fragment(
        ...Array.from({ length: times }, (_, i) => i).map(i =>
          renderableOfTNode(element(new ElementPosition(i, makeSignal(times))))
        )
      )
    }
  }
}
