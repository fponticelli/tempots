import { WithBrowserCtx } from './with-browser-ctx'

/**
 * Returns a renderable function that executes the given function with the
 * current DOMContext as argument.
 * The given function can return a TNode or void. If you need to perform some
 * actions when the Renderable is disposed, you can use `OnDispose` as the
 * return value.
 *
 * @param fn - The function to be executed with the DOMContext argument.
 * @returns A Clear function that can be used to clean up any resources associated with the execution.
 * @public
 * @deprecated Use `WithBrowserCtx` instead.
 */
export const OnBrowserCtx = WithBrowserCtx
