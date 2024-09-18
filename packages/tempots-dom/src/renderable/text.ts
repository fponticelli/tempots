import type { Renderable } from '../types/domain'
import { DOMContext } from '../dom/dom-context'
import { Signal } from '../std/signal'
// import { _maybeAddTextTracker } from '../dom/ssr'
import { Value } from '../std/value'

/**
 * @internal
 */
export const _staticText =
  (text: string): Renderable =>
  (ctx: DOMContext) => {
    // _maybeAddTextTracker(ctx)
    const newCtx = ctx.makeChildText(text)
    return (removeTree: boolean) => newCtx.clear(removeTree)
  }

/**
 * @internal
 */
export const _signalText =
  (signal: Signal<string>): Renderable =>
  (ctx: DOMContext) => {
    // _maybeAddTextTracker(ctx)
    const newCtx = ctx.makeChildText(signal.value)
    const clear = signal.on(v => newCtx.setText(v))
    return (removeTree: boolean) => {
      clear()
      newCtx.clear(removeTree)
    }
  }

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
