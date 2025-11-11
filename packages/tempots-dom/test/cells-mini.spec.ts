import { describe, expect, it } from 'vitest'
import {
  Attr,
  When,
  attr,
  emitValue,
  html,
  on,
  prop,
  render,
  Signal,
  signal,
  computed,
} from '../src'

const waitForMacroTask = () =>
  new Promise(resolve => setTimeout(resolve, 0))

const waitForMicrotask = () => Promise.resolve()

const referencePattern = /([A-Z]+)([0-9]+)/g

const extractCellReferences = (formula: string): string[] => {
  const matches = formula.matchAll(referencePattern)
  const result: string[] = []
  for (const match of matches) {
    result.push(match[0])
  }
  return result
}

const canParseNumber = (value: string) => !Number.isNaN(Number(value))

const evalBinary = (left: string, right: string, operator: string) => {
  const leftNumber = canParseNumber(left) ? Number(left) : left
  const rightNumber = canParseNumber(right) ? Number(right) : right

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
  }

  switch (operator) {
    case '+':
      return `${leftNumber}+${rightNumber}`
    case '-':
      return `${leftNumber}-${rightNumber}`
    case '*':
      return `${leftNumber}*${rightNumber}`
    case '/':
      return `${leftNumber}/${rightNumber}`
    case '%':
      return `${leftNumber}%${rightNumber}`
  }
  return 'ERROR'
}

const evalToken = (token: string, ctx: Map<string, MiniCellValue>): string => {
  const cellValue = ctx.get(token)
  if (cellValue != null) {
    return cellValue.value.value
  } else {
    return token
  }
}

const evalExpr = (expr: string, ctx: Map<string, MiniCellValue>): string => {
  const tokens = expr.replace(/\s+/, '').split(/([+\-*/%])/)
  let acc = ''
  let op: string | null = null
  for (const token of tokens) {
    if (token === '') continue
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
    } else {
      acc = evalBinary(acc, evalToken(token, ctx), op)
      op = null
    }
  }
  return acc
}

const evalFormula = (formula: string, ctx: Map<string, MiniCellValue>) => {
  if (formula.startsWith('=')) {
    return evalExpr(formula.slice(1), ctx)
  }
  return formula
}

class MiniCellValue {
  readonly value: Signal<string>
  _value: Signal<string> = signal('')

  constructor(
    readonly key: string,
    readonly ctx: Map<string, MiniCellValue>,
    readonly formula = prop('')
  ) {
    const value = prop('')
    setTimeout(() => {
      this.formula.on(formula => {
        this._value.dispose()
        const references = extractCellReferences(formula)
          .map(ref => ctx.get(ref)?.value)
          .filter((v): v is Signal<string> => v != null)
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

const sampleData: Record<string, string> = {
  B6: '22',
  B7: '=B6*1.8+32',
}

const columns = ['A', 'B']
const rows = ['6', '7']

const MiniCells = () => {
  const ctx = new Map<string, MiniCellValue>()
  for (const row of rows) {
    for (const column of columns) {
      const key = `${column}${row}`
      const cellValue = new MiniCellValue(key, ctx)
      if (sampleData[key] != null) {
        cellValue.formula.set(sampleData[key])
      }
      ctx.set(key, cellValue)
    }
  }

  const editing = prop<string | null>(null)

  return html.table(
    html.tbody(
      ...rows.map(row =>
        html.tr(
          ...columns.map(column => {
            const key = `${column}${row}`
            const cellValue = ctx.get(key)!
            return html.td(
              Attr('data-cell', key),
              When(
                editing.map(value => value === key),
                () =>
                  html.input(
                    attr.class('cell-input'),
                    attr.value(cellValue.formula),
                    on.blur(
                      emitValue(text => {
                        if (text !== cellValue.formula.value) {
                          cellValue.formula.set(text)
                        }
                        editing.set(null)
                      })
                    )
                  ),
                () =>
                  html.div(
                    attr.class('cell-display'),
                    on.dblclick(() => editing.set(key)),
                    cellValue.value
                  )
              )
            )
          })
        )
      )
    )
  )
}

const getCell = (container: HTMLElement, key: string) =>
  container.querySelector(`[data-cell="${key}"]`) as HTMLTableCellElement

const getDisplayValue = (cell: HTMLTableCellElement) =>
  cell.querySelector('.cell-display')?.textContent?.trim()

describe('MiniCells demo regression', () => {
  it('updates dependent cell asynchronously when source changes through UI', async () => {
    const host = document.createElement('div')
    document.body.append(host)

    const clear = render(MiniCells(), host)

    await waitForMacroTask()
    await waitForMicrotask()
    await waitForMacroTask()
    await waitForMicrotask()

    const b6Cell = getCell(host, 'B6')
    const b7Cell = getCell(host, 'B7')
    expect(getDisplayValue(b6Cell)).toBe('22')
    expect(getDisplayValue(b7Cell)).toBe('71.6')

    const display = b6Cell.querySelector('.cell-display') as HTMLDivElement
    display.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }))
    await waitForMicrotask()

    const input = b6Cell.querySelector(
      'input.cell-input'
    ) as HTMLInputElement
    input.value = '220'
    input.dispatchEvent(new Event('blur', { bubbles: true }))

    await waitForMacroTask()
    await waitForMicrotask()

    expect(getDisplayValue(b6Cell)).toBe('220')
    expect(getDisplayValue(b7Cell)).toBe('428')

    clear()
    host.remove()
  })
})
