import { Txt } from './components/txt'
import {
  html,
  attr,
  type Renderable,
  on,
  emit,
  Signal,
  prop,
  Prop,
  TNode,
  When,
  signal,
  computed,
  Fragment,
} from '@tempots/dom'
import { bmiData } from './cell-sample'
import { InputText } from './ui'
import { AutoSelect } from '@tempots/ui'

const data = bmiData // change to sampleData if desired
const NUM_COLUMNS = 26
const NUM_ROWS = 100

function Cell(...children: TNode[]) {
  return Fragment(
    attr.class('border border-gray-300 dark:border-gray-500 min-h-8'),
    ...children
  )
}

function Header(...children: TNode[]): Renderable {
  return Fragment(
    attr.class(
      'border border-gray-400 dark:border-gray-600 min-w-10 min-h-8 bg-gray-200 dark:bg-gray-800'
    ),
    ...children
  )
}

function getKey(row: string, column: string) {
  return `${column}${row}`
}

function evalToken(token: string, ctx: Map<string, CellValue>): string {
  const cellValue = ctx.get(token)
  if (cellValue != null) {
    return cellValue.value.value
  } else {
    return token
  }
}

function canParseNumber(s: string): boolean {
  return !isNaN(Number(s))
}

function evalBinary(left: string, right: string, operator: string): string {
  const leftNumber = canParseNumber(left) ? Number(left) : (left ?? '_')
  const rightNumber = canParseNumber(left) ? Number(right) : (right ?? '_')
  if (typeof leftNumber === 'number' && typeof rightNumber === 'number') {
    switch (operator) {
      case '+':
        return String(leftNumber + rightNumber)
      case '-':
        return String(leftNumber - rightNumber)
      case '*':
        return String(leftNumber * rightNumber)
      case '/':
        return String(leftNumber / rightNumber)
      case '%':
        return String(leftNumber % rightNumber)
    }
  } else {
    switch (operator) {
      case '+':
        return leftNumber + '+' + rightNumber
      case '-':
        return leftNumber + '-' + rightNumber
      case '*':
        return leftNumber + '*' + rightNumber
      case '/':
        return leftNumber + '/' + rightNumber
      case '%':
        return leftNumber + '%' + rightNumber
    }
  }
  return 'ERROR'
}

function evalExpr(expr: string, ctx: Map<string, CellValue>): string {
  const tokens = expr.replace(/\s+/, '').split(/([+\-*/%])/)
  let acc: string = ''
  let op: null | string = null
  for (const token of tokens) {
    if (token === '') {
      continue
    }
    if (
      token === '+' ||
      token === '-' ||
      token === '*' ||
      token === '/' ||
      token === '%'
    ) {
      op = token
    } else if (op == null) {
      acc = evalToken(token, ctx)
    } else if (op != null) {
      acc = evalBinary(acc, evalToken(token, ctx), op)
      op = null
    }
  }
  return acc
}

function evalFormula(formula: string, ctx: Map<string, CellValue>): string {
  if (formula.startsWith('=')) {
    return evalExpr(formula.slice(1), ctx)
  } else {
    return formula
  }
}

const pattern = /([A-Z]+)([0-9]+)/g
function extractCellReferences(formula: string): string[] {
  const matches = formula.matchAll(pattern)
  const result: string[] = []
  for (const match of matches) {
    result.push(match[0])
  }
  return result
}

class CellValue {
  readonly value: Signal<string>
  _value: Signal<string> = signal('')
  constructor(
    readonly key: string,
    readonly ctx: Map<string, CellValue>,
    readonly formula: Prop<string> = prop('')
  ) {
    const value = prop('')
    // Timeout is needed because ctx is not fully populated yet
    setTimeout(() => {
      this.formula.on(formula => {
        this._value.dispose()
        const references = extractCellReferences(formula)
          .map(ref => ctx.get(ref)?.value)
          .filter(v => v != null) as Signal<string>[]
        this._value = computed(
          () => evalFormula(formula, this.ctx),
          [...references]
        )
        this._value.feedProp(value)
      })
    }, 0)
    this.value = value
  }
}

export function Cells(): Renderable {
  const columns = Array.from({ length: NUM_COLUMNS }, (_, i) =>
    String.fromCharCode(65 + i)
  )
  const rows = Array.from({ length: NUM_ROWS }, (_, i) => String(i + 1))
  const ctx = new Map<string, CellValue>()
  for (const row of rows) {
    for (const column of columns) {
      const key = getKey(row, column)
      const cellValue = new CellValue(key, ctx)
      if (data[key] != null) {
        cellValue.formula.set(data[key])
      }
      ctx.set(key, cellValue)
    }
  }

  const $editing = prop<string | null>(null)
  return html.div(
    attr.class('max-w-full max-h-[calc(100dvh-98px)] overflow-auto'),
    html.table(
      attr.class('relative'),
      html.thead(
        html.tr(
          attr.class('sticky top-0 z-20'),
          html.th(Header('')),
          ...columns.map(column => html.th(Header(Txt(column))))
        )
      ),
      html.tbody(
        ...rows.map(row =>
          html.tr(
            html.th(attr.class('sticky fix left-0 z-10'), Header(Txt(row))),
            ...columns.map(column => {
              const key = getKey(row, column)
              const cellValue = ctx.get(key)!
              return html.td(
                Cell(
                  When(
                    $editing.map(editing => editing === key),
                    InputText(
                      AutoSelect(),
                      attr.class('w-full min-w-20 h-7'),
                      attr.value(cellValue.formula),
                      on.blur(
                        emit.value(text => {
                          if (text !== cellValue.formula.value) {
                            cellValue.formula.set(text)
                          }
                          $editing.set(null)
                        })
                      ),
                      on.keydown((e: KeyboardEvent) => {
                        if (e.key === 'Enter') {
                          $editing.set(null)
                        }
                      })
                    ),
                    html.div(
                      attr.class(
                        'w-full h-full min-h-7 p-0.5 overflow-hidden whitespace-nowrap'
                      ),
                      on.dblclick(() => {
                        $editing.set(key)
                      }),
                      Txt(cellValue.value)
                    )
                  )
                )
              )
            })
          )
        )
      )
    )
  )
}
