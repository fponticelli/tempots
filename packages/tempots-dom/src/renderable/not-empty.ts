import { Signal } from '../std/signal'
import { Value } from '../std/value'
import { Renderable } from '../types/domain'
import { Empty } from './empty'
import { OneOf } from './oneof'

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
  display: (value: Signal<T[]>) => Renderable,
  whenEmpty: () => Renderable = () => Empty
): Renderable =>
  OneOf(
    Value.map<T[], { notEmpty: T[] } | { whenEmpty: null }>(value, v =>
      v.length > 0 ? { notEmpty: v } : { whenEmpty: null }
    ),
    {
      notEmpty: (v: Signal<T[]>) => display(v),
      whenEmpty: () => whenEmpty(),
    }
  )
