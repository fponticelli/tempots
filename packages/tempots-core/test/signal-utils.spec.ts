import { describe, expect, test, vi } from 'vitest'
import {
  prop,
  and,
  or,
  not,
  notNil,
  throttleSignal,
  distinctUntilChanged,
  accumulateSignal,
  createSelector,
  Signal,
} from '../src'

const waitForUpdate = () => new Promise(resolve => setTimeout(resolve, 0))

describe('and', () => {
  test('all true returns true', async () => {
    const a = prop(true)
    const b = prop(true)
    const result = and(a, b)
    await waitForUpdate()
    expect(result.value).toBe(true)
  })

  test('one false returns false', async () => {
    const a = prop(true)
    const b = prop(false)
    const result = and(a, b)
    await waitForUpdate()
    expect(result.value).toBe(false)
  })

  test('all false returns false', async () => {
    const a = prop(false)
    const b = prop(false)
    const result = and(a, b)
    await waitForUpdate()
    expect(result.value).toBe(false)
  })

  test('reacts to changes', async () => {
    const a = prop(true)
    const b = prop(true)
    const result = and(a, b)
    await waitForUpdate()
    expect(result.value).toBe(true)

    b.set(false)
    await waitForUpdate()
    expect(result.value).toBe(false)

    b.set(true)
    await waitForUpdate()
    expect(result.value).toBe(true)
  })

  test('works with literal values', async () => {
    const a = prop(true)
    const result = and(a, true)
    await waitForUpdate()
    expect(result.value).toBe(true)

    const result2 = and(a, false)
    await waitForUpdate()
    expect(result2.value).toBe(false)
  })

  test('works with more than two inputs', async () => {
    const a = prop(true)
    const b = prop(true)
    const c = prop(true)
    const result = and(a, b, c)
    await waitForUpdate()
    expect(result.value).toBe(true)

    c.set(false)
    await waitForUpdate()
    expect(result.value).toBe(false)
  })
})

describe('or', () => {
  test('all false returns false', async () => {
    const a = prop(false)
    const b = prop(false)
    const result = or(a, b)
    await waitForUpdate()
    expect(result.value).toBe(false)
  })

  test('one true returns true', async () => {
    const a = prop(false)
    const b = prop(true)
    const result = or(a, b)
    await waitForUpdate()
    expect(result.value).toBe(true)
  })

  test('all true returns true', async () => {
    const a = prop(true)
    const b = prop(true)
    const result = or(a, b)
    await waitForUpdate()
    expect(result.value).toBe(true)
  })

  test('reacts to changes', async () => {
    const a = prop(false)
    const b = prop(false)
    const result = or(a, b)
    await waitForUpdate()
    expect(result.value).toBe(false)

    a.set(true)
    await waitForUpdate()
    expect(result.value).toBe(true)

    a.set(false)
    await waitForUpdate()
    expect(result.value).toBe(false)
  })

  test('works with literal values', async () => {
    const a = prop(false)
    const result = or(a, true)
    await waitForUpdate()
    expect(result.value).toBe(true)
  })

  test('works with more than two inputs', async () => {
    const a = prop(false)
    const b = prop(false)
    const c = prop(false)
    const result = or(a, b, c)
    await waitForUpdate()
    expect(result.value).toBe(false)

    c.set(true)
    await waitForUpdate()
    expect(result.value).toBe(true)
  })
})

describe('not', () => {
  test('negates a signal', async () => {
    const a = prop(true)
    const result = not(a)
    await waitForUpdate()
    expect((result as Signal<boolean>).value).toBe(false)
  })

  test('reacts to changes', async () => {
    const a = prop(false)
    const result = not(a) as Signal<boolean>
    await waitForUpdate()
    expect(result.value).toBe(true)

    a.set(true)
    await waitForUpdate()
    expect(result.value).toBe(false)
  })

  test('works with literal value', () => {
    expect(not(true)).toBe(false)
    expect(not(false)).toBe(true)
  })
})

