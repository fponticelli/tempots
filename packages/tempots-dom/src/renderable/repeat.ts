import { DOMContext } from '../dom/dom-context'
import { ElementPosition } from '../std/element-position'
import { Signal, signal } from '../std/signal'
import { Value } from '../std/value'
import { TNode, Clear, Renderable } from '../types/domain'
import { renderableOfTNode } from './element'
import { Empty } from './empty'
import { Fragment } from './fragment'
import { OnDispose } from './on-dispose'
import { When } from './when'

/**
 * Renders content a specified number of times, with each iteration receiving position information.
 *
 * This function is useful for generating repeated UI elements based on a count rather than an array.
 * Each iteration receives an `ElementPosition` object that provides the current index and position
 * information relative to the total count.
 *
 * @example
 * ```typescript
 * // Create a simple numbered list
 * const count = prop(5)
 *
 * Repeat(count,
 *   (position) => html.div(
 *     `Item ${position.index + 1} of ${position.total.value}`,
 *     position.isFirst ? ' (first)' : '',
 *     position.isLast ? ' (last)' : ''
 *   )
 * )
 * ```
 *
 * @example
 * ```typescript
 * // Create a star rating component
 * const rating = prop(3)
 * const maxStars = 5
 *
 * Repeat(maxStars,
 *   (position) => html.span(
 *     attr.class(position.index < rating.value ? 'star-filled' : 'star-empty'),
 *     '★'
 *   )
 * )
 * ```
 *
 * @example
 * ```typescript
 * // With separators between items
 * Repeat(3,
 *   (position) => html.span(`Item ${position.index}`),
 *   () => html.span(' | ') // Separator
 * )
 * // Renders: Item 0 | Item 1 | Item 2
 * ```
 *
 * @example
 * ```typescript
 * // Dynamic count that updates the UI
 * const itemCount = prop(2)
 *
 * html.div(
 *   html.button(
 *     on.click(() => itemCount.value++),
 *     'Add Item'
 *   ),
 *   Repeat(itemCount,
 *     (position) => html.div(`Dynamic item ${position.index + 1}`)
 *   )
 * )
 * ```
 *
 * @param times - A signal or number representing how many times to repeat the content
 * @param element - Function that returns content for each iteration, receives position information
 * @param separator - Optional function that returns content to place between iterations
 * @returns A renderable that displays the repeated content
 * @public
 */
export const Repeat = (
  times: Value<number>,
  element: (index: ElementPosition) => TNode,
  separator?: (pos: ElementPosition) => TNode
): Renderable => {
  if (separator != null) {
    return Repeat(times, pos => {
      const sepPos = new ElementPosition(
        pos.index,
        pos.total.map(v => v - 1)
      )
      return Fragment(
        OnDispose(sepPos.dispose),
        renderableOfTNode(element(pos)),
        When(
          pos.isLast,
          () => Empty,
          () => separator(sepPos)
        )
      )
    })
  } else {
    if (Signal.is(times)) {
      return (ctx: DOMContext) => {
        const newCtx = ctx.makeRef()
        const clears: Clear[] = []

        const disposeListener = times.on(newLength => {
          const toRemove = clears.splice(newLength)
          for (const remove of toRemove) {
            remove(true)
          }
          for (let i = clears.length; i < newLength; i++) {
            const pos = new ElementPosition(i, times)
            clears.push(renderableOfTNode(element(pos))(newCtx))
          }
        })

        return (removeTree: boolean) => {
          disposeListener()
          for (const clear of clears) {
            clear(removeTree)
          }
          clears.length = 0
          newCtx.clear(removeTree)
        }
      }
    } else {
      return Fragment(
        ...Array.from({ length: times }, (_, i) => i).map(i =>
          renderableOfTNode(element(new ElementPosition(i, signal(times))))
        )
      )
    }
  }
}
