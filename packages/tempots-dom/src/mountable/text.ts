import type { Mountable } from '../types/domain'
import { removeDOMNode } from '../dom/dom-utils'
import { DOMContext } from '../dom/dom-context'
import { Signal, Value } from '../std/signal'
import { maybeAddTextTracker } from '../dom/ssr'

export const staticText =
  (text: string): Mountable =>
  (ctx: DOMContext) => {
    maybeAddTextTracker(ctx)
    const node = ctx.createText(text)
    ctx.appendOrInsert(node)
    return (removeTree: boolean) => {
      if (removeTree) {
        removeDOMNode(node)
      }
    }
  }

export const signalText =
  (signal: Signal<string>): Mountable =>
  (ctx: DOMContext) => {
    maybeAddTextTracker(ctx)
    const node = ctx.createText(signal.value)
    ctx.appendOrInsert(node)
    const clear = signal.on(v => (node.data = v))
    return (removeTree: boolean) => {
      clear()
      if (removeTree) {
        removeDOMNode(node)
      }
    }
  }

export function Text(value: Value<string>): Mountable {
  if (Signal.is(value)) {
    return signalText(value as Signal<string>)
  } else {
    return staticText(value as string)
  }
}
