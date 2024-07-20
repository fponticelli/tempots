import { DOMContext, type Renderable } from '@tempots/dom'

/**
 * Creates a renderable function that automatically selects the content of an input element after a specified delay.
 * @param delay - The delay in milliseconds before selecting the content. Default is 10 milliseconds.
 * @returns A renderable function that can be used with a DOMContext.
 * @public
 */
export const AutoSelect =
  (delay: number = 10): Renderable =>
  (ctx: DOMContext) => {
    const timeout = setTimeout(() => {
      ;(ctx.element as HTMLInputElement)?.select()
    }, delay)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return (_removeTree: boolean) => {
      clearTimeout(timeout)
    }
  }
