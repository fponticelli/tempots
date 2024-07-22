import { Txt } from './components/txt'
import {
  EmitValue,
  OnUnmount,
  Signal,
  attr,
  on,
  makeProp,
  type Renderable,
} from '@tempots/dom'
import { InputText } from './ui'
import { flex } from './components/flex'

export interface TempChange {
  unit: 'c' | 'f'
  value: string
}

function round(value: number, decimals: number = 2) {
  return String(
    Number(Math.round(Number(value + 'e' + decimals)) + 'e-' + decimals)
  )
}

export function Temperature(): Renderable {
  const celsius = makeProp<string | number>('22')
  const fahrenheit = makeProp<string | number>('71.6')
  const tchange = makeProp<TempChange>({ unit: 'c', value: '' })
  const clear = tchange.on(tchange => {
    const value = Number(tchange.value)
    if (tchange.value === '' || !Number.isFinite(value)) {
      return
    }
    if (tchange.unit === 'c') {
      fahrenheit.set(round((value * 9) / 5 + 32))
    } else {
      celsius.set(round(((value - 32) * 5) / 9))
    }
  })
  return flex.col(
    OnUnmount(clear),
    attr.class('gap-2'),
    flex.row(
      attr.class('gap-2 items-center'),
      InputText(
        attr.value(celsius as Signal<string>),
        on.input(EmitValue(v => tchange.set({ unit: 'c', value: v })))
      ),
      Txt('°C'),
      InputText(
        attr.value(fahrenheit as Signal<string>),
        on.input(EmitValue(v => tchange.set({ unit: 'f', value: v })))
      ),
      Txt('°F')
    )
  )
}
