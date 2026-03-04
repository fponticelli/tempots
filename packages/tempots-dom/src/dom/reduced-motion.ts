import { prop, makeProviderMark } from '@tempots/core'
import type { Signal } from '@tempots/core'
import type { Provider } from '@tempots/render'
import type { DOMContext } from './dom-context'
import { getWindow } from './window'

/**
 * Creates a reactive signal that tracks the user's `prefers-reduced-motion`
 * system preference. The signal updates automatically when the preference
 * changes.
 *
 * SSR-safe: returns a signal with `false` when `window` is unavailable.
 *
 * @returns A signal that is `true` when reduced motion is preferred.
 * @public
 */
export function createReducedMotionSignal(): Signal<boolean> {
  const win = getWindow()
  const matcher =
    win != null ? win.matchMedia('(prefers-reduced-motion: reduce)') : undefined
  const reduced = prop(matcher?.matches ?? false)
  if (matcher != null) {
    const onChange = (e: MediaQueryListEvent) => reduced.set(e.matches)
    matcher.addEventListener('change', onChange)
    reduced.onDispose(() => matcher.removeEventListener('change', onChange))
  }
  return reduced
}

/**
 * A Tempo provider for the reduced motion preference signal.
 * Use with `Provide` / `Use` for app-wide access.
 *
 * @example
 * ```ts
 * Provide(ReducedMotion, undefined,
 *   Use(ReducedMotion, (reducedMotion) =>
 *     reducedMotion.map(v => v ? 'static' : 'animated')
 *   )
 * )
 * ```
 *
 * @public
 */
export const ReducedMotion: Provider<Signal<boolean>, undefined, DOMContext> = {
  mark: makeProviderMark<Signal<boolean>>('ReducedMotion'),
  create: () => {
    const value = createReducedMotionSignal()
    return {
      value,
      dispose: () => value.dispose(),
    }
  },
}
