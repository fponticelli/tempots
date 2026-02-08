import type { DOMContext } from '../dom/dom-context'
import type {
  Provider as BaseProvider,
  ProviderOptions as BaseProviderOptions,
} from '@tempots/render'

export { WithProvider, Provide, Use, UseMany } from './shared'

/**
 * Represents a provider for a specific type `T`, specialized for DOMContext.
 * @public
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Provider<T, O = any> = BaseProvider<T, O, DOMContext>

/**
 * Represents an object with provider options, specialized for DOMContext.
 * @public
 */
export type ProviderOptions = BaseProviderOptions<DOMContext>

export type { ToProviderTypes } from '@tempots/render'
