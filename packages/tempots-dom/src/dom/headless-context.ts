import { _NODE_PLACEHOLDER_ATTR } from '../renderable/render'
import type { Primitive } from '@tempots/core'
import { Prop } from '@tempots/core'
import { ProviderMark, Clear, Providers } from '../types/domain'
import { BrowserContext } from './browser-context'
import { DOMContext, HandlerOptions } from './dom-context'
import { ProviderNotFoundError } from './errors'

/**
 * Attribute name for hydration IDs.
 * Used to match server-rendered elements with client-side renderables during hydration.
 * @public
 */
export const HYDRATION_ID_ATTR = 'data-tempo-id'

const classKey = Symbol('class')
const styleKey = Symbol('style')
const handlerKey = Symbol('handler')

const makeRandom = (): string => {
  return Math.random().toString(36).substring(2, 15)
}

const stripTags = (html: string): string => {
  // cheap but ok for this case
  return html.replace(/<[^>]*>?/g, '')
}

/**
 * Options for streaming HTML output.
 * @public
 */
export interface StreamOptions {
  /**
   * Whether to generate placeholder attributes for hydration.
   */
  generatePlaceholders?: boolean
}

abstract class HeadlessBase {
  readonly id = makeRandom()
  private readonly properties: Record<string, unknown> & {
    [classKey]?: string[]
    [styleKey]?: Record<string, string>
    [handlerKey]?: Record<string, ((event: unknown) => void)[]>
  } = {}
  readonly children: HeadlessNode[] = []
  constructor(readonly parent: HeadlessBase | undefined) {}
  isElement(): this is HeadlessBase {
    return true
  }
  isText(): this is HeadlessText {
    return false
  }
  getText(): string {
    if (this.properties.innerText != null) {
      return this.properties.innerText as string
    }
    if (this.properties.innerHTML != null) {
      return stripTags(this.properties.innerHTML as string)
    }
    return this.children.map(child => child.getText()).join('')
  }
  removeChild(child: HeadlessNode): void {
    const index = this.children.indexOf(child)
    if (index === -1) {
      return
    }

    this.children.splice(index, 1)
  }
  remove(): void {
    if (this.parent != null) {
      this.parent.removeChild(this as unknown as HeadlessNode)
    } else {
      throw new Error('Parent is undefined')
    }
  }
  abstract isPortal(): this is HeadlessPortal

  /**
   * Generates HTML output as an async stream of string chunks.
   * This allows for progressive rendering and better memory efficiency
   * for large DOM trees.
   *
   * @param options - Options for streaming output.
   * @yields String chunks of HTML content.
   */
  abstract toHTMLStream(options?: StreamOptions): AsyncGenerator<string>

  getPortals(): HeadlessPortal[] {
    const children = this.elements().flatMap(child => {
      if (child.isPortal()) {
        return [child, ...child.getPortals()]
      }

      return child.getPortals()
    })
    if (this.isPortal()) {
      children.unshift(this)
    }

    return children
  }

  elements(): HeadlessBase[] {
    return this.children.filter(child => child.isElement()) as HeadlessBase[]
  }

  abstract toHTML(): string

  hasInnerHTML(): boolean {
    return this.properties.innerHTML != null
  }

  getInnerHTML(): string {
    return (this.properties.innerHTML as string) ?? ''
  }

  getInnerText(): string {
    return (this.properties.innerText as string) ?? ''
  }

  hasInnerText(): boolean {
    return this.properties.innerText != null
  }

  hasChildren(): boolean {
    return this.children.length > 0
  }

  hasClasses(): boolean {
    return this.properties[classKey] != null
  }

  hasStyles(): boolean {
    return this.properties[styleKey] != null
  }

  hasAttributes(): boolean {
    return Object.keys(this.properties).length > 0
  }

  hasHandlers(): boolean {
    return this.properties[handlerKey] != null
  }

  hasRenderableProperties(): boolean {
    return this.hasClasses() || this.hasAttributes() || this.hasStyles()
  }

  getById(id: string): HeadlessBase | undefined {
    if (this.properties.id === id) {
      return this
    }

    for (const child of this.elements()) {
      const result = child.getById(id)
      if (result != null) {
        return result
      }
    }
  }

  trigger<E>(event: string, detail: E): void {
    const listeners = (this.properties[handlerKey] ?? {})[event] ?? []
    listeners.forEach(listener => listener(detail))
  }

