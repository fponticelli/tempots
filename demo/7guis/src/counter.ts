import { attr, type Renderable, on, prop } from '@tempots/dom'
import { Txt } from './components/txt'
import { Button } from './ui'
import { flex } from './components/flex'

export function Counter(): Renderable {
  const $count = prop(0)
  return flex.row(
    attr.class('gap-2 items-center'),
    Txt($count.map(String), { size: 'xl' }),
    Button(
      on.click(() => $count.value++),
      'Increment'
    )
  )
}
