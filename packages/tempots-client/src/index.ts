import { DisposalScope, withScope, type Primitive } from '@tempots/core'
import type { Renderable, Providers } from '@tempots/dom'
import {
  BrowserContext,
  DOMContext,
  HYDRATION_ID_ATTR,
  HYDRATION_POSITION_ATTR,
} from '@tempots/dom'
import { HydrationState } from './hydration-state'

/**
 * Options for client-side hydration.
 * @public
 */
export interface HydrateOptions {
  /**
   * Providers to inject during hydration.
   */
  providers?: Providers

  /**
   * Whether to remove hydration markers after hydration completes.
   * Defaults to true.
   */
  removeMarkers?: boolean
}

/**
 * Hydrates server-rendered HTML with client-side interactivity.
 *
 * This function takes a server-rendered container and attaches event handlers
 * and reactive updates to the existing DOM nodes without re-creating them.
 *
 * @example
 * ```typescript
 * import { hydrate } from '@tempots/client'
 * import { App } from './App'
 *
 * // Server-rendered HTML is already in the DOM
 * // Hydrate it with client-side interactivity
 * const cleanup = hydrate(App(), document.getElementById('app')!)
 *
 * // Later, to remove all event listeners:
 * cleanup()
 * ```
 *
 * @param renderable - The Renderable to hydrate with (should match server render).
 * @param container - The container element with server-rendered content.
 * @param options - Hydration options.
 * @returns A cleanup function that removes all event listeners and disposes signals.
 * @public
 */
export function hydrate(
  renderable: Renderable,
  container: HTMLElement,
  options: HydrateOptions = {}
): (removeTree?: boolean) => void {
  const { providers = {}, removeMarkers = true } = options
  const state = new HydrationState(removeMarkers)

  // Create a disposal scope for automatic signal tracking
  const scope = new DisposalScope()

  // Create the hydration context
  const ctx = new HydrationContext(
    container.ownerDocument,
    container,
    undefined,
    providers,
    new Map(),
    0,
    state
  )

  // Execute the renderable within the scope
  const clear = withScope(scope, () => renderable.render(ctx))
  state.finish()

  // Remove hydration markers if requested
  if (removeMarkers) {
    removeHydrationMarkers(container)
  }

  return (removeTree: boolean = false) => {
    scope.dispose()
    clear(removeTree)
  }
}

/**
 * Removes hydration marker attributes from all elements in the container.
 *
 * @param container - The container to clean up.
 * @internal
 */
function removeHydrationMarkers(container: HTMLElement): void {
  const elements = container.querySelectorAll(`[${HYDRATION_ID_ATTR}]`)
  elements.forEach(el => {
    el.removeAttribute(HYDRATION_ID_ATTR)
    el.removeAttribute(HYDRATION_POSITION_ATTR)
    el.removeAttribute('data-tts-node')
  })
}

/**
 * A DOMContext implementation for hydration that reuses existing DOM nodes.
 *
 * During hydration, instead of creating new DOM elements, this context
 * finds and reuses existing elements that were rendered on the server.
 * Event handlers are attached to the existing elements.
 *
 * @public
 */
export class HydrationContext extends BrowserContext {
  constructor(
    document: Document,
    element: HTMLElement,
    reference: Node | undefined,
    providers: Providers,
    private readonly hydrationMap: Map<string, HTMLElement>,
    private readonly startIndex: number,
    private readonly state = new HydrationState(false)
  ) {
    super(document, element, reference, providers)
  }

  /**
   * Finds the next child element instead of creating a new one.
   * Falls back to creating a new element if hydration fails.
   */
  override makeChildElement(
    tagName: string,
    namespace: string | undefined
  ): DOMContext {
    const child = this.state.take(
      this.element,
      this.reference,
      this.startIndex,
      'element',
      candidate =>
        candidate.nodeType === 1 &&
        (candidate as Element).localName.toLowerCase() ===
          tagName.toLowerCase() &&
        (candidate as Element).namespaceURI ===
          (namespace ?? 'http://www.w3.org/1999/xhtml')
    ) as HTMLElement | undefined

    if (child) return this.withElement(child)
    if (this.state.active) {
      console.warn(
        `Hydration mismatch: could not find element <${tagName}> in container`
      )
    }
    return super.makeChildElement(tagName, namespace)
  }

  override makeChildText(value: Primitive): DOMContext {
    const text = String(value)
    const child = this.state.take(
      this.element,
      this.reference,
      this.startIndex,
      'text',
      candidate => candidate.nodeType === 3
    )
    if (!child) return super.makeChildText(text)
    if (child.nodeValue !== text) child.nodeValue = text
    return this.withReference(child)
  }

