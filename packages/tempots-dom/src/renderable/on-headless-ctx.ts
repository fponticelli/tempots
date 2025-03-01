import { WithHeadlessCtx } from './with-headless-ctx'

/**
 * Returns a renderable function that executes the given function with the current DOMContext as argument.
 *
 * @param fn - The function to be executed with the DOMContext argument.
 * @returns A Clear function that can be used to clean up any resources associated with the execution.
 * @public
 * @deprecated Use `WithHeadlessCtx` instead.
 */
export const OnHeadlessCtx = WithHeadlessCtx
