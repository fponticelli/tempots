import { Value, attr, Portal } from '@tempots/dom'

/**
 * Creates an HTML title element with the specified title.
 *
 * @param title - The title to be set for the HTML title element.
 * @returns The created HTML title element.
 * @public
 */
export const HTMLTitle = (title: Value<string>) =>
  Portal('head title', attr.innerText(title))
