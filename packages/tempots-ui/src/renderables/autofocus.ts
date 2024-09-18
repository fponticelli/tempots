import { OnElement, type Renderable } from '@tempots/dom'

/**
 * Creates a renderable function that focuses on the element after a specified delay.
 *
 * @param delay - The delay in milliseconds before focusing on the element. Default is 10 milliseconds.
 * @returns A renderable function that focuses on the element.
 * @public
 */
export const AutoFocus = (delay: number = 10): Renderable =>
  OnElement(el => {
    const timeout = setTimeout(() => {
      el?.focus()
    }, delay)
    return () => clearTimeout(timeout)
  })
