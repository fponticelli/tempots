import {
  Fragment,
  OnDispose,
  Renderable,
  Signal,
  TNode,
  Value,
} from '@tempots/dom'
import {
  QueryResource,
  makeQueryResource,
  QueryResourceLoadOptions,
} from '../utils/query-resource'
import { AsyncResultView } from './async-result-view'
import { AsyncResult, NonLoading } from '@tempots/std'

/**
 * Options for displaying the different states of an asynchronous query.
 *
 * @typeParam Res - The type of the value when the query is successfully loaded.
 * @typeParam E - The type of the error when the query fails to load.
 * @public
 */
export interface QueryDisplayOptions<Res, E> {
  /** Function to render when the query has not been requested yet. */
  notAsked?: () => TNode
  /** Function to render when the query is loading. */
  pending?: (options: {
    previous: Signal<Res | undefined>
    reload: () => void
    cancel: (newState?: NonLoading<Res, E>) => void
  }) => TNode
  /** Function to render when the query has failed to load. */
  failure?: (options: { error: Signal<E>; reload: () => void }) => TNode
  /** Function to render when the query has successfully loaded. */
  success: (options: {
    value: Signal<Res>
    reload: () => void
    loading: Signal<boolean>
  }) => TNode
  /**
   * When true, the success view stays mounted during reloads instead of
   * switching to the pending view. The `loading` signal passed to `success`
   * indicates when a reload is in progress. Only applies when the query
   * was already in a success state before the reload.
   */
  keepOnReload?: boolean
}

/**
 * Component to display an asynchronous query based on its current status.
 *
 * @typeParam Res - The type of the value when the query is successfully loaded.
 * @typeParam E - The type of the error when the query fails to load.
 *
 * @param {QueryResource<Res, E>} query - The asynchronous query to display.
 * @param {QueryDisplayOptions<Res, E>} options - The display options for the query.
 * @returns {TNode} A node representing the current state of the query.
 * @public
 */
export const QueryDisplay = <Res, E>(
  query: QueryResource<Res, E>,
  options: QueryDisplayOptions<Res, E>
): Renderable => {
  const { status, dispose, reload, loading: loadingSignal } = query
  const {
    notAsked: notAskedFn,
    pending: pendingFn,
    failure: error,
    success,
    keepOnReload = false,
  } = options

  const displayStatus = keepOnReload
    ? status.map(current => {
        if (
          AsyncResult.isLoading(current) &&
          current.previousValue !== undefined
        ) {
          return AsyncResult.success(current.previousValue as Res)
        }
        return current
      })
    : status

  return Fragment(
    OnDispose(dispose),
    AsyncResultView(displayStatus, {
      notAsked: notAskedFn,
      loading:
        pendingFn != null
          ? v => pendingFn({ previous: v, reload, cancel: query.cancel })
          : undefined,
      failure: error != null ? e => error({ error: e, reload }) : undefined,
      success: v => success({ value: v, reload, loading: loadingSignal }),
    })
  )
}

/**
 * Creates a reactive query component for handling asynchronous data loading.
 *
 * This component provides a declarative way to handle async operations with proper
 * loading, success, and error states. It automatically manages the lifecycle of
 * async requests and provides reload functionality.
 *
 * @example
 * ```typescript
 * // Basic API data loading
 * const userId = prop(1)
 *
 * const UserProfile = Query({
 *   request: userId,
 *   load: async ({ request }) => {
 *     const response = await fetch(`/api/users/${request}`)
 *     if (!response.ok) throw new Error('Failed to load user')
 *     return response.json()
 *   },
 *   pending: () => html.div('Loading user...'),
 *   failure: ({ error, reload }) => html.div(
 *     'Error: ', error,
 *     html.button(on.click(reload), 'Retry')
 *   ),
 *   success: ({ value }) => html.div(
 *     html.h2(value.map(u => u.name)),
 *     html.p(value.map(u => u.email))
 *   )
 * })
 * ```
 *
 * @example
 * ```typescript
 * // Query with keepOnReload — success view stays mounted during reloads
 * const searchQuery = prop('')
 *
 * const SearchResults = Query({
 *   request: searchQuery,
 *   keepOnReload: true,
 *   load: async ({ request, abortSignal }) => {
 *     const response = await fetch(`/api/search?q=${request}`, {
 *       signal: abortSignal
 *     })
 *     return response.json()
 *   },
 *   convertError: (error) => error instanceof Error ? error.message : 'Unknown error',
 *   pending: () => html.div('Searching...'),
 *   failure: ({ error, reload }) => html.div(
 *     attr.class('error'),
 *     'Search failed: ', error,
 *     html.button(on.click(reload), 'Try again')
 *   ),
 *   success: ({ value, reload, loading }) => html.div(
 *     html.button(on.click(reload), 'Refresh'),
 *     loading.map(l => l ? html.div('Refreshing...') : null),
 *     ForEach(value, result => SearchResultItem(result))
 *   )
 * })
 * ```
 *
 * @typeParam Req - The type of the request parameter
 * @typeParam Res - The type of the successful result value
 * @typeParam E - The type of the error (defaults to unknown)
 * @param options - Configuration object for the query
 * @param options.request - Signal or value representing the request parameters
 * @param options.load - Async function that loads the query
 * @param options.convertError - Optional function to transform errors into a specific type
 * @param options.onSuccess - Optional callback for successful loads
 * @param options.onError - Optional callback for failed loads
 * @param options.onSettled - Optional callback for both successful and failed loads
 * @param options.notAsked - Optional function to render before the first load
 * @param options.success - Function to render when the query has successfully loaded
 * @param options.pending - Optional function to render when the query is loading
 * @param options.failure - Optional function to render when the query has failed to load
 * @param options.keepOnReload - When true, keeps the success view mounted during reloads
 * @returns A renderable component
 * @public
 */
export const Query = <Req, Res, E = unknown>({
  request,
  load,
  convertError = v => v as E,
  onSuccess,
  onError,
  onSettled,
  notAsked,
  success,
  pending,
  failure,
  keepOnReload,
}: {
  request: Value<Req>
  load: (options: QueryResourceLoadOptions<Req, Res, E>) => Promise<Res>
  convertError?: (error: unknown) => E
  onSuccess?: (value: Res, req: Req) => void
  onError?: (error: E, req: Req) => void
  onSettled?: (result: AsyncResult<Res, E>, req: Req) => void
} & QueryDisplayOptions<Res, E>): Renderable => {
  const query = makeQueryResource<Req, Res, E>({
    request,
    load,
    convertError,
    onSuccess,
    onError,
    onSettled,
  })
  return QueryDisplay(query, {
    notAsked,
    success,
    pending,
    failure,
    keepOnReload,
  })
}
