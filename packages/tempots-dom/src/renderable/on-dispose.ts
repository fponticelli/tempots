import type { DOMContext } from '../dom/dom-context'
import type {
  DisposeCallback as BaseDisposeCallback,
  WithDispose as BaseWithDispose,
} from '@tempots/render'

export { OnDispose } from './shared'

/**
 * Callback invoked on dispose, specialized for DOMContext.
 * @public
 */
export type DisposeCallback = BaseDisposeCallback<DOMContext>

/**
 * Object with a dispose method, specialized for DOMContext.
 * @public
 */
export type WithDispose = BaseWithDispose<DOMContext>
