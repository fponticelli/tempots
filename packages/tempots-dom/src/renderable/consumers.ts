import type { TNode, Renderable, ProviderMark } from '../types/domain'
import { DOMContext } from '../dom/dom-context'
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
  ? object
  : T extends [infer K]
    ? { [_ in ProviderMark<K>]: K }
    : T extends [infer K, ...infer R]
      ? { [_ in ProviderMark<K>]: K } & ToProviders<R>
      : never

/**
 * Represents a consumer function that takes a callback function and returns a renderable object.
 * The callback function takes a value of type T and returns a TNode.
 *
 * @typeParam T - The type of the value passed to the callback function.
 * @public
 */
export type Consumer<T> = (fn: (value: T) => TNode) => Renderable

const consumersRenderable =
  <T extends unknown[]>(
    marks: ToArrayOfMarks<T>,
    fn: (providers: ToProviders<T>) => TNode
  ): Renderable =>
  (ctx: DOMContext) => {
    const providers = Object.values(marks).reduce((providers, mark) => {
      const provider = ctx.getProvider(mark)
      if (provider == null) {
        throw new Error(`No provider found for mark: ${mark.description}`)
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(providers as any)[mark] = provider
      return providers
    }, {} as ToProviders<T>)
    return renderableOfTNode(fn(providers))(ctx)
  }

/**
 * Represents a type that extracts the value types from a record of `Consumer` types.
 * @typeParam C - The record of `Consumer` types.
 * @public
 */
export type UseMany<C extends Record<string, Consumer<unknown>>> = {
  [K in keyof C]: C[K] extends Consumer<infer V> ? V : never
}

/**
 * Creates a renderable function that consumes data from multiple consumers and renders the result.
 *
 * @param consumers - An object containing consumer functions.
 * @param fn - A function that receives the data from the consumers and returns a renderable function.
 * @returns A renderable function that can be called with a DOMContext and returns a cleanup function.
 * @public
 */
export const Use = <C extends Record<string, Consumer<unknown>>>(
  consumers: C,
  fn: (data: UseMany<C>) => Renderable
): Renderable => {
  return (ctx: DOMContext) => {
    const clears = [] as ((removeTree: boolean) => void)[]
    const data = Object.entries(consumers).reduce(
      (acc, [key, f]) => {
        clears.push(
          f(value => {
            Reflect.set(acc, key, value)
            return null
          })(ctx)
        )
        return acc
      },
      {} as {
        [K in keyof C]: C[K] extends Consumer<infer V> ? V : never
      }
    )
    clears.push(fn(data)(ctx))
    return (removeTree: boolean) => {
      clears.forEach(f => f(removeTree))
    }
  }
}

/**
 * Creates a renderable function that consumes a provider value and renders a `TNode`.
 *
 * @typeParam T - The type of the provider value.
 * @param mark - The provider mark.
 * @param fn - The function that takes the provider value and returns a `TNode`.
 * @returns A renderable function that consumes the provider value and renders a `TNode`.
 * @public
 */
export const UseProvider = <T>(
  mark: ProviderMark<T>,
  fn: (value: T) => TNode
) => consumersRenderable<[T]>([mark], o => renderableOfTNode(fn(o[mark]!)))

/**
 * Creates a renderable function that consumes providers and renders a TNode.
 *
 * @param marks - The marks to be converted to an array of marks.
 * @param fn - The function that takes providers and returns a TNode.
 * @returns A renderable function that consumes providers and renders a TNode.
 * @public
 */
export const UseProviders = <T extends unknown[]>(
  marks: ToArrayOfMarks<T>,
  fn: (providers: ToProviders<T>) => TNode
) =>
  consumersRenderable<T>(marks, providers => renderableOfTNode(fn(providers)))