  override makeRef(): DOMContext {
    const child = this.state.take(
      this.element,
      this.reference,
      this.startIndex,
      'anchor',
      candidate =>
        candidate.nodeType === 8 ||
        (candidate.nodeType === 3 && candidate.nodeValue === '')
    )
    return child ? this.withReference(child) : super.makeRef()
  }

  protected override deriveContext(
    document: Document,
    element: HTMLElement,
    reference: Node | undefined,
    providers: Providers
  ): BrowserContext {
    if (!this.state.active) {
      return super.deriveContext(document, element, reference, providers)
    }
    return new HydrationContext(
      document,
      element,
      reference,
      providers,
      this.hydrationMap,
      element === this.element ? this.startIndex : 0,
      this.state
    )
  }

  override canCloneTemplates(): boolean {
    return !this.state.active
  }

  override moveRangeBefore(
    startRef: DOMContext,
    endRef: DOMContext,
    targetRef: DOMContext
  ): void {
    if (
      this.state.active &&
      this.state.isServerAnchor((startRef as BrowserContext).reference!) &&
      this.state.isServerAnchor((endRef as BrowserContext).reference!) &&
      this.state.isServerAnchor((targetRef as BrowserContext).reference!)
    ) {
      return
    }
    super.moveRangeBefore(startRef, endRef, targetRef)
  }

  override detach(): void {
    if (!this.state.active) super.detach()
  }
}

// ============================================================================
// Islands Architecture
// ============================================================================

/**
 * Attribute name for island markers.
 * @public
 */
export const ISLAND_ATTR = 'data-tempo-island'

/**
 * Attribute name for island hydration strategy.
 * @public
 */
export const ISLAND_HYDRATE_ATTR = 'data-tempo-hydrate'

/**
 * Attribute name for serialized island options.
 * @public
 */
export const ISLAND_OPTIONS_ATTR = 'data-tempo-options'

/**
 * Hydration strategy for islands.
 *
 * - `"immediate"` - Hydrate as soon as possible (client:load)
 * - `"idle"` - Hydrate when the browser is idle (client:idle)
 * - `"visible"` - Hydrate when scrolled into view (client:visible)
 * - `"media"` - Hydrate when a media query matches
 *
 * @public
 */
export type HydrationStrategy =
  | 'immediate'
  | 'idle'
  | 'visible'
  | { media: string }

/**
 * Options for island hydration.
 * @public
 */
export interface IslandHydrateOptions {
  /**
   * Providers to inject during hydration.
   */
  providers?: Providers
}

/**
 * Island component factory type.
 * Options are received from JSON deserialization and typed as `unknown`.
 * Components should cast options to their expected type internally.
 *
 * @example
 * ```typescript
 * interface CounterOptions { initial?: number }
 *
 * const Counter: IslandComponent = (options) => {
 *   const { initial = 0 } = (options ?? {}) as CounterOptions;
 *   return html.div(/* ... *\/)
 * }
 * ```
 * @public
 */
export type IslandComponent = (options: unknown) => Renderable

/**
 * Island component registry type.
 * Maps island names to their component factories.
 * @public
 */
export type IslandRegistry = Record<string, IslandComponent>

/**
 * Hydrates a single island element with the given component.
 *
 * Unlike full hydration, islands are re-rendered fresh on the client.
 * The server-rendered HTML is replaced with the interactive component.
 * This is simpler and more reliable than trying to match existing DOM.
 *
 * @example
 * ```typescript
 * import { hydrateIsland } from '@tempots/client'
 * import { Counter } from './islands/Counter'
 *
 * const element = document.querySelector('[data-tempo-island="Counter"]')
 * const options = JSON.parse(element.dataset.tempoProps || '{}')
 *
 * hydrateIsland(element, Counter, options)
 * ```
 *
 * @param element - The island container element.
 * @param component - The component factory function.
 * @param componentOptions - Options to pass to the component.
 * @param hydrateOptions - Hydration options.
 * @returns A cleanup function.
 * @public
 */
export function hydrateIsland<O>(
  element: HTMLElement,
  component: (options: O) => Renderable,
  componentOptions: O,
  hydrateOptions: IslandHydrateOptions = {}
): () => void {
  // Clear the server-rendered placeholder content
  element.innerHTML = ''

  // Create a fresh BrowserContext and render the component
  const ctx = new BrowserContext(
    element.ownerDocument,
    element,
    undefined,
    hydrateOptions.providers ?? {}
  )

  const scope = new DisposalScope()
  const clear = withScope(scope, () => component(componentOptions).render(ctx))

  return (removeTree: boolean = false) => {
    scope.dispose()
    clear(removeTree)
  }
}

