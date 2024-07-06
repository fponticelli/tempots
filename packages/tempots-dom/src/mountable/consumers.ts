import type { Child, Mountable, ProviderMark } from '../types/domain'
import { DOMContext } from '../dom/dom-context'
import { childToMountable } from './element'

export type ToArrayOfMarks<T extends unknown[]> = T extends []
  ? []
  : T extends [infer K]
    ? [ProviderMark<K>]
    : T extends [infer K, ...infer R]
      ? [ProviderMark<K>, ...ToArrayOfMarks<R>]
      : never
export type ToProviders<T extends unknown[]> = T extends []
  ? object
  : T extends [infer K]
    ? { [_ in ProviderMark<K>]: K }
    : T extends [infer K, ...infer R]
      ? { [_ in ProviderMark<K>]: K } & ToProviders<R>
      : never

export type Consumer<T> = (fn: (value: T) => Child) => Mountable

const consumersMountable =
  <T extends unknown[]>(
    marks: ToArrayOfMarks<T>,
    fn: (providers: ToProviders<T>) => Child
  ): Mountable =>
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
    return childToMountable(fn(providers))(ctx)
  }

export const Use = <C extends Record<string, Consumer<unknown>>>(
  consumers: C,
  fn: (data: {
    [K in keyof C]: C[K] extends Consumer<infer V> ? V : never
  }) => Mountable
): Mountable => {
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

export const UseProvider = <T>(
  mark: ProviderMark<T>,
  fn: (value: T) => Child
) => consumersMountable<[T]>([mark], o => childToMountable(fn(o[mark]!)))

export const UseProviders = <T extends unknown[]>(
  marks: ToArrayOfMarks<T>,
  fn: (providers: ToProviders<T>) => Child
) => consumersMountable<T>(marks, providers => childToMountable(fn(providers)))
