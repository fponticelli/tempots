import { Renderable, TNode } from '../types/domain'
import { Value } from '../std/value'
import { renderableOfTNode } from './element'
import { Empty } from './empty'
import { handleValueOrSignal, createReactiveRenderable } from './utils'

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
): Renderable =>
  handleValueOrSignal(
    condition,
    signal => ctx =>
      createReactiveRenderable(ctx, signal, isTrue =>
        isTrue ? then() : otherwise?.()
      ),
    literal => {
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
  )
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
