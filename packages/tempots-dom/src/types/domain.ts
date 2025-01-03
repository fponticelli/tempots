import { DOMContext } from '../dom/dom-context'
import { Value } from '../std/value'

/**
 * Represents a function that can be rendered in the DOM.
 * @param ctx - The DOM context for rendering.
 * @returns A function that clears the rendered content.
 * @public
 */
export type Renderable<CTX extends DOMContext = DOMContext> = (
  ctx: CTX
) => Clear

/**
 * Represents a node in the rendering tree.
 * It can be a renderable element, a string value, undefined, null, or an array of renderable elements.
 * @public
 */
export type TNode = Renderable | Value<string> | undefined | null | Renderable[]
/**
 * Represents a function that clears a resource.
 * @param removeTree - A boolean value indicating whether to remove the tree associated with the resource.
 * @public
 */
export type Clear = (removeTree: boolean) => void

/**
 * Represents a provider mark.
 * @typeParam T - The type of the mark.
 * @public
 */
export type ProviderMark<T> = symbol & { readonly __type: T }
/**
 * Represents a collection of providers.
 * The keys of the record are ProviderMark types, and the values are of unknown type.
 * @public
 */
export type Providers = Record<ProviderMark<unknown>, unknown>

/**
 * Represents the size of an object with width and height.
 * @public
 */
export type Size = {
  /**
   * The width of the object.
   */
  readonly width: number
  /**
   * The height of the object.
   */
  readonly height: number
}

/**
 * Represents a nullable value or a signal of a nullable value.
 * @typeParam T - The type of the value.
 * @public
 */
export type NValue<T> =
  | Value<T>
  | Value<T | null>
  | Value<T | undefined>
  | Value<T | null | undefined>
  | null
  | undefined

/**
 * Gets the value type of a given Value type.
 * If the type is a `Signal`, it returns the inferred value type.
 * Otherwise, it returns the type itself.
 * @public
 */
export type GetValueType<T> = T extends Value<infer V> ? V : T

/**
 * Gets the value types of a given array of Value types.
 * @public
 */
export type GetValueTypes<T extends Value<unknown>[]> = {
  [K in keyof T]: GetValueType<T[K]>
}

/**
 * Removes signals from a given object type and returns a new object type
 * with only the non-signal properties.
 *
 * @typeParam T - The input object type.
 * @typeParam K - The keys of the input object type to keep (optional).
 * @public
 */
export type RemoveSignals<
  T extends Record<string | number | symbol, Value<unknown>>,
  K extends (string | number | symbol) & keyof T = keyof T,
> = {
  [k in K]: GetValueType<T[k]>
}
