import { ProviderMark, Clear, Providers } from '../types/domain'
import { BrowserContext } from './browser-context'
import { DOMContext } from './dom-context'
import { ProviderNotFoundError } from './errors'

export interface HeadlessContext extends DOMContext {
  readonly parent: HeadlessElementContext | undefined
  readonly trigger: <E>(event: string, detail: E) => void
  readonly toHTML: () => string
}

export class HeadlessTextContext implements HeadlessContext {
  constructor(
    // readonly isFirstLevel: boolean,
    readonly parent: HeadlessElementContext,
    readonly providers: Providers,
    public text: string
  ) {}
  readonly makeChildElement = (
    tagName: string,
    namespace: string | undefined
  ): DOMContext => this.parent.makeChildElement(tagName, namespace)
  readonly makeChildText = (text: string): DOMContext =>
    this.parent.makeChildText(text)
  readonly setText = (text: string): void => {
    this.text = text
  }
  readonly getText = (): string | undefined => this.text
  readonly makeRef = (): DOMContext => this.parent.makeRef()
  readonly makePortal = (selector: string): DOMContext =>
    this.parent.makePortal(selector)
  readonly withProvider = <T>(mark: ProviderMark<T>, value: T): DOMContext =>
    new HeadlessTextContext(
      // this.isFirstLevel,
      this.parent,
      { ...this.providers, [mark]: value },
      this.text
    )
  readonly withProviders = (providers: {
    [K in ProviderMark<unknown>]: unknown
  }): DOMContext =>
    new HeadlessTextContext(
      // this.isFirstLevel,
      this.parent,
      { ...this.providers, ...providers },
      this.text
    )
  readonly getProvider = <T>(mark: ProviderMark<T>): T => {
    if (this.providers[mark] === undefined) {
      throw new ProviderNotFoundError(mark)
    }

    return this.providers[mark]! as T
  }
  readonly clear = (): void => this.parent.removeChild(this)
  readonly on = <E>(event: string, listener: (event: E) => void): Clear =>
    this.parent.on(event, listener)

  readonly addClasses = (tokens: string[]): void =>
    this.parent.addClasses(tokens)
  readonly removeClasses = (tokens: string[]): void =>
    this.parent.removeClasses(tokens)

  readonly getClasses = (): string[] => this.parent.getClasses()
  readonly isBrowserDOM = (): this is BrowserContext => false
  readonly setStyle = (name: string, value: string): void =>
    this.parent.setStyle(name, value)
  readonly getStyle = (name: string): string => this.parent.getStyle(name)
  readonly makeAccessors = (
    name: string
  ): { get(): unknown; set(value: unknown): void } =>
    this.parent.makeAccessors(name)
  readonly trigger = <E>(event: string, detail: E): void =>
    this.parent.trigger(event, detail)

  readonly toHTML = (): string => this.text
}

export class HeadlessElementContext implements HeadlessContext {
  readonly classes = new Set<string>()
  readonly styles = new Map<string, string>()
  readonly attributes = new Map<string, unknown>()
  readonly handlers = new Map<string, ((event: unknown) => void)[]>()
  readonly children: HeadlessContext[] = []
  readonly portals = new Map<string, DOMContext>()

  constructor(
    // readonly isFirstLevel: boolean,
    readonly tagName: string,
    readonly namespace: string | undefined,
    readonly providers: Providers,
    readonly parent: HeadlessElementContext | undefined
  ) {}

