import {
  DOMContext,
  Signal,
  makeProp,
  TNode,
  Size,
  renderableOfTNode,
  OnBrowserCtx,
  BrowserContext,
} from '@tempots/dom'

/**
 * Creates a renderable function that monitors the size of an element and provides it as a signal.
 *
 * @param fn - The renderable function that receives the size signal and returns a TNode.
 * @returns A function that takes a DOMContext and returns a renderable function.
 * @public
 */
export const ElementSize = (fn: (size: Signal<Size>) => TNode) =>
  OnBrowserCtx((ctx: BrowserContext) => {
    const { element } = ctx
    const size = makeProp({
      width: element.clientWidth,
      height: element.clientHeight,
    })
    const clear = renderableOfTNode(fn(size))(ctx)
    const onResize = () => {
      size.set({ width: element.clientWidth, height: element.clientHeight })
    }
    let observer: ResizeObserver
    if (typeof ResizeObserver === 'function') {
      observer = new ResizeObserver(onResize)
      observer.observe(element)
    }
    return (removeTree: boolean) => {
      observer?.disconnect()
      clear(removeTree)
    }
  })

/**
 * Creates a renderable function that monitors the window size and invokes the provided function with the current size.
 * @param fn - The function to be invoked with the current window size.
 * @returns A renderable function that monitors the window size.
 * @public
 */
export const WindowSize =
  (fn: (size: Signal<Size>) => TNode) => (ctx: DOMContext) => {
    const size = makeProp({
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
