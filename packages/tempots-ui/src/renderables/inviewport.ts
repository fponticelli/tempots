import {
  ssr,
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
} from '@tempots/dom'

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

export function InViewport(
  mode: InViewportMode,
  fn: (value: Signal<boolean>) => TNode
): Renderable {
  const signal = useProp(ssr.isSSR())
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

export const WhenInViewport = (
  mode: InViewportMode,
  then: TNode,
  otherwise?: TNode
) => InViewport(mode, inView => When(inView, then, otherwise ?? Empty))
