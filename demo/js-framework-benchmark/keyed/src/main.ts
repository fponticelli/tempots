import {
  render,
  html,
  attr,
  on,
  prop,
  WithBrowserCtx,
  OnDispose,
  aria,
} from '@tempots/dom'
import type { Renderable, Prop } from '@tempots/dom'
import { buildData, RowData } from './data.ts'

interface RowEntry {
  tr: HTMLTableRowElement
  labelA: HTMLAnchorElement
  data: RowData
}

function KeyedRows(
  data: Prop<RowData[]>,
  selected: Prop<number>
): Renderable {
  return WithBrowserCtx(ctx => {
    const tbody = ctx.element
    const doc = ctx.document

    const rowMap = new Map<number, RowEntry>()
    let selectedId = 0

    function createRow(item: RowData): RowEntry {
      const tr = doc.createElement('tr')

      const td1 = doc.createElement('td')
      td1.className = 'col-md-1'
      td1.textContent = String(item.id)
      tr.appendChild(td1)

      const td2 = doc.createElement('td')
      td2.className = 'col-md-4'
      const labelA = doc.createElement('a')
      labelA.textContent = item.label
      td2.appendChild(labelA)
      tr.appendChild(td2)

      const td3 = doc.createElement('td')
      td3.className = 'col-md-1'
      const deleteA = doc.createElement('a')
      const span = doc.createElement('span')
      span.className = 'glyphicon glyphicon-remove'
      span.setAttribute('aria-hidden', 'true')
      deleteA.appendChild(span)
      td3.appendChild(deleteA)
      tr.appendChild(td3)

      const td4 = doc.createElement('td')
      td4.className = 'col-md-6'
      tr.appendChild(td4)

      return { tr, labelA, data: item }
    }

    // Event delegation on tbody
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
        const idStr = (tr.firstChild as HTMLTableCellElement).textContent!
        const id = parseInt(idStr, 10)
        selected.set(id)
      } else if (td.className === 'col-md-1' && a.querySelector('.glyphicon-remove')) {
        // Delete row
        const idStr = (tr.firstChild as HTMLTableCellElement).textContent!
        const id = parseInt(idStr, 10)
        const d = data.value
        const idx = d.findIndex(r => r.id === id)
        if (idx >= 0) {
          data.set([...d.slice(0, idx), ...d.slice(idx + 1)])
        }
      }
    })

    const clearSelected = selected.on(
      id => {
        if (selectedId !== 0) {
          const old = rowMap.get(selectedId)
          if (old) old.tr.className = ''
        }
        selectedId = id
        if (id !== 0) {
          const entry = rowMap.get(id)
          if (entry) entry.tr.className = 'danger'
        }
      },
      { noAutoDispose: true }
    )

    const clearData = data.on(
      newData => {
        const newKeySet = new Set<number>()
        for (let i = 0; i < newData.length; i++) {
          newKeySet.add(newData[i].id)
        }

        // Remove rows not in new data
        for (const [id, entry] of rowMap) {
          if (!newKeySet.has(id)) {
            tbody.removeChild(entry.tr)
            rowMap.delete(id)
          }
        }

        // Add new rows, update existing, reorder
        for (let i = 0; i < newData.length; i++) {
          const item = newData[i]
          let entry = rowMap.get(item.id)

          if (!entry) {
            entry = createRow(item)
            rowMap.set(item.id, entry)
          } else if (entry.data.label !== item.label) {
            entry.labelA.textContent = item.label
            entry.data = item
          }

          // Ensure correct position
          const existingAtPos = tbody.children[i] as HTMLElement | undefined
          if (existingAtPos !== entry.tr) {
            tbody.insertBefore(entry.tr, existingAtPos || null)
          }
        }

        // Restore selection highlight
        if (selectedId !== 0) {
          const sel = rowMap.get(selectedId)
          if (sel) sel.tr.className = 'danger'
        }
      },
      { noAutoDispose: true }
    )

    return OnDispose(removeTree => {
      clearSelected()
      clearData()
      if (removeTree) {
        tbody.textContent = ''
      }
      rowMap.clear()
    })
  })
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
      html.tbody(attr.id('tbody'), KeyedRows(data, selected))
    ),
    html.span(
      attr.class('preloadicon glyphicon glyphicon-remove'),
      aria.hidden(true)
    )
  )
}

render(App(), document.getElementById('main')!)
