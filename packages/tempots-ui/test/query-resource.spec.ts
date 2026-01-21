import { describe, expect, test, vi } from 'vitest'
import { makeQueryResource } from '../src/utils/query-resource'
import { prop } from '@tempots/dom'
import { AsyncResult } from '@tempots/std'

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

describe('makeQueryResource', () => {
  describe('initialization', () => {
    test('should load immediately with static request', async () => {
      const load = vi.fn().mockResolvedValue('result')

      const resource = makeQueryResource({
        request: 'static-request',
        load,
        convertError: (e) => String(e),
      })

      await sleep(10)

      expect(load).toHaveBeenCalled()
      expect(load.mock.calls[0][0].request).toBe('static-request')
      expect(resource.value.value).toBe('result')

      resource.dispose()
    })

    test('should load immediately with signal request', async () => {
      const request = prop('initial-request')
      const load = vi.fn().mockResolvedValue('result')

      const resource = makeQueryResource({
        request,
        load,
        convertError: (e) => String(e),
      })

      await sleep(10)

      expect(load).toHaveBeenCalled()
      expect(resource.value.value).toBe('result')

      resource.dispose()
      request.dispose()
    })
  })

  describe('loading states', () => {
    test('should transition through Loading to Success', async () => {
      const request = prop('request')
      const states: string[] = []

      const resource = makeQueryResource({
        request,
        load: async () => {
          await sleep(20)
          return 'result'
        },
        convertError: (e) => String(e),
      })

      resource.status.on((status) => {
        if (AsyncResult.isLoading(status)) states.push('loading')
        if (AsyncResult.isSuccess(status)) states.push('success')
      })

      await sleep(30)

      expect(states).toContain('loading')
      expect(states).toContain('success')
      expect(resource.loading.value).toBe(false)

      resource.dispose()
      request.dispose()
    })

    test('should transition through Loading to Failure', async () => {
      const request = prop('request')

      const resource = makeQueryResource({
        request,
        load: async () => {
          await sleep(10)
          throw new Error('load failed')
        },
        convertError: (e) => (e as Error).message,
      })

      await sleep(20)

      expect(AsyncResult.isFailure(resource.status.value)).toBe(true)
      expect(resource.error.value).toBe('load failed')
      expect(resource.loading.value).toBe(false)

      resource.dispose()
      request.dispose()
    })

    test('should indicate loading state via loading signal', async () => {
      const request = prop('request')

      const resource = makeQueryResource({
        request,
        load: async () => {
          await sleep(30)
          return 'result'
        },
        convertError: (e) => String(e),
      })

      await sleep(5)
      expect(resource.loading.value).toBe(true)

      await sleep(40)
      expect(resource.loading.value).toBe(false)

      resource.dispose()
      request.dispose()
    })
  })

  describe('reactive request', () => {
    test('should reload when request signal changes', async () => {
      const request = prop(1)
      const load = vi.fn().mockImplementation(async ({ request: req }) => {
        await sleep(10)
        return `result-${req}`
      })

      const resource = makeQueryResource({
        request,
        load,
        convertError: (e) => String(e),
      })

      await sleep(20)
      expect(resource.value.value).toBe('result-1')

      request.set(2)
      await sleep(20)
      expect(resource.value.value).toBe('result-2')

      request.set(3)
      await sleep(20)
      expect(resource.value.value).toBe('result-3')

      expect(load).toHaveBeenCalledTimes(3)

      resource.dispose()
      request.dispose()
    })

    test('should abort previous request when request changes', async () => {
      const request = prop(1)
      let abortCount = 0

      const resource = makeQueryResource({
        request,
        load: async ({ abortSignal }) => {
          abortSignal.addEventListener('abort', () => abortCount++)
          await sleep(50)
          return 'result'
        },
        convertError: (e) => String(e),
      })

      await sleep(10)
      request.set(2)
      await sleep(10)
      request.set(3)

      await sleep(60)

      expect(abortCount).toBeGreaterThanOrEqual(2)

      resource.dispose()
      request.dispose()
    })
  })

  describe('reload', () => {
    test('should reload with current request', async () => {
      const load = vi.fn().mockResolvedValue('result')

      const resource = makeQueryResource({
        request: 'request',
        load,
        convertError: (e) => String(e),
      })

      await sleep(10)
      expect(load).toHaveBeenCalledTimes(1)

      resource.reload()
      await sleep(10)
      expect(load).toHaveBeenCalledTimes(2)

      resource.dispose()
    })

    test('should abort previous request on reload', async () => {
      let abortCount = 0

      const resource = makeQueryResource({
        request: 'request',
        load: async ({ abortSignal }) => {
          abortSignal.addEventListener('abort', () => abortCount++)
          await sleep(50)
          return 'result'
        },
        convertError: (e) => String(e),
      })

      await sleep(10)
      resource.reload()

      await sleep(60)

      expect(abortCount).toBeGreaterThanOrEqual(1)

      resource.dispose()
    })
  })

  describe('cancel', () => {
    test('should cancel in-flight request', async () => {
      let wasAborted = false

      const resource = makeQueryResource({
        request: 'request',
        load: async ({ abortSignal }) => {
          abortSignal.addEventListener('abort', () => {
            wasAborted = true
          })
          await sleep(100)
          return 'result'
        },
        convertError: (e) => String(e),
      })

      await sleep(10)
      resource.cancel()

      expect(wasAborted).toBe(true)
      expect(AsyncResult.isNotAsked(resource.status.value)).toBe(true)

      resource.dispose()
    })

    test('should set custom state when canceling', async () => {
      const resource = makeQueryResource({
        request: 'request',
        load: async () => {
          await sleep(100)
          return 'result'
        },
        convertError: (e) => String(e),
      })

      await sleep(10)
      resource.cancel(AsyncResult.failure('cancelled'))

      expect(AsyncResult.isFailure(resource.status.value)).toBe(true)
      expect(resource.error.value).toBe('cancelled')

      resource.dispose()
    })
  })

  describe('callbacks', () => {
    test('should call onSuccess callback', async () => {
      const onSuccess = vi.fn()

      const resource = makeQueryResource({
        request: 'myRequest',
        load: async () => 'result',
        convertError: (e) => String(e),
        onSuccess,
      })

      await sleep(10)

      expect(onSuccess).toHaveBeenCalledWith('result', 'myRequest')

      resource.dispose()
    })

    test('should call onError callback', async () => {
      const onError = vi.fn()

      const resource = makeQueryResource({
        request: 'request',
        load: async () => {
          throw new Error('load failed')
        },
        convertError: (e) => (e as Error).message,
        onError,
      })

      await sleep(10)

      expect(onError).toHaveBeenCalledWith('load failed', 'request')

      resource.dispose()
    })

    test('should call onSettled callback after success', async () => {
      const onSettled = vi.fn()

      const resource = makeQueryResource({
        request: 'request',
        load: async () => 'result',
        convertError: (e) => String(e),
        onSettled,
      })

      await sleep(10)

      expect(onSettled).toHaveBeenCalled()
      const [result, req] = onSettled.mock.calls[0]
      expect(AsyncResult.isSuccess(result)).toBe(true)
      expect(req).toBe('request')

      resource.dispose()
    })

    test('should call onSettled callback after error', async () => {
      const onSettled = vi.fn()

      const resource = makeQueryResource({
        request: 'request',
        load: async () => {
          throw new Error('failed')
        },
        convertError: (e) => (e as Error).message,
        onSettled,
      })

      await sleep(10)

      expect(onSettled).toHaveBeenCalled()
      const [result] = onSettled.mock.calls[0]
      expect(AsyncResult.isFailure(result)).toBe(true)

      resource.dispose()
    })
  })

  describe('previous result', () => {
    test('should pass previous result to load function', async () => {
      const request = prop(1)
      const load = vi.fn().mockImplementation(async ({ request: req }) => {
        await sleep(5)
        return `result-${req}`
      })

      const resource = makeQueryResource({
        request,
        load,
        convertError: (e) => String(e),
      })

      await sleep(10)

      // First load - previous is NotAsked
      expect(AsyncResult.isNotAsked(load.mock.calls[0][0].previous)).toBe(true)

      request.set(2)
      await sleep(10)

      // Second load - previous is Success
      expect(AsyncResult.isSuccess(load.mock.calls[1][0].previous)).toBe(true)

      resource.dispose()
      request.dispose()
    })

    test('should preserve previous value during loading', async () => {
      const request = prop(1)
      const values: (string | undefined)[] = []

      const resource = makeQueryResource({
        request,
        load: async ({ request: req }) => {
          await sleep(20)
          return `result-${req}`
        },
        convertError: (e) => String(e),
      })

      await sleep(30)
      expect(resource.value.value).toBe('result-1')

      request.set(2)

      // During loading, should still show previous value via Loading state
      await sleep(5)
      const loadingStatus = resource.status.value
      if (AsyncResult.isLoading(loadingStatus)) {
        expect(loadingStatus.previousValue).toBe('result-1')
      }

      await sleep(30)
      expect(resource.value.value).toBe('result-2')

      resource.dispose()
      request.dispose()
    })
  })

  describe('dispose', () => {
    test('should abort in-flight request on dispose', async () => {
      let wasAborted = false

      const resource = makeQueryResource({
        request: 'request',
        load: async ({ abortSignal }) => {
          abortSignal.addEventListener('abort', () => {
            wasAborted = true
          })
          await sleep(100)
          return 'result'
        },
        convertError: (e) => String(e),
      })

      await sleep(10)
      resource.dispose()

      expect(wasAborted).toBe(true)
    })
  })
})
