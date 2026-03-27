import { Txt } from './components/txt'
import {
  attr,
  on,
  prop,
  type Renderable,
  emitValueAsNumber,
} from '@tempots/dom'
import { InputNumber } from './ui'
import { flex } from './components/flex'

export interface TempChange {
  unit: 'c' | 'f'
  value: number
}

function round(value: number, decimals: number = 2) {
  return Number(Math.round(Number(value + 'e' + decimals)) + 'e-' + decimals)
}

export function Temperature(): Renderable {
  const celsius = prop(22)
  const fahrenheit = prop(71.6)
  const tchange = prop<TempChange>({ unit: 'c', value: NaN })
  tchange.on(tchange => {
    const value = tchange.value
    console.log(value)
    if (!Number.isFinite(value)) {
      return
    }
    if (tchange.unit === 'c') {
      fahrenheit.set(round((value * 9) / 5 + 32))
    } else {
      celsius.set(round(((value - 32) * 5) / 9))
    }
  })
  return flex.col(
    attr.class('gap-2'),
    flex.row(
      attr.class('gap-2 items-center'),
      InputNumber(
        attr.value(celsius.map(String)),
        on.input(emitValueAsNumber(v => tchange.set({ unit: 'c', value: v })))
      ),
      Txt('°C'),
      InputNumber(
        attr.value(fahrenheit.map(String)),
        on.input(emitValueAsNumber(v => tchange.set({ unit: 'f', value: v })))
      ),
      Txt('°F')
    )
  )
}
