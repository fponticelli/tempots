import { makeProviderMark, Provider, Prop, prop } from '@tempots/dom'

/**
 * Represents the context information for a router level in nested routing.
 *
 * Each router level (AppRouter or SubRouter) creates a RouterContext that contains
 * information about the matched path, remaining path for child routers, and accumulated
 * parameters from all parent router levels.
 *
 * @example
 * ```typescript
 * // For URL "/admin/users/123" with routes:
 * // RootRouter: { '/admin/*': () => AdminRoutes() }
 * // ChildRouter: { '/users/:id': (info) => UserDetail(info) }
 *
 * // RootRouter context:
 * {
 *   matchedPath: '/admin',
 *   remainingPath: '/users/123',
 *   fullPath: '/admin/users/123',
 *   params: {}
 * }
 *
 * // ChildRouter context:
 * {
 *   matchedPath: '/users/123',
 *   remainingPath: '',
 *   fullPath: '/admin/users/123',
 *   params: { id: '123' }
 * }
 * ```
 *
 * @public
 */
export interface RouterContext {
  /**
   * The portion of the path that was matched by this router level.
   * For RootRouter, this is the matched portion of the full pathname.
   * For ChildRouter, this is the matched portion of the remaining path from parent.
   */
  readonly matchedPath: string

  /**
   * The remaining path that should be processed by child routers.
   * Empty string if no remaining path.
   */
  readonly remainingPath: string

  /**
   * The full original pathname from the browser location.
   * This remains the same across all router levels.
   */
  readonly fullPath: string

  /**
   * Route parameters extracted at this router level.
   * These are accumulated with parameters from parent router levels.
   */
  readonly params: Record<string, string>
}

/**
 * Provider for router context stack in nested routing scenarios.
 *
 * The RouterContextProvider maintains a stack of RouterContext objects,
 * where each level represents a router in the nested hierarchy. Child
 * routers can access the context stack to determine what path remains
 * to be processed and what parameters have been accumulated from parent
 * router levels.
 *
 * @example
 * ```typescript
 * // RootRouter creates the initial context
 * const RootRouter = <T extends Routes>(routes: T) =>
 *   Provide(
 *     RouterContextProvider,
 *     {},
 *     () => {
 *       // Router implementation that creates initial context
 *       return Use(Location, location => {
 *         // Match routes and create context...
 *       })
 *     }
 *   )
 * ```
 *
 * @example
 * ```typescript
 * // ChildRouter reads parent context and adds its own
 * const ChildRouter = <T extends Routes>(routes: T) =>
 *   Use(RouterContextProvider, contextStack => {
 *     const parentContext = contextStack.value[contextStack.value.length - 1]
 *     const remainingPath = parentContext?.remainingPath || ''
 *
 *     // Match against remaining path and create new context...
 *   })
 * ```
 *
 * @public
 */
export const RouterContextProvider: Provider<Prop<RouterContext[]>> = {
  mark: makeProviderMark<Prop<RouterContext[]>>('RouterContext'),
  create: () => {
    const contextStack = prop<RouterContext[]>([])
    return {
      value: contextStack,
      dispose: () => contextStack.dispose(),
    }
  },
}
