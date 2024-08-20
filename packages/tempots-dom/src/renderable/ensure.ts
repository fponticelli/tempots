import type { TNode, Clear, Renderable, Value } from '../types/domain'
import { DOMContext } from '../dom/dom-context'
import { Signal, makeProp, makeSignal } from '../std/signal'
import { _removeDOMNode } from '../dom/dom-utils'
import { renderableOfTNode } from './element'
import { Empty } from './empty'

/**
 * Represents a function that ensures a signal has a value before rendering a TNode.
 *
 * @typeParam T - The type of the signal value.
 * @param value - The signal or literal that may hold a value of type T or null or undefined.
 * @param then - The function that returns a TNode when the signal has a value. It takes a signal of the non-nullable type of T.
 * @param otherwise - The function that returns a TNode when the signal does not have a value.
 * @returns A renderable function that ensures the signal has a value before rendering a TNode.
 * @public
 */
export const Ensure = <T>(
  value: Value<T | null> | Value<T | undefined> | Value<T | null | undefined>,
  then: (value: Signal<NonNullable<T>>) => TNode,
  otherwise?: () => TNode
): Renderable => {
  if (Signal.is(value as Value<T | null | undefined>)) {
    const signal = value as Signal<T | null | undefined>
    return (ctx: DOMContext) => {
      ctx = ctx.makeRef()
      let clear = null as Clear | null
      let hadValue = false
      const feed = makeProp(null as T | null)
      const clearSignal = signal.on(value => {
        if (value == null) {
          clear?.(true)
          clear = renderableOfTNode(otherwise?.() ?? Empty)(ctx)
          hadValue = false
        } else {
          feed.value = value
          if (!hadValue) {
            clear?.(true)
            clear = renderableOfTNode(then(feed as Signal<NonNullable<T>>))(ctx)
            hadValue = true
          }
        }
      })
      return (removeTree: boolean) => {
        clearSignal()
        clear?.(removeTree)
        if (removeTree && ctx.reference) {
          _removeDOMNode(ctx.reference)
        }
      }
    }
  } else {
    const literal = value as T | null | undefined
    if (literal == null) {
      const result = otherwise?.()
      if (result != null) {
        return renderableOfTNode(result)
      }
      return Empty
    }
    return renderableOfTNode(then(makeSignal(literal)))
  }
}
