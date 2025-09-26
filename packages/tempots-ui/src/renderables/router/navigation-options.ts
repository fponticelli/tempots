/**
 * Configuration applied when committing a navigation update.
 *
 * @public
 */
export type NavigationOptions = {
  /**
   * Optional history state to associate with the navigation entry.
   */
  state?: unknown
  /**
   * Scroll behaviour after navigation. Defaults to preserving the current scroll position.
   */
  scroll?: 'preserve' | 'auto'
  /**
   * Enable view transitions when supported by the browser.
   */
  viewTransition?: boolean
  /**
   * Force replacement of the current history entry instead of pushing a new one.
   */
  replace?: boolean
}
