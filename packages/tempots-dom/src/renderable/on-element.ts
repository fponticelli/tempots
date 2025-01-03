import type { Renderable, TNode } from '../types/domain'
import { OnBrowserCtx } from './on-browser-ctx'

/**
 * Executes a callback function when the parent element is mounted in the DOM.
 * The given function can return a TNode or void. Any returned TNode will be
 * appended to the element argument.
 * If you need to perform some actions when the Renderable is disposed, you
 * can use `OnDispose` as the return value.
 *
 * @typeParam T - The type of the element.
 * @param fn - The callback function to be executed.
 * @returns - The renderable function.
 * @public
 */
export const OnElement = <T extends HTMLElement>(
  fn: (element: T) => TNode | void
): Renderable => OnBrowserCtx(ctx => fn(ctx.element as T))
