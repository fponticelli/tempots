import { prop, Signal } from '@tempots/dom'
import { AsyncResult, NonLoading } from '@tempots/std'

/**
 * A write-side wrapper for async state around POST/PUT/PATCH/DELETE.
 * Mirrors AsyncResource but the action is explicit (execute), not implicit (reload).
 *
 * @template Req - The request payload/type you send.
 * @template Res - The response/value you get back on success.
 * @template E   - The error type on failure.
 */
export interface MutationResource<Req, Res, E> {
  /** Current async status (Idle | Loading | Success | Failure). */
  readonly status: Signal<AsyncResult<Res, E>>
  /** Latest successful value (if any). */
  readonly value: Signal<Res | undefined>
  /** Latest error (if any). */
  readonly error: Signal<E | undefined>
  /** Whether a mutation is currently in flight. */
  readonly pending: Signal<boolean>

  /** Execute the mutation. */
  readonly execute: (
    request: Req,
    options?: MutationResourceExecuteOptions<Req, Res, E>
  ) => void

  /** Abort the current in-flight request (if any) and clean up. */
  readonly cancel: (newState?: NonLoading<Res, E>) => void

  /** Dispose of resources, aborting any in-flight request. */
  readonly dispose: () => void
}

/**
 * Execution-time options for a mutation.
 * Useful for optimistic UI and side-effects.
 */
export interface MutationResourceExecuteOptions<Req, Res, E> {
  /** The request to execute the mutation. */
  readonly request: Req
  /** External abort signal for this single execution. */
  readonly abortSignal: AbortSignal
  /** The previous result of the mutation, if any. */
  readonly previous: AsyncResult<Res, E>

  /**
   * Optionally provide an optimistic value to set immediately.
   * This will set status to Loading with value prefilled.
   */
  readonly optimisticValue?: Res

  /**
   * Optionally derive an optimistic value from the request.
   * Runs only if optimisticValue is not provided.
   */
  readonly optimisticFromRequest?: (req: Req) => Res

  /** Side-effects */
  readonly onSuccess?: (value: Res, req: Req) => void
  readonly onError?: (error: E, req: Req) => void
  readonly onSettled?: (result: AsyncResult<Res, E>, req: Req) => void
}

export const makeMutationResource = <Req, Res, E>({
  mutate,
  convertError,
  onSuccess,
  onError,
  onSettled,
}: {
  mutate: (options: MutationResourceExecuteOptions<Req, Res, E>) => Promise<Res>
  convertError: (error: unknown) => E
  onSuccess?: (value: Res, req: Req) => void
  onError?: (error: E, req: Req) => void
  onSettled?: (result: AsyncResult<Res, E>, req: Req) => void
}): MutationResource<Req, Res, E> => {
  let abortController: AbortController | undefined
  const status = prop<AsyncResult<Res, E>>(AsyncResult.notAsked)
  const value = status.map(r =>
    AsyncResult.isSuccess(r) ? r.value : undefined
  )
  const error = status.map(r =>
    AsyncResult.isFailure(r) ? r.error : undefined
  )
  const pending = status.map(r => AsyncResult.isLoading(r))
  const abort = () => {
    /* c8 ignore next */
    abortController?.abort()
    abortController = undefined
  }
  const cancel = (newState?: NonLoading<Res, E>) => {
    abort()
    status.set(newState ?? AsyncResult.notAsked)
  }

  const execute = async (
    request: Req,
    options?: MutationResourceExecuteOptions<Req, Res, E>
  ) => {
    abort()
    abortController = new AbortController()
    const abortSignal = abortController.signal
    const previous = status.get()
    const optimisticValue =
      options?.optimisticValue ??
      (options?.optimisticFromRequest != null
        ? options.optimisticFromRequest(request)
        : undefined)
    if (optimisticValue != null) {
      status.set(AsyncResult.loading(optimisticValue))
    } else {
      status.set(AsyncResult.loading(AsyncResult.getOrUndefined(previous)))
    }
    try {
      const result = await mutate({ request, abortSignal, previous })
      abortController = undefined
      status.set(AsyncResult.success(result))
      onSuccess?.(result, request)
    } catch (error) {
      abortController = undefined
      status.set(AsyncResult.failure(convertError(error)))
      onError?.(convertError(error), request)
    }
    onSettled?.(status.get(), request)
  }

  const dispose = () => {
    /* c8 ignore next */
    abortController?.abort()
    abortController = undefined
    status.dispose()
  }

  return {
    status,
    value,
    error,
    pending,
    execute,
    cancel,
    dispose,
  }
}
