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
 * @template Res - The type of the value when the query is successfully loaded.
 * @template E - The type of the error when the query fails to load.
 * @public
 */
export interface QueryDisplayOptions<Res, E> {
  /** Function to render when the query is loading. */
  pending?: (options: {
    previous: Signal<Res | undefined>
    reload: () => void
    cancel: (newState?: NonLoading<Res, E>) => void
  }) => TNode
  /** Function to render when the query has failed to load. */
  failure?: (options: { error: Signal<E>; reload: () => void }) => TNode
  /** Function to render when the query has successfully loaded. */
  success: (options: { value: Signal<Res>; reload: () => void }) => TNode
}

/**
 * Component to display an asynchronous query based on its current status.
 *
 * @template Res - The type of the value when the query is successfully loaded.
 * @template E - The type of the error when the query fails to load.
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
  const { status, dispose, reload } = query
  const { pending: loading, failure: error, success } = options

  return Fragment(
    OnDispose(dispose),
    AsyncResultView(status, {
      loading:
        loading != null
          ? v => loading({ previous: v, reload, cancel: query.cancel })
          : undefined,
      failure: error != null ? e => error({ error: e, reload }) : undefined,
      success: v => success({ value: v, reload }),
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
 *   loading: () => html.div('Loading user...'),
 *   failure: (error, reload) => html.div(
 *     'Error: ', error,
 *     html.button(on.click(reload), 'Retry')
 *   ),
 *   success: (user) => html.div(
 *     html.h2(user.map(u => u.name)),
 *     html.p(user.map(u => u.email))
 *   )
 * })
 * ```
 *
 * @example
 * ```typescript
 * // Query with dependencies
 * const searchQuery = prop('')
 * const filters = prop({ category: 'all', sort: 'name' })
 *
 * const SearchResults = Query({
 *   request: computed(() => ({
 *     query: searchQuery.value,
 *     ...filters.value
 *   })),
 *   load: async ({ request, abortSignal }) => {
 *     const params = new URLSearchParams(request)
 *     const response = await fetch(`/api/search?${params}`, {
 *       signal: abortSignal
 *     })
 *     return response.json()
 *   },
 *   convertError: (error) => error instanceof Error ? error.message : 'Unknown error',
 *   loading: (previous) => html.div(
 *     'Searching...',
 *     previous.value && html.div('Previous results:', previous.value.length)
 *   ),
 *   failure: (error, reload) => html.div(
 *     attr.class('error'),
 *     'Search failed: ', error,
 *     html.button(on.click(reload), 'Try again')
 *   ),
 *   success: (results, reload) => html.div(
 *     html.button(on.click(reload), 'Refresh'),
 *     ForEach(results, result => SearchResultItem(result))
 *   )
 * })
 * ```
 *
 * @example
 * ```typescript
 * // File upload query
 * const selectedFile = prop<File | null>(null)
 *
 * const FileUpload = Query({
 *   request: selectedFile,
 *   load: async ({ request }) => {
 *     if (!request) throw new Error('No file selected')
 *
 *     const formData = new FormData()
 *     formData.append('file', request)
 *
 *     const response = await fetch('/api/upload', {
 *       method: 'POST',
 *       body: formData
 *     })
 *
 *     if (!response.ok) throw new Error('Upload failed')
 *     return response.json()
 *   },
 *   loading: () => html.div(
 *     attr.class('upload-progress'),
 *     'Uploading file...'
 *   ),
 *   failure: (error, reload) => html.div(
 *     attr.class('upload-error'),
 *     'Upload failed: ', error,
 *     html.button(on.click(reload), 'Retry upload')
 *   ),
 *   success: (result) => html.div(
 *     attr.class('upload-success'),
 *     'File uploaded successfully!',
 *     html.a(
 *       attr.href(result.map(r => r.url)),
 *       'View file'
 *     )
 *   )
 * })
 * ```
 *
 * @template Req - The type of the request parameter
 * @template Res - The type of the successful result value
 * @template E - The type of the error (defaults to unknown)
 * @param options - Configuration object for the query
 * @param options.request - Signal or value representing the request parameters
 * @param options.load - Async function that loads the query
 * @param options.convertError - Optional function to transform errors into a specific type
 * @param options.onSuccess - Optional callback for successful loads
 * @param options.onError - Optional callback for failed loads
 * @param options.onSettled - Optional callback for both successful and failed loads
 * @param options.success - Function to render when the query has successfully loaded
 * @param options.pending - Optional function to render when the query is loading
 * @param options.failure - Optional function to render when the query has failed to load
 * @returns Function that takes display options and returns a renderable component
 * @public
 */
export const Query = <Req, Res, E = unknown>({
  request,
  load,
  convertError = v => v as E,
  onSuccess,
  onError,
  onSettled,
  success,
  pending,
  failure,
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
  return QueryDisplay(query, { success, pending, failure })
}
