import { Readable } from 'stream'
import { Value } from '@tempots/core'
import type { Renderable, Providers } from '@tempots/dom'
import {
  HeadlessContext,
  HeadlessPortal,
  runHeadless,
  type StreamOptions,
} from '@tempots/dom'

/**
 * Options for server-side rendering.
 * @public
 */
export interface RenderOptions {
  /**
   * Streaming lifecycle callbacks.
   */
  onShellReady?: () => void
  onAllReady?: () => void
  onError?: (error: Error) => void

  /**
   * Initial URL for routing (defaults to 'https://example.com').
   */
  url?: string

  /**
   * The selector used to find the root element (defaults to 'body').
   */
  selector?: string

  /**
   * Whether to generate hydration placeholder attributes.
   */
  generatePlaceholders?: boolean

  /**
   * Providers to inject during rendering.
   */
  providers?: Providers
}

/**
 * Result of a headless render operation.
 * @public
 */
export interface HeadlessRenderResult {
  /**
   * The root portal containing the rendered content.
   */
  root: HeadlessPortal

  /**
   * Function to clear/dispose the rendered content.
   */
  clear: (removeTree?: boolean) => void

  /**
   * Current URL signal (useful for routing).
   */
  currentURL: ReturnType<typeof Value.toSignal>['deriveProp']
}

/**
 * Renders a Renderable to a Node.js Readable stream.
 *
 * This function enables streaming server-side rendering, allowing the server
 * to start sending HTML to the client before the entire page is rendered.
 * This improves Time To First Byte (TTFB) for large pages.
 *
 * @example
 * ```typescript
 * import { renderToStream } from '@tempots/server'
 * import { html } from '@tempots/dom'
 *
 * const App = () => html.div(
 *   html.h1('Hello, World!'),
 *   html.p('This is streamed from the server.')
 * )
 *
 * // Express example
 * app.get('/', (req, res) => {
 *   const stream = renderToStream(App(), { url: req.url })
 *   stream.pipe(res)
 * })
 * ```
 *
 * @param renderable - The Renderable to render.
 * @param options - Rendering options.
 * @returns A Node.js Readable stream of HTML chunks.
 * @public
 */
export function renderToStream(
  renderable: Renderable,
  options: RenderOptions = {}
): Readable {
  return renderFactoryToStream(() => () => renderable, options)
}

function renderFactoryToStream(
  prepareFactory: () => (() => Renderable) | Promise<() => Renderable>,
  options: RenderOptions
): Readable {
  const {
    url = 'https://example.com',
    selector = 'body',
    generatePlaceholders = false,
    providers = {},
    onShellReady,
    onAllReady,
    onError,
  } = options

  let cancelPreparation!: () => void
  const cancelled = new Promise<undefined>(resolve => {
    cancelPreparation = () => resolve(undefined)
  })

  async function* renderChunks(): AsyncGenerator<string> {
    try {
      const factory = await Promise.race([prepareFactory(), cancelled])
      if (factory === undefined || stream.destroyed) return

      const { root, clear } = runHeadless(factory, {
        startUrl: url,
        selector,
        providers,
      })
      try {
        onShellReady?.()
        yield* streamPortalContent(root, { generatePlaceholders })
        if (!stream.destroyed) onAllReady?.()
      } finally {
        clear(false)
      }
    } catch (error) {
      const failure = error instanceof Error ? error : new Error(String(error))
      if (!stream.destroyed) onError?.(failure)
      throw failure
    }
  }

  const stream = Readable.from(renderChunks(), {
    objectMode: false,
    highWaterMark: 16 * 1024,
    destroy(error, callback) {
      cancelPreparation()
      callback(error)
    },
  })
  return stream
}

/**
 * Renders a Renderable to an HTML string.
 *
 * This is a simpler alternative to `renderToStream` when streaming is not needed.
 * It waits for the entire render to complete before returning the HTML string.
 *
 * @example
 * ```typescript
 * import { renderToString } from '@tempots/server'
 * import { html } from '@tempots/dom'
 *
 * const App = () => html.div(
 *   html.h1('Hello, World!'),
 *   html.p('This is rendered on the server.')
 * )
 *
 * const html = await renderToString(App())
 * ```
 *
 * @param renderable - The Renderable to render.
 * @param options - Rendering options.
 * @returns A Promise that resolves to the HTML string.
 * @public
 */
export async function renderToString(
  renderable: Renderable,
  options: Omit<RenderOptions, 'onShellReady' | 'onAllReady'> = {}
): Promise<string> {
  return renderFactoryToString(() => renderable, options)
}

async function renderFactoryToString(
  factory: () => Renderable,
  options: Omit<RenderOptions, 'onShellReady' | 'onAllReady'>
): Promise<string> {
  const {
    url = 'https://example.com',
    selector = 'body',
    generatePlaceholders = false,
    providers = {},
    onError,
  } = options

  try {
    // Render to headless context
    const { root, clear } = runHeadless(factory, {
      startUrl: url,
      selector,
      providers,
    })

    try {
      return collectPortalHTML(root, generatePlaceholders)
    } finally {
      clear(false)
    }
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error))
    onError?.(err)
    throw err
  }
}

