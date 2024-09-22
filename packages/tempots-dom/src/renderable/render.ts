import type { Renderable } from '../types/domain'
import { DOMContext } from '../dom/dom-context'
import {
  _getSelfOrParentElement,
  _isElement,
  _removeDOMNode,
} from '../dom/dom-utils'
import { BrowserContext } from '../dom/browser-context'
import { HeadlessContext, HeadlessPortal } from '../dom/headless-context'
import { Value } from '../std/value'

/**
 * Renders the given `renderable` with the provided `ctx` DOM context.
 *
 * @param renderable - The renderable node to be rendered.
 * @param ctx - The DOM context to be used for rendering.
 * @returns A function that can be called to clear the rendered node.
 * @public
 */
export const renderWithContext = (renderable: Renderable, ctx: DOMContext) => {
  const clear = renderable(ctx)
  return () => clear(true)
}

/**
 * Options for rendering.
 * @public
 */
export type RenderOptions = {
  /**
   * The document to render to. It is inferred from the parent element if not provided.
   */
  doc?: Document
  /**
   * Whether to clear the document before rendering. This is useful when the page has been pre-rendered on the server.
   */
  clear?: boolean
}

/**
 * Renders a `Renderable` node into a specified parent element or selector.
 *
 * @param node - The `Renderable` node to render.
 * @param parent - The parent element or selector where the node should be rendered.
 * @param options - Optional rendering options.
 * @returns The result of rendering the `Renderable` node.
 * @throws Throws a `RenderingError` if the parent element cannot be found by the provided selector.
 * @public
 */
export const render = (
  node: Renderable,
  parent: Node | string,
  { doc, clear }: RenderOptions = {}
) => {
  const el =
    typeof parent === 'string'
      ? (doc ?? document).querySelector(parent)
      : parent
  if (el === null) {
    throw new RenderingError(
      `Cannot find element by selector for render: ${parent}`
    )
  }
  if (clear !== false && (doc ?? el.ownerDocument) != null) {
    if (el.nodeType === 1) (el as Element).innerHTML = ''
  }
  const element = _getSelfOrParentElement(el)
  const ref = _isElement(el) ? undefined : el
  const ctx = BrowserContext.of(element, ref)
  return renderWithContext(node, ctx)
}

export const runHeadless = (
  makeRenderable: () => Renderable,
  {
    startUrl = 'https://example.com',
    selector = ':root',
  }: { startUrl?: Value<string>; selector?: string } = {}
) => {
  const currentURL = Value.toSignal(startUrl).deriveProp()
  const root = new HeadlessPortal(selector, undefined)
  const ctx = new HeadlessContext(root, undefined, { currentURL }, {})
  const clear = renderWithContext(makeRenderable(), ctx)
  return {
    clear,
    root,
    currentURL,
  }
}

/**
 * Represents an error that occurs during rendering.
 * @public
 */
export class RenderingError extends Error {
  constructor(message: string) {
    super(message)
  }
}

export const NODE_PLACEHOLDER_ATTR = 'data-tts-node'
const CLASS_PLACEHOLDER_ATTR = 'data-tts-class'
const STYLE_PLACEHOLDER_ATTR = 'data-tts-style'
const HTML_PLACEHOLDER_ATTR = 'data-tts-html'
const TEXT_PLACEHOLDER_ATTR = 'data-tts-text'
const ATTRS_PLACEHOLDER_ATTR = 'data-tts-attrs'

