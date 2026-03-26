import { prop, render } from '@tempots/dom'
import { Mutation } from '../src/renderables/mutation'
import { makeMutationResource } from '../src/utils/mutation-resource'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import { sleep, AsyncResult } from '@tempots/std'

describe('mutation-resource', () => {
  test('execute options passed to mutate should not include lifecycle callbacks', async () => {
    let capturedOptions: Record<string, unknown> = {}
    const resource = makeMutationResource<number, number, string>({
      mutate: async (options) => {
        capturedOptions = { ...options }
        return options.request
      },
      convertError: String,
      onSuccess: () => {},
      onError: () => {},
      onSettled: () => {},
    })

    resource.execute(42)
    await sleep(5)

    // The mutate function should receive request, abortSignal, previous
    expect(capturedOptions.request).toBe(42)
    expect(capturedOptions.abortSignal).toBeDefined()
    expect(capturedOptions.previous).toBeDefined()
    expect('onSuccess' in capturedOptions).toBe(false)
    expect('onError' in capturedOptions).toBe(false)
    expect('onSettled' in capturedOptions).toBe(false)

    resource.dispose()
  })

  test('cancel should be available in mutate options', async () => {
    let cancelFn: (() => void) | undefined
    const resource = makeMutationResource<number, number, string>({
      mutate: async (options) => {
        cancelFn = options.cancel
        return options.request
      },
      convertError: String,
    })

    resource.execute(1)
    await sleep(5)

    // cancel should be provided in mutate options
    expect(cancelFn).toBeDefined()

    resource.dispose()
  })

  test('sync mutation should still show Loading state', async () => {
    const states: string[] = []
    const resource = makeMutationResource<number, number, string>({
      mutate: async (options) => {
        // Resolves immediately (sync-like)
        return options.request * 2
      },
      convertError: String,
    })

    resource.status.on(s => {
      states.push(s.type)
    })

    resource.execute(5)
    // After execute is called, Loading should be set synchronously
    expect(AsyncResult.isLoading(resource.status.value)).toBe(true)

    await sleep(5)
    // After resolution, should be Success
    expect(AsyncResult.isSuccess(resource.status.value)).toBe(true)
    // Loading should have appeared in the state history
    expect(states).toContain('Loading')

    resource.dispose()
  })

  test('convertError is called exactly once on error', async () => {
    const convertError = vi.fn(String)
    const resource = makeMutationResource<number, number, string>({
      mutate: async () => {
        throw 'mutation-error'
      },
      convertError,
      onError: () => {},
    })

    resource.execute(1)
    await sleep(5)

    expect(convertError).toHaveBeenCalledTimes(1)
    expect(convertError).toHaveBeenCalledWith('mutation-error')

    resource.dispose()
  })

  test('onSuccess and onError callbacks fire correctly', async () => {
    const successCb = vi.fn()
    const errorCb = vi.fn()
    const settledCb = vi.fn()
    const resource = makeMutationResource<number, number, string>({
      mutate: async (options) => {
        if (options.request > 1) throw 'fail'
        return options.request
      },
      convertError: String,
      onSuccess: successCb,
      onError: errorCb,
      onSettled: settledCb,
    })

    resource.execute(1)
    await sleep(5)
    expect(successCb).toHaveBeenCalledWith(1, 1)
    expect(settledCb).toHaveBeenCalledTimes(1)

    resource.execute(2)
    await sleep(5)
    expect(errorCb).toHaveBeenCalledWith('fail', 2)
    expect(settledCb).toHaveBeenCalledTimes(2)

    resource.dispose()
  })

  test('cancel aborts and resets state', async () => {
    const resource = makeMutationResource<number, number, string>({
      mutate: async (options) => {
        await sleep(50)
        return options.request
      },
      convertError: String,
    })

    resource.execute(1)
    expect(AsyncResult.isLoading(resource.status.value)).toBe(true)

    resource.cancel()
    expect(resource.status.value).toEqual(AsyncResult.notAsked)

    resource.dispose()
  })

  test('optimistic update sets loading with optimistic value', async () => {
    const resource = makeMutationResource<number, number, string>({
      mutate: async (options) => {
        await sleep(5)
        return options.request * 10
      },
      convertError: String,
    })

    resource.execute(5, {
      optimisticValue: 99,
    })

    const status = resource.status.value
    expect(AsyncResult.isLoading(status)).toBe(true)
    if (AsyncResult.isLoading(status)) {
      expect(status.previousValue).toBe(99)
    }

    await sleep(5)
    expect(AsyncResult.isSuccess(resource.status.value)).toBe(true)

    resource.dispose()
  })
})

describe('Mutation component', () => {
  beforeEach(() => {
    document.body.textContent = ''
  })

  test('basic mutation render', async () => {
    const renderable = Mutation<number, string, string>({
      mutate: async ({ request }) => {
        await sleep(5)
        return `result-${request}`
      },
      convertError: String,
      content: ({ execute, value, pending }) =>
        pending.map(p =>
          p ? 'loading...' : value.value ? `done: ${value.value}` : 'idle'
        ),
    })

    const clear = render(renderable, document.body)
    expect(document.body.textContent).toBe('idle')

    clear()
  })
})
