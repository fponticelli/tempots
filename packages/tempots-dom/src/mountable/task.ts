import type { Child, Mountable } from '../types/domain'
import { DOMContext } from '../dom/dom-context'
import { removeDOMNode } from '../dom/dom-utils'
import { childToMountable } from './element'
import { Empty } from './empty'

export const Task = <T>(
  task: () => Promise<T>,
  options:
    | {
        pending?: Child
        then: (value: T) => Child
        error?: (error: unknown) => Child
      }
    | ((value: T) => Child)
): Mountable => {
  if (typeof options === 'function') {
    return Task(task, { then: options })
  }
  const pending =
    options.pending != null ? childToMountable(options.pending) : Empty
  const then = options.then
  const error =
    options.error != null
      ? (e: unknown) => childToMountable(options.error!(e))
      : () => Empty
  return (ctx: DOMContext) => {
    let active = true
    const promise = task()
    ctx = ctx.makeRef()
    let clear = childToMountable(pending)(ctx)
    promise.then(
      value => {
        if (!active) return
        clear(true)
        clear = childToMountable(then(value))(ctx)
      },
      e => {
        if (!active) return
        clear(true)
        clear = childToMountable(error(e))(ctx)
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
