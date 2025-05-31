import {
  Signal,
  prop,
  makeProviderMark,
  getWindow,
  Provider,
} from '@tempots/dom'

/**
 * Defines the possible appearance types for the application.
 *
 * @public
 */
export type AppearanceType = 'light' | 'dark'

/**
 * A provider that provides a child component with an appearance context, which can be used to
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
export const Appearance: Provider<Signal<AppearanceType>> = {
  mark: makeProviderMark<Signal<AppearanceType>>('Appearance'),
  create: () => {
    const value = useAppearence()
    return {
      value,
      dispose: value.dispose,
    }
  },
}

/**
 * Creates a signal that represents the current appearance (light or dark) based on the user's system
 * preferences.
 *
 * The appearance is updated whenever the user's system preferences change, and the signal is cleaned
 * up when it is no longer needed.
 *
 * @returns A signal representing the current appearance.
 * @public
 */
export function useAppearence() {
  const win = getWindow()
  const matcher =
    win != null && win.matchMedia != null
      ? win.matchMedia('(prefers-color-scheme: dark)')
      : undefined
  const isDark = matcher?.matches ?? false
  const value = prop<AppearanceType>(isDark ? 'dark' : 'light')
  const onChange = (e: MediaQueryListEvent) =>
    value.set(e.matches ? 'dark' : 'light')
  matcher?.addEventListener('change', onChange)
  value.onDispose(() => matcher?.removeEventListener('change', onChange))
  return value as Signal<AppearanceType>
}
