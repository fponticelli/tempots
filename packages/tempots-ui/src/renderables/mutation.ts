import {
  Fragment,
  OnDispose,
  previousSignal,
  Renderable,
  Signal,
  TNode,
} from '@tempots/dom'
import { AsyncResult, NonLoading } from '@tempots/std'
import {
  makeMutationResource,
  MutationResource,
  MutationResourceExecuteOptions,
} from '../utils/mutation-resource'

/**
 * Options for displaying the different states of an asynchronous resource.
 *
 * @template Res - The type of the value when the resource is successfully loaded.
 * @template E - The type of the error when the resource fails to load.
 * @public
 */
export interface MutationDisplayOptions<Req, Res, E> {
  /** Function to render when the query is loading. */
  content: (options: {
    previous: Signal<Res | undefined>
    execute: (request: Req) => void
    cancel: (newState?: NonLoading<Res, E>) => void
    pending: Signal<boolean>
    error: Signal<E | undefined>
    value: Signal<Res | undefined>
    status: Signal<AsyncResult<Res, E>>
  }) => TNode
}

/**
 * Component to display an asynchronous mutation based on its current status.
 *
 * @template Req - The type of the request.
 * @template Res - The type of the value when the resource is successfully loaded.
 * @template E - The type of the error when the resource fails to load.
 *
 * @param {MutationResource<Req, Res, E>} resource - The asynchronous resource to display.
 * @param {MutationDisplayOptions<Req, Res, E>} options - The display options for the resource.
 * @returns {Renderable} A node representing the current state of the resource.
 * @public
 */
export const MutationDisplay = <Req, Res, E>(
  resource: MutationResource<Req, Res, E>,
  options: MutationDisplayOptions<Req, Res, E>
): Renderable => {
  const { status, dispose, execute, cancel, pending, error, value } = resource
  const { content } = options
  const previous = previousSignal(value)

  return Fragment(
    OnDispose(dispose),
    content({
      previous,
      execute,
      cancel,
      pending,
      error,
      value,
      status,
    })
  )
}

/**
 * Creates a reactive mutation component for handling asynchronous data loading.
 *
 * This component provides a declarative way to handle async operations with proper
 * loading, success, and error states. It automatically manages the lifecycle of
 * async requests and provides reload functionality.
 *
 * @template Req - The type of the request.
 * @template Res - The type of the value when the resource is successfully loaded.
 * @template E - The type of the error when the resource fails to load.
 *
 * @param {MutationResource<Req, Res, E>} resource - The asynchronous resource to display.
 * @param {MutationDisplayOptions<Req, Res, E>} options - The display options for the resource.
 * @returns {Renderable} A node representing the current state of the resource.
 * @public
 */
export const Mutation = <Req, Res, E = unknown>({
  mutate,
  convertError = v => v as E,
  onSuccess,
  onError,
  onSettled,
  content,
}: {
  mutate: (options: MutationResourceExecuteOptions<Req, Res, E>) => Promise<Res>
  convertError?: (error: unknown) => E
  onSuccess?: (value: Res, req: Req) => void
  onError?: (error: E, req: Req) => void
  onSettled?: (result: AsyncResult<Res, E>, req: Req) => void
} & MutationDisplayOptions<Req, Res, E>): Renderable => {
  const resource = makeMutationResource<Req, Res, E>({
    mutate,
    convertError,
    onSuccess,
    onError,
    onSettled,
  })
  return MutationDisplay(resource, { content })
}
