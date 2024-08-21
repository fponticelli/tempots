import { Value } from '../std/value'
import { Renderable } from '../types/domain'
import { Empty } from './empty'
import { When } from './when'

/**
 * Returns a renderable component that displays the given `display` component
 * when the `signal` contains a non-empty array, and the `whenEmpty` component
 * otherwise.
 *
 * @typeParam T - The type of elements in the array.
 * @param value - The signal or literal containing the array.
 * @param display - The component to display when the array is non-empty.
 * @param whenEmpty- The component to display when the array is empty.
 * @returns - The renderable component.
 * @public
 */
export const NotEmpty = <T>(
  value: Value<T[]>,
  display: Renderable,
  whenEmpty: Renderable = Empty
): Renderable =>
  When(
    Value.map(value, v => v.length > 0),
    display,
    whenEmpty
  )