export class HeadlessAdapter<EL> {
  readonly select: (selector: string) => EL[]
  readonly getAttribute: (el: EL, attr: string) => string | null
  readonly setAttribute: (el: EL, attr: string, value: string | null) => void
  readonly getClass: (el: EL) => string | null
  readonly setClass: (el: EL, cls: string | null) => void
  readonly getStyles: (el: EL) => Record<string, string>
  readonly setStyles: (el: EL, styles: Record<string, string>) => void
  readonly appendHTML: (el: EL, html: string) => void
  readonly getInnerHTML: (el: EL) => string | null
  readonly setInnerHTML: (el: EL, html: string) => void
  readonly getInnerText: (el: EL) => string | null
  readonly setInnerText: (el: EL, text: string) => void
  constructor({
    select,
    getAttribute,
    setAttribute,
    getClass,
    setClass,
    getStyles,
    setStyles,
    appendHTML,
    getInnerHTML,
    setInnerHTML,
    getInnerText,
    setInnerText,
  }: {
    select: (selector: string) => EL[]
    getAttribute: (el: EL, attr: string) => string | null
    setAttribute: (el: EL, attr: string, value: string | null) => void
    getClass: (el: EL) => string | null
    setClass: (el: EL, cls: string | null) => void
    getStyles: (el: EL) => Record<string, string>
    setStyles: (el: EL, styles: Record<string, string>) => void
    appendHTML: (el: EL, html: string) => void
    getInnerHTML: (el: EL) => string | null
    setInnerHTML: (el: EL, html: string) => void
    getInnerText: (el: EL) => string | null
    setInnerText: (el: EL, text: string) => void
  }) {
    this.select = select
    this.getAttribute = getAttribute
    this.setAttribute = setAttribute
    this.getClass = getClass
    this.setClass = setClass
    this.getStyles = getStyles
    this.setStyles = setStyles
    this.appendHTML = appendHTML
    this.getInnerHTML = getInnerHTML
    this.setInnerHTML = setInnerHTML
    this.getInnerText = getInnerText
    this.setInnerText = setInnerText
  }

  readonly setFromRoot = (root: HeadlessPortal, setPlaceholder: boolean) => {
    const portals = root.getPortals()
    portals.forEach(portal => {
      for (const el of this.select(portal.selector)) {
        if (el == null) {
          throw new Error(
            `Cannot find element by selector for render: ${portal.selector}`
          )
        }
        if (portal.hasChildren()) {
          this.appendHTML(el, portal.contentToHTML(setPlaceholder))
        }
        if (portal.hasInnerHTML()) {
          if (setPlaceholder) {
            const original = this.getInnerHTML(el)
            if (original != null) {
              this.setAttribute(el, HTML_PLACEHOLDER_ATTR, original)
            }
          }
          this.setInnerHTML(el, portal.getInnerHTML())
        }
        if (portal.hasInnerText()) {
          if (setPlaceholder) {
            const original = this.getInnerText(el)
            if (original != null) {
              this.setAttribute(el, TEXT_PLACEHOLDER_ATTR, original)
            }
          }
          this.setInnerText(el, portal.getInnerText())
        }
        if (portal.hasClasses()) {
          if (setPlaceholder) {
            const original = this.getClass(el)
            if (original != null) {
              this.setAttribute(el, CLASS_PLACEHOLDER_ATTR, original)
            }
          }
          this.setClass(el, portal.getClasses().join(' '))
        }
        if (portal.hasStyles()) {
          if (setPlaceholder) {
            const original = this.getStyles(el)
            if (Object.keys(original).length > 0) {
              this.setAttribute(
                el,
                STYLE_PLACEHOLDER_ATTR,
                JSON.stringify(original)
              )
            }
          }
          this.setStyles(el, portal.getStyles())
        }
        if (portal.hasAttributes()) {
          const attrs = portal.getAttributes()
          if (setPlaceholder) {
            const collectedAttributes = [] as [string, string | null][]
            attrs.forEach(([attr]) => {
              const original = this.getAttribute(el, attr)
              if (original != null) {
                collectedAttributes.push([attr, original])
              }
            })
            if (collectedAttributes.length > 0) {
              this.setAttribute(
                el,
                ATTRS_PLACEHOLDER_ATTR,
                JSON.stringify(Object.fromEntries(collectedAttributes))
              )
            }
          }
          attrs.forEach(([attr, value]) => {
            this.setAttribute(el, attr, value as string | null)
          })
        }
      }
    })
  }
}