  readonly makeChildElement = (
    tagName: string,
    namespace: string | undefined
  ): DOMContext => {
    const child = new HeadlessElementContext(
      // false,
      tagName,
      namespace,
      this.providers,
      this
    )
    this.children.push(child)
    return child
  }
  readonly makeChildText = (text: string): DOMContext => {
    const child = new HeadlessTextContext(this, this.providers, text)
    this.children.push(child)
    return child
  }
  readonly setText = (): void => {}
  readonly getText = (): string | undefined => {
    const values = this.children
      .map(child => child.getText())
      .filter(v => v != null)
    if (values.length === 0) {
      return undefined
    }

    return values.join('')
  }
  readonly makeRef = (): DOMContext => {
    const ref = new HeadlessTextContext(this, this.providers, '')
    this.children.push(ref)
    return ref
  }
  readonly makePortal = (selector: string): DOMContext => {
    const portal = new HeadlessElementContext(
      // false,
      '$$portal',
      undefined,
      this.providers,
      this
    )
    this.portals.set(selector, portal)
    return portal
  }
  readonly withProvider = <T>(mark: ProviderMark<T>, value: T): DOMContext =>
    new HeadlessElementContext(
      // this.isFirstLevel,
      this.tagName,
      this.namespace,
      {
        ...this.providers,
        [mark]: value,
      },
      this
    )
  readonly withProviders = (providers: {
    [K in ProviderMark<unknown>]: unknown
  }): DOMContext =>
    new HeadlessElementContext(
      // this.isFirstLevel,
      this.tagName,
      this.namespace,
      { ...this.providers, ...providers },
      this
    )
  readonly getProvider = <T>(mark: ProviderMark<T>): T => {
    if (this.providers[mark] === undefined) {
      throw new ProviderNotFoundError(mark)
    }

    return this.providers[mark]! as T
  }
  readonly clear = (): void => {
    if (this.parent != null) {
      this.parent.removeChild(this)
    }
  }
  readonly on = <E>(event: string, listener: (event: E) => void): Clear => {
    const _listener = listener as (event: unknown) => void
    this.handlers.set(event, [...(this.handlers.get(event) ?? []), _listener])
    return () => {
      const listeners = this.handlers.get(event) ?? []
      const index = listeners.indexOf(_listener)
      if (index === -1) {
        return
      }

      listeners.splice(index, 1)
      if (listeners.length === 0) {
        this.handlers.delete(event)
      } else {
        this.handlers.set(event, listeners)
      }
    }
  }
  readonly addClasses = (tokens: string[]): void => {
    tokens.forEach(token => this.classes.add(token))
  }
  readonly removeClasses = (tokens: string[]): void => {
    tokens.forEach(token => this.classes.delete(token))
  }
  readonly getClasses = (): string[] => Array.from(this.classes)
  readonly isBrowserDOM = (): this is BrowserContext => false
  readonly setStyle = (name: string, value: string): void => {
    this.styles.set(name, value)
  }
  readonly getStyle = (name: string): string => {
    return this.styles.get(name) ?? ''
  }
  readonly makeAccessors = (
    name: string
  ): { get(): unknown; set(value: unknown): void } => {
    return {
      get: () => this.attributes.get(name),
      set: (value: unknown) => this.attributes.set(name, value),
    }
  }

  readonly removeChild = (child: HeadlessContext): void => {
    const index = this.children.indexOf(child)
    if (index === -1) {
      return
    }

    this.children.splice(index, 1)
  }

  readonly trigger = <E>(event: string, detail: E): void => {
    const listeners = this.handlers.get(event) ?? []
    listeners.forEach(listener => listener(detail))
  }

  readonly toHTML = (): string => {
    const children = this.children.map(child => child.toHTML()).join('')
    if (this.tagName === '$$root') {
      return children
    }
    const ns = this.namespace ? ` xmlns="${this.namespace}"` : ''
    const classes =
      this.classes.size > 0
        ? ` class="${Array.from(this.classes).join(' ')}"`
        : ''
    const attributes = Array.from(this.attributes.entries()).map(
      ([name, value]) =>
        attributesWithNoValue.has(name) ? ` ${name}` : ` ${name}="${value}"`
    )
    if (selfClosingTags.has(this.tagName) && children === '') {
      return `<${this.tagName}${ns}${classes}${attributes} />`
    }
    return `<${this.tagName}${ns}${classes}${attributes}>${children}</${this.tagName}>`
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
