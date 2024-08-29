import { Txt } from './components/txt'
import {
  attr,
  type Renderable,
  on,
  makeProp,
  html,
  ElementPosition,
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
          const loc = `${pos.counter} - index: ${pos.index}, `

          return flex.row(
            attr.class('gap-2 justify-between items-center w-96'),
            flex.row(
              attr.class('gap-2'),
              Txt(loc),
              When(pos.isFirst, Txt('FIRST, ')),
              When(pos.isLast, Txt('LAST, ')),
              When(pos.isOdd, Txt('odd')),
              When(pos.isEven, Txt('even'))
            )
          )
        },
        (pos: ElementPosition) => {
          const classes = []
          if (pos.isFirst) {
            classes.push('border-2')
          }
          if (pos.isOdd) {
            classes.push('border-green-600')
          }
          if (pos.isEven) {
            classes.push('border-red-600')
          }
          return html.hr(
            attr.class(classes.join(' ')),
            attr.class(
              pos.isLast.map((isLast): string =>
                isLast ? 'border-dashed' : ''
              )
            )
          )
        }
      )
    )
  )
}
