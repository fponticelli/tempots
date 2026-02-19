import type { Signal, Prop, Computed } from './signal'

/**
 * Represents a value that can be either static or reactive (a Signal).
 *
 * This type is used throughout Tempo to allow properties to be either
 * static values or reactive signals that update over time.
 *
 * @typeParam T - The type of the value
 *
 * @example
 * ```typescript
 * // Static value
 * const staticWidth: Value<number> = 100
 *
 * // Reactive value
 * const reactiveWidth: Value<number> = prop(100)
 *
 * // Function accepting either
 * function setWidth(width: Value<number>) {
 *   // Handle both static and reactive values
 * }
 * ```
 *
 * @public
 */
export type Value<T> = T | Signal<T>

/**
 * Gets the value type of a given Value type.
 * If the type is a `Signal`, it returns the inferred value type.
 * Otherwise, it returns the type itself.
 * @public
 */
export type ValueType<T> =
  T extends Computed<infer V>
    ? V
    : T extends Prop<infer V>
      ? V
      : T extends Signal<infer V>
        ? V
        : T

/**
 * Gets the base value type of a given Value type.
 * @public
 */
export type BaseValueType<T> = NonNullable<ValueType<T>>

/**
 * Gets the value types of a given array of Value types.
 * @public
 */
export type ValueTypes<T extends Value<unknown>[]> = {
  [K in keyof T]: ValueType<T[K]>
}

/**
 * Wraps all non-`Value` types in the array in `Value`.
 * @public
 */
export type Values<T extends unknown[]> = {
  [K in keyof T]: T[K] extends
    | Signal<unknown>
    | Computed<unknown>
    | Prop<unknown>
    ? T[K]
    : Value<T[K]>
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
  [k in K]: ValueType<T[k]>
}

/**
 * Represents a value that can be null or undefined.
 * @public
 */
export type Nil = null | undefined

/**
 * A function that clears a resource.
 *
 * Clear functions are returned by renderables and are called when the rendered
 * content needs to be removed. The `removeTree` parameter indicates whether
 * the entire tree should be removed (true) or just the event listeners and
 * reactive subscriptions (false).
 *
 * @param removeTree - Whether to remove the entire rendered tree
 * @public
 */
export type Clear = (removeTree: boolean) => void

/**
 * Base interface for all rendering contexts.
 *
 * A RenderContext provides the minimal interface needed for rendering content.
 * Context-specific implementations (DOM, ThreeJS, Konva, etc.) extend this
 * interface with their own methods.
 *
 * @public
 */
export interface RenderContext {
  /**
   * Clears the context and optionally removes the rendered tree.
   *
   * @param removeTree - Whether to remove the entire rendered tree
   */
  clear(removeTree: boolean): void
}

/**
 * Extended interface for contexts that support hierarchical rendering with ordered children.
 *
 * Most rendering contexts (DOM, ThreeJS, Konva, PixiJS) have ordered children
 * where position matters for rendering order, z-index, or scene graph traversal.
 * This interface provides methods for creating reference markers that preserve
 * exact insertion points when conditionally rendering or swapping children.
 *
 * Reference markers are invisible placeholders that mark positions in the
 * children list. Implementation varies by context:
 * - DOM: Comment nodes (`<!-- ref -->`)
 * - ThreeJS: Empty `Object3D` with `visible=false`
 * - Konva: Invisible `Group` with `listening=false`
 * - PixiJS: Empty `Container` with `renderable=false`
 *
 * @public
 */
export interface HierarchicalContext extends RenderContext {
  /**
   * Creates a reference marker at the current position.
   *
   * Reference markers are used to preserve exact insertion points when
   * conditionally rendering or swapping children. For example, when using
   * `When(condition, () => Child())`, the reference marker ensures that
   * `Child` is inserted at the correct position when the condition becomes true.
   *
   * @returns A new context with a reference to the marker
   */
  makeRef(): this
}

