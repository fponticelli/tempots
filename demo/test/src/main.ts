import {
  attr,
  html,
  Renderable,
  on,
  makeProp,
  render,
  ForEach,
  input,
  emitChecked,
  emitValue,
  emitValueAsNumber,
} from '@tempots/dom'

type Payload = {
  option: 'a' | 'b' | 'c'
  checked: boolean
  text: string
  number: number
}

function App(): Renderable {
  const list = makeProp([
    {
      option: 'a',
      checked: true,
      text: 'ABC',
      number: 1,
    },
    {
      option: 'b',
      checked: false,
      text: 'DEF',
      number: 2,
    },
  ] as Payload[])
  return html.div(
    attr.class('app'),
    html.ul(
      ForEach(list, (item, pos) => {
        return html.li(
          attr.class('item'),
          String(pos.counter),
          html.select(
            html.option(
              attr.value('a'),
              attr.selected(item.$.option.map(v => v === 'a')),
              'A'
            ),
            html.option(
              attr.value('b'),
              attr.selected(item.$.option.map(v => v === 'b')),
              'B'
            ),
            html.option(
              attr.value('c'),
              attr.selected(item.$.option.map(v => v === 'c')),
              'C'
            ),
            on.change(
              emitValue(v =>
                list.update(ls =>
                  ls.map((item, i) =>
                    i === pos.index
                      ? { ...item, option: v as 'a' | 'b' | 'c' }
                      : item
                  )
                )
              )
            )
          ),
          input.checkbox(
            attr.checked(item.$.checked),
            on.change(
              emitChecked(v =>
                list.update(ls =>
                  ls.map((item, i) =>
                    i === pos.index ? { ...item, checked: v } : item
                  )
                )
              )
            )
          ),
          input.text(
            attr.value(item.$.text),
            on.input(
              emitValue(v =>
                list.update(ls =>
                  ls.map((item, i) =>
                    i === pos.index ? { ...item, text: v } : item
                  )
                )
              )
            )
          ),
          input.number(
            attr.valueAsNumber(item.$.number),
            on.input(
              emitValueAsNumber(v =>
                list.update(ls =>
                  ls.map((item, i) =>
                    i === pos.index ? { ...item, number: v } : item
                  )
                )
              )
            )
          ),
          html.button(
            'x',
            on.click(() => {
              list.update(v => v.filter((_, i) => i !== pos.index))
            })
          )
        )
      })
    )
  )
}

render(App(), document.body)
