import { Prop } from '@tempots/dom'
import { AsyncResult, NonLoading } from '@tempots/std'

export function makeResourceRunner<Req, Res, E>({
  status,
  load,
  convertError,
  onSuccess,
  onError,
  onSettled,
  deferSuccess,
}: {
  status: Prop<AsyncResult<Res, E>>
  load: (options: {
    request: Req
    abortSignal: AbortSignal
    previous: AsyncResult<Res, E>
    cancel: (newState?: NonLoading<Res, E>) => void
  }) => Promise<Res>
  convertError: (error: unknown) => E
  onSuccess?: (value: Res, request: Req) => void
  onError?: (error: E, request: Req) => void
  onSettled?: (result: AsyncResult<Res, E>, request: Req) => void
  deferSuccess?: boolean
}) {
  let generation = 0
  let pending: AbortController | undefined
  const replacePending = (next?: AbortController) => {
    const previous = pending
    pending = next
    const id = ++generation
    previous?.abort()
    return id
  }
  const cancel = (newState?: NonLoading<Res, E>) => {
    if (status.isDisposed()) return
    const id = replacePending()
    if (id === generation) status.set(newState ?? AsyncResult.notAsked)
  }
  status.onDispose(() => replacePending())

  const run = async (request: Req, optimistic?: () => Res | undefined) => {
    if (status.isDisposed()) return
    const controller = new AbortController()
    const id = replacePending(controller)
    const isCurrent = () => id === generation
    if (!isCurrent()) return

    let result: AsyncResult<Res, E>
    try {
      const previous = status.get()
      const loadingValue =
        optimistic?.() ?? AsyncResult.getOrUndefined(previous)
      if (!isCurrent()) return
      status.set(AsyncResult.loading(loadingValue))
      if (!isCurrent()) return

      const value = await load({
        request,
        abortSignal: controller.signal,
        previous,
        cancel: newState => {
          if (pending === controller) cancel(newState)
        },
      })
      // Give query subscribers a microtask to observe Loading first.
      if (deferSuccess) await Promise.resolve()
      result = AsyncResult.success(value)
    } catch (error) {
      if (!isCurrent()) return
      result = AsyncResult.failure(convertError(error))
    } finally {
      if (pending === controller) pending = undefined
    }

    if (!isCurrent()) return
    status.set(result)
    if (!isCurrent()) return
    if (AsyncResult.isSuccess(result)) onSuccess?.(result.value, request)
    if (AsyncResult.isFailure(result)) onError?.(result.error, request)
    if (isCurrent()) onSettled?.(result, request)
  }

  return { run, cancel }
}
