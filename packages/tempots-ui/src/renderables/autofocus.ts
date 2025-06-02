import { OnDispose, WithElement, type Renderable } from '@tempots/dom'
import { delayed } from '@tempots/std'

/**
 * Automatically focuses an element when it's rendered to the DOM.
 *
 * This utility is commonly used for form inputs, modals, or any interactive element
 * that should receive focus immediately when it appears. The small default delay
 * ensures the element is fully rendered before attempting to focus.
 *
 * @example
 * ```typescript
 * // Auto-focus a text input
 * html.input(
 *   AutoFocus(),
 *   attr.placeholder('Enter your name'),
 *   attr.type('text')
 * )
 * ```
 *
 * @example
 * ```typescript
 * // Auto-focus with custom delay
 * html.textarea(
 *   AutoFocus(100), // Wait 100ms before focusing
 *   attr.placeholder('Enter your message')
 * )
 * ```
 *
 * @example
 * ```typescript
 * // Use in a modal dialog
 * const showModal = prop(false)
 *
 * When(showModal,
 *   () => html.div(
 *     attr.class('modal'),
 *     html.input(
 *       AutoFocus(), // Focus when modal opens
 *       attr.placeholder('Search...')
 *     ),
 *     html.button(
 *       on.click(() => showModal.value = false),
 *       'Close'
 *     )
 *   )
 * )
 * ```
 *
 * @example
 * ```typescript
 * // Combine with other input enhancements
 * html.input(
 *   AutoFocus(),
 *   AutoSelect(), // Also select the text
 *   attr.value(searchTerm),
 *   on.input(emitValue(value => searchTerm.value = value))
 * )
 * ```
 *
 * @param delay - Delay in milliseconds before focusing (default: 10ms)
 * @returns A renderable that focuses the element when rendered
 * @public
 */
export const AutoFocus = (delay: number = 10): Renderable =>
  WithElement(el => OnDispose(delayed(() => el?.focus(), delay)))
