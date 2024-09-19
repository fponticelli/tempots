import { Prop } from '../std/signal'
import { ProviderMark, Clear, Providers } from '../types/domain'
import { BrowserContext } from './browser-context'
import { DOMContext } from './dom-context'
import { ProviderNotFoundError } from './errors'

const classKey = Symbol('class')
const styleKey = Symbol('style')
const handlerKey = Symbol('handler')

const makeRandom = (): string => {
  return Math.random().toString(36).substring(2, 15)
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
    return this.children.map(child => child.getText()).join('')
  }
  readonly removeChild = (child: HeadlessNode): void => {
    console.log(
      '>>>> removeChild',
      child.id,
      this.children.map(c => c.id)
    )
    const index = this.children.indexOf(child)
    if (index === -1) {
      console.log('>>>> removeChild', 'not found')
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
  readonly on = <E>(event: string, listener: (event: E) => void): Clear => {
    const handlers = (this.properties[handlerKey] ??= {})
    const _listener = listener as (event: unknown) => void
    handlers[event] = [...(handlers[event] ?? []), _listener]
    return () => {
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
    }
  }
  readonly addClasses = (tokens: string[]): void => {
    if (tokens.length === 0) {
      return
    }
    const classes = (this.properties[classKey] ??= []) as string[]
    tokens.forEach(token => {
      if (!classes.includes(token)) {
        classes.push(token)
      }
    })
  }
  readonly removeClasses = (tokens: string[]): void => {
    if (tokens.length === 0) {
      return
    }
    const classes = (this.properties[classKey] ??= []) as string[]
    tokens.forEach(token => {
      const index = classes.indexOf(token)
      if (index !== -1) {
        classes.splice(index, 1)
      }
    })
    if (classes.length === 0) {
      delete this.properties[classKey]
    }
  }
  readonly getClasses = (): string[] => {
    return this.properties[classKey] ?? []
  }
  readonly getAttributes = () => {
    return Object.entries(this.properties)
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
        return ` ${name}="${quote(value as string)}"`
      })
      .join('')
    if (selfClosingTags.has(this.tagName) && children === '') {
      return `<${this.tagName}${ns}${attrs} />`
    }
    return `<${this.tagName}${ns}${attrs}>${children}</${this.tagName}>`
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
  readonly id = makeRandom()
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
  readonly appendOrInsert = (element: HeadlessNode): void => {
    if (this.reference != null) {
      const index = this.element.children.indexOf(this.reference)
      this.element.children.splice(index, 0, element)
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
      if (this.reference !== undefined) {
        console.log('>>>> clear REF', this.reference.toHTML())
        this.element.removeChild(this.reference)
      } else {
        console.log('>>>> clear ELEM', this.element.toHTML())
        this.element.remove()
      }
    }
  }
  readonly on = <E>(event: string, listener: (event: E) => void): Clear =>
    this.element.on(event, listener)
  readonly addClasses = (tokens: string[]): void =>
    this.element.addClasses(tokens)
  readonly removeClasses = (tokens: string[]): void =>
    this.element.removeClasses(tokens)
  readonly getClasses = (): string[] => this.element.getClasses()
  readonly isBrowserDOM = (): this is BrowserContext => false
  readonly isHeadlessDOM = (): this is HeadlessContext => true
  readonly setStyle = (name: string, value: string): void =>
    this.element.setStyle(name, value)
  readonly getStyle = (name: string): string => this.element.getStyle(name)
  readonly makeAccessors = (
    name: string
  ): { get(): unknown; set(value: unknown): void } =>
    this.element.makeAccessors(name)
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
