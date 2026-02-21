import type { Renderable } from '../types/domain'
import type { Primitive } from '@tempots/core'
import { DOMContext } from '../dom/dom-context'
import { Signal } from '@tempots/core'
import { Value } from '@tempots/core'
import { domRenderable } from '../types/domain'

/**
 * @internal
 */
export const _staticText = (text: Primitive): Renderable =>
  domRenderable((ctx: DOMContext) => {
    const newCtx = ctx.makeChildText(text)
    return (removeTree: boolean) => newCtx.clear(removeTree)
  })

/**
 * @internal
 */
export const _signalText = <T extends Primitive>(
  signal: Signal<T>
): Renderable =>
  domRenderable((ctx: DOMContext) => {
    const newCtx = ctx.makeChildText(signal.value)
    const dispose = signal.on((v: T) => newCtx.setText(v))
    return (removeTree: boolean) => {
      dispose()
      newCtx.clear(removeTree)
    }
  })

/**
 * Creates a renderable text node.
 *
 * @param value - The value of the text node.
 * @returns A renderable text node.
 * @public
 */
export const TextNode = <T extends Primitive>(value: Value<T>): Renderable => {
  if (Signal.is(value)) {
    return _signalText(value as Signal<T>)
  } else {
    return _staticText(value as T)
  }
}
