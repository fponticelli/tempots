import type { Renderable } from '../types/domain'
import type { HTMLEvents } from '../types/html-events'
import { DOMContext, HandlerOptions } from '../dom/dom-context'
import { domRenderable } from '../types/domain'
import { BrowserContext } from '../dom/browser-context'

const delegatedHandler = <T extends Event>(
  name: string,
  selector: string,
  handler: (event: T, ctx: DOMContext) => void,
  options?: HandlerOptions
): Renderable => {
  const r = domRenderable((ctx: DOMContext) => {
    if (!ctx.isBrowser()) {
      return () => {}
    }

    const el = (ctx as BrowserContext).element

    const listener = (event: Event) => {
      const target = (event.target as Element)?.closest(selector)
      if (target != null && el.contains(target)) {
        handler(event as T, ctx)
      }
    }

    el.addEventListener(name, listener, options)
    return (removeTree: boolean) => {
      if (removeTree) {
        el.removeEventListener(name, listener, options)
      }
    }
  }) as Renderable & Record<string, unknown>
  r.kind = 'dynamic-attr'
  return r
}

/**
 * Provides type-safe delegated event handlers for all HTML events.
 *
 * The `delegate` object is a proxy that creates event handlers attached to the
 * **container element** rather than individual children. Events are matched
 * against a CSS selector using `Element.closest()`, making this ideal for lists
 * and other containers with many similar children.
 *
 * Unlike `on`, which attaches one listener per element, `delegate` attaches a
 * single listener on the container regardless of how many children match.
 *
 * @example
 * ```typescript
 * // Delegated click on list items — one listener on the <ul>
 * html.ul(
 *   delegate.click('li', (event, ctx) => {
 *     const li = (event.target as Element).closest('li')!
 *     console.log('Clicked:', li.textContent)
 *   }),
 *   ForEach(items, (item) => html.li(item))
 * )
 * ```
 *
 * @example
 * ```typescript
 * // Delegated click on buttons inside a toolbar
 * html.div(
 *   delegate.click('button', (event) => {
 *     const btn = (event.target as Element).closest('button')!
 *     console.log('Button clicked:', btn.dataset.action)
 *   }),
 *   html.button(attr.data('action', 'save'), 'Save'),
 *   html.button(attr.data('action', 'cancel'), 'Cancel')
 * )
 * ```
 *
 * @remarks
 * Delegated events rely on event bubbling. Events that do not bubble (such as
 * `focus`, `blur`, `mouseenter`, `mouseleave`) will not be captured by
 * delegation. Use the regular `on` handler for those events.
 *
 * @public
 */
export const delegate = new Proxy(
  {} as {
    [EN in keyof HTMLEvents]: (
      selector: string,
      handler: (event: HTMLEvents[EN], ctx: DOMContext) => void,
      options?: HandlerOptions
    ) => Renderable
  },
  {
    get: (_, name: keyof HTMLEvents) => {
      return (
        selector: string,
        fn: (event: HTMLEvents[typeof name], ctx: DOMContext) => void,
        options?: HandlerOptions
      ) => delegatedHandler(name, selector, fn, options)
    },
  }
)
