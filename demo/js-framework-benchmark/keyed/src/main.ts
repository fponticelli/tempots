import {
  render,
  html,
  attr,
  on,
  prop,
  computed,
  delegate,
  KeyedForEach,
  aria,
} from '@tempots/dom'
import type { Renderable, Signal } from '@tempots/dom'
import { buildData, RowData } from './data.ts'

function Row(item: Signal<RowData>, selected: Signal<number>): Renderable {
  return html.tr(
    attr.class(
      computed(
        (): string => (item.value.id === selected.value ? 'danger' : ''),
        [item, selected]
      )
    ),
    html.td(attr.class('col-md-1'), item.map(d => String(d.id))),
    html.td(attr.class('col-md-4'), html.a(item.map(d => d.label))),
    html.td(
      attr.class('col-md-1'),
      html.a(
        html.span(
          attr.class('glyphicon glyphicon-remove'),
          aria.hidden(true)
        )
      )
    ),
    html.td(attr.class('col-md-6'))
  )
}

function ActionButton(
  id: string,
  label: string,
  handler: () => void
): Renderable {
  return html.div(
    attr.class('col-sm-6 smallpad'),
    html.button(
      attr.type('button'),
      attr.class('btn btn-primary btn-block'),
      attr.id(id),
      on.click(handler),
      label
    )
  )
}

function App(): Renderable {
  const data = prop<RowData[]>([])
  const selected = prop(0)
  const run = () => {
    selected.set(0)
    data.set(buildData(1000))
  }
  const runLots = () => {
    selected.set(0)
    data.set(buildData(10000))
  }
  const add = () => {
    data.set([...data.value, ...buildData(1000)])
  }
  const update = () => {
    const d = data.value.slice()
    for (let i = 0; i < d.length; i += 10) {
      d[i] = { ...d[i], label: d[i].label + ' !!!' }
    }
    data.set(d)
  }
  const clear = () => {
    selected.set(0)
    data.set([])
  }
  const swapRows = () => {
    const d = data.value.slice()
    if (d.length > 998) {
      const tmp = d[1]
      d[1] = d[998]
      d[998] = tmp
      data.set(d)
    }
  }

  return html.div(
    attr.class('container'),
    html.div(
      attr.class('jumbotron'),
      html.div(
        attr.class('row'),
        html.div(attr.class('col-md-6'), html.h1('Tempo-keyed')),
        html.div(
          attr.class('col-md-6'),
          html.div(
            attr.class('row'),
            ActionButton('run', 'Create 1,000 rows', run),
            ActionButton('runlots', 'Create 10,000 rows', runLots),
            ActionButton('add', 'Append 1,000 rows', add),
            ActionButton('update', 'Update every 10th row', update),
            ActionButton('clear', 'Clear', clear),
            ActionButton('swaprows', 'Swap Rows', swapRows)
          )
        )
      )
    ),
    html.table(
      attr.class('table table-hover table-striped test-data'),
      html.tbody(
        attr.id('tbody'),
        delegate.click('td.col-md-4 a', e => {
          const tr = (e.target as Element).closest('tr')!
          const id = parseInt((tr.children[0] as HTMLElement).textContent!, 10)
          selected.set(id)
        }),
        delegate.click('td.col-md-1 a', e => {
          const tr = (e.target as Element).closest('tr')!
          const id = parseInt((tr.children[0] as HTMLElement).textContent!, 10)
          const d = data.value
          const idx = d.findIndex(r => r.id === id)
          if (idx >= 0) {
            data.set([...d.slice(0, idx), ...d.slice(idx + 1)])
          }
        }),
        KeyedForEach(
          data,
          d => d.id,
          (item: Signal<RowData>) => Row(item, selected)
        )
      )
    ),
    html.span(
      attr.class('preloadicon glyphicon glyphicon-remove'),
      aria.hidden(true)
    )
  )
}

render(App(), document.getElementById('main')!)
