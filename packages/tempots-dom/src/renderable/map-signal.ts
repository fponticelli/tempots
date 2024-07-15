import type { Clear, Renderable } from '../types/domain'
import type { Signal } from '../std/signal'
import { DOMContext } from '../dom/dom-context'
import { renderableOfTNode } from './element'

export const MapSignal = <T>(
  signal: Signal<T>,
  fn: (value: T) => Renderable
): Renderable => {
  return (ctx: DOMContext) => {
    ctx = ctx.makeRef()
    const mountableSignal = signal.map(v => renderableOfTNode(fn(v)))
    let previousClear: Clear = () => {}
    const clear = mountableSignal.on(child => {
      previousClear(true)
      previousClear = child(ctx)
    })
    return removeTree => {
      clear()
      previousClear(removeTree)
    }
  }
}
