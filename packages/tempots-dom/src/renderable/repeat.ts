import { DOMContext } from '../dom/dom-context'
import { _removeDOMNode } from '../dom/dom-utils'
import { ElementPosition } from '../std/position'
import { Prop, Signal, makeProp, makeSignal } from '../std/signal'
import { Value } from '../std/value'
import { TNode, Clear, Renderable } from '../types/domain'
import { renderableOfTNode } from './element'
import { Empty } from './empty'
import { Fragment } from './fragment'
import { OneOfValue } from './oneof'
import { OnUnmount } from './onunmount'

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
  element: (index: Signal<ElementPosition>) => TNode,
  separator?: (pos: Signal<ElementPosition>) => TNode
): Renderable => {
  if (separator != null) {
    return Repeat(times, pos => {
      const sepPos = pos.map(p => new ElementPosition(p.index, p.total - 1))
      const last = pos.map(p => (p.isLast ? 'last' : 'other'))
      return Fragment(
        OnUnmount(() => {
          sepPos.dispose()
          last.dispose()
        }),
        renderableOfTNode(element(pos)),
        OneOfValue(last, {
          last: () => Empty,
          other: () => separator(sepPos),
        })
      )
    })
  } else {
    if (Signal.is(times)) {
      return (ctx: DOMContext) => {
        ctx = ctx.makeRef()
        const elementSignals = times.map(times =>
          Array.from({ length: times }, (_, i) => i).map(
            i => new ElementPosition(i, times)
          )
        )
        const clears: Clear[] = []
        const existings: Prop<ElementPosition>[] = []
        const clear = elementSignals.on(elements => {
          const newLength = elements.length
          while (newLength < clears.length) {
            clears.pop()?.(true)
            existings.pop()?.dispose()
          }
          for (let i = 0; i < newLength; i++) {
            if (existings[i] == null) {
              existings[i] = makeProp(elements[i])
              const node = renderableOfTNode(element(existings[i]))
              clears[i] = node(ctx)
            } else {
              existings[i].value = elements[i]
            }
          }
        })

        return (removeTree: boolean) => {
          clear()
          if (removeTree && ctx.reference) {
            _removeDOMNode(ctx.reference)
          }
        }
      }
    } else {
      return Fragment(
        ...Array.from({ length: times }, (_, i) => i).map(i =>
          renderableOfTNode(element(makeSignal(new ElementPosition(i, times))))
        )
      )
    }
  }
}
