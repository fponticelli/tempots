import type { Clear, Signal } from '@tempots/core'
import type { DOMContext } from '../dom/dom-context'

// --- Compiled template types ---

/**
 * Describes a dynamic slot in a compiled template.
 *
 * @internal
 */
export interface SlotInfo {
  /** childNodes indices from the template fragment root to the target node */
  path: number[]
  /** The kind of dynamic binding this slot represents */
  kind: 'dynamic-attr' | 'dynamic-text' | 'slot'
}

/**
 * A compiled DOM template ready for cloning.
 *
 * @internal
 */
export interface CompiledTemplate {
  /** The template fragment to clone via `cloneNode(true)` */
  fragment: DocumentFragment
  /** Slot descriptors in build order (matches extractSlots order) */
  slots: SlotInfo[]
}

// --- Template node types (kind metadata on renderables) ---

/** An element renderable with tag name and children. */
export interface ElementNode {
  readonly kind: 'element'
  readonly tag: string
  readonly ns?: string
  readonly children: readonly TemplateNode[]
}

/** A static attribute baked into the template. */
export interface StaticAttrNode {
  readonly kind: 'static-attr'
  readonly name: string
  readonly value: string
}

/** A dynamic attribute that needs runtime binding. */
export interface DynamicAttrNode {
  readonly kind: 'dynamic-attr'
  readonly render: (ctx: DOMContext) => Clear
}

/** A static text node baked into the template. */
export interface StaticTextNode {
  readonly kind: 'static-text'
  readonly text: string
}

/** A dynamic text node bound to a signal. */
export interface DynamicTextNode {
  readonly kind: 'dynamic-text'
  readonly source: Signal<unknown>
  readonly transform: (v: unknown) => string
}

/** A fragment that inlines its children (no DOM node). */
export interface FragmentNode {
  readonly kind: 'fragment'
  readonly children: readonly TemplateNode[]
}

/** An empty renderable (no DOM output). */
export interface EmptyNode {
  readonly kind: 'empty'
}

/** An opaque renderable without kind metadata (e.g. When, ForEach). */
export interface OpaqueNode {
  readonly kind?: undefined
  readonly render: (ctx: DOMContext) => Clear
}

/**
 * Discriminated union of all renderable node shapes the template engine
 * can encounter when walking a renderable tree.
 *
 * @internal
 */
export type TemplateNode =
  | ElementNode
  | StaticAttrNode
  | DynamicAttrNode
  | StaticTextNode
  | DynamicTextNode
  | FragmentNode
  | EmptyNode
  | OpaqueNode

// --- Hydration slot types ---

/** A dynamic-text slot carries a signal source and transform function. */
export interface DynamicTextSlot {
  readonly source: Signal<unknown>
  readonly transform: (v: unknown) => string
}

/** A renderable slot (dynamic-attr or opaque) carries a render function. */
export interface RenderableSlot {
  readonly render: (ctx: DOMContext) => Clear
}
