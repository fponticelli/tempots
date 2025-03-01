import { DOMContext } from '../dom/dom-context'
import { Clear, ProviderMark, Renderable, TNode } from '../types/domain'
import { renderableOfTNode } from './element'

/**
 * Converts a tuple type `T` into an array of `ProviderMark` types.
 * If `T` is an empty tuple, returns an empty array.
 * If `T` has only one element, returns an array with a single `ProviderMark`.
 * If `T` has more than one element, recursively converts each element into a `ProviderMark` and returns an array.
 * @public
 */
export type ToArrayOfMarks<T extends unknown[]> = T extends []
  ? []
  : T extends [infer K]
    ? [ProviderMark<K>]
    : T extends [infer K, ...infer R]
      ? [ProviderMark<K>, ...ToArrayOfMarks<R>]
      : never

/**
 * Represents a type that transforms a tuple of values into an object where each value is associated with a provider mark.
 * @typeParam T - The tuple of values.
 * @returns An object where each value is associated with a provider mark.
 * @public
 */
export type ToProviders<T extends unknown[]> = T extends []
  ? []
  : T extends [ProviderMark<infer K>]
    ? [K]
    : T extends [ProviderMark<infer K>, ...infer R]
      ? [K, ...ToProviders<R>]
      : never

export type ProviderOptions = {
  use: <T>(mark: ProviderMark<T>) => T
  set: <T>(mark: ProviderMark<T>, value: T) => void
}

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
 */
export const WithProvider =
  (fn: (ctx: ProviderOptions) => TNode | void): Renderable =>
  (ctx: DOMContext): Clear => {
    let newCtx = ctx
    const result = fn({
      use: ctx.getProvider,
      set: (mark, value) => (newCtx = newCtx.setProvider(mark, value)),
    })
    if (result == null) {
      return () => {}
    }
    return renderableOfTNode(result)(newCtx)
  }

/**
 * Returns a renderable function that sets a provider for the given provider mark and returns a child renderable.
 *
 * @param mark - The provider mark to set the provider for.
 * @param value - The provider to set for the given mark.
 * @param child - The child renderable to return.
 */
export const SetProvider = <T>(
  mark: ProviderMark<T>,
  value: T,
  child: (provider: T) => TNode
): Renderable =>
  WithProvider(({ set }) => {
    set(mark, value)
    return child(value)
  })

/**
 * Returns a renderable function that uses a provider for the given provider mark and returns a child renderable.
 *
 * @param mark - The provider mark to use the provider for.
 * @param child - The child renderable to return.
 */
export const UseProvider = <T>(
  mark: ProviderMark<T>,
  child: (provider: T) => TNode
): Renderable =>
  WithProvider(({ use }) => {
    return child(use(mark))
  })

/**
 * Returns a renderable function that uses a provider for the given provider marks and returns a child renderable.
 *
 * @param marks - The provider marks to use the providers for.
 * @param child - The child renderable to return.
 */
export const UseProviders =
  <T extends unknown[]>(...marks: ToArrayOfMarks<T>) =>
  (child: (...providers: ToProviders<T>) => TNode): Renderable =>
    WithProvider(({ use }) => {
      const providers = marks.map(mark => use(mark))
      return child(...(providers as ToProviders<T>))
    })
