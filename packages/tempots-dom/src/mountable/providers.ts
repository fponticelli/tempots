import type { Child, Mountable, ProviderMark } from '../types/domain'
import { DOMContext } from '../dom/dom-context'
import { childToMountable } from './element'

export type Provider = (node: Child) => Mountable

/**
 * Creates a unique symbol that can be used as a provider mark for a specific type `T`.
 * The provider mark is used to identify the provider of a value of type `T` in a dependency injection system.
 *
 * @param identifier - A string that uniquely identifies the provider.
 * @returns A unique symbol that can be used as a provider mark.
 */
export function makeProviderMark<T>(identifier: string): ProviderMark<T> {
  return Symbol(identifier) as ProviderMark<T>
}

const providersMountable =
  (providers: { [K in ProviderMark<unknown>]: unknown }, node: Child) =>
  (ctx: DOMContext) => {
    return childToMountable(node)(ctx.withProviders(providers))
  }

export const Provide = <T extends Provider[]>(...providerFns: T) => {
  return providerFns.length > 0
    ? providerFns.reduceRight((acc, fn) => c => acc(fn(c)))
    : childToMountable
}

export const WithProvider = <T>(
  mark: ProviderMark<T>,
  value: T,
  child: Child
) => providersMountable({ [mark]: value }, childToMountable(child))

export const WithProviders = <T extends unknown[]>(
  providers: { [K in ProviderMark<T[number]>]: T[number] },
  child: Child
) => providersMountable(providers, childToMountable(child))
