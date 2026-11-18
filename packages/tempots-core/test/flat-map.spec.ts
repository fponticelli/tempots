import { expect, test, vi } from 'vitest'
import { prop } from '../src'

test('flatMap follows the selected signal and detaches from the previous one', async () => {
  const selection = prop(true)
  const first = prop(1)
  const second = prop(10)
  const select = vi.fn(value => (value ? first : second))
  const flattened = selection.flatMap(select)
  const doubled = flattened.map(value => value * 2)
  const listener = vi.fn()
  flattened.on(listener)

  first.set(2)
  await Promise.resolve()
  expect(listener.mock.calls).toEqual([[1, undefined], [2, 1]])
  expect(select).toHaveBeenCalledTimes(1)

  selection.set(false)
  expect(doubled.value).toBe(20)
  first.set(3)
  expect(first.hasListeners()).toBe(false)
  second.set(11)
  expect(doubled.value).toBe(22)
  expect(listener.mock.calls).toEqual([[1, undefined], [2, 1], [10, 2], [11, 10]])

  flattened.dispose()
  expect(second.hasListeners()).toBe(false)
  expect(selection.hasListeners()).toBe(false)
})

test('disposing a selected signal leaves flatMap able to select another signal', () => {
  const first = prop(1)
  const second = prop(2)
  const selection = prop(first)
  const flattened = selection.flatMap(inner => inner)
  expect(flattened.value).toBe(1)

  first.dispose()
  selection.set(second)

  expect(flattened.value).toBe(2)
  selection.dispose()
  expect(flattened.isDisposed()).toBe(true)
  expect(second.hasListeners()).toBe(false)
})