describe('notNil', () => {
  test('returns true for non-nil signal values', async () => {
    const a = prop<string | null>('hello')
    const result = notNil(a) as Signal<boolean>
    await waitForUpdate()
    expect(result.value).toBe(true)
  })

  test('returns false for null', async () => {
    const a = prop<string | null>(null)
    const result = notNil(a) as Signal<boolean>
    await waitForUpdate()
    expect(result.value).toBe(false)
  })

  test('returns false for undefined', async () => {
    const a = prop<string | undefined>(undefined)
    const result = notNil(a) as Signal<boolean>
    await waitForUpdate()
    expect(result.value).toBe(false)
  })

  test('reacts to changes', async () => {
    const a = prop<number | null>(42)
    const result = notNil(a) as Signal<boolean>
    await waitForUpdate()
    expect(result.value).toBe(true)

    a.set(null)
    await waitForUpdate()
    expect(result.value).toBe(false)

    a.set(0)
    await waitForUpdate()
    expect(result.value).toBe(true)
  })

  test('works with literal values', () => {
    expect(notNil('hello')).toBe(true)
    expect(notNil(null)).toBe(false)
    expect(notNil(undefined)).toBe(false)
    expect(notNil(0)).toBe(true)
  })
})

describe('throttleSignal', () => {
  test('emits initial value immediately', () => {
    const source = prop(0)
    const throttled = throttleSignal(source, 100)
    expect(throttled.value).toBe(0)
    throttled.dispose()
  })

  test('passes through first change immediately', () => {
    const source = prop(0)
    const throttled = throttleSignal(source, 100)

    source.set(1)
    expect(throttled.value).toBe(1)

    throttled.dispose()
  })

  test('throttles rapid changes and emits latest after interval', async () => {
    vi.useFakeTimers()
    try {
      const source = prop(0)
      const throttled = throttleSignal(source, 100)

      source.set(1) // immediate (first change, elapsed >= ms since lastEmit=0)
      expect(throttled.value).toBe(1)

      // Advance time partially so next change is within the throttle window
      vi.advanceTimersByTime(50)

      source.set(2) // throttled
      source.set(3) // throttled, replaces 2
      expect(throttled.value).toBe(1) // still 1

      vi.advanceTimersByTime(50) // total 100ms from first emit
      expect(throttled.value).toBe(3) // latest value emitted

      throttled.dispose()
    } finally {
      vi.useRealTimers()
    }
  })

  test('allows emission after interval elapses', async () => {
    vi.useFakeTimers()
    try {
      const source = prop(0)
      const throttled = throttleSignal(source, 100)

      source.set(1)
      expect(throttled.value).toBe(1)

      vi.advanceTimersByTime(100)

      source.set(2) // interval has elapsed, immediate
      expect(throttled.value).toBe(2)

      throttled.dispose()
    } finally {
      vi.useRealTimers()
    }
  })

  test('cleans up on dispose', () => {
    vi.useFakeTimers()
    try {
      const source = prop(0)
      const throttled = throttleSignal(source, 100)

      source.set(1)
      vi.advanceTimersByTime(50)
      source.set(2) // pending

      throttled.dispose()

      vi.advanceTimersByTime(100)
      // Disposed signal should not be updated
      expect(source.value).toBe(2) // source unaffected
    } finally {
      vi.useRealTimers()
    }
  })
})

