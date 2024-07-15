import { Prop } from '../std/signal'
import { attr } from './attribute'
import { Fragment } from './fragment'
import { emit, on, OnChecked } from './handler'

function bindDate(prop: Prop<Date>, handler: keyof typeof on = 'input') {
  return Fragment(
    attr.valueAsDate(prop),
    on[handler](emit.valueAsDate(prop.set))
  )
}

function bindDateTime(prop: Prop<Date>, handler: keyof typeof on = 'input') {
  return Fragment(
    attr.valueAsDate(prop),
    on[handler](emit.valueAsDateTime(prop.set))
  )
}

function bindNumber(prop: Prop<number>, handler: keyof typeof on = 'input') {
  return Fragment(
    attr.valueAsNumber(prop),
    on[handler](emit.valueAsNumber(prop.set))
  )
}

function bindText(prop: Prop<string>, handler: keyof typeof on = 'input') {
  return Fragment(attr.value(prop), on[handler](emit.value(prop.set)))
}

function bindChecked(prop: Prop<boolean>) {
  return Fragment(attr.checked(prop), OnChecked(prop.set))
}

export const bind = {
  date: bindDate,
  dateTime: bindDateTime,
  number: bindNumber,
  text: bindText,
  checked: bindChecked,
}
