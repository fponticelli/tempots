import type { Renderable } from '../types/domain'
import { _removeDOMNode } from '../dom/dom-utils'
import { DOMContext } from '../dom/dom-context'
import { Signal } from '../std/signal'
import { _maybeAddTextTracker } from '../dom/ssr'
import { Value } from '../std/value'

/**
 * @internal
 */
export const _staticText =
  (text: string): Renderable =>
  (ctx: DOMContext) => {
    _maybeAddTextTracker(ctx)
    const node = ctx.createText(text)
    ctx.appendOrInsert(node)
    return (removeTree: boolean) => {
      if (removeTree) {
        _removeDOMNode(node)
      }
    }
  }

/**
 * @internal
 */
export const _signalText =
  (signal: Signal<string>): Renderable =>
  (ctx: DOMContext) => {
    _maybeAddTextTracker(ctx)
    const node = ctx.createText(signal.value)
    ctx.appendOrInsert(node)
    const clear = signal.on(v => (node.data = v))
    return (removeTree: boolean) => {
      clear()
      if (removeTree) {
        _removeDOMNode(node)
      }
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