  click(): void {
    this.trigger('click', {})
  }
  on<E>(
    event: string,
    listener: (event: E, ctx: HeadlessContext) => void,
    ctx: HeadlessContext,
    options?: HandlerOptions
  ): Clear {
    const handlers = (this.properties[handlerKey] ??= {})
    const _listener = options?.once
      ? (event: unknown) => {
          clear()
          listener(event as E, ctx)
        }
      : (event: unknown) => listener(event as E, ctx)
    handlers[event] = [...(handlers[event] ?? []), _listener]
    const clear = () => {
      /* c8 ignore next */
      const listeners = handlers[event] ?? []
      const index = listeners.indexOf(_listener)
      if (index === -1) {
        return
      }

      listeners.splice(index, 1)
      if (listeners.length === 0) {
        delete handlers[event]
        if (Object.keys(handlers).length === 0) {
          delete this.properties[handlerKey]
        }
      } else {
        handlers[event] = listeners
      }

      if (options?.signal != null) {
        options.signal.removeEventListener('abort', clear)
      }
    }

    if (options?.signal != null) {
      options.signal.addEventListener('abort', clear)
    }

    return clear
  }
  addClasses(tokens: string[]): void {
    if (tokens.length === 0) {
      return
    }
    const classes = (this.properties[classKey] ??= []) as string[]
    // Use Set for O(1) lookups instead of O(n) includes() in loop
    const existingSet = new Set(classes)
    for (const token of tokens) {
      if (!existingSet.has(token)) {
        classes.push(token)
        existingSet.add(token)
      }
    }
  }
  removeClasses(tokens: string[]): void {
    if (tokens.length === 0) {
      return
    }
    const classes = (this.properties[classKey] ??= []) as string[]
    // Use Set for O(1) lookups and single-pass filter instead of O(n²)
    const toRemove = new Set(tokens)
    let writeIndex = 0
    for (let readIndex = 0; readIndex < classes.length; readIndex++) {
      if (!toRemove.has(classes[readIndex])) {
        classes[writeIndex] = classes[readIndex]
        writeIndex++
      }
    }
    classes.length = writeIndex
    if (classes.length === 0) {
      delete this.properties[classKey]
    }
  }
  getClasses(): string[] {
    return this.properties[classKey] ?? []
  }
  getAttributes() {
    return Object.entries(this.properties).filter(
      ([key]) => !['innerText', 'innerHTML'].includes(key)
    )
  }
  getVisibleAttributes() {
    return Reflect.ownKeys(this.properties).flatMap(
      (
        key
      ): (
        | ['class', string[]]
        | ['style', Record<string, string> | string]
        | [string, string]
      )[] => {
        if (key === classKey) {
          return [['class', this.getClasses()]]
        } else if (key === styleKey) {
          return [['style', this.getStyles()]]
        } else if (typeof key === 'string') {
          return [[key as string, String(this.properties[key])]]
        }
        return []
      }
    )
  }
  setStyle(name: string, value: string): void {
    const styles = (this.properties[styleKey] ??= {})
    styles[name] = value
    if (value === '') {
      delete styles[name]
      if (Object.keys(styles).length === 0) {
        delete this.properties[styleKey]
      }
    }
  }
  getStyle(name: string): string {
    return this.properties[styleKey]?.[name] ?? ''
  }
  getStyles(): Record<string, string> {
    return this.properties[styleKey] ?? {}
  }
  makeAccessors(name: string): { get(): unknown; set(value: unknown): void } {
    const attributes = this.properties
    return {
      get: () => attributes[name],
      set: (value: unknown) => (attributes[name] = value),
    }
  }
}

