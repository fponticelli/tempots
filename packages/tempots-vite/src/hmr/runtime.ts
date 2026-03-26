/**
 * HMR boundary for Tempo applications.
 *
 * Manages the teardown/re-render cycle when a module is hot-updated.
 * On render errors, dispatches to Vite's native error overlay.
 *
 * This module is used in two ways:
 * 1. Imported directly in tests
 * 2. Its source is inlined as a virtual module in the Vite plugin
 */

type AnyRenderable = unknown
type RenderFn = (
  node: AnyRenderable,
  parent: Node | string,
  options?: Record<string, unknown>
) => () => void

export interface HmrBoundary {
  update: (factory: () => AnyRenderable) => void
  dispose: () => void
}

export function createHmrBoundary(
  render: RenderFn,
  factory: () => AnyRenderable,
  target: Node | string,
  options?: Record<string, unknown>
): HmrBoundary {
  let clear: (() => void) | null = null

  const doRender = (f: () => AnyRenderable) => {
    const renderable = f()
    clear = render(renderable, target, options)
  }

  // Initial render
  doRender(factory)

  return {
    update(newFactory: () => AnyRenderable) {
      // Teardown previous render
      if (clear != null) {
        clear()
        clear = null
      }

      try {
        doRender(newFactory)
      } catch (e) {
        const error = e instanceof Error ? e : new Error(String(e))
        console.error('[tempo:hmr] Error during hot update:', error)
      }
    },

    dispose() {
      if (clear != null) {
        clear()
        clear = null
      }
    },
  }
}
