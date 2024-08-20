import { Txt } from './components/txt'
import {
  attr,
  type Renderable,
  on,
  makeProp,
  html,
  ElementPosition,
  Signal,
  Repeat,
  When,
} from '@tempots/dom'
import { Button } from './ui'
import { flex } from './components/flex'

export function RepeatDemo(): Renderable {
  const count = makeProp(5)
  const deleteDisabled = count.map(count => count === 0)
  return flex.col(
    attr.class('gap-2 items-center'),
    flex.row(Txt(count.map(count => `Count: ${count}`))),
    flex.row(
      attr.class('gap-2'),
      Button(
        'Add 1',
        on.click(() => (count.value += 1))
      ),
      Button(
        'Add 10',
        on.click(() => (count.value += 10))
      ),
      Button(
        attr.disabled(deleteDisabled),
        'Delete 1',
        on.click(() => (count.value -= 1))
      ),
      Button(
        attr.disabled(deleteDisabled),
        'Delete 10',
        on.click(() => count.update(c => Math.max(0, c - 10)))
      )
    ),
    flex.col(
      attr.class('gap-2'),
      Repeat(
        count,
        pos => {
          const loc = pos.map(pos => `${pos.counter} - index: ${pos.index}, `)
          const isFirst = pos.map(pos => pos.isFirst)
          const isLast = pos.map(pos => pos.isLast)
          const isOdd = pos.map(pos => pos.isOdd)
          const isEven = pos.map(pos => pos.isEven)

          return flex.row(
            attr.class('gap-2 justify-between items-center w-96'),
            flex.row(
              attr.class('gap-2'),
              Txt(loc),
              When(isFirst, Txt('FIRST, ')),
              When(isLast, Txt('LAST, ')),
              When(isOdd, Txt('odd')),
              When(isEven, Txt('even'))
            )
          )
        },
        (pos: Signal<ElementPosition>) => {
          const cls = pos.map((p: ElementPosition) => {
            const classes = []
            console.log(p)
            if (p.isFirst) {
              classes.push('border-2')
            }
            if (p.isLast) {
              classes.push('border-dashed')
            }
            if (p.isOdd) {
              classes.push('border-green-600')
            }
            if (p.isEven) {
              classes.push('border-red-600')
            }
            return classes.join(' ')
          })
          return html.hr(attr.class(cls))
        }
      )
    )
  )
}
