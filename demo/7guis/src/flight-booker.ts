import {
  attr,
  html,
  on,
  type Renderable,
  emit,
  useProp,
  bind,
} from '@tempots/dom'
import { Button, InputDate, Select } from './ui'
import { flex } from './components/flex'

export function FlightBooker(): Renderable {
  const oneWay = useProp(true)
  const departure = useProp(new Date())
  const returnValue = useProp(new Date())
  return flex.col(
    attr.class('gap-2 w-64'),
    Select(
      on.change(emit.value(v => oneWay.set(v === 'One-way'))),
      html.option(attr.value('One-way'), 'One-way'),
      html.option(attr.value('Return'), 'Return')
    ),
    InputDate(bind.date(departure)),
    InputDate(attr.disabled(oneWay), bind.date(returnValue)),
    Button(
      'Book',
      on.click(() => {
        if (oneWay.value) {
          alert(
            `You have booked a one-way flight on ${departure.value.toLocaleDateString()}`
          )
        } else {
          alert(
            `You have booked a return flight on ${departure.value.toLocaleDateString()} and ${returnValue.value.toLocaleDateString()}`
          )
        }
      })
    )
  )
}