/**
 * Schedules island hydration based on the specified strategy.
 *
 * @param element - The island element to hydrate.
 * @param strategy - When to hydrate the island.
 * @param hydrateCallback - Function to call when hydration should occur.
 * @returns A cleanup function to cancel scheduled hydration.
 * @internal
 */
function scheduleHydration(
  element: HTMLElement,
  strategy: HydrationStrategy,
  hydrateCallback: () => void
): () => void {
  if (strategy === 'immediate') {
    hydrateCallback()
    return () => {}
  }

  if (strategy === 'idle') {
    if ('requestIdleCallback' in window) {
      const id = requestIdleCallback(hydrateCallback)
      return () => cancelIdleCallback(id)
    } else {
      // Fallback for browsers without requestIdleCallback
      const id = setTimeout(hydrateCallback, 1)
      return () => clearTimeout(id)
    }
  }

  if (strategy === 'visible') {
    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            observer.disconnect()
            hydrateCallback()
            break
          }
        }
      },
      { rootMargin: '50px' }
    )
    observer.observe(element)
    return () => observer.disconnect()
  }

  if (typeof strategy === 'object' && 'media' in strategy) {
    const mediaQuery = window.matchMedia(strategy.media)
    if (mediaQuery.matches) {
      hydrateCallback()
      return () => {}
    }

    const handler = (e: MediaQueryListEvent) => {
      if (e.matches) {
        mediaQuery.removeEventListener('change', handler)
        hydrateCallback()
      }
    }
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }

  // Default to immediate
  hydrateCallback()
  return () => {}
}

/**
 * Parses the hydration strategy from a string attribute.
 *
 * @param value - The attribute value (e.g., "visible", "idle", "media:(min-width: 768px)")
 * @returns The parsed hydration strategy.
 * @internal
 */
function parseStrategy(value: string | null): HydrationStrategy {
  if (!value || value === 'immediate' || value === 'load') {
    return 'immediate'
  }
  if (value === 'idle') {
    return 'idle'
  }
  if (value === 'visible') {
    return 'visible'
  }
  if (value.startsWith('media:')) {
    return { media: value.slice(6).trim() }
  }
  return 'immediate'
}

/**
 * Initializes all islands in the document using the provided registry.
 *
 * This function scans the document for elements with `data-tempo-island` attributes
 * and hydrates them using the corresponding component from the registry.
 *
 * @example
 * ```typescript
 * import { initIslands } from '@tempots/client'
 * import { Counter } from './islands/Counter'
 * import { TodoList } from './islands/TodoList'
 *
 * // Initialize all islands
 * const cleanup = initIslands({
 *   Counter,
 *   TodoList,
 * })
 *
 * // Later, to cleanup all islands:
 * cleanup()
 * ```
 *
 * @param registry - A map of island names to component factories.
 * @param options - Hydration options.
 * @returns A cleanup function that disposes all islands.
 * @public
 */
export function initIslands(
  registry: IslandRegistry,
  options: IslandHydrateOptions = {}
): () => void {
  const cleanups: Array<() => void> = []
  const elements = document.querySelectorAll(`[${ISLAND_ATTR}]`)

  elements.forEach(el => {
    const element = el as HTMLElement
    const islandName = element.getAttribute(ISLAND_ATTR)

    if (!islandName) {
      console.warn('[Tempo Islands] Element missing island name:', element)
      return
    }

    const component = registry[islandName]
    if (!component) {
      console.warn(
        `[Tempo Islands] Component "${islandName}" not found in registry`
      )
      return
    }

    // Parse options from data attribute
    const optionsStr = element.getAttribute(ISLAND_OPTIONS_ATTR)
    let componentOptions: unknown = {}
    if (optionsStr) {
      try {
        componentOptions = JSON.parse(optionsStr)
      } catch (e) {
        console.warn(
          `[Tempo Islands] Failed to parse options for "${islandName}":`,
          e
        )
      }
    }

    // Parse hydration strategy
    const strategyStr = element.getAttribute(ISLAND_HYDRATE_ATTR)
    const strategy = parseStrategy(strategyStr)

    // Schedule hydration
    const cancelSchedule = scheduleHydration(element, strategy, () => {
      const cleanup = hydrateIsland(
        element,
        component,
        componentOptions,
        options
      )
      cleanups.push(cleanup)

      // Remove island markers after hydration
      element.removeAttribute(ISLAND_ATTR)
      element.removeAttribute(ISLAND_HYDRATE_ATTR)
      element.removeAttribute(ISLAND_OPTIONS_ATTR)
    })

    cleanups.push(cancelSchedule)
  })

  return () => {
    cleanups.forEach(cleanup => cleanup())
  }
}