const quote = (value: string): string => {
  return value.replace(/"/g, '&quot;')
}

const escapeHTML = (value: string): string => {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

export class HeadlessElement extends HeadlessBase {
  constructor(
    readonly tagName: string,
    readonly namespace: string | undefined,
    parent: HeadlessBase | undefined
  ) {
    super(parent)
  }

  isPortal(): this is HeadlessPortal {
    return false
  }

  /**
   * Builds the attributes string for this element.
   * Returns an object containing the attributes string and any innerHTML value.
   */
  private buildAttributesString(generatePlaceholders: boolean): {
    attrs: string
    innerHTML: string | null
  } {
    let innerHTML = null as string | null
    const ns = this.namespace ? ` xmlns="${this.namespace}"` : ''
    const attrs = this.getVisibleAttributes()
      .map(([name, value]) => {
        if (name === 'class') {
          return ` class="${(value as string[]).join(' ')}"`
        }
        if (name === 'style') {
          if (typeof value === 'string') {
            return ` style="${value}"`
          } else {
            return ` style="${Object.entries(value)
              .map(([name, value]) => `${name}: ${value};`)
              .join(' ')}"`
          }
        }
        if (attributesWithNoValue.has(name)) {
          return ` ${name}`
        }
        if (name === 'innerHTML') {
          innerHTML = value
          return ''
        }
        if (name === 'innerText') {
          innerHTML = escapeHTML(value)
          return ''
        }
        return ` ${name}="${quote(value as string)}"`
      })
      .join('')
    // When generating placeholders for hydration:
    // - data-tts-node marks the element as server-rendered
    // - data-tempo-id provides a unique identifier for hydration matching
    const placeholder = generatePlaceholders
      ? ` ${_NODE_PLACEHOLDER_ATTR} ${HYDRATION_ID_ATTR}="${this.id}"`
      : ''
    return { attrs: `${ns}${attrs}${placeholder}`, innerHTML }
  }

  toHTML(generatePlaceholders: boolean = false): string {
    const children = this.children.map(child => child.toHTML()).join('')
    const { attrs, innerHTML } =
      this.buildAttributesString(generatePlaceholders)
    if (selfClosingTags.has(this.tagName) && children === '') {
      return `<${this.tagName}${attrs} />`
    }
    return `<${this.tagName}${attrs}>${innerHTML ?? children}</${this.tagName}>`
  }

  /**
   * Generates HTML output as an async stream of string chunks.
   * Yields the opening tag, then each child's content, then the closing tag.
   *
   * @param options - Options for streaming output.
   * @yields String chunks of HTML content.
   */
  async *toHTMLStream(options?: StreamOptions): AsyncGenerator<string> {
    const generatePlaceholders = options?.generatePlaceholders ?? false
    const { attrs, innerHTML } =
      this.buildAttributesString(generatePlaceholders)

    // Self-closing tags with no children
    if (selfClosingTags.has(this.tagName) && this.children.length === 0) {
      yield `<${this.tagName}${attrs} />`
      return
    }

    // Opening tag
    yield `<${this.tagName}${attrs}>`

    // Content: either innerHTML or children
    if (innerHTML !== null) {
      yield innerHTML
    } else {
      for (const child of this.children) {
        yield* child.toHTMLStream(options)
      }
    }

    // Closing tag
    yield `</${this.tagName}>`
  }
}

export class HeadlessPortal extends HeadlessBase {
  constructor(
    readonly selector: string | HTMLElement,
    parent: HeadlessBase | undefined
  ) {
    super(parent)
  }

  isPortal(): this is HeadlessPortal {
    return true
  }

  toHTML(): string {
    return ''
  }

  /**
   * Portals don't render inline - they render at their target selector.
   * This method yields nothing for the inline position.
   */
  // eslint-disable-next-line require-yield
  async *toHTMLStream(options?: StreamOptions): AsyncGenerator<string> {
    // Portals render at their target location, not inline
    // Options parameter kept for API consistency with other toHTMLStream implementations
    void options
    return
  }

  contentToHTML(generatePlaceholders: boolean = false): string {
    return this.children
      .map(child => child.toHTML(generatePlaceholders))
      .join('')
  }

  /**
   * Streams the portal's content HTML.
   * Unlike toHTMLStream, this yields the actual content for rendering at the target location.
   *
   * @param options - Options for streaming output.
   * @yields String chunks of the portal's content.
   */
  async *contentToHTMLStream(options?: StreamOptions): AsyncGenerator<string> {
    for (const child of this.children) {
      yield* child.toHTMLStream(options)
    }
  }
}

export class HeadlessText {
  readonly id = makeRandom()
  constructor(public text: string) {}
  isElement(): this is HeadlessElement {
    return false
  }
  isText(): this is HeadlessText {
    return true
  }
  getText(): string {
    return this.text
  }
  toHTML(): string {
    return this.text
  }

  /**
   * Streams the text content as a single chunk.
   *
   * @param options - Options (unused for text nodes, kept for API consistency).
   * @yields The text content.
   */
  async *toHTMLStream(options?: StreamOptions): AsyncGenerator<string> {
    // Options parameter kept for API consistency with other toHTMLStream implementations
    void options
    yield this.text
  }
}

export type HeadlessNode = HeadlessElement | HeadlessPortal | HeadlessText

export interface HeadlessContainer {
  currentURL: Prop<string>
}

export class HeadlessContext implements DOMContext {
  constructor(
    readonly element: HeadlessBase,
    readonly reference: HeadlessNode | undefined,
    readonly container: HeadlessContainer,
    readonly providers: Providers
  ) {}
  appendOrInsert(element: HeadlessNode): void {
    if (this.reference != null) {
      const index = this.element.children.indexOf(this.reference)
      if (index >= 0) {
        this.element.children.splice(index, 0, element)
      }
    } else {
      this.element.children.push(element)
    }
  }
  makeChildElement(tagName: string, namespace: string | undefined): DOMContext {
    const childEl = new HeadlessElement(tagName, namespace, this.element)
    this.appendOrInsert(childEl)
    return new HeadlessContext(
      childEl,
      undefined,
      this.container,
      this.providers
    )
  }
  makeChildText(text: Primitive): DOMContext {
    const childTxt = new HeadlessText(String(text))
    this.appendOrInsert(childTxt)
    return new HeadlessContext(
      this.element,
      childTxt,
      this.container,
      this.providers
    )
  }
  setText(text: Primitive): void {
    if (this.reference && this.reference.isText()) {
      this.reference.text = String(text)
    }
  }
  getText(): string {
    /* c8 ignore next */
    return this.reference?.getText() ?? this.element.getText()
  }
  makeRef(): DOMContext {
    return this.makeChildText('')
  }
  makeMarker(): DOMContext {
    // In headless mode, markers are just empty text nodes (same as makeRef)
    return this.makeChildText('')
  }
  makePortal(selector: string | HTMLElement): DOMContext {
    const portal = new HeadlessPortal(selector, this.element)
    this.appendOrInsert(portal)
    return new HeadlessContext(
      portal,
      undefined,
      this.container,
      this.providers
    )
  }

  /**
   * Sets a provider for the given provider mark.
   *
   * @param mark - The provider mark to set the provider for.
   * @param value - The provider to set for the given mark.
   * @returns A new `DOMContext` instance with the specified provider.
   */
  setProvider<T>(
    mark: ProviderMark<T>,
    value: T,
    onUse: undefined | (() => void)
  ): DOMContext {
    return new HeadlessContext(this.element, this.reference, this.container, {
      ...this.providers,
      [mark]: [value, onUse],
    })
  }

  getProvider<T>(mark: ProviderMark<T>) {
    if (this.providers[mark] === undefined) {
      throw new ProviderNotFoundError(mark)
    }

    const [value, onUse] = this.providers[mark]! as [
      T,
      undefined | (() => void),
    ]
    return { value, onUse }
  }

  tryGetProvider<T>(mark: ProviderMark<T>) {
    if (this.providers[mark] === undefined) {
      return undefined
    }

    const [value, onUse] = this.providers[mark]! as [
      T,
      undefined | (() => void),
    ]
    return { value, onUse }
  }
  clear(removeTree: boolean): void {
    if (removeTree) {
      if (this.reference !== undefined) {
        this.element.removeChild(this.reference)
      } else {
        this.element.remove()
      }
    }
  }
  on<E>(
    event: string,
    listener: (event: E, ctx: HeadlessContext) => void
  ): Clear {
    return this.element.on(event, listener, this)
  }
  addClasses(tokens: string[]): void {
    this.element.addClasses(tokens)
  }
  removeClasses(tokens: string[]): void {
    this.element.removeClasses(tokens)
  }
  getClasses(): string[] {
    return this.element.getClasses()
  }
  isBrowserDOM(): this is BrowserContext {
    return false
  }
  isBrowser(): this is BrowserContext {
    return false
  }
  isHeadlessDOM(): this is HeadlessContext {
    return true
  }
  isHeadless(): this is HeadlessContext {
    return true
  }
  setStyle(name: string, value: string): void {
    this.element.setStyle(name, value)
  }
  getStyle(name: string): string {
    return this.element.getStyle(name)
  }
  makeAccessors(name: string): { get(): unknown; set(value: unknown): void } {
    return this.element.makeAccessors(name)
  }

  moveRangeBefore(
    startRef: DOMContext,
    endRef: DOMContext,
    targetRef: DOMContext
  ): void {
    const start = (startRef as HeadlessContext).reference!
    const end = (endRef as HeadlessContext).reference!
    const target = (targetRef as HeadlessContext).reference!
    const children = this.element.children

    const startIndex = children.indexOf(start)
    const endIndex = children.indexOf(end)
    const count = endIndex - startIndex + 1

    // Extract the range
    const range = children.splice(startIndex, count)

    // Find the new target index (after extraction, indices shifted)
    const targetIndex = children.indexOf(target)

    // Insert before target
    children.splice(targetIndex, 0, ...range)
  }

  removeRange(startRef: DOMContext, endRef: DOMContext): void {
    const start = (startRef as HeadlessContext).reference!
    const end = (endRef as HeadlessContext).reference!
    const children = this.element.children

    const startIndex = children.indexOf(start)
    const endIndex = children.indexOf(end)
    const count = endIndex - startIndex + 1

    children.splice(startIndex, count)
  }

  removeAllBefore(ref: DOMContext): void {
    const marker = (ref as HeadlessContext).reference!
    const children = this.element.children
    const markerIndex = children.indexOf(marker)
    if (markerIndex > 0) {
      children.splice(0, markerIndex)
    }
  }

  detach(): void {
    // No-op: headless has no layout engine
  }

  reattach(): void {
    // No-op: headless has no layout engine
  }
}

const attributesWithNoValue = new Set([
  'checked',
  'disabled',
  'multiple',
  'readonly',
  'required',
  'selected',
])

const selfClosingTags = new Set(['img', 'br', 'hr', 'input', 'link', 'meta'])
