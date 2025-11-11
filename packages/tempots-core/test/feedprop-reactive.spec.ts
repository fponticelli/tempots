import { describe, it, expect } from 'vitest'
import {
  prop,
  computed,
  DisposalScope,
  withScope,
  signal,
  Signal,
} from '../src/index.js'

describe('feedProp reactive updates', () => {
  it('should reactively update when computed source changes', async () => {
    const scope = new DisposalScope()

    const updateLog: string[] = []

    await withScope(scope, async () => {
      const base = prop('22')
      const target = prop('')

      const computed1 = computed(() => {
        const val = parseFloat(base.value)
        return String(val * 2)
      }, [base])

      computed1.feedProp(target)

      // Track updates to target AFTER feedProp
      target.on(
        value => {
          updateLog.push(`target updated to: ${value}`)
        },
        { skipInitial: true }
      )

      // Initial value should be set
      expect(target.value).toBe('44')
      expect(updateLog).toEqual([])

      // Change the base value
      base.set('220')

      // Synchronously, target should still have old value (computed notifies async)
      expect(target.value).toBe('44')

      // Wait for async notification
      await new Promise(resolve => setTimeout(resolve, 10))

      // Now target should have new value
      expect(target.value).toBe('440')
      expect(updateLog).toEqual(['target updated to: 440'])
    })

    scope.dispose()
  })

  it('should work with cells demo pattern - B6 and B7', async () => {
    const scope = new DisposalScope()

    const updateLog: string[] = []

    await withScope(scope, async () => {
      // Simulate B6 cell
      const B6_formula = prop('22')
      const B6_value = prop('')
      let B6_computed = computed(() => B6_formula.value, [B6_formula])
      B6_computed.feedProp(B6_value)

      // Track B6 updates
      B6_value.on(value => {
        updateLog.push(`B6: ${value}`)
      })

      // Simulate B7 cell with formula =B6*1.8+32
      const B7_formula = prop('=B6*1.8+32')
      const B7_value = prop('')
      let B7_computed = computed(() => {
        const b6 = parseFloat(B6_value.value)
        return String(b6 * 1.8 + 32)
      }, [B6_value])
      B7_computed.feedProp(B7_value)

      // Track B7 updates
      B7_value.on(value => {
        updateLog.push(`B7: ${value}`)
      })

      // Initial values
      expect(B6_value.value).toBe('22')
      expect(B7_value.value).toBe('71.6')
      expect(updateLog).toEqual(['B6: 22', 'B7: 71.6'])

      // Change B6 to 220
      B6_formula.set('220')

      // Synchronously, B6 should still be 22 (computed notifies async)
      expect(B6_value.value).toBe('22')
      expect(B7_value.value).toBe('71.6')

      // Wait for async notifications
      await new Promise(resolve => setTimeout(resolve, 10))

      // Now both should be updated
      expect(B6_value.value).toBe('220')
      expect(B7_value.value).toBe('428')
      expect(updateLog).toEqual(['B6: 22', 'B7: 71.6', 'B6: 220', 'B7: 428'])
    })

    scope.dispose()
  })

  it('should work with cells demo pattern - recreating computed on formula change', async () => {
    const scope = new DisposalScope()

    const updateLog: string[] = []

    await withScope(scope, async () => {
      // Simulate B6 cell
      const B6_formula = prop('22')
      const B6_value = prop('')
      let B6_computed = computed(() => B6_formula.value, [B6_formula])
      B6_computed.feedProp(B6_value)

      // Track B6 updates
      B6_value.on(value => {
        updateLog.push(`B6: ${value}`)
      })

      // Simulate B7 cell with formula =B6*1.8+32
      const B7_formula = prop('=B6*1.8+32')
      const B7_value = prop('')
      let B7_computed = computed(() => {
        const b6 = parseFloat(B6_value.value)
        return String(b6 * 1.8 + 32)
      }, [B6_value])
      B7_computed.feedProp(B7_value)

      // Track B7 updates
      B7_value.on(value => {
        updateLog.push(`B7: ${value}`)
      })

      // Initial values
      expect(B6_value.value).toBe('22')
      expect(B7_value.value).toBe('71.6')

      // Change B6 to 220
      B6_formula.set('220')
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(B6_value.value).toBe('220')
      expect(B7_value.value).toBe('428')

      // Now change B7's formula to =B6*2 (simulating user editing the formula)
      B7_computed.dispose()
      B7_computed = computed(() => {
        const b6 = parseFloat(B6_value.value)
        return String(b6 * 2)
      }, [B6_value])
      B7_computed.feedProp(B7_value)

      // Should immediately update to new formula result
      expect(B7_value.value).toBe('440')

      // Change B6 again
      B6_formula.set('100')
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(B6_value.value).toBe('100')
      expect(B7_value.value).toBe('200')

      expect(updateLog).toEqual([
        'B6: 22',
        'B7: 71.6',
        'B6: 220',
        'B7: 428',
        'B7: 440', // New formula applied
        'B6: 100',
        'B7: 200',
      ])
    })

    scope.dispose()
  })

  it('should not leak listeners when computed is recreated', async () => {
    const scope = new DisposalScope()

    let notificationCount = 0

    await withScope(scope, async () => {
      const source = prop('initial')
      const target = prop('')

      // Create first computed
      let comp = computed(() => source.value.toUpperCase(), [source])
      comp.feedProp(target)

      // Track notifications AFTER feedProp
      target.on(
        () => {
          notificationCount++
        },
        { skipInitial: true }
      )

      expect(notificationCount).toBe(0) // No notifications yet

      // Change source
      source.set('changed')
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(notificationCount).toBe(1)

      // Dispose and recreate computed (like cells demo does on formula change)
      comp.dispose()
      comp = computed(() => source.value.toLowerCase(), [source])
      comp.feedProp(target)

      expect(notificationCount).toBe(2) // feedProp calls listener

      // Change source again
      source.set('final')
      await new Promise(resolve => setTimeout(resolve, 10))

      // Should only get ONE more notification, not two
      expect(notificationCount).toBe(3)

      comp.dispose()
    })

    scope.dispose()
  })

  it('does not drop other listeners when one clears', () => {
    const base = prop('10')
    const target = prop('')

    const comp = computed(() => {
      const value = Number(base.value)
      return String(value * 2)
    }, [base])

    comp.feedProp(target)

    const getListenerNames = () =>
      (
        (base as unknown as {
          _onValueListeners: Array<(...args: unknown[]) => unknown>
        })?._onValueListeners ?? []
      ).map(listener => listener.name || 'anonymous')

    expect(getListenerNames()).toContain('setDirty')

    const clearDisplay = base.on(() => {}, { skipInitial: true })

    expect(getListenerNames()).toEqual(['setDirty', 'anonymous'])

    clearDisplay()

    expect(getListenerNames()).toEqual(['setDirty'])
  })

  it('should update dependent cells when values change (cells demo regression)', async () => {
    const scope = new DisposalScope()

    await withScope(scope, async () => {
      const ctx = new Map<string, DemoCellValue>()

      const B6 = new DemoCellValue('B6', ctx)
      const B7 = new DemoCellValue('B7', ctx)
      ctx.set('B6', B6)
      ctx.set('B7', B7)

      // Seed initial formulas (happens before listeners attach in the real demo)
      B6.formula.set('22')
      B7.formula.set('=B6*1.8+32')

      // Wait for the async formula listener wiring
      await waitForMacroTask()
      await waitForMicrotask()

      expect(B6.value.value).toBe('22')
      expect(B7.value.value).toBe('71.6')

      // Update B6 and expect B7 to follow asynchronously
      B6.formula.set('220')

      await waitForMacroTask()
      await waitForMicrotask()

      expect(B6.value.value).toBe('220')
      expect(B7.value.value).toBe('428')
    })

    scope.dispose()
  })

  it('should work with cells demo pattern - exact pattern with formula.on()', async () => {
    const scope = new DisposalScope()

    const updateLog: string[] = []

    await withScope(scope, async () => {
      // Simulate B6 cell - EXACT pattern from cells.ts
      const B6_formula = prop('22')
      const B6_value = prop('')
      let B6_computed = signal('')

      // This is the EXACT pattern from CellValue constructor - with setTimeout!
      setTimeout(() => {
        B6_formula.on(formula => {
          B6_computed.dispose()
          B6_computed = computed(() => formula, [])
          B6_computed.feedProp(B6_value)
        })
      }, 0)

      // Simulate B7 cell - EXACT pattern from cells.ts
      const B7_formula = prop('=B6*1.8+32')
      const B7_value = prop('')
      let B7_computed = signal('')

      setTimeout(() => {
        B7_formula.on(formula => {
          B7_computed.dispose()
          B7_computed = computed(() => {
            const b6 = parseFloat(B6_value.value)
            return String(b6 * 1.8 + 32)
          }, [B6_value])
          B7_computed.feedProp(B7_value)
        })
      }, 0)

      // Wait for initial formula.on() to complete
      await new Promise(resolve => setTimeout(resolve, 10))

      // Track updates AFTER initialization
      B6_value.on(
        value => {
          updateLog.push(`B6: ${value}`)
        },
        { skipInitial: true }
      )

      B7_value.on(
        value => {
          updateLog.push(`B7: ${value}`)
        },
        { skipInitial: true }
      )

      // Initial values
      expect(B6_value.value).toBe('22')
      expect(B7_value.value).toBe('71.6')

      // Change B6 formula to 220 (this is what happens when user edits the cell)
      B6_formula.set('220')

      // Wait for async notifications
      await new Promise(resolve => setTimeout(resolve, 20))

      // B6 should be updated
      expect(B6_value.value).toBe('220')

      // B7 should also be updated because it depends on B6_value
      expect(B7_value.value).toBe('428')
      expect(updateLog).toEqual(['B6: 220', 'B7: 428'])
    })

    scope.dispose()
  })
})

const waitForMacroTask = () => new Promise(resolve => setTimeout(resolve, 0))
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

const evalToken = (token: string, ctx: Map<string, DemoCellValue>): string => {
  const cellValue = ctx.get(token)
  if (cellValue != null) {
    return cellValue.value.value
  } else {
    return token
  }
}

const evalExpr = (expr: string, ctx: Map<string, DemoCellValue>): string => {
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

const evalFormula = (formula: string, ctx: Map<string, DemoCellValue>) => {
  if (formula.startsWith('=')) {
    return evalExpr(formula.slice(1), ctx)
  }
  return formula
}

class DemoCellValue {
  readonly value: Signal<string>
  _value: Signal<string> = signal('')

  constructor(
    readonly key: string,
    readonly ctx: Map<string, DemoCellValue>,
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