/**
 * A renderable object that can be rendered into a specific context.
 *
 * Renderables are the fundamental building blocks of Tempo applications. They
 * are objects with a `render()` method that receives a context and returns a
 * cleanup function, and a `type` symbol for runtime type checking.
 *
 * @typeParam CTX - The type of context this renderable can be rendered into
 * @typeParam TType - The symbol type used for branding (runtime type checking)
 *
 * @example
 * ```typescript
 * // DOM renderable
 * const DOM_RENDERABLE_TYPE = Symbol('DOM_RENDERABLE')
 * type DOMRenderable = Renderable<DOMContext, typeof DOM_RENDERABLE_TYPE>
 *
 * const myComponent: DOMRenderable = {
 *   type: DOM_RENDERABLE_TYPE,
 *   render: (ctx: DOMContext) => {
 *     const divCtx = ctx.makeChildElement('div', undefined)
 *     divCtx.makeChildText('Hello, World!')
 *     return (removeTree) => {
 *       divCtx.clear(removeTree)
 *     }
 *   }
 * }
 * ```
 *
 * @public
 */
export interface Renderable<
  CTX extends RenderContext,
  TType extends symbol = symbol,
> {
  /**
   * Symbol type for runtime type checking.
   *
   * This symbol is used to distinguish between renderables for different
   * contexts at runtime. Each context defines its own unique symbol.
   */
  readonly type: TType

  /**
   * Renders the content into the provided context.
   *
   * @param ctx - The context to render into
   * @returns A cleanup function that removes the rendered content
   */
  render(ctx: CTX): Clear
}

/**
 * A flexible type representing any content that can be rendered in a specific context.
 *
 * TNode (Template Node) is the union type that encompasses all possible content
 * that can be rendered. This includes renderables, text, signals, arrays of content,
 * and null/undefined values for conditional rendering.
 *
 * @typeParam CTX - The type of context
 * @typeParam TType - The symbol type used for branding
 *
 * @example
 * ```typescript
 * // All of these are valid TNode values:
 *
 * // Renderable component
 * const component: TNode<DOMContext, typeof DOM_RENDERABLE_TYPE> = MyComponent()
 *
 * // Static text
 * const text: TNode<DOMContext, typeof DOM_RENDERABLE_TYPE> = 'Hello, World!'
 *
 * // Signal text
 * const dynamicText: TNode<DOMContext, typeof DOM_RENDERABLE_TYPE> = userNameSignal
 *
 * // Array of content
 * const list: TNode<DOMContext, typeof DOM_RENDERABLE_TYPE> = [
 *   html.div('Item 1'),
 *   html.div('Item 2'),
 *   html.div('Item 3')
 * ]
 *
 * // Conditional content
 * const conditional: TNode<DOMContext, typeof DOM_RENDERABLE_TYPE> =
 *   isVisible.value ? html.div('Visible') : null
 * ```
 *
 * @public
 */
/**
 * Primitive types that can be rendered as text content.
 * The rendering context coerces these to strings automatically.
 * @public
 */
export type Primitive = string | number | boolean

export type TNode<CTX extends RenderContext, TType extends symbol> =
  | Renderable<CTX, TType>
  | Value<string>
  | Value<number>
  | Value<boolean>
  | undefined
  | null
  | Renderable<CTX, TType>[]

/**
 * Represents a provider mark for dependency injection.
 *
 * Provider marks are unique symbols used to identify providers in a
 * dependency injection system. The type parameter ensures type safety
 * when retrieving providers.
 *
 * @typeParam T - The type of value provided
 * @public
 */
export type ProviderMark<T> = symbol & { readonly __type: T }

/**
 * Creates a unique symbol that can be used as a provider mark for a specific type `T`.
 *
 * @param identifier - A string that uniquely identifies the provider
 * @returns A unique symbol that can be used as a provider mark
 *
 * @example
 * ```typescript
 * interface UserService {
 *   getUser(id: string): Promise<User>
 * }
 *
 * const USER_SERVICE = makeProviderMark<UserService>('UserService')
 * ```
 *
 * @public
 */
export const makeProviderMark = <T>(identifier: string): ProviderMark<T> =>
  Symbol(identifier) as ProviderMark<T>
