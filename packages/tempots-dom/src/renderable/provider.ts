import { DOMContext } from '../dom/dom-context'
import { Clear, ProviderMark, Renderable, TNode } from '../types/domain'
import { renderableOfTNode } from './element'
import { Fragment } from './fragment'
import { OnDispose } from './on-dispose'

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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Provider<T, O = any> = {
  /** The provider mark. */
  mark: ProviderMark<T>
  /** The function to create the provider. */
  create: (
    options: O | undefined,
    ctx: DOMContext
  ) => {
    value: T
    dispose: () => void
    onUse?: () => void
  }
}

/**
 * Represents an object with provider options.
 * @public
 */
export type ProviderOptions = {
  /** The function to use a provider. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  use: <T, O = any>(provider: Provider<T, O>) => T
  /** The function to set a provider. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  set: <T, O = any>(provider: Provider<T, O>, options?: O) => void
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
  (fn: (opts: ProviderOptions) => TNode | void): Renderable =>
  (ctx: DOMContext): Clear => {
    let newCtx = ctx
    function getCtx() {
      return newCtx
    }
    function setCtx(ctx: DOMContext) {
      newCtx = ctx
    }
    const disposers: (() => void)[] = []
    const result = fn({
      use: ({ mark }) => {
        const { value, onUse } = getCtx().getProvider(mark)
        onUse?.()
        return value
      },
      set: ({ mark, create }, options) => {
        const { value, dispose, onUse } = create(options, getCtx())
        disposers.push(dispose)
        setCtx(getCtx().setProvider(mark, value, onUse))
      },
    })
    if (result == null) {
      return () => {}
    }
    return Fragment(
      renderableOfTNode(result),
      OnDispose(() => disposers.forEach(fn => fn()))
    )(getCtx())
  }

/**
 * Returns a renderable function that sets a provider for the given provider mark and returns a child renderable.
 *
 * @param provider - The provider to set.
 * @param options - The options to pass to the provider.
 * @param child - The child renderable to return.
 */
export const Provide = <T, O>(
  provider: Provider<T, O>,
  options: O,
  child: () => TNode
): Renderable =>
  WithProvider(({ set }) => {
    set(provider, options)
    return child()
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
): Renderable => WithProvider(({ use }) => child(use(provider)))

/**
 * Returns a renderable function that uses a provider for the given provider marks and returns a child renderable.
 *
 * @param providers - The provider marks to use the providers for.
 * @param child - The child renderable to return.
 */
export const UseMany =
  <T extends Provider<unknown>[]>(...providers: T) =>
  (child: (...values: ToProviderTypes<T>) => TNode): Renderable =>
    WithProvider(({ use }) => {
      const args = providers.map(use) as ToProviderTypes<T>
      return child(...args)
    })