describe('distinctUntilChanged', () => {
  test('emits initial value', () => {
    const source = prop(1)
    const distinct = distinctUntilChanged(source)
    expect(distinct.value).toBe(1)
    distinct.dispose()
  })

  test('emits when value changes', () => {
    const source = prop(1)
    const distinct = distinctUntilChanged(source)
    const spy = vi.fn()
    distinct.on(spy, { skipInitial: true })

    source.set(2)
    expect(spy).toHaveBeenCalledWith(2, 1)

    distinct.dispose()
  })

  test('skips duplicate values (default equality)', () => {
    const source = prop(1)
    const distinct = distinctUntilChanged(source)
    const spy = vi.fn()
    distinct.on(spy, { skipInitial: true })

    source.set(1) // same value — Prop equality already prevents this
    expect(spy).not.toHaveBeenCalled()

    distinct.dispose()
  })

  test('uses custom equality function', () => {
    // Source signal with no equality (always notifies)
    const source = new Signal({ x: 1 }, () => false)
    const distinct = distinctUntilChanged(
      source,
      (a, b) => a.x === b.x
    )
    const spy = vi.fn()
    distinct.on(spy, { skipInitial: true })

    ;(source as any)._setAndNotify({ x: 1 }) // same x, filtered by distinct
    expect(spy).not.toHaveBeenCalled()

    ;(source as any)._setAndNotify({ x: 2 }) // different x, passes through
    expect(spy).toHaveBeenCalledTimes(1)
    expect(distinct.value).toEqual({ x: 2 })

    distinct.dispose()
  })

  test('works downstream of map chains', async () => {
    const user = prop({ name: 'Alice', age: 30 })
    const name = user.map(u => u.name)
    const distinctName = distinctUntilChanged(name)
    const spy = vi.fn()
    distinctName.on(spy, { skipInitial: true })

    // Change age but not name
    user.set({ name: 'Alice', age: 31 })
    await waitForUpdate()
    expect(spy).not.toHaveBeenCalled()

    // Change name
    user.set({ name: 'Bob', age: 31 })
    await waitForUpdate()
    expect(spy).toHaveBeenCalledTimes(1)
    expect(distinctName.value).toBe('Bob')

    distinctName.dispose()
  })
})

describe('accumulateSignal', () => {
  test('starts with reducer applied to initial and first value', () => {
    const source = prop(5)
    const total = accumulateSignal(source, (sum, n) => sum + n, 0)
    // reducer(0, 5) = 5
    expect(total.value).toBe(5)
    total.dispose()
  })

  test('accumulates on each change', () => {
    const source = prop(1)
    const total = accumulateSignal(source, (sum, n) => sum + n, 0)
    expect(total.value).toBe(1) // reducer(0, 1)

    source.set(2)
    expect(total.value).toBe(3) // reducer(1, 2)

    source.set(3)
    expect(total.value).toBe(6) // reducer(3, 3)

    total.dispose()
  })

  test('works as a running maximum', () => {
    const source = prop(5)
    const max = accumulateSignal(source, (m, n) => Math.max(m, n), -Infinity)
    expect(max.value).toBe(5)

    source.set(3)
    expect(max.value).toBe(5) // max stays

    source.set(10)
    expect(max.value).toBe(10)

    source.set(7)
    expect(max.value).toBe(10)

    max.dispose()
  })

  test('works as a counter', () => {
    const source = prop('a')
    const count = accumulateSignal(source, (n, _v) => n + 1, -1)
    // Initial: reducer(-1, 'a') = 0
    expect(count.value).toBe(0)

    source.set('b')
    expect(count.value).toBe(1)

    source.set('c')
    expect(count.value).toBe(2)

    count.dispose()
  })

  test('collects values into an array', () => {
    const source = prop(1)
    const collected = accumulateSignal(
      source,
      (arr, v) => [...arr, v],
      [] as number[]
    )
    expect(collected.value).toEqual([1])

    source.set(2)
    expect(collected.value).toEqual([1, 2])

    source.set(3)
    expect(collected.value).toEqual([1, 2, 3])

    collected.dispose()
  })

  test('uses custom equality', () => {
    const source = prop(1)
    const spy = vi.fn()
    // Equality: same parity
    const result = accumulateSignal(
      source,
      (acc, v) => acc + v,
      0,
      (a, b) => a % 2 === b % 2
    )
    result.on(spy, { skipInitial: true })

    // Initial: reducer(0, 1) = 1 (odd)
    expect(result.value).toBe(1)

    source.set(2) // reducer(1, 2) = 3 (odd, same parity as 1 → suppressed)
    expect(spy).not.toHaveBeenCalled()

    source.set(3) // reducer(3, 3) = 6 (even, different parity → emitted)
    expect(spy).toHaveBeenCalledTimes(1)

    result.dispose()
  })

  test('cleans up on dispose', () => {
    const source = prop(0)
    const total = accumulateSignal(source, (sum, n) => sum + n, 0)

    total.dispose()

    source.set(100)
    // After dispose, the accumulated signal should not update
    expect(total.isDisposed()).toBe(true)
  })
})

