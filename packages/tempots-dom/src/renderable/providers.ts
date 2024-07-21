import type { TNode, Renderable, ProviderMark } from '../types/domain'
import { DOMContext } from '../dom/dom-context'
import { renderableOfTNode } from './element'

/**
 * Represents a provider function that takes a `TNode` and returns a `Renderable`.
 * @param node - The node to be rendered.
 * @returns The rendered output.
 * @public
 */
export type Provider = (node: TNode) => Renderable

/**
 * Creates a unique symbol that can be used as a provider mark for a specific type `T`.
 * The provider mark is used to identify the provider of a value of type `T` in a dependency injection system.
 *
 * @param identifier - A string that uniquely identifies the provider.
 * @returns A unique symbol that can be used as a provider mark.
 * @public
 */
export const makeProviderMark = <T>(identifier: string): ProviderMark<T> =>
  Symbol(identifier) as ProviderMark<T>

const providersRenderable =
  (
    providers: { [K in ProviderMark<unknown>]: unknown },
    node: TNode
  ): Renderable =>
  (ctx: DOMContext) => {
    return renderableOfTNode(node)(ctx.withProviders(providers))
  }

/**
 * Higher-order function that composes multiple provider functions into a single provider function.
 *
 * @param providerFns - The provider functions to be composed.
 * @returns A new provider function that applies the composed providers in reverse order.
 * @public
 */
export const Provide = <T extends Provider[]>(...providerFns: T): Provider =>
  providerFns.length > 0
    ? providerFns.reduceRight((acc, fn) => c => acc(fn(c)))
    : renderableOfTNode

/**
 * Creates a renderable with a provider mark and value.
 *
 * The value will be available to any consumers that request the provider mark.
 *
 * @typeParam T - The type of the provider value.
 * @param mark - The provider mark.
 * @param value - The provider value.
 * @param child - The child TNode.
 * @returns - The renderable with the provider.
 * @public
 */
export const WithProvider = <T>(
  mark: ProviderMark<T>,
  value: T,
  child: TNode
): Renderable =>
  providersRenderable({ [mark]: value }, renderableOfTNode(child))

/**
 * Renders the given child with the specified providers.
 *
 * @typeParam T - The types of the provider values.
 * @param providers - An object containing the providers.
 * @param child - The child to render.
 * @returns The rendered result.
 * @public
 */
export const WithProviders = <T extends unknown[]>(
  providers: { [K in ProviderMark<T[number]>]: T[number] },
  child: TNode
): Renderable => providersRenderable(providers, renderableOfTNode(child))
