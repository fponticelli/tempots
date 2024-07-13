import { DOMContext } from '../dom/dom-context'
import { Signal, prop } from '../std/signal'
import { TNode, Size } from '../types/domain'
import { childToRenderable } from './element'

const elementSizeMonitor =
  (fn: (size: Signal<Size>) => TNode) => (ctx: DOMContext) => {
    const el = ctx.element
    const size = prop({ width: el.clientWidth, height: el.clientHeight })
    const clear = childToRenderable(fn(size))(ctx)
    const onResize = () => {
      size.set({ width: el.clientWidth, height: el.clientHeight })
    }
    let observer: ResizeObserver
    if (typeof ResizeObserver === 'function') {
      observer = new ResizeObserver(onResize)
      observer.observe(el)
    }
    return (removeTree: boolean) => {
      observer?.disconnect()
      clear(removeTree)
    }
  }

const windowSizeMonitor =
  (fn: (size: Signal<Size>) => TNode) => (ctx: DOMContext) => {
    const size = prop({
      width: window?.innerWidth ?? 0,
      height: window?.innerHeight ?? 0,
    })
    const clear = childToRenderable(fn(size))(ctx)
    const onResize = () => {
      size.set({
        width: window?.innerWidth ?? 0,
        height: window?.innerHeight ?? 0,
      })
    }
    window?.addEventListener('resize', onResize)
    return (removeTree: boolean) => {
      window?.removeEventListener('resize', onResize)
      clear(removeTree)
    }
  }

export const size = {
  element: elementSizeMonitor,
  window: windowSizeMonitor,
}