/**
 * Renders a Renderable to static HTML markup without hydration markers.
 *
 * Use this when you don't need client-side hydration, such as for
 * generating static HTML pages, emails, or PDFs.
 *
 * @example
 * ```typescript
 * import { renderToStaticMarkup } from '@tempots/server'
 * import { html } from '@tempots/dom'
 *
 * const EmailTemplate = () => html.div(
 *   html.h1('Welcome!'),
 *   html.p('Thank you for signing up.')
 * )
 *
 * const markup = await renderToStaticMarkup(EmailTemplate())
 * ```
 *
 * @param renderable - The Renderable to render.
 * @param options - Rendering options (generatePlaceholders is forced to false).
 * @returns A Promise that resolves to the static HTML string.
 * @public
 */
export async function renderToStaticMarkup(
  renderable: Renderable,
  options: Omit<
    RenderOptions,
    'onShellReady' | 'onAllReady' | 'generatePlaceholders'
  > = {}
): Promise<string> {
  return renderToString(renderable, {
    ...options,
    generatePlaceholders: false,
  })
}

/**
 * Streams the content of a portal and all nested portals.
 *
 * @param root - The root portal to stream.
 * @param options - Streaming options.
 * @yields HTML string chunks.
 * @internal
 */
async function* streamPortalContent(
  root: HeadlessPortal,
  options: StreamOptions
): AsyncGenerator<string> {
  // Stream the root portal's direct content
  yield* root.contentToHTMLStream(options)

  // Stream nested portals
  const nestedPortals = root.getPortals().filter(p => p !== root)
  for (const portal of nestedPortals) {
    yield* portal.contentToHTMLStream(options)
  }
}

/**
 * Collects HTML from a portal and all nested portals synchronously.
 *
 * @param root - The root portal to collect from.
 * @param generatePlaceholders - Whether to include hydration markers.
 * @returns The collected HTML string.
 * @internal
 */
function collectPortalHTML(
  root: HeadlessPortal,
  generatePlaceholders: boolean
): string {
  const parts: string[] = []

  // Collect root portal content
  parts.push(root.contentToHTML(generatePlaceholders))

  // Collect nested portal content
  const nestedPortals = root.getPortals().filter(p => p !== root)
  for (const portal of nestedPortals) {
    parts.push(portal.contentToHTML(generatePlaceholders))
  }

  return parts.join('')
}

// ============================================================================
// High-Level Server API
// ============================================================================

/**
 * Options for createRenderer.
 * @public
 */
export interface RendererOptions<O extends Record<string, unknown>> {
  /**
   * Generate hydration placeholders in the output.
   * @default true
   */
  hydrate?: boolean

  /**
   * Function to get initial data for each request.
   * The returned object will be passed to the App component.
   */
  getData?: (url: string) => O | Promise<O>

  /**
   * The selector used to find the root element.
   * @default "body"
   */
  selector?: string

  /**
   * Providers to inject during rendering.
   */
  providers?: Providers
}

/**
 * Result of createRenderer containing render functions.
 * @public
 */
export interface Renderer {
  /**
   * Renders the app to an HTML string.
   */
  render: (url: string) => Promise<string>

  /**
   * Renders the app to a Node.js Readable stream.
   */
  renderStream: (url: string) => Readable
}

/**
 * Creates standard render functions for SSR entry points.
 *
 * This is a high-level convenience function that creates the standard
 * `render()` and `renderStream()` exports for your entry-server.ts file.
 *
 * For more control, use the lower-level `renderToString()` and `renderToStream()` functions directly.
 *
 * @example
 * ```typescript
 * // entry-server.ts
 * import { createRenderer } from '@tempots/server'
 * import { App } from './app'
 *
 * export const { render, renderStream } = createRenderer(App, {
 *   getData: (url) => ({
 *     timestamp: new Date().toISOString(),
 *     path: new URL(url, 'https://example.com').pathname
 *   })
 * })
 *
 * export { App }
 * ```
 *
 * @example
 * ```typescript
 * // Without getData (for simple apps)
 * export const { render, renderStream } = createRenderer(App)
 * ```
 *
 * @param App - The app component factory function.
 * @param options - Renderer options.
 * @returns An object with `render` and `renderStream` functions.
 * @public
 */
export function createRenderer<O extends Record<string, unknown>>(
  App: (options: O) => Renderable,
  options: RendererOptions<O> = {}
): Renderer {
  const { hydrate = true, getData, selector = 'body', providers = {} } = options

  /**
   * Renders the app to an HTML string.
   */
  async function render(url: string): Promise<string> {
    const data = getData ? await getData(url) : ({} as O)

    return renderFactoryToString(() => App(data), {
      url,
      selector,
      providers,
      generatePlaceholders: hydrate,
    })
  }

  /**
   * Renders the app to a Node.js Readable stream.
   */
  function renderStreamFn(url: string): Readable {
    return renderFactoryToStream(
      async () => {
        const data = getData ? await getData(url) : ({} as O)
        return () => App(data)
      },
      { url, selector, providers, generatePlaceholders: hydrate }
    )
  }

  return {
    render,
    renderStream: renderStreamFn,
  }
}

// Re-export useful types from @tempots/dom for convenience
export type { Renderable, Providers, StreamOptions }
export { runHeadless, HeadlessContext, HeadlessPortal }
