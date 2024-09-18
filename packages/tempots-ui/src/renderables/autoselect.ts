import { OnElement, type Renderable } from '@tempots/dom'

/**
 * Creates a renderable function that automatically selects the content of an input element after a specified delay.
 * @param delay - The delay in milliseconds before selecting the content. Default is 10 milliseconds.
 * @returns A renderable function that can be used with a DOMContext.
 * @public
 */
export const AutoSelect = (delay: number = 10): Renderable =>
  OnElement(el => {
    const timeout = setTimeout(() => {
      ;(el as HTMLInputElement)?.select()
    }, delay)
    return () => clearTimeout(timeout)
  })
