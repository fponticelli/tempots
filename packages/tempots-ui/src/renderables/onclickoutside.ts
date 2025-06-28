import { OnDispose, WithElement } from '@tempots/dom'

/**
 * Executes a callback function when a click event occurs outside of the parent element.
 *
 * @param handler - The callback function to be executed when a click event occurs outside of the parent element.
 * @returns A renderable function that takes a DOMContext and returns a function that takes a boolean indicating whether to remove the tree.
 * @public
 */
export function OnClickOutside(handler: (event: MouseEvent) => void) {
  return WithElement((el: HTMLElement) => {
    const onClick = (event: MouseEvent) => {
      if (!el.contains(event.target as Node)) {
        handler(event)
      }
    }
    document.addEventListener('click', onClick)
    return OnDispose(() => {
      document.removeEventListener('click', onClick)
    })
  })
}
