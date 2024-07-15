import type { TNode, Renderable } from '../types/domain'
import { DOMContext } from '../dom/dom-context'
import { removeDOMNode } from '../dom/dom-utils'
import { renderableOfTNode } from './element'
import { Empty } from './empty'

export const Task = <T>(
  task: () => Promise<T>,
  options:
    | {
        pending?: TNode
        then: (value: T) => TNode
        error?: (error: unknown) => TNode
      }
    | ((value: T) => TNode)
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