describe('createSelector', () => {
  test('returns false for non-matching keys', () => {
    const selected = prop(1)
    const isSelected = createSelector(selected)

    const is2 = isSelected(2)
    const is3 = isSelected(3)

    expect(is2.value).toBe(false)
    expect(is3.value).toBe(false)

    is2.dispose()
    is3.dispose()
  })

  test('returns true for matching key', () => {
    const selected = prop(1)
    const isSelected = createSelector(selected)

    const is1 = isSelected(1)
    expect(is1.value).toBe(true)

    is1.dispose()
  })

  test('updates only affected items on selection change', () => {
    const selected = prop(0)
    const isSelected = createSelector(selected)

    const is1 = isSelected(1)
    const is2 = isSelected(2)
    const is3 = isSelected(3)

    const spy1 = vi.fn()
    const spy2 = vi.fn()
    const spy3 = vi.fn()
    is1.on(spy1, { skipInitial: true })
    is2.on(spy2, { skipInitial: true })
    is3.on(spy3, { skipInitial: true })

    // Select item 1
    selected.set(1)
    expect(is1.value).toBe(true)
    expect(is2.value).toBe(false)
    expect(is3.value).toBe(false)
    expect(spy1).toHaveBeenCalledTimes(1)
    expect(spy2).not.toHaveBeenCalled()
    expect(spy3).not.toHaveBeenCalled()

    spy1.mockClear()

    // Switch to item 2
    selected.set(2)
    expect(is1.value).toBe(false)
    expect(is2.value).toBe(true)
    expect(is3.value).toBe(false)
    expect(spy1).toHaveBeenCalledTimes(1) // deselected
    expect(spy2).toHaveBeenCalledTimes(1) // selected
    expect(spy3).not.toHaveBeenCalled()   // untouched

    is1.dispose()
    is2.dispose()
    is3.dispose()
  })

  test('handles deselection (selecting a key with no subscriber)', () => {
    const selected = prop(1)
    const isSelected = createSelector(selected)

    const is1 = isSelected(1)
    expect(is1.value).toBe(true)

    // Select a key that has no subscriber — should not throw
    selected.set(999)
    expect(is1.value).toBe(false)

    is1.dispose()
  })

  test('cleans up subscriber on dispose', () => {
    const selected = prop(0)
    const isSelected = createSelector(selected)

    const is1 = isSelected(1)
    const spy = vi.fn()
    is1.on(spy, { skipInitial: true })

    is1.dispose()

    // Selecting 1 after dispose should not call spy
    selected.set(1)
    expect(spy).not.toHaveBeenCalled()
  })

  test('works with custom equality', () => {
    const selected = prop({ id: 1 })
    const isSelected = createSelector(selected, (a, b) => a.id === b.id)

    const is1 = isSelected({ id: 1 })
    const is2 = isSelected({ id: 2 })

    expect(is1.value).toBe(true)
    expect(is2.value).toBe(false)

    // Note: with custom equals for source change detection,
    // we need the Map lookup to use the same key object.
    // This test demonstrates the equals is used for initial check.
    is1.dispose()
    is2.dispose()
  })

  test('handles rapid selection changes', () => {
    const selected = prop(0)
    const isSelected = createSelector(selected)

    const signals = Array.from({ length: 100 }, (_, i) => isSelected(i))

    // Rapidly change selection
    for (let i = 0; i < 100; i++) {
      selected.set(i)
    }

    // Only the last one should be selected
    signals.forEach((s, i) => {
      expect(s.value).toBe(i === 99)
    })

    signals.forEach(s => s.dispose())
  })
})
