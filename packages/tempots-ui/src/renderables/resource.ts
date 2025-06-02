import {
  Fragment,
  OnDispose,
  Renderable,
  Signal,
  TNode,
  Value,
} from '@tempots/dom'
import {
  AsyncResource,
  makeResource,
  ResourceLoadOptions,
} from '../utils/resource'
import { AsyncResultView } from './async-result-view'

/**
 * Options for displaying the different states of an asynchronous resource.
 *
 * @template V - The type of the value when the resource is successfully loaded.
 * @template E - The type of the error when the resource fails to load.
 * @public
 */
export interface ResourceDisplayOptions<V, E> {
  /** Function to render when the resource is loading. */
  loading?: (previous: Signal<V | undefined>, reload: () => void) => TNode
  /** Function to render when the resource has failed to load. */
  failure?: (error: Signal<E>, reload: () => void) => TNode
  /** Function to render when the resource has successfully loaded. */
  success: (value: Signal<V>, reload: () => void) => TNode
}

/**
 * Component to display an asynchronous resource based on its current status.
 *
 * @template V - The type of the value when the resource is successfully loaded.
 * @template E - The type of the error when the resource fails to load.
 *
 * @param {AsyncResource<V, E>} resource - The asynchronous resource to display.
 * @param {ResourceDisplayOptions<V, E>} options - The display options for the resource.
 * @returns {TNode} A node representing the current state of the resource.
 * @public
 */
export const ResourceDisplay = <V, E>(
  resource: AsyncResource<V, E>,
  options: ResourceDisplayOptions<V, E>
) => {
  const { status, dispose, reload } = resource
  const { loading, failure: error, success } = options

  return Fragment(
    OnDispose(dispose),
    AsyncResultView(status, {
      loading: loading != null ? v => loading(v, reload) : undefined,
      failure: error != null ? e => error(e, reload) : undefined,
      success: v => success(v, reload),
    })
  )
}

/**
 * Creates a reactive resource component for handling asynchronous data loading.
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
 * const UserProfile = Resource({
 *   request: userId,
 *   load: async ({ request }) => {
 *     const response = await fetch(`/api/users/${request}`)
 *     if (!response.ok) throw new Error('Failed to load user')
 *     return response.json()
 *   }
 * })({
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
 * // Resource with dependencies
 * const searchQuery = prop('')
 * const filters = prop({ category: 'all', sort: 'name' })
 *
 * const SearchResults = Resource({
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
 *   mapError: (error) => error instanceof Error ? error.message : 'Unknown error'
 * })({
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
 * // File upload resource
 * const selectedFile = prop<File | null>(null)
 *
 * const FileUpload = Resource({
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
 *   }
 * })({
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
 * @template R - The type of the request parameter
 * @template V - The type of the successful result value
 * @template E - The type of the error (defaults to unknown)
 * @param config - Configuration object for the resource
 * @param config.request - Signal or value representing the request parameters
 * @param config.load - Async function that loads the resource
 * @param config.mapError - Optional function to transform errors into a specific type
 * @returns Function that takes display options and returns a renderable component
 * @public
 */
export const Resource = <R, V, E = unknown>({
  request,
  load,
  mapError = v => v as E,
}: {
  request: Value<R>
  load: (options: ResourceLoadOptions<R, V, E>) => Promise<V>
  mapError?: (error: unknown) => E
}): ((displayOptions: ResourceDisplayOptions<V, E>) => Renderable) => {
  const resource = makeResource(request, load, mapError)
  return (displayOptions: ResourceDisplayOptions<V, E>): Renderable =>
    ResourceDisplay(resource, displayOptions)
}
