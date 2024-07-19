import { DOMContext } from '../dom/dom-context'
import { removeDOMNode } from '../dom/dom-utils'
import { Position } from '../std/position'
import { Prop, Signal, useProp } from '../std/signal'
import { TNode, Clear, Renderable } from '../types/domain'
import { renderableOfTNode } from './element'
import { Empty } from './empty'
import { Fragment } from './fragment'
import { OnUnmount } from './onunmount'
import { oneof } from './oneof'

export const Repeat = (
  times: Signal<number>,
  element: (index: Signal<Position>) => TNode,
  separator?: (pos: Signal<Position>) => TNode
): Renderable => {
  if (separator != null) {
    return Repeat(times, p => {
      const last = p.map(v => (v.isLast ? 'last' : 'other'))
      return Fragment(
        OnUnmount(() => last.dispose()),
        renderableOfTNode(element(p)),
        oneof.value(last, {
          last: () => Empty,
          other: () => separator(p),
        })
      )
    })
  } else {
    return (ctx: DOMContext) => {
      ctx = ctx.makeRef()
      const elementSignals = times.map(times =>
        Array.from({ length: times }, (_, i) => i).map(
          i => new Position(i, times)
        )
      )
      const clears: Clear[] = []
      const existings: Prop<Position>[] = []
      const clear = elementSignals.on(elements => {
        const newLength = elements.length
        while (newLength < clears.length) {
          clears.pop()?.(true)
          existings.pop()?.dispose()
        }
        for (let i = 0; i < newLength; i++) {
          if (existings[i] == null) {
            existings[i] = useProp(elements[i])
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
          removeDOMNode(ctx.reference)
        }
      }
    }
  }
}
