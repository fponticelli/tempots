import { Prop } from '../std/signal'
import { Renderable } from '../types/domain'
import { attr } from './attribute'
import { Fragment } from './fragment'
import {
  emitValue,
  emitValueAsDate,
  emitValueAsDateTime,
  emitValueAsNumber,
  on,
  OnChecked,
} from './on'

/**
 * Binds a `Date` property to an input element. The binding is two-way.
 * Changes to the input element will update the property but will only be
 * affected by day changes and ignore time changes.
 * @param prop - The `Date` property to bind.
 * @param handler - The event handler to use (default: 'input').
 * @returns A Renderable.
 * @public
 */
export const BindDate = (
  prop: Prop<Date>,
  handler: keyof typeof on = 'input'
): Renderable => {
  return Fragment(
    attr.valueAsDate(prop),
    on[handler](emitValueAsDate(prop.set))
  )
}

/**
 * Binds a `Date` property to an input element. The binding is two-way.
 * @param prop - The `Date` property to bind.
 * @param handler - The event handler to use (default: 'input').
 * @returns A Renderable.
 * @public
 */
export const BindDateTime = (
  prop: Prop<Date>,
  handler: keyof typeof on = 'input'
): Renderable => {
  return Fragment(
    attr.valueAsDate(prop),
    on[handler](emitValueAsDateTime(prop.set))
  )
}

/**
 * Binds a `number` property to an input element. The binding is two-way.
 * @param prop - The `number` property to bind.
 * @param handler - The event handler to use (default: 'input').
 * @returns A Renderable.
 * @public
 */
export const BindNumber = (
  prop: Prop<number>,
  handler: keyof typeof on = 'input'
): Renderable => {
  return Fragment(
    attr.valueAsNumber(prop),
    on[handler](emitValueAsNumber(prop.set))
  )
}

/**
 * Binds a `string` property to an input element. The binding is two-way.
 * @param prop - The `string` property to bind.
 * @param handler - The event handler to use (default: 'input').
 * @returns A Renderable.
 * @public
 */
export const BindText = (
  prop: Prop<string>,
  handler: keyof typeof on = 'input'
): Renderable => {
  return Fragment(attr.value(prop), on[handler](emitValue(prop.set)))
}

/**
 * Binds a `boolean` property to the checked value of an input element. The binding is two-way.
 * @param prop - The `boolean` property to bind.
 * @param handler - The event handler to use (default: 'input').
 * @returns A Renderable.
 * @public
 */
export const BindChecked = (prop: Prop<boolean>): Renderable => {
  return Fragment(attr.checked(prop), OnChecked(prop.set))
}
