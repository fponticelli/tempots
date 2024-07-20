import { DOMContext, type Renderable } from '@tempots/dom'

/**
 * Creates a renderable function that focuses on the element after a specified delay.
 *
 * @param delay - The delay in milliseconds before focusing on the element. Default is 10 milliseconds.
 * @returns A renderable function that focuses on the element.
 * @public
 */
export const AutoFocus =
  (delay: number = 10): Renderable =>
  (ctx: DOMContext) => {
    const timeout = setTimeout(() => {
      ;(ctx.element as HTMLElement)?.focus()
    }, delay)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return (_removeTree: boolean) => clearTimeout(timeout)
  }
