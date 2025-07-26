import { Clear, Renderable, TNode } from '../types/domain'
import { Value } from '../std/value'
import { Signal } from '../std/signal'
import { DOMContext } from '../dom/dom-context'
import { renderableOfTNode } from './element'
import { Empty } from './empty'

/**
 * Lazily renders content based on a boolean condition.
 * @param condition - The condition to evaluate
 * @param then - Function returning content to render if condition is true
 * @param otherwise - Optional function returning content to render if condition is false
 * @returns Renderable content
 * @public
 */
export const When = (
  condition: Value<boolean>,
  then: () => TNode,
  otherwise?: () => TNode
): Renderable => {
  if (Signal.is(condition as Value<boolean>)) {
    const signal = condition as Signal<boolean>
    return (ctx: DOMContext) => {
      const newCtx = ctx.makeRef()
      let clear: Clear = () => {}
      const clearSignal = signal.on(isTrue => {
        clear(true)
        if (isTrue) {
          clear = renderableOfTNode(then())(newCtx)
        } else {
          clear = renderableOfTNode(otherwise?.())(newCtx)
        }
      })
      return (removeTree: boolean) => {
        clear(removeTree)
        clearSignal()
        newCtx.clear(removeTree)
      }
    }
  } else {
    const literal = condition as boolean
    if (literal) {
      const result = then()
      if (result != null) {
        return renderableOfTNode(result)
        /* c8 ignore next 3 */
      }
      return Empty
    }
    return renderableOfTNode(otherwise?.())
  }
}
/**
 * Lazily renders content when a condition is false.
 * @param condition - The condition to evaluate
 * @param then - Function returning content to render if condition is false
 * @param otherwise - Optional function returning content to render if condition is true
 * @returns Renderable content
 * @public
 */
export const Unless = (
  condition: Value<boolean>,
  then: () => TNode,
  otherwise?: () => TNode
): Renderable =>
  When(
    Value.map(condition, v => !v),
    then,
    otherwise
  )
