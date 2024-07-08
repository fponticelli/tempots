import type { Child, Clear, Mountable } from '../types/domain'
import { DOMContext } from '../dom/dom-context'
import { Signal, prop } from '../std/signal'
import { removeDOMNode } from '../dom/dom-utils'
import { childToMountable } from './element'
import { Empty } from './empty'

// TODO, rename to Show?
export const Ensure =
  <T>(
    signal:
      | Signal<T | null>
      | Signal<T | undefined>
      | Signal<T | null | undefined>,
    then: (value: Signal<NonNullable<T>>) => Child,
    otherwise?: () => Child
  ): Mountable =>
  (ctx: DOMContext) => {
    ctx = ctx.makeRef()
    let clear = null as Clear | null
    let hadValue = false
    const feed = prop(null as T | null)
    const clearSignal = signal.on(value => {
      if (value == null) {
        clear?.(true)
        clear = childToMountable(otherwise?.() ?? Empty)(ctx)
        hadValue = false
      } else {
        feed.value = value
        if (!hadValue) {
          clear?.(true)
          clear = childToMountable(then(feed as Signal<NonNullable<T>>))(ctx)
          hadValue = true
        }
      }
    })
    return (removeTree: boolean) => {
      clearSignal()
      clear?.(removeTree)
      if (removeTree && ctx.reference) {
        removeDOMNode(ctx.reference)
      }
    }
  }