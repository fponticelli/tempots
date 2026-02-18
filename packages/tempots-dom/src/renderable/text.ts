import type { Renderable } from '../types/domain'
import { DOMContext } from '../dom/dom-context'
import { Signal } from '@tempots/core'
import { Value } from '@tempots/core'
import { domRenderable } from '../types/domain'

/**
 * @internal
 */
export const _staticText = (text: string): Renderable =>
  domRenderable((ctx: DOMContext) => {
    const newCtx = ctx.makeChildText(text)
    return (removeTree: boolean) => newCtx.clear(removeTree)
  })

/**
 * @internal
 */
export const _signalText = (signal: Signal<string>): Renderable =>
  domRenderable((ctx: DOMContext) => {
    const newCtx = ctx.makeChildText(signal.value)
    const dispose = signal.on((v: string) => newCtx.setText(v))
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
export const TextNode = (value: Value<string>): Renderable => {
  if (Signal.is(value)) {
    return _signalText(value as Signal<string>)
  } else {
    return _staticText(value as string)
  }
}
