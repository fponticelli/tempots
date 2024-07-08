import { DOMContext } from '../dom/dom-context'
import { removeDOMNode } from '../dom/dom-utils'
import { Position } from '../std/position'
import { Prop, Signal, prop } from '../std/signal'
import { Child, Clear, Mountable } from '../types/domain'
import { childToMountable } from './element'
import { Empty } from './empty'
import { Fragment } from './fragment'
import { OnDispose } from './ondispose'
import { oneof } from './oneof'

export const Repeat = (
  times: Signal<number>,
  element: (index: Signal<Position>) => Child,
  separator?: (pos: Signal<Position>) => Child
): Mountable => {
  if (separator != null) {
    return Repeat(times, p => {
      const last = p.map(v => (v.isLast ? 'last' : 'other'))
      return Fragment(
        OnDispose(() => last.dispose()),
        childToMountable(element(p)),
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
            existings[i] = prop(elements[i])
            const node = childToMountable(element(existings[i]))
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