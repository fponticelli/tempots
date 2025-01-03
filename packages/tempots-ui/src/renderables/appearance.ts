import {
  Signal,
  makeProp,
  TNode,
  UseProvider,
  Fragment,
  OnDispose,
  makeProviderMark,
  WithProvider,
  Renderable,
  getWindow,
} from '@tempots/dom'

/**
 * Defines the possible appearance types for the application.
 *
 * @public
 */
export type AppearanceType = 'light' | 'dark'

/**
 * A provider mark for a signal representing the current appearance type.
 * @public
 */
export const appearanceMarker =
  makeProviderMark<Signal<AppearanceType>>('Appearance')

/**
 * Provides a child component with an appearance context, which can be used to
 * determine the current appearance (light or dark) based on the user's system
 * preferences.
 *
 * The appearance context is updated whenever the user's system preferences
 * change, and the component is cleaned up when it is no longer needed.
 *
 * @param child - The child component to be provided with the appearance context.
 * @returns The child component with the appearance context.
 * @public
 */
export const ProvideAppearance = (child: TNode): Renderable => {
  const win = getWindow()
  const isDark =
    win != null &&
    win.matchMedia != null &&
    win.matchMedia('(prefers-color-scheme: dark)').matches
  const appearance = makeProp<AppearanceType>(isDark ? 'dark' : 'light')
  const onChange = (e: MediaQueryListEvent) => {
    appearance.set(e.matches ? 'dark' : 'light')
  }
  const matcher =
    win != null && win.matchMedia != null
      ? win.matchMedia('(prefers-color-scheme: dark)')
      : undefined
  matcher?.addEventListener('change', onChange)
  return Fragment(
    WithProvider(appearanceMarker, appearance, child),
    OnDispose(() => matcher?.removeEventListener('change', onChange))
  )
}

/**
 * Makes the AppearanceType available to the child component by consuming the signal provided by the parent.
 * The result of the function is returned as the final output.
 *
 * @param fn - A function that accepts the `AppearanceType` signal and returns a `TNode` element.
 * @returns The `TNode` element returned by the provided function.
 * @public
 */
export const UseAppearance = (
  fn: (appearance: Signal<AppearanceType>) => TNode
): TNode => UseProvider(appearanceMarker, fn)
