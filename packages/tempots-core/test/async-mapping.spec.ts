import { expect, test, vi } from 'vitest'
import { computedOfAsync, computedOfAsyncGenerator, prop } from '../src'

test('disposing a promise mapping aborts its work and skips error recovery', async () => {
  const source = prop(1)
  const recover = vi.fn(() => -1)
  const running = vi.fn()
  const mapped = source.mapAsync(
    (_value, { abortSignal }) => new Promise<number>((_, reject) => {
      running(abortSignal)
      abortSignal.addEventListener('abort', () => reject(new Error('aborted')))
    }),
    0,
    recover
  )

  mapped.dispose()
  expect(running.mock.calls[0][0].aborted).toBe(true)
  expect(source.hasListeners()).toBe(false)
  source.set(2)
  await Promise.resolve()
  expect(running).toHaveBeenCalledOnce()
  expect(recover).not.toHaveBeenCalled()
})

test('disposing an async generator mapping closes its iterator', async () => {
  const source = prop(1)
  let finishIteration!: () => void
  const finished = new Promise<void>(resolve => { finishIteration = resolve })
  let currentSignal!: AbortSignal
  async function* values(value: number, abortSignal: AbortSignal) {
    currentSignal = abortSignal
    try {
      yield value
      await new Promise<void>(resolve => abortSignal.addEventListener('abort', () => resolve()))
      yield value * 2
    } finally {
      finishIteration()
    }
  }
  let closeIterator!: ReturnType<typeof vi.spyOn>
  const mapped = source.mapAsyncGenerator((value, { abortSignal }) => {
    const iterator = values(value, abortSignal)
    closeIterator = vi.spyOn(iterator, 'return')
    return iterator
  }, 0)

  await vi.waitFor(() => expect(mapped.value).toBe(1))
  mapped.dispose()
  expect(currentSignal.aborted).toBe(true)
  await finished
  expect(closeIterator).toHaveBeenCalledOnce()
  expect(mapped.value).toBe(1)
})

test('computed async mappings dispose their intermediate signals', () => {
  const source = prop(1)
  const promise = computedOfAsync(source)(async value => value, 0)
  const generator = computedOfAsyncGenerator(source)(async function* (value) {
    yield value
  }, 0)

  promise.dispose()
  generator.dispose()
  expect(source.hasListeners()).toBe(false)
})
