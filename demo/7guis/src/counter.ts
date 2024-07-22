import { attr, type Renderable, on, makeProp } from '@tempots/dom'
import { Txt } from './components/txt'
import { Button } from './ui'
import { flex } from './components/flex'

export function Counter(): Renderable {
  const count = makeProp(0)
  return flex.row(
    attr.class('gap-2 items-center'),
    Txt(count.map(String), { size: 'xl' }),
    Button(
      on.click(() => count.value++),
      'Increment'
    )
  )
}
