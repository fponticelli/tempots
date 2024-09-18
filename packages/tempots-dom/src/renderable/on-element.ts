import type { Clear, Renderable } from '../types/domain'
import { OnBrowserCtx } from './on-browser-ctx'

/**
 * Executes a callback function when the parent element is mounted in the DOM.
 *
 * @typeParam T - The type of the element.
 * @param fn - The callback function to be executed.
 * @returns - The renderable function.
 * @public
 */
export const OnElement = <T extends HTMLElement>(
  fn: (element: T) => Clear | undefined | void
): Renderable => OnBrowserCtx(ctx => fn(ctx.element as T) ?? (() => {}))
