import {
  render,
  html,
  attr,
  on,
  prop,
  ForEach,
  WithBrowserCtx,
  OnDispose,
  aria,
} from '@tempots/dom'
import type { Renderable, Signal } from '@tempots/dom'
import { buildData, RowData } from './data.ts'

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

function Row(item: Signal<RowData>): Renderable {
  return html.tr(
    html.td(attr.class('col-md-1'), item.map(d => String(d.id))),
    html.td(
      attr.class('col-md-4'),
      html.a(item.map(d => d.label))
    ),
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

function App(): Renderable {
  const data = prop<RowData[]>([])
  let selectedTr: HTMLTableRowElement | null = null

  const clearSelection = () => {
    if (selectedTr) {
      selectedTr.className = ''
      selectedTr = null
    }
  }
  const run = () => {
    clearSelection()
    data.set(buildData(1000))
  }
  const runLots = () => {
    clearSelection()
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
    clearSelection()
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
        html.div(attr.class('col-md-6'), html.h1('Tempo-non-keyed')),
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
        // Event delegation for selection and deletion
        WithBrowserCtx(ctx => {
          const tbody = ctx.element
          tbody.addEventListener('click', (e: Event) => {
            const target = e.target as HTMLElement
            const a = target.closest('a')
            if (!a) return

            const tr = a.closest('tr')
            if (!tr) return

            const td = a.parentElement
            if (!td) return

            if (td.className === 'col-md-4') {
              // Select row
              if (selectedTr) selectedTr.className = ''
              selectedTr = tr as HTMLTableRowElement
              selectedTr.className = 'danger'
            } else if (
              td.className === 'col-md-1' &&
              a.querySelector('.glyphicon-remove')
            ) {
              // Delete row - read ID from first cell
              const id = parseInt(
                (tr.children[0] as HTMLElement).textContent!,
                10
              )
              const d = data.value
              const idx = d.findIndex(r => r.id === id)
              if (idx >= 0) {
                if (selectedTr === tr) {
                  selectedTr.className = ''
                  selectedTr = null
                }
                data.set([...d.slice(0, idx), ...d.slice(idx + 1)])
              }
            }
          })
          return OnDispose(() => {})
        }),
        ForEach(data, (item: Signal<RowData>) => Row(item))
      )
    ),
    html.span(
      attr.class('preloadicon glyphicon glyphicon-remove'),
      aria.hidden(true)
    )
  )
}

render(App(), document.getElementById('main')!)
