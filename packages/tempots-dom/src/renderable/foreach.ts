import type { TNode, Renderable } from '../types/domain'
import { Signal, Value, ElementPosition } from '@tempots/core'
import { Repeat } from './repeat'
import { renderableOfTNode } from './element'

/**
 * Efficiently renders a dynamic list of items from an array signal.
 *
 * This function creates a reactive list that automatically updates when the source array changes.
 * Each item in the array gets its own signal that tracks changes to that specific item.
 * The list efficiently handles additions, removals, and modifications to the array.
 *
 * @example
 * ```typescript
 * const todos = prop([
 *   { id: 1, text: 'Learn Tempo', done: false },
 *   { id: 2, text: 'Build an app', done: false }
 * ])
 *
 * ForEach(todos,
 *   (todoSignal, position) => html.div(
 *     html.input(
 *       attr.type('checkbox'),
 *       attr.checked(todoSignal.map(t => t.done))
 *     ),
 *     html.span(todoSignal.map(t => t.text)),
 *     html.small(`Item ${position.index + 1}`)
 *   )
 * )
 * ```
 *
 * @example
 * ```typescript
 * // With separators between items
 * const items = prop(['apple', 'banana', 'cherry'])
 *
 * ForEach(items,
 *   (itemSignal) => html.span(itemSignal),
 *   () => html.span(', ') // Separator between items
 * )
 * // Renders: apple, banana, cherry
 * ```
 *
 * @example
 * ```typescript
 * // Using position information
 * const numbers = prop([10, 20, 30])
 *
 * ForEach(numbers,
 *   (numberSignal, position) => html.div(
 *     `Position ${position.index}: `,
 *     numberSignal,
 *     position.isFirst ? ' (first)' : '',
 *     position.isLast ? ' (last)' : ''
 *   )
 * )
 * ```
 *
 * @typeParam T - The type of items in the array
 * @param value - A signal or literal array to iterate over
 * @param item - Function that renders each item, receives the item signal and position info
 * @param separator - Optional function that renders content between items
 * @returns A renderable that displays the dynamic list
 * @public
 */
export const ForEach = <T>(
  value: Value<T[]>,
  item: (value: Signal<T>, position: ElementPosition) => TNode,
  separator?: (pos: ElementPosition) => TNode
): Renderable => {
  const times = Value.map(value, arr => arr.length)
  const arr = Value.toSignal(value)
  return Repeat(
    times,
    pos => {
      const signal = arr.map(v => v[pos.index])
      // Signal is automatically disposed by the scope when the item is removed
      return renderableOfTNode(item(signal, pos))
    },
    separator
  )
}
