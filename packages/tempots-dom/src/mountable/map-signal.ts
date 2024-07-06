import type { Clear, Mountable } from '../types/domain'
import type { Signal } from '../std/signal'
import { DOMContext } from '../dom/dom-context'
import { childToMountable } from './element'

export const MapSignal = <T>(
  signal: Signal<T>,
  fn: (value: T) => Mountable
): Mountable => {
  return (ctx: DOMContext) => {
    ctx = ctx.makeRef()
    const mountableSignal = signal.map(v => childToMountable(fn(v)))
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
