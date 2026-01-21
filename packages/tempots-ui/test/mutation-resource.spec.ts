import { describe, expect, test, vi, beforeEach } from 'vitest'
import { makeMutationResource } from '../src/utils/mutation-resource'
import { AsyncResult } from '@tempots/std'

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

describe('makeMutationResource', () => {
  describe('initialization', () => {
    test('should initialize with NotAsked status', () => {
      const resource = makeMutationResource({
        mutate: async () => 'result',
        convertError: (e) => String(e),
      })

      expect(AsyncResult.isNotAsked(resource.status.value)).toBe(true)
      expect(resource.value.value).toBeUndefined()
      expect(resource.error.value).toBeUndefined()
      expect(resource.pending.value).toBe(false)

      resource.dispose()
    })
  })

  describe('execute', () => {
    test('should transition to Loading on execute', async () => {
      const resource = makeMutationResource({
        mutate: async () => {
          await sleep(50)
          return 'result'
        },
        convertError: (e) => String(e),
      })

      resource.execute('request')

      expect(AsyncResult.isLoading(resource.status.value)).toBe(true)
      expect(resource.pending.value).toBe(true)

      await sleep(60)
      resource.dispose()
    })

    test('should transition to Success on successful mutation', async () => {
      const resource = makeMutationResource({
        mutate: async ({ request }) => {
          await sleep(10)
          return `result-${request}`
        },
        convertError: (e) => String(e),
      })

      resource.execute('test')

      await sleep(20)

      expect(AsyncResult.isSuccess(resource.status.value)).toBe(true)
      expect(resource.value.value).toBe('result-test')
      expect(resource.error.value).toBeUndefined()
      expect(resource.pending.value).toBe(false)

      resource.dispose()
    })

    test('should transition to Failure on error', async () => {
      const resource = makeMutationResource({
        mutate: async () => {
          await sleep(10)
          throw new Error('mutation failed')
        },
        convertError: (e) => (e as Error).message,
      })

      resource.execute('test')

      await sleep(20)

      expect(AsyncResult.isFailure(resource.status.value)).toBe(true)
      expect(resource.error.value).toBe('mutation failed')
      expect(resource.value.value).toBeUndefined()
      expect(resource.pending.value).toBe(false)

      resource.dispose()
    })

    test('should call onSuccess callback on success', async () => {
      const onSuccess = vi.fn()

      const resource = makeMutationResource({
        mutate: async ({ request }) => `result-${request}`,
        convertError: (e) => String(e),
        onSuccess,
      })

      resource.execute('myRequest')
      await sleep(10)

      expect(onSuccess).toHaveBeenCalledWith('result-myRequest', 'myRequest')

      resource.dispose()
    })

    test('should call onError callback on error', async () => {
      const onError = vi.fn()

      const resource = makeMutationResource({
        mutate: async () => {
          throw new Error('failed')
        },
        convertError: (e) => (e as Error).message,
        onError,
      })

      resource.execute('request')
      await sleep(10)

      expect(onError).toHaveBeenCalledWith('failed', 'request')

      resource.dispose()
    })

    test('should call onSettled callback after success', async () => {
      const onSettled = vi.fn()

      const resource = makeMutationResource({
        mutate: async () => 'result',
        convertError: (e) => String(e),
        onSettled,
      })

      resource.execute('request')
      await sleep(10)

      expect(onSettled).toHaveBeenCalled()
      const [result, req] = onSettled.mock.calls[0]
      expect(AsyncResult.isSuccess(result)).toBe(true)
      expect(req).toBe('request')

      resource.dispose()
    })

    test('should call onSettled callback after error', async () => {
      const onSettled = vi.fn()

      const resource = makeMutationResource({
        mutate: async () => {
          throw new Error('failed')
        },
        convertError: (e) => (e as Error).message,
        onSettled,
      })

      resource.execute('request')
      await sleep(10)

      expect(onSettled).toHaveBeenCalled()
      const [result, req] = onSettled.mock.calls[0]
      expect(AsyncResult.isFailure(result)).toBe(true)
      expect(req).toBe('request')

      resource.dispose()
    })

    test('should pass previous result to mutate function', async () => {
      const mutate = vi.fn().mockResolvedValue('result')

      const resource = makeMutationResource({
        mutate,
        convertError: (e) => String(e),
      })

      // First execution - previous is NotAsked
      resource.execute('first')
      await sleep(10)

      expect(mutate.mock.calls[0][0].previous).toEqual(AsyncResult.notAsked)

      // Second execution - previous is Success
      resource.execute('second')
      await sleep(10)

      const secondCall = mutate.mock.calls[1][0]
      expect(AsyncResult.isSuccess(secondCall.previous)).toBe(true)

      resource.dispose()
    })

    test('should provide abortSignal to mutate function', async () => {
      let capturedSignal: AbortSignal | undefined

      const resource = makeMutationResource({
        mutate: async ({ abortSignal }) => {
          capturedSignal = abortSignal
          return 'result'
        },
        convertError: (e) => String(e),
      })

      resource.execute('request')
      await sleep(10)

      expect(capturedSignal).toBeDefined()
      expect(capturedSignal instanceof AbortSignal).toBe(true)

      resource.dispose()
    })
  })

  describe('optimistic updates', () => {
    test('should apply optimisticValue immediately', async () => {
      const resource = makeMutationResource({
        mutate: async () => {
          await sleep(50)
          return 'final-result'
        },
        convertError: (e) => String(e),
      })

      resource.execute('request', {
        request: 'request',
        abortSignal: new AbortController().signal,
        previous: AsyncResult.notAsked,
        optimisticValue: 'optimistic-value',
      })

      // Should be in Loading state with optimistic value
      expect(AsyncResult.isLoading(resource.status.value)).toBe(true)
      expect(AsyncResult.getOrUndefined(resource.status.value)).toBe(
        'optimistic-value'
      )

      await sleep(60)

      // Should now have final value
      expect(resource.value.value).toBe('final-result')

      resource.dispose()
    })

    test('should use optimisticFromRequest if optimisticValue not provided', async () => {
      const resource = makeMutationResource<string, string, string>({
        mutate: async () => {
          await sleep(50)
          return 'final-result'
        },
        convertError: (e) => String(e),
      })

      resource.execute('my-request', {
        request: 'my-request',
        abortSignal: new AbortController().signal,
        previous: AsyncResult.notAsked,
        optimisticFromRequest: (req) => `optimistic-${req}`,
      })

      expect(AsyncResult.getOrUndefined(resource.status.value)).toBe(
        'optimistic-my-request'
      )

      await sleep(60)
      resource.dispose()
    })
  })

  describe('cancel', () => {
    test('should abort in-flight request', async () => {
      let wasAborted = false

      const resource = makeMutationResource({
        mutate: async ({ abortSignal }) => {
          abortSignal.addEventListener('abort', () => {
            wasAborted = true
          })
          await sleep(100)
          return 'result'
        },
        convertError: (e) => String(e),
      })

      resource.execute('request')
      await sleep(10)

      resource.cancel()

      expect(wasAborted).toBe(true)
      expect(AsyncResult.isNotAsked(resource.status.value)).toBe(true)

      resource.dispose()
    })

    test('should set custom state when canceling', async () => {
      const resource = makeMutationResource({
        mutate: async () => {
          await sleep(100)
          return 'result'
        },
        convertError: (e) => String(e),
      })

      resource.execute('request')
      await sleep(10)

      resource.cancel(AsyncResult.failure('cancelled'))

      expect(AsyncResult.isFailure(resource.status.value)).toBe(true)
      expect(resource.error.value).toBe('cancelled')

      resource.dispose()
    })
  })

  describe('rapid executions', () => {
    test('should abort previous request on new execute', async () => {
      let abortCount = 0

      const resource = makeMutationResource({
        mutate: async ({ request, abortSignal }) => {
          abortSignal.addEventListener('abort', () => abortCount++)
          await sleep(50)
          return `result-${request}`
        },
        convertError: (e) => String(e),
      })

      resource.execute('first')
      await sleep(10)
      resource.execute('second')
      await sleep(10)
      resource.execute('third')

      await sleep(60)

      expect(abortCount).toBeGreaterThanOrEqual(2)
      expect(resource.value.value).toBe('result-third')

      resource.dispose()
    })
  })

  describe('dispose', () => {
    test('should abort in-flight request on dispose', async () => {
      let wasAborted = false

      const resource = makeMutationResource({
        mutate: async ({ abortSignal }) => {
          abortSignal.addEventListener('abort', () => {
            wasAborted = true
          })
          await sleep(100)
          return 'result'
        },
        convertError: (e) => String(e),
      })

      resource.execute('request')
      await sleep(10)

      resource.dispose()

      expect(wasAborted).toBe(true)
    })
  })
})
