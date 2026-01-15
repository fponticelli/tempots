import { _NODE_PLACEHOLDER_ATTR } from '../renderable/render'
import { Prop } from '@tempots/core'
import { ProviderMark, Clear, Providers } from '../types/domain'
import { BrowserContext } from './browser-context'
import { DOMContext, HandlerOptions } from './dom-context'
import { ProviderNotFoundError } from './errors'

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
  readonly isElement = (): this is HeadlessBase => true
  readonly isText = (): this is HeadlessText => false
  readonly getText = (): string => {
    if (this.properties.innerText != null) {
      return this.properties.innerText as string
    }
    if (this.properties.innerHTML != null) {
      return stripTags(this.properties.innerHTML as string)
    }
    return this.children.map(child => child.getText()).join('')
  }
  readonly removeChild = (child: HeadlessNode): void => {
    const index = this.children.indexOf(child)
    if (index === -1) {
      return
    }

    this.children.splice(index, 1)
  }
  readonly remove = (): void => {
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

  readonly getPortals = (): HeadlessPortal[] => {
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

  readonly elements = (): HeadlessBase[] => {
    return this.children.filter(child => child.isElement()) as HeadlessBase[]
  }

  abstract toHTML(): string

  readonly hasInnerHTML = (): boolean => this.properties.innerHTML != null

  readonly getInnerHTML = (): string =>
    (this.properties.innerHTML as string) ?? ''

  readonly getInnerText = (): string =>
    (this.properties.innerText as string) ?? ''

  readonly hasInnerText = (): boolean => this.properties.innerText != null

  readonly hasChildren = (): boolean => this.children.length > 0

  readonly hasClasses = (): boolean => this.properties[classKey] != null

  readonly hasStyles = (): boolean => this.properties[styleKey] != null

  readonly hasAttributes = (): boolean =>
    Object.keys(this.properties).length > 0

  readonly hasHandlers = (): boolean => this.properties[handlerKey] != null

  readonly hasRenderableProperties = (): boolean =>
    this.hasClasses() || this.hasAttributes() || this.hasStyles()

  readonly getById = (id: string): HeadlessBase | undefined => {
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

  readonly trigger = <E>(event: string, detail: E): void => {
    const listeners = (this.properties[handlerKey] ?? {})[event] ?? []
    listeners.forEach(listener => listener(detail))
  }

  readonly click = (): void => {
    this.trigger('click', {})
  }
  readonly on = <E>(
    event: string,
    listener: (event: E, ctx: HeadlessContext) => void,
    ctx: HeadlessContext,
    options?: HandlerOptions
  ): Clear => {
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
  readonly addClasses = (tokens: string[]): void => {
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
  readonly removeClasses = (tokens: string[]): void => {
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
  readonly getClasses = (): string[] => {
    return this.properties[classKey] ?? []
  }
  readonly getAttributes = () => {
    return Object.entries(this.properties).filter(
      ([key]) => !['innerText', 'innerHTML'].includes(key)
    )
  }
  readonly getVisibleAttributes = () => {
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
  readonly setStyle = (name: string, value: string): void => {
    const styles = (this.properties[styleKey] ??= {})
    styles[name] = value
    if (value === '') {
      delete styles[name]
      if (Object.keys(styles).length === 0) {
        delete this.properties[styleKey]
      }
    }
  }
  readonly getStyle = (name: string): string => {
    return this.properties[styleKey]?.[name] ?? ''
  }
  readonly getStyles = (): Record<string, string> => {
    return this.properties[styleKey] ?? {}
  }
  readonly makeAccessors = (
    name: string
  ): { get(): unknown; set(value: unknown): void } => {
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

  readonly isPortal = (): this is HeadlessPortal => false

  /**
   * Builds the attributes string for this element.
   * Returns an object containing the attributes string and any innerHTML value.
   */
  private readonly buildAttributesString = (
    generatePlaceholders: boolean
  ): { attrs: string; innerHTML: string | null } => {
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
    const placeholder = generatePlaceholders ? ` ${_NODE_PLACEHOLDER_ATTR}` : ''
    return { attrs: `${ns}${attrs}${placeholder}`, innerHTML }
  }

  readonly toHTML = (generatePlaceholders: boolean = false): string => {
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

  readonly isPortal = (): this is HeadlessPortal => true

  readonly toHTML = (): string => ''

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

  readonly contentToHTML = (generatePlaceholders: boolean = false): string => {
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
  readonly isElement = (): this is HeadlessElement => false
  readonly isText = (): this is HeadlessText => true
  readonly getText = (): string => this.text
  readonly toHTML = (): string => this.text

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
  readonly appendOrInsert = (element: HeadlessNode): void => {
    if (this.reference != null) {
      const index = this.element.children.indexOf(this.reference)
      if (index >= 0) {
        this.element.children.splice(index, 0, element)
      }
    } else {
      this.element.children.push(element)
    }
  }
  readonly makeChildElement = (
    tagName: string,
    namespace: string | undefined
  ): DOMContext => {
    const childEl = new HeadlessElement(tagName, namespace, this.element)
    this.appendOrInsert(childEl)
    return new HeadlessContext(
      childEl,
      undefined,
      this.container,
      this.providers
    )
  }
  readonly makeChildText = (text: string): DOMContext => {
    const childTxt = new HeadlessText(text)
    this.appendOrInsert(childTxt)
    return new HeadlessContext(
      this.element,
      childTxt,
      this.container,
      this.providers
    )
  }
  readonly setText = (text: string): void => {
    if (this.reference && this.reference.isText()) {
      this.reference.text = text
    }
  }
  readonly getText = (): string => {
    /* c8 ignore next */
    return this.reference?.getText() ?? this.element.getText()
  }
  readonly makeRef = (): DOMContext => {
    return this.makeChildText('')
  }
  readonly makePortal = (selector: string | HTMLElement): DOMContext => {
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
  readonly setProvider = <T>(
    mark: ProviderMark<T>,
    value: T,
    onUse: undefined | (() => void)
  ): DOMContext =>
    new HeadlessContext(this.element, this.reference, this.container, {
      ...this.providers,
      [mark]: [value, onUse],
    })

  readonly getProvider = <T>(mark: ProviderMark<T>) => {
    if (this.providers[mark] === undefined) {
      throw new ProviderNotFoundError(mark)
    }

    const [value, onUse] = this.providers[mark]! as [
      T,
      undefined | (() => void),
    ]
    return { value, onUse }
  }
  readonly clear = (removeTree: boolean): void => {
    if (removeTree) {
      if (this.reference !== undefined) {
        this.element.removeChild(this.reference)
      } else {
        this.element.remove()
      }
    }
  }
  readonly on = <E>(
    event: string,
    listener: (event: E, ctx: HeadlessContext) => void
  ): Clear => this.element.on(event, listener, this)
  readonly addClasses = (tokens: string[]): void =>
    this.element.addClasses(tokens)
  readonly removeClasses = (tokens: string[]): void =>
    this.element.removeClasses(tokens)
  readonly getClasses = (): string[] => this.element.getClasses()
  readonly isBrowserDOM = (): this is BrowserContext => false
  readonly isBrowser = (): this is BrowserContext => false
  readonly isHeadlessDOM = (): this is HeadlessContext => true
  readonly isHeadless = (): this is HeadlessContext => true
  readonly setStyle = (name: string, value: string): void =>
    this.element.setStyle(name, value)
  readonly getStyle = (name: string): string => this.element.getStyle(name)
  readonly makeAccessors = (
    name: string
  ): { get(): unknown; set(value: unknown): void } =>
    this.element.makeAccessors(name)
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
