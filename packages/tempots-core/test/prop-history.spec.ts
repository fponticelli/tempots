import { describe, expect, test } from 'vitest'
import { prop, propHistory, Signal, DisposalScope, withScope } from '../src'

describe('propHistory', () => {
  test('basic undo/redo', () => {
    const p = prop(0)
    const h = propHistory(p)

    p.set(1)
    p.set(2)
    p.set(3)

    expect(p.value).toBe(3)

    h.undo()
    expect(p.value).toBe(2)

    h.undo()
    expect(p.value).toBe(1)

    h.redo()
    expect(p.value).toBe(2)

    h.redo()
    expect(p.value).toBe(3)

    h.dispose()
  })

  test('undo past beginning is a no-op', () => {
    const p = prop(0)
    const h = propHistory(p)

    p.set(1)
    h.undo()
    expect(p.value).toBe(0)

    h.undo()
    expect(p.value).toBe(0)
    expect(h.canUndo.value).toBe(false)

    h.dispose()
  })

  test('redo past end is a no-op', () => {
    const p = prop(0)
    const h = propHistory(p)

    p.set(1)
    h.redo()
    expect(p.value).toBe(1)
    expect(h.canRedo.value).toBe(false)

    h.dispose()
  })

  test('new change clears redo stack', () => {
    const p = prop(0)
    const h = propHistory(p)

    p.set(1)
    p.set(2)
    p.set(3)

    h.undo()
    h.undo()
    expect(p.value).toBe(1)

    // Set a new value — should clear redo
    p.set(10)
    expect(h.canRedo.value).toBe(false)

    h.redo()
    expect(p.value).toBe(10) // no change

    h.dispose()
  })

  test('canUndo/canRedo reactivity', () => {
    const p = prop(0)
    const h = propHistory(p)

    expect(h.canUndo.value).toBe(false)
    expect(h.canRedo.value).toBe(false)

    p.set(1)
    expect(h.canUndo.value).toBe(true)
    expect(h.canRedo.value).toBe(false)

    h.undo()
    expect(h.canUndo.value).toBe(false)
    expect(h.canRedo.value).toBe(true)

    h.redo()
    expect(h.canUndo.value).toBe(true)
    expect(h.canRedo.value).toBe(false)

    h.dispose()
  })

  test('entries/index signals reflect history state', () => {
    const p = prop('a')
    const h = propHistory(p)

    expect(h.entries.value).toEqual(['a'])
    expect(h.index.value).toBe(0)

    p.set('b')
    p.set('c')
    expect(h.entries.value).toEqual(['a', 'b', 'c'])
    expect(h.index.value).toBe(2)

    h.undo()
    expect(h.index.value).toBe(1)
    expect(h.entries.value).toEqual(['a', 'b', 'c'])

    h.dispose()
  })

  test('go(index) jumps to specific history point', () => {
    const p = prop(0)
    const h = propHistory(p)

    p.set(1)
    p.set(2)
    p.set(3)

    h.go(0)
    expect(p.value).toBe(0)
    expect(h.index.value).toBe(0)

    h.go(2)
    expect(p.value).toBe(2)
    expect(h.index.value).toBe(2)

    h.dispose()
  })

  test('go() out of bounds is a no-op', () => {
    const p = prop(0)
    const h = propHistory(p)

    p.set(1)
    p.set(2)

    h.go(-1)
    expect(p.value).toBe(2)

    h.go(10)
    expect(p.value).toBe(2)

    // Same index is also a no-op
    h.go(h.index.value)
    expect(p.value).toBe(2)

    h.dispose()
  })

  test('maxSize trims history when exceeded', () => {
    const p = prop(0)
    const h = propHistory(p, { maxSize: 3 })

    p.set(1)
    p.set(2)
    p.set(3)
    p.set(4)

    // maxSize=3 means we keep at most 3 entries
    expect(h.entries.value).toEqual([2, 3, 4])
    expect(h.index.value).toBe(2)

    h.undo()
    h.undo()
    expect(p.value).toBe(2)

    h.dispose()
  })

  test('maxSize 0 means unlimited', () => {
    const p = prop(0)
    const h = propHistory(p, { maxSize: 0 })

    for (let i = 1; i <= 200; i++) {
      p.set(i)
    }
    // 201 entries: initial 0 + 200 sets
    expect(h.entries.value.length).toBe(201)

    h.dispose()
  })

  test('filter prevents recording certain changes', () => {
    const p = prop(0)
    const h = propHistory(p, {
      filter: (value, prev) => Math.abs(value - prev) >= 5,
    })

    p.set(1) // filtered (diff < 5)
    p.set(2) // filtered
    p.set(10) // recorded (diff from 0 initial >= 5)

    // Only initial + the filtered-in change
    expect(h.entries.value).toEqual([0, 10])

    h.dispose()
  })

  test('pause/resume prevents recording', () => {
    const p = prop(0)
    const h = propHistory(p)

    p.set(1)

    const resume = h.pause()
    p.set(2)
    p.set(3)
    p.set(4)
    resume()

    // Only initial and 1 were recorded
    expect(h.entries.value).toEqual([0, 1])
    // The signal itself has the latest value
    expect(p.value).toBe(4)

    // New changes after resume are recorded
    p.set(5)
    expect(h.entries.value).toEqual([0, 1, 5])

    h.dispose()
  })

  test('transaction groups multiple changes into one undo step', () => {
    const p = prop(0)
    const h = propHistory(p)

    p.set(1)
    p.set(2)

    h.transaction(() => {
      p.set(10)
      p.set(20)
      p.set(30)
    })

    expect(h.entries.value).toEqual([0, 1, 2, 30])

    h.undo()
    expect(p.value).toBe(2)

    h.redo()
    expect(p.value).toBe(30)

    h.dispose()
  })

  test('transaction no-op when value unchanged', () => {
    const p = prop(0)
    const h = propHistory(p)

    p.set(1)

    h.transaction(() => {
      p.set(5)
      p.set(1) // back to original
    })

    // No new entry since net change is 0
    expect(h.entries.value).toEqual([0, 1])

    h.dispose()
  })

  test('transaction respects filter', () => {
    const p = prop(0)
    const h = propHistory(p, {
      filter: (value, prev) => Math.abs(value - prev) >= 10,
    })

    h.transaction(() => {
      p.set(3)
    })

    // Change of 3 is below threshold, should not record
    expect(h.entries.value).toEqual([0])

    h.transaction(() => {
      p.set(15)
    })

    // Change of 15 from 0 is above threshold
    expect(h.entries.value).toEqual([0, 15])

    h.dispose()
  })

  test('Signal + setter overload', () => {
    const s = new Signal(0, (a, b) => a === b)
    const values: number[] = []
    const mySetter = (v: number) => {
      values.push(v)
      ;(s as any)._setAndNotify(v)
    }

    const h = propHistory(s, mySetter)

    h.set(1)
    h.set(2)
    h.set(3)

    expect(s.value).toBe(3)
    expect(values).toEqual([1, 2, 3])

    h.undo()
    expect(s.value).toBe(2)
    expect(values).toContain(2)

    h.redo()
    expect(s.value).toBe(3)

    h.dispose()
  })

  test('set() goes through history recording', () => {
    const p = prop(0)
    const h = propHistory(p)

    h.set(1)
    h.set(2)

    expect(h.entries.value).toEqual([0, 1, 2])

    h.undo()
    expect(p.value).toBe(1)

    h.dispose()
  })

  test('clear resets history', () => {
    const p = prop(0)
    const h = propHistory(p)

    p.set(1)
    p.set(2)
    p.set(3)

    h.clear()
    expect(h.entries.value).toEqual([3])
    expect(h.index.value).toBe(0)
    expect(h.canUndo.value).toBe(false)
    expect(h.canRedo.value).toBe(false)
    expect(p.value).toBe(3)

    h.dispose()
  })

  test('clear with resetValue', () => {
    const p = prop(0)
    const h = propHistory(p)

    p.set(1)
    p.set(2)

    h.clear(42)
    expect(p.value).toBe(42)
    expect(h.entries.value).toEqual([42])
    expect(h.index.value).toBe(0)

    h.dispose()
  })

  test('dispose cleans up internal signals and listener', () => {
    const p = prop(0)
    const h = propHistory(p)

    p.set(1)
    h.dispose()

    // After dispose, setting new values should not affect history
    p.set(2)
    p.set(3)

    // Internal signals are disposed
    expect(h.canUndo.isDisposed()).toBe(true)
    expect(h.canRedo.isDisposed()).toBe(true)
    expect(h.entries.isDisposed()).toBe(true)
    expect(h.index.isDisposed()).toBe(true)

    // Source signal is NOT disposed
    expect(p.isDisposed()).toBe(false)
    expect(p.value).toBe(3)
  })

  test('DisposalScope integration — auto-cleanup in scoped context', () => {
    const p = prop(0)
    const scope = new DisposalScope()

    let history: ReturnType<typeof propHistory>
    withScope(scope, () => {
      history = propHistory(p)
    })

    p.set(1)
    expect(history!.canUndo.value).toBe(true)

    scope.dispose()

    // After scope disposal, internal signals should be disposed
    expect(history!.canUndo.isDisposed()).toBe(true)
  })

  test('equal values do not create history entries', () => {
    const p = prop(0)
    const h = propHistory(p)

    p.set(0) // same value — Prop equality prevents notification
    p.set(0)
    p.set(0)

    expect(h.entries.value).toEqual([0])

    h.dispose()
  })

  test('signal property returns the source signal', () => {
    const p = prop(0)
    const h = propHistory(p)

    expect(h.signal).toBe(p)

    h.dispose()
  })

  test('maxSize trims during transaction', () => {
    const p = prop(0)
    const h = propHistory(p, { maxSize: 3 })

    p.set(1)
    p.set(2)

    h.transaction(() => {
      p.set(10)
      p.set(20)
    })

    // entries: [0, 1, 2, 20] trimmed to [1, 2, 20]
    expect(h.entries.value).toEqual([1, 2, 20])

    h.dispose()
  })

  test('undo after go() works correctly', () => {
    const p = prop(0)
    const h = propHistory(p)

    p.set(1)
    p.set(2)
    p.set(3)

    h.go(1)
    expect(p.value).toBe(1)

    h.undo()
    expect(p.value).toBe(0)

    h.redo()
    expect(p.value).toBe(1)

    h.dispose()
  })
})
