import {
  el,
  on,
  trigger,
  text,
  style,
  attr,
  prop,
  mapState,
  iterator,
  renderSimple,
  oneOf2,
  innerHTML
} from 'tempo-dom/lib/core'
import {
  Choice2
} from 'tempo-dom/lib/choice'

const range = (len: number): number[] =>
  len < 0 ? [] : Array.from(Array(len).keys()).map(s => s + 1)

const template = el<number, number, unknown>(
  'div',
  el(
    'div',
    el(
      'button',
      trigger('click', ({ state }) => state - 10),
      text('- 10')
    ),
    el(
      'button',
      trigger('click', ({ state }) => state - 1),
      text('-')
    ),
    el(
      'button',
      trigger('click', ({ state }) => state + 1),
      text('+')
    ),
    el(
      'button',
      trigger('click', ({ state }) => state + 10),
      text('+ 10')
    )
  ),
  el(
    'div',
    style('font-size', '24px'),
    mapState<number, string, number, unknown>(
      (s): string => `number is ${s}`,
      text(s => s)
    )
  ),
  el(
    'div',
    el(
      'input',
      attr('type', 'number'),
      prop('valueAsNumber', s => s),
      on<number, number, HTMLInputElement, Event>(
        'input',
        ({ element, dispatch }) =>
          dispatch(isFinite(element.valueAsNumber) ? element.valueAsNumber : 0)
      )
    )
  ),
  el("div", innerHTML((s: number) => `<b><u>${s}</u></b>`)),
  oneOf2(
    (s: number): Choice2<number[], number[]> =>
      s % 2 === 0
        ? Choice2.one(range(s).filter(s => s % 2 === 0))
        : Choice2.two(range(s).filter(s => s % 2 !== 0)),
    el(
      'ul',
      iterator(
        s => s,
        el(
          'li',
          text(s => `even ${s}`)
        )
      )
    ),
    oneOf2(
      (s: number[]): Choice2<number[], number[]> =>
        s[s.length - 1] === 7 ? Choice2.one(s.map(s => s * 7)) : Choice2.two(s),
      el(
        'ul',
        iterator(
          s => s,
          el(
            'li',
            text(s => `sevens ${s}`)
          )
        )
      ),
      el(
        'ul',
        iterator(
          s => s,
          el(
            'li',
            text(s => `odd ${s}`)
          )
        )
      )
    )
  )
)

renderSimple({ template, state: 10 })
