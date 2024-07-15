import {
  DOMContext,
  Signal,
  prop,
  TNode,
  Size,
  renderableOfTNode,
} from '@tempots/dom'

const elementSizeMonitor =
  (fn: (size: Signal<Size>) => TNode) => (ctx: DOMContext) => {
    const el = ctx.element
    const size = prop({ width: el.clientWidth, height: el.clientHeight })
    const clear = renderableOfTNode(fn(size))(ctx)
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
    const clear = renderableOfTNode(fn(size))(ctx)
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
