import {
  DOMContext,
  Signal,
  makeProp,
  TNode,
  Size,
  renderableOfTNode,
  OnBrowserCtx,
  BrowserContext,
  getWindow,
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
    const win = getWindow()
    const size = makeProp({
      width: win?.innerWidth ?? 0,
      height: win?.innerHeight ?? 0,
    })
    const clear = renderableOfTNode(fn(size))(ctx)
    const onResize = () => {
      size.set({
        width: win?.innerWidth ?? 0,
        height: win?.innerHeight ?? 0,
      })
    }
    win?.addEventListener('resize', onResize)
    return (removeTree: boolean) => {
      win?.removeEventListener('resize', onResize)
      clear(removeTree)
    }
  }
