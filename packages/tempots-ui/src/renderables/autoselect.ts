import { OnDispose, WithElement, type Renderable } from '@tempots/dom'
import { delayed } from '@tempots/std'

/**
 * Automatically selects all text content in an input element when it's rendered.
 *
 * This utility is particularly useful for input fields where you want the user to be able
 * to immediately start typing to replace the existing content, or easily copy the current value.
 * The small default delay ensures the element is fully rendered before attempting to select.
 *
 * @example
 * ```typescript
 * // Auto-select text in an input
 * const username = prop('john_doe')
 *
 * html.input(
 *   AutoSelect(),
 *   attr.value(username),
 *   attr.type('text')
 * )
 * // When rendered, 'john_doe' will be automatically selected
 * ```
 *
 * @example
 * ```typescript
 * // Combine with AutoFocus for complete UX
 * html.input(
 *   AutoFocus(),   // Focus the input
 *   AutoSelect(),  // Select all text
 *   attr.value(editableValue),
 *   attr.placeholder('Enter value')
 * )
 * ```
 *
 * @example
 * ```typescript
 * // Use in an edit dialog
 * const editMode = prop(false)
 * const itemName = prop('Default Name')
 *
 * When(editMode,
 *   () => html.div(
 *     html.label('Edit name:'),
 *     html.input(
 *       AutoFocus(),
 *       AutoSelect(), // Select existing name for easy editing
 *       attr.value(itemName),
 *       on.keydown(e => {
 *         if (e.key === 'Enter') editMode.value = false
 *         if (e.key === 'Escape') editMode.value = false
 *       })
 *     )
 *   )
 * )
 * ```
 *
 * @example
 * ```typescript
 * // Custom delay for specific timing needs
 * html.input(
 *   AutoSelect(50), // Wait 50ms before selecting
 *   attr.value(sensitiveData)
 * )
 * ```
 *
 * @param delay - Delay in milliseconds before selecting text (default: 10ms)
 * @returns A renderable that selects all text in the input element when rendered
 * @public
 */
export const AutoSelect = (delay: number = 10): Renderable =>
  WithElement((el: HTMLInputElement) => {
    const clear = delayed(() => el.select(), delay)
    return OnDispose(clear)
  })
