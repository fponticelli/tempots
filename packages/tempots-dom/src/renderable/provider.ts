import { DOMContext } from '../dom/dom-context'
import { Clear, ProviderMark, Renderable, TNode } from '../types/domain'
import { renderableOfTNode } from './element'
import { Fragment } from './fragment'
import { OnDispose } from './on-dispose'

/**
 * Converts a tuple type `T` into an array of `Provider` types.
 * If `T` is an empty tuple, returns an empty array.
 * If `T` has only one element, returns an array with a single `Provider`.
 * If `T` has more than one element, recursively converts each element into a `Provider` and returns an array.
 * @public
 */
export type ToArrayOfProviders<T extends unknown[]> = T extends []
  ? []
  : T extends [infer K]
    ? [Provider<K>]
    : T extends [infer K, ...infer R]
      ? [Provider<K>, ...ToArrayOfProviders<R>]
      : never

/**
 * Converts an array of `Provider` types `T` into an array of their corresponding types.
 * @public
 */
export type ToProviderTypes<T extends unknown[]> = T extends []
  ? []
  : T extends [Provider<infer K>]
    ? [K]
    : T extends [Provider<infer K>, ...infer R]
      ? [K, ...ToProviderTypes<R>]
      : never

/**
 * Represents a provider for a specific type `T`.
 * @public
 */
export type Provider<T, O extends object = object> = {
  /** The provider mark. */
  mark: ProviderMark<T>
  /** The function to create the provider. */
  create: (
    options: O | undefined,
    ctx: DOMContext
  ) => { value: T; dispose: () => void; onUse?: () => void }
}

/**
 * Represents an object with provider options.
 * @public
 */
export type ProviderOptions = {
  /** The function to use a provider. */
  use: <T, O extends object = object>(provider: Provider<T, O>) => T
  /** The function to set a provider. */
  set: <T, O extends object = object>(
    provider: Provider<T, O>,
    options?: O
  ) => void
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
    const disposers: (() => void)[] = []
    const result = fn({
      use: ({ mark }) => {
        const [value, onUse] = newCtx.getProvider(mark)
        onUse?.()
        return value
      },
      set: ({ mark, create }, options) => {
        const { value, dispose, onUse } = create(options, newCtx)
        disposers.push(dispose)
        newCtx = newCtx.setProvider(mark, value, onUse)
      },
    })
    if (result == null) {
      return () => {}
    }
    return Fragment(
      renderableOfTNode(result),
      OnDispose(() => disposers.forEach(fn => fn()))
    )(newCtx)
  }

/**
 * Returns a renderable function that sets a provider for the given provider mark and returns a child renderable.
 *
 * @param provider - The provider to set.
 * @param options - The options to pass to the provider.
 * @param child - The child renderable to return.
 */
export const Provide = <T, O extends object>(
  provider: Provider<T, O>,
  options: O,
  child: (value: T) => TNode
): Renderable =>
  WithProvider(({ set, use }) => {
    set(provider, options)
    const value = use(provider)
    return child(value)
  })

/**
 * Returns a renderable function that uses a provider for the given provider mark and returns a child renderable.
 *
 * @param provider - The provider mark to use the provider for.
 * @param child - The child renderable to return.
 */
export const Use = <T>(
  provider: Provider<T>,
  child: (provider: T) => TNode
): Renderable =>
  WithProvider(({ use }) => {
    return child(use(provider))
  })

/**
 * Returns a renderable function that uses a provider for the given provider marks and returns a child renderable.
 *
 * @param providers - The provider marks to use the providers for.
 * @param child - The child renderable to return.
 */
export const UseMany =
  <T extends unknown[]>(...providers: ToArrayOfProviders<T>) =>
  (child: (...values: ToProviderTypes<T>) => TNode): Renderable =>
    WithProvider(({ use }) => {
      const args = providers.map(use) as ToProviderTypes<T>
      return child(...args)
    })
