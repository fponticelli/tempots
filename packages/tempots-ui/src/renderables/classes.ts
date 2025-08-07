import { attr, Fragment, Value } from '@tempots/dom'

/**
 * Creates a renderable that applies classes based on a record of boolean signals.
 *
 * @param obj - The record of signals.
 * @returns The created renderable.
 */
export function classes(obj: Record<string, Value<boolean>>) {
  const entries = Object.entries(obj) as [string, Value<boolean>][]
  return Fragment(
    ...entries.map(([name, value]) =>
      attr.class(Value.map(value, v => (v ? name : undefined)))
    )
  )
}
