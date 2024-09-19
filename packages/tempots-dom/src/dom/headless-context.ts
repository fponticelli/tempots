import { Prop } from '../std/signal'
import { ProviderMark, Clear, Providers } from '../types/domain'
import { BrowserContext } from './browser-context'
import { DOMContext } from './dom-context'
import { ProviderNotFoundError } from './errors'

abstract class HeadlessBase {
  readonly classes = new Set<string>()
  readonly styles = new Map<string, string>()
  readonly attributes = new Map<string, unknown>()
  readonly handlers = new Map<string, ((event: unknown) => void)[]>()
  readonly children: HeadlessNode[] = []
  constructor(readonly parent: HeadlessBase | undefined) {}
  readonly isElement = (): this is HeadlessElement => true
  readonly isText = (): this is HeadlessText => false
  readonly getText = (): string => {
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

  readonly getPortals = (): HeadlessPortal[] => {
    const children = this.children.flatMap(child => {
      if (child.isText()) {
        return []
      }

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

  abstract toHTML(): string

  readonly hasChildren = (): boolean => {
    return this.children.length > 0
  }

  readonly hasClasses = (): boolean => {
    return this.classes.size > 0
  }

  readonly hasStyles = (): boolean => {
    return this.styles.size > 0
  }

  readonly hasAttributes = (): boolean => {
    return this.attributes.size > 0
  }

  readonly hasHandlers = (): boolean => {
    return this.handlers.size > 0
  }

  readonly hasRenderableProperties = (): boolean => {
    return this.hasClasses() || this.hasStyles() || this.hasAttributes()
  }
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

  readonly toHTML = (): string => {
    const children = this.children.map(child => child.toHTML()).join('')
    const ns = this.namespace ? ` xmlns="${this.namespace}"` : ''
    const classes =
      this.classes.size > 0
        ? ` class="${Array.from(this.classes).join(' ')}"`
        : ''
    const attributes = Array.from(this.attributes.entries()).map(
      ([name, value]) =>
        attributesWithNoValue.has(name) ? ` ${name}` : ` ${name}="${value}"`
    )
    const allStyles = Array.from(this.styles.entries()).map(
      ([name, value]) => `${name}: ${value}`
    )
    const styles = allStyles.length > 0 ? ` style="${allStyles.join(';')}"` : ''
    if (selfClosingTags.has(this.tagName) && children === '') {
      return `<${this.tagName}${ns}${classes}${attributes}${styles} />`
    }
    return `<${this.tagName}${ns}${classes}${attributes}${styles}>${children}</${this.tagName}>`
  }
}

export class HeadlessPortal extends HeadlessBase {
  constructor(
    readonly selector: string,
    parent: HeadlessBase | undefined
  ) {
    super(parent)
  }

  readonly isPortal = (): this is HeadlessPortal => true

  readonly toHTML = (): string => ''

  readonly contentToHTML = (): string => {
    return this.children.map(child => child.toHTML()).join('')
  }
}

export class HeadlessText {
  constructor(public text: string) {}
  readonly isElement = (): this is HeadlessElement => false
  readonly isText = (): this is HeadlessText => true
  readonly getText = (): string => this.text
  readonly toHTML = (): string => this.text
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
  readonly makeChildElement = (
    tagName: string,
    namespace: string | undefined
  ): DOMContext => {
    const child = new HeadlessElement(tagName, namespace, this.element)
    this.element.children.push(child)
    return new HeadlessContext(
      child,
      this.reference,
      this.container,
      this.providers
    )
  }
  readonly makeChildText = (text: string): DOMContext => {
    const child = new HeadlessText(text)
    this.element.children.push(child)
    return new HeadlessContext(
      this.element,
      child,
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
    return this.reference?.getText() ?? this.element.getText()
  }
  readonly makeRef = (): DOMContext => {
    return this.makeChildText('')
  }
  readonly makePortal = (selector: string): DOMContext => {
    return this.makeChildElement(`$$portal:${selector}`, undefined)
  }
  readonly withProviders = (providers: {
    [K in ProviderMark<unknown>]: unknown
  }): DOMContext => {
    return new HeadlessContext(this.element, this.reference, this.container, {
      ...this.providers,
      ...providers,
    })
  }
  readonly getProvider = <T>(mark: ProviderMark<T>): T => {
    if (this.providers[mark] === undefined) {
      throw new ProviderNotFoundError(mark)
    }

    return this.providers[mark]! as T
  }
  readonly clear = (removeTree: boolean): void => {
    if (removeTree) {
      if (this.reference) {
        this.element.removeChild(this.reference)
      } else {
        this.element.remove()
      }
    }
  }
  readonly on = <E>(event: string, listener: (event: E) => void): Clear => {
    const handlers = this.element.handlers
    const _listener = listener as (event: unknown) => void
    handlers.set(event, [...(handlers.get(event) ?? []), _listener])
    return () => {
      const listeners = handlers.get(event) ?? []
      const index = listeners.indexOf(_listener)
      if (index === -1) {
        return
      }

      listeners.splice(index, 1)
      if (listeners.length === 0) {
        handlers.delete(event)
      } else {
        handlers.set(event, listeners)
      }
    }
  }
  readonly addClasses = (tokens: string[]): void => {
    tokens.forEach(token => this.element.classes.add(token))
  }
  readonly removeClasses = (tokens: string[]): void => {
    tokens.forEach(token => this.element.classes.delete(token))
  }
  readonly getClasses = (): string[] => {
    return Array.from(this.element.classes)
  }
  readonly isBrowserDOM = (): this is BrowserContext => false
  readonly isHeadlessDOM = (): this is HeadlessContext => true
  readonly setStyle = (name: string, value: string): void => {
    this.element.styles.set(name, value)
  }
  readonly getStyle = (name: string): string => {
    return this.element.styles.get(name) ?? ''
  }
  readonly makeAccessors = (
    name: string
  ): { get(): unknown; set(value: unknown): void } => {
    const attributes = this.element.attributes
    return {
      get: () => attributes.get(name),
      set: (value: unknown) => attributes.set(name, value),
    }
  }

  readonly trigger = <E>(event: string, detail: E): void => {
    const listeners = this.element.handlers.get(event) ?? []
    listeners.forEach(listener => listener(detail))
  }

  // readonly container: HeadlessContainer
  // readonly parent: HeadlessElementContext | undefined
  // readonly trigger: <E>(event: string, detail: E) => void
  // readonly toHTML: () => string
}

// export class HeadlessElementContext implements HeadlessContext {
//   readonly classes = new Set<string>()
//   readonly styles = new Map<string, string>()
//   readonly attributes = new Map<string, unknown>()
//   readonly handlers = new Map<string, ((event: unknown) => void)[]>()
//   readonly children: HeadlessContext[] = []
//   readonly portals = new Map<string, DOMContext>()

//   constructor(
//     // readonly isFirstLevel: boolean,
//     readonly container: HeadlessContainer,
//     readonly tagName: string,
//     readonly namespace: string | undefined,
//     readonly providers: Providers,
//     readonly parent: HeadlessElementContext | undefined
//   ) {}

//   readonly makeChildElement = (
//     tagName: string,
//     namespace: string | undefined
//   ): DOMContext => {
//     const child = new HeadlessElementContext(
//       this.container,
//       tagName,
//       namespace,
//       this.providers,
//       this
//     )
//     this.children.push(child)
//     return child
//   }
//   readonly makeChildText = (text: string): DOMContext => {
//     const child = new HeadlessTextContext(
//       this.container,
//       this,
//       this.providers,
//       text
//     )
//     this.children.push(child)
//     return child
//   }
//   readonly setText = (): void => {}
//   readonly getText = (): string | undefined => {
//     const values = this.children
//       .map(child => child.getText())
//       .filter(v => v != null)
//     if (values.length === 0) {
//       return undefined
//     }

//     return values.join('')
//   }
//   readonly makeRef = (): DOMContext => {
//     const ref = new HeadlessTextContext(
//       this.container,
//       this,
//       this.providers,
//       ''
//     )
//     this.children.push(ref)
//     return ref
//   }
//   readonly makePortal = (selector: string): DOMContext => {
//     const portal = new HeadlessElementContext(
//       this.container,
//       '$$portal',
//       undefined,
//       this.providers,
//       this
//     )
//     this.portals.set(selector, portal)
//     return portal
//   }
//   readonly withProviders = (providers: {
//     [K in ProviderMark<unknown>]: unknown
//   }): DOMContext =>
//     new HeadlessElementContext(
//       this.container,
//       this.tagName,
//       this.namespace,
//       { ...this.providers, ...providers },
//       this
//     )
//   readonly getProvider = <T>(mark: ProviderMark<T>): T => {
//     if (this.providers[mark] === undefined) {
//       throw new ProviderNotFoundError(mark)
//     }

//     return this.providers[mark]! as T
//   }
//   readonly clear = (): void => {
//     if (this.parent != null) {
//       this.parent.removeChild(this)
//     }
//   }
//   readonly on = <E>(event: string, listener: (event: E) => void): Clear => {
//     const _listener = listener as (event: unknown) => void
//     this.handlers.set(event, [...(this.handlers.get(event) ?? []), _listener])
//     return () => {
//       const listeners = this.handlers.get(event) ?? []
//       const index = listeners.indexOf(_listener)
//       if (index === -1) {
//         return
//       }

//       listeners.splice(index, 1)
//       if (listeners.length === 0) {
//         this.handlers.delete(event)
//       } else {
//         this.handlers.set(event, listeners)
//       }
//     }
//   }
//   readonly addClasses = (tokens: string[]): void => {
//     tokens.forEach(token => this.classes.add(token))
//   }
//   readonly removeClasses = (tokens: string[]): void => {
//     tokens.forEach(token => this.classes.delete(token))
//   }
//   readonly getClasses = (): string[] => Array.from(this.classes)
//   readonly isBrowserDOM = (): this is BrowserContext => false
//   readonly isHeadlessDOM = (): this is HeadlessContext => true
//   readonly setStyle = (name: string, value: string): void => {
//     this.styles.set(name, value)
//   }
//   readonly getStyle = (name: string): string => {
//     return this.styles.get(name) ?? ''
//   }
//   readonly makeAccessors = (
//     name: string
//   ): { get(): unknown; set(value: unknown): void } => {
//     return {
//       get: () => this.attributes.get(name),
//       set: (value: unknown) => this.attributes.set(name, value),
//     }
//   }

//   readonly removeChild = (child: HeadlessContext): void => {
//     const index = this.children.indexOf(child)
//     if (index === -1) {
//       return
//     }

//     this.children.splice(index, 1)
//   }

//   readonly trigger = <E>(event: string, detail: E): void => {
//     const listeners = this.handlers.get(event) ?? []
//     listeners.forEach(listener => listener(detail))
//   }

//   readonly toHTML = (): string => {
//     const children = this.children.map(child => child.toHTML()).join('')
//     if (this.tagName === '$$root') {
//       return children
//     }
//     const ns = this.namespace ? ` xmlns="${this.namespace}"` : ''
//     const classes =
//       this.classes.size > 0
//         ? ` class="${Array.from(this.classes).join(' ')}"`
//         : ''
//     const attributes = Array.from(this.attributes.entries()).map(
//       ([name, value]) =>
//         attributesWithNoValue.has(name) ? ` ${name}` : ` ${name}="${value}"`
//     )
//     if (selfClosingTags.has(this.tagName) && children === '') {
//       return `<${this.tagName}${ns}${classes}${attributes} />`
//     }
//     return `<${this.tagName}${ns}${classes}${attributes}>${children}</${this.tagName}>`
//   }
// }

const attributesWithNoValue = new Set([
  'checked',
  'disabled',
  'multiple',
  'readonly',
  'required',
  'selected',
])

const selfClosingTags = new Set(['img', 'br', 'hr', 'input', 'link', 'meta'])
