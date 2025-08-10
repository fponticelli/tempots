import { DOMContext } from '../dom/dom-context'
import { Value } from '../std/value'

/**
 * A function that renders content into the DOM and returns a cleanup function.
 *
 * Renderables are the fundamental building blocks of Tempo applications. They receive
 * a DOMContext and use it to create DOM elements, text nodes, or other content.
 * The returned Clear function is called when the renderable needs to be removed
 * from the DOM.
 *
 * @example
 * ```typescript
 * // Simple renderable that creates a div
 * const MyComponent: Renderable = (ctx) => {
 *   const divCtx = ctx.makeChildElement('div', undefined)
 *   divCtx.makeChildText('Hello, World!')
 *
 *   // Return cleanup function
 *   return (removeTree) => {
 *     if (removeTree) {
 *       // Cleanup logic here
 *     }
 *   }
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Renderable with event listeners
 * const Button: Renderable = (ctx) => {
 *   const buttonCtx = ctx.makeChildElement('button', undefined)
 *   buttonCtx.makeChildText('Click me')
 *
 *   const clearClick = buttonCtx.on('click', () => {
 *     console.log('Button clicked!')
 *   })
 *
 *   return (removeTree) => {
 *     clearClick(removeTree)
 *   }
 * }
 * ```
 *
 * @template CTX - The type of DOMContext (defaults to DOMContext)
 * @param ctx - The DOM context for rendering
 * @returns A cleanup function that removes the rendered content when called
 * @public
 */
export type Renderable<CTX extends DOMContext = DOMContext> = (
  ctx: CTX
) => Clear

/**
 * A flexible type representing any content that can be rendered in Tempo.
 *
 * TNode (Template Node) is the union type that encompasses all possible content
 * that can be rendered in a Tempo application. This includes components, text,
 * signals, arrays of content, and null/undefined values for conditional rendering.
 *
 * @example
 * ```typescript
 * // All of these are valid TNode values:
 *
 * // Renderable component
 * const component: TNode = MyComponent()
 *
 * // Static text
 * const text: TNode = 'Hello, World!'
 *
 * // Signal text
 * const dynamicText: TNode = userNameSignal
 *
 * // Array of content
 * const list: TNode = [
 *   html.div('Item 1'),
 *   html.div('Item 2'),
 *   html.div('Item 3')
 * ]
 *
 * // Conditional content
 * const conditional: TNode = isVisible.value ? html.div('Visible') : null
 * ```
 *
 * @example
 * ```typescript
 * // Function that accepts any renderable content
 * function Container(children: TNode): Renderable {
 *   return html.div(
 *     attr.class('container'),
 *     children // Can be any TNode type
 *   )
 * }
 *
 * // Usage with different TNode types
 * Container('Simple text')
 * Container(MyComponent())
 * Container([html.p('Paragraph 1'), html.p('Paragraph 2')])
 * Container(isLoading.value ? 'Loading...' : null)
 * ```
 *
 * @example
 * ```typescript
 * // Building complex content with TNode
 * const buildContent = (items: string[]): TNode => {
 *   if (items.length === 0) {
 *     return html.div('No items found')
 *   }
 *
 *   return items.map(item => html.div(item))
 * }
 * ```
 *
 * @template CTX - The type of DOMContext (defaults to DOMContext)
 * @public
 */
export type TNode<CTX extends DOMContext = DOMContext> =
  | Renderable<CTX>
  | Value<string>
  | undefined
  | null
  | Renderable<CTX>[]
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
export type Providers = Record<
  ProviderMark<unknown>,
  [unknown, undefined | (() => void)]
>

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

type WithNullish<X> =
  | Value<X>
  | Value<X | null>
  | Value<X | undefined>
  | Value<X | null | undefined>

/**
 * Represents a nullable value or a signal of a nullable value.
 * @typeParam T - The type of the value.
 * @public
 */
export type NValue<T> = WithNullish<T> | null | undefined

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
