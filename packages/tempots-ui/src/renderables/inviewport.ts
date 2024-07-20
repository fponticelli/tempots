import {
  Prop,
  Signal,
  useProp,
  TNode,
  Renderable,
  renderableOfTNode,
  Empty,
  Fragment,
  OnUnmount,
  OnMount,
  When,
  isSSR,
} from '@tempots/dom'

/**
 * Represents the mode for determining if an element is in the viewport.
 * - `'partial'`: Indicates that the element is considered in the viewport if any part of it is visible.
 * - `'full'`: Indicates that the element is considered in the viewport only if it is fully visible.
 *
 * @public
 */
export type InViewportMode = 'partial' | 'full'

const options = {
  partial: {
    root: null,
    rootMargin: '0px',
    threshold: 0,
  },
  full: {
    root: null,
    rootMargin: '0px',
    threshold: 1,
  },
}

const maps = {
  partial: new Map<Element, Prop<boolean>>(),
  full: new Map<Element, Prop<boolean>>(),
}

const observers = {
  partial: null as IntersectionObserver | null,
  full: null as IntersectionObserver | null,
}

function ensureObserver(mode: InViewportMode): IntersectionObserver {
  if (observers[mode] == null) {
    observers[mode] = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const signal = maps[mode].get(entry.target)
        signal?.set(entry.isIntersecting)
      })
    }, options[mode])
  }
  return observers[mode]!
}

/**
 * Creates a renderable component that tracks whether the element is in the viewport.
 *
 * @param mode - The mode for tracking the element's visibility in the viewport.
 * @param fn - A function that returns the renderable component based on the visibility signal.
 * @returns The renderable component that tracks the element's visibility in the viewport.
 * @public
 */
export function InViewport(
  mode: InViewportMode,
  fn: (value: Signal<boolean>) => TNode
): Renderable {
  const signal = useProp(isSSR())
  return Fragment(
    OnMount((el: HTMLElement) => {
      const observer =
        typeof IntersectionObserver !== 'undefined'
          ? ensureObserver(mode)
          : null
      maps[mode].set(el, signal)
      observer?.observe(el)

      return () => {
        observer?.unobserve(el)
        maps[mode].delete(el)
        if (maps[mode].size === 0) {
          observers[mode]?.disconnect()
          observers[mode] = null
        }
      }
    }),
    OnUnmount(signal.dispose),
    renderableOfTNode(fn(signal))
  )
}

/**
 * Executes the provided `then` function when the element is in the viewport.
 * Optionally, executes the `otherwise` function when the element is not in the viewport.
 *
 * @param mode - The mode to determine when the element is considered in the viewport.
 * @param then - The function to execute when the element is in the viewport.
 * @param otherwise - The function to execute when the element is not in the viewport.
 * @returns The result of executing the `then` function or the `otherwise` function.
 * @public
 */
export const WhenInViewport = (
  mode: InViewportMode,
  then: TNode,
  otherwise?: TNode
) => InViewport(mode, inView => When(inView, then, otherwise ?? Empty))
