import { prop } from '@tempots/dom'
import { AsyncResult } from '@tempots/std'
import { expect, test, vi } from 'vitest'
import { makeMutationResource } from '../src/utils/mutation-resource'
import { makeQueryResource } from '../src/utils/query-resource'

function controlledLoads() {
  const operations = new Map<number, {
    abortSignal: AbortSignal
    cancel: () => void
    resolve: (value: number) => void
    reject: (error: Error) => void
  }>()
  const load = ({ request, abortSignal, cancel }: {
    request: number
    abortSignal: AbortSignal
    cancel: () => void
  }) => new Promise<number>((resolve, reject) => {
    operations.set(request, { abortSignal, cancel, resolve, reject })
  })
  return { load, operation: (request: number) => operations.get(request)! }
}

async function finishPromises() {
  await Promise.resolve()
  await Promise.resolve()
}

test('a stale query completion and cancel cannot affect the active query', async () => {
  const { load, operation } = controlledLoads()
  const request = prop(1)
  const onSuccess = vi.fn()
  const onSettled = vi.fn()
  const query = makeQueryResource({ request, load, convertError: String, onSuccess, onSettled })

  request.set(2)
  expect(operation(1).abortSignal.aborted).toBe(true)
  operation(1).cancel()
  operation(1).resolve(10)
  await finishPromises()
  expect(query.loading.value).toBe(true)
  expect(operation(2).abortSignal.aborted).toBe(false)
  expect(onSuccess).not.toHaveBeenCalled()
  expect(onSettled).not.toHaveBeenCalled()

  query.cancel(AsyncResult.success(12))
  expect(operation(2).abortSignal.aborted).toBe(true)
  operation(2).resolve(20)
  await finishPromises()
  expect(query.value.value).toBe(12)
  expect(onSuccess).not.toHaveBeenCalled()
  query.dispose()
})

test('a stale mutation error leaves the active mutation pending', async () => {
  const { load: mutate, operation } = controlledLoads()
  const convertError = vi.fn(String)
  const onError = vi.fn()
  const onSettled = vi.fn()
  const mutation = makeMutationResource({ mutate, convertError, onError, onSettled })

  mutation.execute(1)
  mutation.execute(2)
  operation(1).reject(new Error('stale error'))
  await finishPromises()
  expect(mutation.pending.value).toBe(true)
  expect(convertError).not.toHaveBeenCalled()
  expect(onError).not.toHaveBeenCalled()
  expect(onSettled).not.toHaveBeenCalled()

  mutation.dispose()
  expect(operation(2).abortSignal.aborted).toBe(true)
  operation(2).resolve(20)
  await finishPromises()
  expect(onSettled).not.toHaveBeenCalled()
})

test('a completion is invalidated when its status listener starts a newer request', async () => {
  const { load: mutate, operation } = controlledLoads()
  const onSuccess = vi.fn()
  const onSettled = vi.fn()
  const mutation = makeMutationResource({ mutate, convertError: String, onSuccess, onSettled })
  mutation.status.onChange(status => {
    if (AsyncResult.isSuccess(status) && status.value === 1) mutation.execute(2)
  })
  mutation.execute(1)
  operation(1).resolve(1)
  await finishPromises()
  expect(onSuccess).not.toHaveBeenCalled()
  expect(onSettled).not.toHaveBeenCalled()

  operation(2).resolve(2)
  await finishPromises()
  expect(onSuccess.mock.calls).toEqual([[2, 2]])
  expect(onSettled.mock.calls).toEqual([[AsyncResult.success(2), 2]])
  mutation.dispose()
})
