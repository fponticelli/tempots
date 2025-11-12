import { TNode } from '../types/domain'
import { Fragment } from './fragment'
import { OnDispose } from './on-dispose'
import { renderWithContext } from './render'
import { WithBrowserCtx } from './with-browser-ctx'

export interface IFrameOptions {
  /**
   * The URL of the page to embed in the iframe.
   */
  src?: string
  /**
   * The name of the iframe.
   */
  name?: string
  /**
   * The width of the iframe.
   */
  width?: string | number
  /**
   * The height of the iframe.
   */
  height?: string | number
  /**
   * The sandbox attribute for the iframe.
   */
  sandbox?: string
  /**
   * The allow attribute for the iframe.
   */
  allow?: string
  /**
   * The referrerpolicy attribute for the iframe.
   */
  referrerpolicy?: string
  /**
   * The loading attribute for the iframe.
   */
  loading?: 'eager' | 'lazy'
  /**
   * Callback function that is called when the iframe is loaded.
   * Receives the iframe element and its contentDocument.
   */
  onLoad?: (iframe: HTMLIFrameElement, doc: Document) => void
}

/**
 * Creates an iframe element and optionally renders content into its document.
 *
 * When children are provided, they are rendered into the iframe's contentDocument.
 * This allows you to create isolated DOM contexts with their own styles and scripts.
 *
 * @example
 * ```typescript
 * // Simple iframe with src
 * IFrame({ src: 'https://example.com', width: 800, height: 600 })
 * ```
 *
 * @example
 * ```typescript
 * // Iframe with rendered content
 * IFrame(
 *   { width: 800, height: 600 },
 *   html.div(
 *     html.style('body { font-family: sans-serif; }'),
 *     html.h1('Hello from iframe!'),
 *     html.p('This content is rendered inside the iframe')
 *   )
 * )
 * ```
 *
 * @example
 * ```typescript
 * // Iframe with onLoad callback
 * IFrame(
 *   {
 *     width: 800,
 *     height: 600,
 *     onLoad: (iframe, doc) => {
 *       console.log('Iframe loaded:', doc.title)
 *     }
 *   },
 *   html.div('Content')
 * )
 * ```
 *
 * @param options - Configuration options for the iframe
 * @param children - Optional content to render inside the iframe's document
 * @returns A renderable that creates and manages the iframe
 * @public
 */
export function IFrame(options: IFrameOptions = {}, ...children: TNode[]) {
  return WithBrowserCtx(ctx => {
    const iframe = ctx.document.createElement('iframe')

    // Set iframe attributes
    if (options.src !== undefined) iframe.src = options.src
    if (options.name !== undefined) iframe.name = options.name
    if (options.width !== undefined) {
      iframe.width =
        typeof options.width === 'number'
          ? options.width.toString()
          : options.width
    }
    if (options.height !== undefined) {
      iframe.height =
        typeof options.height === 'number'
          ? options.height.toString()
          : options.height
    }
    if (options.sandbox !== undefined) iframe.sandbox.value = options.sandbox
    if (options.allow !== undefined) iframe.allow = options.allow
    if (options.referrerpolicy !== undefined)
      iframe.referrerPolicy = options.referrerpolicy
    if (options.loading !== undefined) iframe.loading = options.loading

    // Append iframe to parent
    ctx.appendOrInsert(iframe)

    let contentClear: ((removeTree: boolean) => void) | undefined
    let loadHandled = false

    // Handle iframe load event
    const handleLoad = () => {
      // Prevent double execution
      if (loadHandled) return
      loadHandled = true

      const iframeDoc = iframe.contentDocument
      if (!iframeDoc) return

      // Call onLoad callback if provided
      if (options.onLoad) {
        options.onLoad(iframe, iframeDoc)
      }

      // Render children into iframe document if provided
      if (children.length > 0) {
        const iframeBody = iframeDoc.body
        if (iframeBody) {
          const iframeCtx = ctx.withElement(
            iframeBody as unknown as HTMLElement
          )
          contentClear = renderWithContext(Fragment(...children), iframeCtx)
        }
      }
    }

    // Only set up load handler if we have children or onLoad callback
    if (children.length > 0 || options.onLoad) {
      iframe.addEventListener('load', handleLoad)

      // If there's no src, the iframe is already "loaded"
      if (!options.src) {
        // Use setTimeout to ensure the iframe's document is ready
        setTimeout(handleLoad, 0)
      }
    }

    // Create a new context for the iframe element
    const iframeCtx = ctx.withElement(iframe as unknown as HTMLElement)

    return OnDispose(() => {
      // Remove load event listener first
      if (children.length > 0 || options.onLoad) {
        iframe.removeEventListener('load', handleLoad)
      }

      // Clean up content rendered in iframe BEFORE removing iframe from DOM
      // This ensures the iframe's document is still accessible
      if (contentClear) {
        contentClear(false) // Don't remove the tree, just dispose signals
      }

      // Remove iframe from DOM (this will also remove all its content)
      iframeCtx.clear(true)
    })
  })
}
