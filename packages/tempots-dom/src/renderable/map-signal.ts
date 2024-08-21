import type { Clear, Renderable } from '../types/domain'
import { Signal } from '../std/signal'
import { DOMContext } from '../dom/dom-context'
import { renderableOfTNode } from './element'
import { Value } from '../std/value'

/**
 * Maps the values emitted by a signal to a renderable function and returns a new renderable function.
 *
 * While it is tempting to use MapSignal for its simplicity, it is important to remember that the
 * renderable function returned by MapSignal will be re-rendered every time the signal emits a new value.
 *
 * In other contexts link `Ensure` or `OneOf`, the renderable function is only re-rendered when the signal
 * changes to a state that requires a different renderable function.
 *
 * @typeParam T - The type of values emitted by the signal.
 * @param vlaue - The signal or value to map.
 * @param fn - The function to map the signal values to renderable functions.
 * @returns - A new renderable function that represents the mapped signal.
 * @public
 */
export const MapSignal = <T>(
  value: Value<T>,
  fn: (value: T) => Renderable
): Renderable => {
  if (Signal.is(value)) {
    const signal = value as Signal<T>
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
  return renderableOfTNode(fn(value))
}
