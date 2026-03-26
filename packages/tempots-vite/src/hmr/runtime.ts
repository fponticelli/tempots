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

type LabeledProp = {
  value: unknown
  __hmr_label?: string
  $__prop__?: boolean
  set: (value: unknown) => void
}

export interface HmrBoundary {
  update: (factory: () => AnyRenderable) => void
  dispose: () => void
}

// Module-level snapshot storage -- survives across boundary instances
const _snapshot = new Map<string, unknown>()

function snapshotProps(props: LabeledProp[], moduleId: string) {
  for (const p of props) {
    if (p.__hmr_label != null && p.$__prop__ === true) {
      _snapshot.set(`${moduleId}:${p.__hmr_label}`, p.value)
    }
  }
}

function restoreProps(props: LabeledProp[], moduleId: string) {
  for (const p of props) {
    if (p.__hmr_label != null && p.$__prop__ === true) {
      const key = `${moduleId}:${p.__hmr_label}`
      if (_snapshot.has(key)) {
        p.set(_snapshot.get(key))
        _snapshot.delete(key)
      }
    }
  }
}

export function createHmrBoundary(
  render: RenderFn,
  factory: () => AnyRenderable,
  target: Node | string,
  options?: Record<string, unknown>,
  moduleProps?: LabeledProp[],
  moduleId?: string
): HmrBoundary {
  let clear: (() => void) | null = null

  const doRender = (f: () => AnyRenderable) => {
    const renderable = f()
    clear = render(renderable, target, options)
  }

  // Initial render
  doRender(factory)

  // Restore state from previous module evaluation
  if (moduleProps != null && moduleId != null) {
    restoreProps(moduleProps, moduleId)
  }

  return {
    update(newFactory: () => AnyRenderable) {
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
      // Snapshot prop values before teardown
      if (moduleProps != null && moduleId != null) {
        snapshotProps(moduleProps, moduleId)
      }
      if (clear != null) {
        clear()
        clear = null
      }
    },
  }
}
