import type { TNode, Renderable } from '../types/domain'
import { DOMContext } from '../dom/dom-context'
import { removeDOMNode } from '../dom/dom-utils'
import { renderableOfTNode } from './element'
import { Empty } from './empty'

/**
 * Represents the options for a task.
 *
 * @typeParam T - The type of the task value.
 * @public
 */
export type TaskOptions<T> = {
  pending?: TNode
  then: (value: T) => TNode
  error?: (error: unknown) => TNode
}

/**
 * Represents a renderable task that can be executed asynchronously.
 *
 * @typeParam T - The type of the value returned by the task.
 * @param task - The asynchronous task to be executed.
 * @param options - The options for the task or a function that transforms the task result into a renderable node.
 * @returns - A function that renders the task and returns a cleanup function.
 * @public
 */
export const Task = <T>(
  task: () => Promise<T>,
  options: TaskOptions<T> | ((value: T) => TNode)
): Renderable => {
  if (typeof options === 'function') {
    return Task(task, { then: options })
  }
  const pending =
    options.pending != null ? renderableOfTNode(options.pending) : Empty
  const then = options.then
  const error =
    options.error != null
      ? (e: unknown) => renderableOfTNode(options.error!(e))
      : () => Empty
  return (ctx: DOMContext) => {
    let active = true
    const promise = task()
    ctx = ctx.makeRef()
    let clear = renderableOfTNode(pending)(ctx)
    promise.then(
      value => {
        if (!active) return
        clear(true)
        clear = renderableOfTNode(then(value))(ctx)
      },
      e => {
        if (!active) return
        clear(true)
        clear = renderableOfTNode(error(e))(ctx)
      }
    )
    return (removeTree: boolean) => {
      active = false
      clear(removeTree)
      if (removeTree && ctx.reference) {
        removeDOMNode(ctx.reference)
      }
    }
  }
}
