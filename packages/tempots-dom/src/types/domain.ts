import { DOMContext } from '../dom/dom-context'
import {
  AnySignal,
  Computed,
  Prop,
  Signal,
  Value,
  ValueType,
  BaseValueType,
  ValueTypes,
  Values,
  RemoveSignals,
  Nil,
  Clear,
  ProviderMark,
  makeProviderMark,
  Renderable as CoreRenderable,
  createRenderable,
} from '@tempots/core'

// Re-export core types that are used in DOM-specific types
export type {
  Clear,
  ProviderMark,
  ValueType,
  BaseValueType,
  ValueTypes,
  Values,
  RemoveSignals,
  Nil,
  AnySignal,
}
export { makeProviderMark, Computed, Value, Signal, Prop }

/**
 * Symbol to brand DOM renderables and prevent mixing with other contexts
 * @public
 */
export const DOM_RENDERABLE_TYPE = Symbol('DOM_RENDERABLE')

/**
 * A renderable object that can render content into the DOM.
 *
 * Renderables are the fundamental building blocks of Tempo applications. They are
 * objects with a `render()` method that receives a DOMContext and returns a cleanup
 * function, and a `type` symbol for runtime type checking.
 *
 * This is a specialized version of the core Renderable type for DOM contexts.
 *
 * @example
 * ```typescript
 * // Simple renderable that creates a div
 * const MyComponent: Renderable = {
 *   type: DOM_RENDERABLE_TYPE,
 *   render: (ctx) => {
 *     const divCtx = ctx.makeChildElement('div', undefined)
 *     divCtx.makeChildText('Hello, World!')
 *
 *     // Return cleanup function
 *     return (removeTree) => {
 *       if (removeTree) {
 *         // Cleanup logic here
 *       }
 *     }
 *   }
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Renderable with event listeners
 * const Button: Renderable = {
 *   type: DOM_RENDERABLE_TYPE,
 *   render: (ctx) => {
 *     const buttonCtx = ctx.makeChildElement('button', undefined)
 *     buttonCtx.makeChildText('Click me')
 *
 *     const clearClick = buttonCtx.on('click', () => {
 *       console.log('Button clicked!')
 *     })
 *
 *     return (removeTree) => {
 *       clearClick(removeTree)
 *     }
 *   }
 * }
 * ```
 *
 * @typeParam CTX - The type of DOMContext (defaults to DOMContext)
 * @public
 */
export type Renderable<CTX extends DOMContext = DOMContext> = CoreRenderable<
  CTX,
  typeof DOM_RENDERABLE_TYPE
>

/**
 * Helper to create DOM renderables (internal use)
 * @internal
 */
export const domRenderable = <CTX extends DOMContext = DOMContext>(
  renderFn: (ctx: CTX) => Clear
): Renderable<CTX> =>
  createRenderable(DOM_RENDERABLE_TYPE, renderFn) as Renderable<CTX>

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
 * @typeParam CTX - The type of DOMContext (defaults to DOMContext)
 * @public
 */
export type TNode<CTX extends DOMContext = DOMContext> =
  | Renderable<CTX>
  | string
  | number
  | boolean
  | Signal<string>
  | Signal<number>
  | Signal<boolean>
  | undefined
  | null
  | Renderable<CTX>[]
// Clear and ProviderMark are re-exported from @tempots/core
// Providers is re-exported from @tempots/render
export type { Providers } from '@tempots/render'

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
  | Value<NonNullable<T>>
  | Signal<T>
  | Signal<T | null>
  | Signal<T | undefined>
  | Signal<T | null | undefined>
  | null
  | undefined

type TupleToUnion<T extends unknown[]> = T[number]

export type SplitNValue<T> =
  | (T extends unknown ? TupleToUnion<NValue<T>[]> : never)
  | NValue<T>

export type SplitValue<T> =
  | (T extends unknown ? TupleToUnion<Value<T>[]> : never)
  | Value<T>

// ValueType, BaseValueType, ValueTypes, Values, RemoveSignals, and Nil are re-exported from @tempots/core
