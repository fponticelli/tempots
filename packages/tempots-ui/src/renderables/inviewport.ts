import {
  Prop,
  Signal,
  prop,
  TNode,
  Renderable,
  renderableOfTNode,
  Empty,
  Fragment,
  WithElement,
  When,
  OnDispose,
} from '@tempots/dom'

/**
 * Represents the mode for determining if an element is in the viewport.
 *
 * - `partial`: Indicates that the element is considered in the viewport if any part of it is visible.
 * - `full`: Indicates that the element is considered in the viewport only if it is fully visible.
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

export type InViewportOptions = {
  mode?: InViewportMode
  once?: boolean
}

/**
 * Creates a component that tracks whether an element is visible in the viewport.
 *
 * This component uses the Intersection Observer API to efficiently detect when an element
 * enters or exits the viewport. It's perfect for implementing lazy loading, infinite scrolling,
 * animations on scroll, and other viewport-based interactions.
 *
 * @example
 * ```typescript
 * // Basic viewport detection
 * InViewport(
 *   { mode: 'partial' },
 *   (isVisible) => html.div(
 *     attr.class(isVisible.map(v => v ? 'visible' : 'hidden')),
 *     'This element changes class when visible'
 *   )
 * )
 * ```
 *
 * @example
 * ```typescript
 * // Lazy load images
 * const imageUrl = 'https://example.com/large-image.jpg'
 *
 * InViewport(
 *   { mode: 'partial', once: true },
 *   (isVisible) => isVisible.value
 *     ? html.img(attr.src(imageUrl), attr.alt('Lazy loaded image'))
 *     : html.div(attr.class('placeholder'), 'Loading...')
 * )
 * ```
 *
 * @example
 * ```typescript
 * // Infinite scrolling trigger
 * const loadMore = () => {
 *   // Load more data
 *   console.log('Loading more items...')
 * }
 *
 * html.div(
 *   ForEach(items, item => ItemComponent(item)),
 *   InViewport(
 *     { mode: 'partial' },
 *     (isVisible) => {
 *       // Trigger load more when sentinel comes into view
 *       isVisible.on(visible => {
 *         if (visible) loadMore()
 *       })
 *       return html.div(attr.class('loading-sentinel'), 'Loading more...')
 *     }
 *   )
 * )
 * ```
 *
 * @example
 * ```typescript
 * // Animation on scroll
 * InViewport(
 *   { mode: 'full' }, // Only trigger when fully visible
 *   (isVisible) => html.div(
 *     attr.class(isVisible.map(v =>
 *       v ? 'animate-fade-in' : 'opacity-0'
 *     )),
 *     'This animates when fully in view'
 *   )
 * )
 * ```
 *
 * @param options - Configuration options for viewport detection
 * @param options.mode - 'partial' (any part visible) or 'full' (completely visible)
 * @param options.once - If true, stops observing after first intersection
 * @param fn - Function that receives the visibility signal and returns content to render
 * @returns A renderable component that tracks viewport visibility
 * @public
 */
export const InViewport = (
  { mode = 'partial', once = false }: InViewportOptions,
  fn: (value: Signal<boolean>) => TNode
): Renderable => {
  const inView = prop(false)
  return Fragment(
    WithElement((el: HTMLElement) => {
      const observer =
        typeof IntersectionObserver !== 'undefined'
          ? ensureObserver(mode)
          : null
      maps[mode].set(el, inView)
      observer?.observe(el)

      function unwire() {
        observer?.unobserve(el)
        maps[mode].delete(el)
        if (maps[mode].size === 0) {
          observers[mode]?.disconnect()
          observers[mode] = null
        }
      }

      let clearOnce: (() => void) | null = null
      if (once) {
        clearOnce = inView.on(value => {
          if (value) {
            unwire()
          }
        })
      }

      return OnDispose(() => {
        inView.dispose()
        unwire()
        clearOnce?.()
      })
    }),
    renderableOfTNode(fn(inView))
  )
}

/**
 * Conditionally renders content based on whether an element is in the viewport.
 *
 * This is a convenience wrapper around `InViewport` that provides a simpler API
 * for cases where you just want to show/hide content based on viewport visibility.
 * It's perfect for simple lazy loading or reveal animations.
 *
 * @example
 * ```typescript
 * // Simple lazy loading
 * WhenInViewport(
 *   { mode: 'partial', once: true },
 *   () => html.img(
 *     attr.src('https://example.com/image.jpg'),
 *     attr.alt('Lazy loaded image')
 *   ),
 *   () => html.div(attr.class('skeleton'), 'Loading...')
 * )
 * ```
 *
 * @example
 * ```typescript
 * // Reveal animation
 * WhenInViewport(
 *   { mode: 'full' },
 *   () => html.div(
 *     attr.class('animate-slide-up'),
 *     'This content slides up when visible'
 *   )
 * )
 * ```
 *
 * @example
 * ```typescript
 * // Load expensive component only when needed
 * WhenInViewport(
 *   { mode: 'partial', once: true },
 *   () => ExpensiveChart({ data: chartData }),
 *   () => html.div('Chart will load when visible')
 * )
 * ```
 *
 * @param options - Configuration options for viewport detection
 * @param then - Function that returns content to render when element is in viewport
 * @param otherwise - Optional function that returns content when element is not in viewport
 * @returns A renderable component that conditionally shows content based on viewport visibility
 * @public
 */
export const WhenInViewport = (
  options: InViewportOptions,
  then: () => TNode,
  otherwise?: () => TNode
) =>
  InViewport(options, inView => When(inView, then, otherwise ?? (() => Empty)))