/**
 * Creates an island marker for server-side rendering.
 *
 * This function returns attributes that should be added to the island's
 * root element during SSR to enable client-side hydration.
 *
 * @example
 * ```typescript
 * // In your SSR template
 * const Counter = (options: CounterOptions) => {
 *   return html.div(
 *     ...islandMarker('Counter', options, 'visible'),
 *     // ... counter implementation
 *   )
 * }
 * ```
 *
 * @param name - The island component name (must match registry key).
 * @param options - Options to serialize for client-side hydration.
 * @param strategy - When to hydrate the island.
 * @returns An array of attribute setters for the island element.
 * @public
 */
export function islandMarker(
  name: string,
  options: unknown = {},
  strategy: HydrationStrategy = 'visible'
): Array<{ name: string; value: string }> {
  const strategyStr =
    typeof strategy === 'object' ? `media:${strategy.media}` : strategy

  return [
    { name: ISLAND_ATTR, value: name },
    { name: ISLAND_OPTIONS_ATTR, value: JSON.stringify(options) },
    { name: ISLAND_HYDRATE_ATTR, value: strategyStr },
  ]
}

// ============================================================================
// High-Level Client API
// ============================================================================

/**
 * Options for the startClient function.
 * @public
 */
export interface ClientOptions<R extends IslandRegistry> {
  /**
   * App component for client-only rendering.
   * If provided and no SSR content is detected, this will be rendered.
   */
  app?: () => Renderable

  /**
   * Island component registry.
   * Maps island names to their component factories.
   */
  islands: R

  /**
   * Container selector or element.
   * @default "#app"
   */
  container?: string | HTMLElement

  /**
   * Providers to inject during hydration.
   */
  providers?: Providers

  /**
   * Enable debug logging.
   * @default false
   */
  debug?: boolean
}

/**
 * Initializes the Tempo client with automatic SSR detection.
 *
 * This is a high-level convenience function that handles:
 * - Container detection
 * - SSR vs client-only mode detection
 * - Island initialization
 * - HMR cleanup (when available)
 *
 * For more control, use the lower-level `initIslands()` and `hydrateIsland()` functions directly.
 *
 * @example
 * ```typescript
 * // Minimal usage - islands only
 * import { startClient } from '@tempots/client'
 * import { Counter, TodoList } from './islands'
 *
 * startClient({
 *   islands: { Counter, TodoList }
 * })
 * ```
 *
 * @example
 * ```typescript
 * // With client-only fallback
 * import { startClient } from '@tempots/client'
 * import { App, Counter } from './app'
 *
 * startClient({
 *   app: () => App(),
 *   islands: { Counter },
 *   debug: true
 * })
 * ```
 *
 * @param options - Client configuration options.
 * @returns A cleanup function that disposes all islands and removes event listeners.
 * @public
 */
export function startClient<R extends IslandRegistry>(
  options: ClientOptions<R>
): () => void {
  const {
    app,
    islands,
    container: containerOption = '#app',
    providers = {},
    debug = false,
  } = options

  const log = debug
    ? (message: string) => console.log(`[Tempo] ${message}`)
    : () => {}

  // Find container
  const container =
    typeof containerOption === 'string'
      ? document.querySelector<HTMLElement>(containerOption)
      : containerOption

  if (!container) {
    const selector =
      typeof containerOption === 'string' ? containerOption : '(element)'
    console.error(`[Tempo] Could not find container: ${selector}`)
    return () => {}
  }

  // Detect SSR mode by checking for island markers
  const hasSSRContent = container.querySelector(`[${ISLAND_ATTR}]`) !== null

  let cleanup: () => void

  if (hasSSRContent) {
    // SSR mode: Just initialize islands, don't re-render the app
    log('SSR mode: Initializing islands...')
    cleanup = initIslands(islands, { providers })
    log('Islands initialized! Static content stays static.')
  } else if (app) {
    // Client-only mode: Render the full app, then initialize islands
    log('Client-only mode: Rendering app...')
    const ctx = new BrowserContext(document, container, undefined, providers)
    const scope = new DisposalScope()
    const clear = withScope(scope, () => app().render(ctx))
    const islandCleanup = initIslands(islands, { providers })

    cleanup = () => {
      islandCleanup()
      scope.dispose()
      clear(true)
    }
    log('App rendered and islands initialized!')
  } else {
    // No SSR content and no app provided - just initialize any islands
    log('No SSR content detected, initializing islands only...')
    cleanup = initIslands(islands, { providers })
  }

  // Set up HMR cleanup if available
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const hot = (import.meta as any).hot
  if (hot) {
    hot.dispose(() => {
      log('HMR cleanup...')
      cleanup()
    })
  }

  return cleanup
}

// Re-export useful types
export type { Renderable, Providers }
export { HYDRATION_ID_ATTR }
