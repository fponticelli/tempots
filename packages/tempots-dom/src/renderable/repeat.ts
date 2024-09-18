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
        When(pos.isLast, Empty, separator(sepPos))
      )
    })
  } else {
    if (Signal.is(times)) {
      return (ctx: DOMContext) => {
        const newCtx = ctx.makeRef()
        const existings: ElementPosition[] = Array.from(
          { length: times.value },
          (_, i) => i
        ).map(i => new ElementPosition(i, times))
        const clears: Clear[] = existings.map(pos =>
          renderableOfTNode(element(pos))(newCtx)
        )
        const clear = times.on(newLength => {
          while (newLength < clears.length) {
            existings.pop()!.dispose()
            clears.pop()!(true)
          }
          for (let i = 0; i < newLength; i++) {
            if (existings[i] == null) {
              existings[i] = new ElementPosition(i, times)
              const node = renderableOfTNode(element(existings[i]))
              clears[i] = node(newCtx)
            }
          }
        })

        return (removeTree: boolean) => {
          clear()
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
