import { Renderable, TNode } from '../types/domain'
import { Signal } from '../std/signal'
import { Ensure } from './ensure'

/**
 * Renders the `then` node if the `condition` is true, otherwise renders the `otherwise` node.
 *
 * @param condition - The condition to evaluate.
 * @param then - The node to render if the condition is true.
 * @param otherwise - The node to render if the condition is false.
 * @returns The rendered node.
 * @public
 */
export const When = (
  condition: Signal<boolean>,
  then: TNode,
  otherwise?: TNode
): Renderable => {
  return Ensure(
    condition.map(v => (v ? true : null)) as Signal<true | null>,
    () => then,
    otherwise != null ? () => otherwise : undefined
  )
}

/**
 * Executes the `then` TNode if the `condition` Signal evaluates to `false`, otherwise executes the `otherwise` TNode.
 *
 * @param condition - The Signal representing the condition to evaluate.
 * @param then - The TNode to execute if the condition is `false`.
 * @param otherwise - The optional TNode to execute if the condition is `true`.
 * @returns The result of executing the `then` or `otherwise` TNode based on the condition.
 * @public
 */
export const Unless = (
  condition: Signal<boolean>,
  then: TNode,
  otherwise?: TNode
): Renderable => {
  return When(
    condition.map(v => !v),
    then,
    otherwise
  )
}
