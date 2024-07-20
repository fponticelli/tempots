import { on } from '@tempots/dom'

/**
 * Selects the text inside an input element when it receives focus.
 *
 * @returns A renderable function that selects the text inside an input element when it receives focus.
 * @public
 */
export const SelectOnFocus = () =>
  on.focus(e => (e.target as HTMLInputElement)?.select())
