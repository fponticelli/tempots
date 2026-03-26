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
  MutationResourceLoadOptions,
} from '../utils/mutation-resource'

export interface MutationContentOptions<Req, Res, E> {
  previous: Signal<Res | undefined>
  execute: (request: Req) => void
  cancel: (newState?: NonLoading<Res, E>) => void
  pending: Signal<boolean>
  error: Signal<E | undefined>
  value: Signal<Res | undefined>
  status: Signal<AsyncResult<Res, E>>
}

/**
 * Options for displaying the different states of an asynchronous resource.
 *
 * @typeParam Res - The type of the value when the resource is successfully loaded.
 * @typeParam E - The type of the error when the resource fails to load.
 * @public
 */
export interface MutationDisplayOptions<Req, Res, E> {
  /** Function to render the mutation content. */
  content: (options: MutationContentOptions<Req, Res, E>) => TNode
}

/**
 * Component to display an asynchronous mutation based on its current status.
 *
 * @typeParam Req - The type of the request.
 * @typeParam Res - The type of the value when the resource is successfully loaded.
 * @typeParam E - The type of the error when the resource fails to load.
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
 * Creates a reactive mutation component for handling asynchronous write operations.
 *
 * This component provides a declarative way to handle mutations (POST/PUT/PATCH/DELETE)
 * with proper loading, success, and error states. Unlike Query, mutations are triggered
 * explicitly via `execute()` rather than reactively from a request signal.
 *
 * @typeParam Req - The type of the request payload.
 * @typeParam Res - The type of the value when the mutation succeeds.
 * @typeParam E - The type of the error when the mutation fails.
 *
 * @param options - Configuration object for the mutation
 * @param options.mutate - Async function that performs the mutation
 * @param options.convertError - Optional function to transform errors into a specific type
 * @param options.onSuccess - Optional callback for successful mutations
 * @param options.onError - Optional callback for failed mutations
 * @param options.onSettled - Optional callback for both successful and failed mutations
 * @param options.content - Function to render the mutation UI
 * @returns A renderable component
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
  mutate: (options: MutationResourceLoadOptions<Req, Res, E>) => Promise<Res>
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