const removeNodesWithPlaceholders = () => {
  const nodes = document.querySelectorAll(`[${NODE_PLACEHOLDER_ATTR}]`)
  nodes.forEach(_removeDOMNode)
}

const restoreClassPlaceholder = (el: HTMLElement) => {
  const cls = el.getAttribute(CLASS_PLACEHOLDER_ATTR)
  el.removeAttribute(CLASS_PLACEHOLDER_ATTR)
  if (cls != null) {
    el.setAttribute('class', cls)
  }
}

const restoreAllClassPlaceholders = () => {
  const nodes = document.querySelectorAll(`[${CLASS_PLACEHOLDER_ATTR}]`)
  nodes.forEach(el => restoreClassPlaceholder(el as HTMLElement))
}

const restoreInnerHTMLPlaceholder = (el: HTMLElement) => {
  const html = el.getAttribute(HTML_PLACEHOLDER_ATTR)
  el.removeAttribute(HTML_PLACEHOLDER_ATTR)
  if (html != null) {
    el.innerHTML = html
  }
}

const restoreAllInnerHTMLPlaceholders = () => {
  const nodes = document.querySelectorAll(`[${HTML_PLACEHOLDER_ATTR}]`)
  nodes.forEach(el => restoreInnerHTMLPlaceholder(el as HTMLElement))
}

const restoreInnerTextPlaceholder = (el: HTMLElement) => {
  const text = el.getAttribute(TEXT_PLACEHOLDER_ATTR)
  el.removeAttribute(TEXT_PLACEHOLDER_ATTR)
  if (text != null) {
    el.innerText = text
  }
}

const restoreAllInnerTextPlaceholders = () => {
  const nodes = document.querySelectorAll(`[${TEXT_PLACEHOLDER_ATTR}]`)
  nodes.forEach(el => restoreInnerTextPlaceholder(el as HTMLElement))
}

const parseJSON = (json: string) => {
  return JSON.parse(json.replace(/&quot;/g, '"'))
}

const restoreStylePlaceholder = (el: HTMLElement) => {
  const styles = el.getAttribute(STYLE_PLACEHOLDER_ATTR)
  el.removeAttribute(STYLE_PLACEHOLDER_ATTR)
  if (styles != null) {
    const parsed = parseJSON(styles)
    Object.entries(parsed).forEach(([key, value]) => {
      el.style.setProperty(key, value as string)
    })
  }
}

const restoreAllStylePlaceholders = () => {
  const nodes = document.querySelectorAll(`[${STYLE_PLACEHOLDER_ATTR}]`)
  nodes.forEach(el => restoreStylePlaceholder(el as HTMLElement))
}

const restoreAttrsPlaceholder = (el: HTMLElement) => {
  const attrs = el.getAttribute(ATTRS_PLACEHOLDER_ATTR)
  el.removeAttribute(ATTRS_PLACEHOLDER_ATTR)
  if (attrs != null) {
    const parsed = parseJSON(attrs)
    Object.entries(parsed).forEach(([key, value]) => {
      if (value == null) {
        el.removeAttribute(key)
      } else {
        el.setAttribute(key, value as string)
      }
    })
  }
}

const restoreAllAttrsPlaceholders = () => {
  const nodes = document.querySelectorAll(`[${ATTRS_PLACEHOLDER_ATTR}]`)
  nodes.forEach(el => restoreAttrsPlaceholder(el as HTMLElement))
}

export const restoreTempoPlaceholders = () => {
  removeNodesWithPlaceholders()
  restoreAllClassPlaceholders()
  restoreAllInnerTextPlaceholders()
  restoreAllInnerHTMLPlaceholders()
  restoreAllStylePlaceholders()
  restoreAllAttrsPlaceholders()
}
