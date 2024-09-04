import { Renderable, TNode } from '../types/domain'
import { Ensure } from './ensure'
import { Value } from '../std/value'

/**
 * Renders content conditionally based on a boolean value.
 * @param condition - The condition to evaluate
 * @param then - Content to render if condition is true
 * @param otherwise - Optional content to render if condition is false
 * @returns Renderable content
 * @public
 */
export const When = (
  condition: Value<boolean>,
  then: TNode,
  otherwise?: TNode
): Renderable =>
  LazyWhen(
    condition,
    () => then,
    () => otherwise
  )

/**
 * Lazily renders content based on a boolean condition.
 * @param condition - The condition to evaluate
 * @param then - Function returning content to render if condition is true
 * @param otherwise - Optional function returning content to render if condition is false
 * @returns Renderable content
 * @public
 */
export const LazyWhen = (
  condition: Value<boolean>,
  then: () => TNode,
  otherwise?: () => TNode
): Renderable =>
  Ensure(
    Value.map(condition, v => (v ? true : null)) as Value<true | null>,
    then,
    otherwise != null ? otherwise : undefined
  )

/**
 * Renders content when a condition is false.
 * @param condition - The condition to evaluate
 * @param then - Content to render if condition is false
 * @param otherwise - Optional content to render if condition is true
 * @returns Renderable content
 * @public
 */
export const Unless = (
  condition: Value<boolean>,
  then: TNode,
  otherwise?: TNode
): Renderable =>
  LazyUnless(
    condition,
    () => then,
    () => otherwise
  )

/**
 * Lazily renders content when a condition is false.
 * @param condition - The condition to evaluate
 * @param then - Function returning content to render if condition is false
 * @param otherwise - Optional function returning content to render if condition is true
 * @returns Renderable content
 * @public
 */
export const LazyUnless = (
  condition: Value<boolean>,
  then: () => TNode,
  otherwise?: () => TNode
): Renderable =>
  LazyWhen(
    Value.map(condition, v => !v),
    then,
    otherwise
  )
