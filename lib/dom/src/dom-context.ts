import { IDOMContext, ProviderMark } from "./types/idom-context"
import { Clear } from "./types/clean"

function extractClassNames(cls: string): string[] {
  return (cls ?? '').replace(/\s+/g, ' ').split(' ').filter((className) => className.length > 0);
}

function createIntegerSet(x: number): Set<number> {
  const integerSet = new Set<number>();

  for (let i = 0; i < x; i++) {
    integerSet.add(i);
  }

  return integerSet;
}

export type Providers = Record<ProviderMark<unknown>, unknown>

export class DOMContext implements IDOMContext {
  static of(element: HTMLElement): IDOMContext {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return new DOMContext(element.ownerDocument!, element, undefined, undefined, {});
  }
  constructor(
    private document: Document,
    private element: HTMLElement,
    private reference: Text | undefined,
    private ns: string | undefined,
    private providers: Providers
  ) { }

  append(node: Node) {
    if (this.reference !== undefined) {
      this.element.insertBefore(node, this.reference)
    } else {
      this.element.appendChild(node)
    }
  }

  getElement(): HTMLElement {
    return this.element
  }

  getDocument(): Document {
    return this.document
  }

  makeReference(): IDOMContext {
    const textNode = this.document.createTextNode('')
    this.append(textNode)
    return new DOMContext(this.document, this.element, textNode, this.ns, this.providers)
  }

  makeElement(tagName: string): IDOMContext {
    if (this.ns !== undefined || tagName === 'svg') {
      const ns = this.ns ?? 'http://www.w3.org/2000/svg'
      const element = this.document.createElementNS(ns, tagName)
      this.append(element)
      return new DOMContext(this.document, element as HTMLElement, undefined, ns, this.providers)
    } else {
      const element = this.document.createElement(tagName)
      this.append(element)
      return new DOMContext(this.document, element, undefined, this.ns, this.providers)
    }
  }

  getBooleanAttribute(name: string): boolean {
    return this.element.hasAttribute(name)
  }

  setBooleanAttribute(name: string, value: boolean) {
    if (value) {
      this.element.setAttribute(name, '')
    } else {
      this.element.removeAttribute(name)
    }
  }

  createBooleanAttribute(name: string, value: boolean): [(newValue: boolean) => void, Clear] {
    const current = this.element.hasAttribute(name)
    this.setBooleanAttribute(name, value)
    return [
      (newValue: boolean) => {
        this.setBooleanAttribute(name, newValue)
      },
      (removeTree: boolean) => {
        if (removeTree) {
          this.setBooleanAttribute(name, current)
        }
      }
    ]
  }

  getAttribute(name: string): string | null {
    return this.element.getAttribute(name)
  }

  setAttribute(name: string, value: string | null) {
    if (value == null) {
      this.element.removeAttribute(name)
    } else {
      this.element.setAttribute(name, value)
    }
  }

  createAttribute(name: string, value: string): [(newValue: string) => void, Clear] {
    const current = this.element.getAttribute(name)
    this.setAttribute(name, value)
    return [
      (newValue: string) => {
        this.setAttribute(name, newValue)
      },
      (removeTree: boolean) => {
        if (removeTree) {
          this.setAttribute(name, current)
        }
      }
    ]
  }

  getProperty<T>(name: string): T {
    return Reflect.get(this.element, name)
  }

  setProperty<T>(name: string, value: T) {
    if (value == null) {
      Reflect.deleteProperty(this.element, name)
    } else {
      Reflect.set(this.element, name, value)
    }
  }

  createProperty<T>(name: string, value: T): [(newValue: T) => void, Clear] {
    const current = this.getProperty<T>(name)
    this.setProperty(name, value)
    return [
      (newValue: T) => {
        this.setProperty(name, newValue)
      },
      (removeTree: boolean) => {
        if (removeTree) {
          this.setProperty(name, current)
        }
      }
    ]
  }

  createText(text: string): [(newText: string) => void, Clear] {
    const textNode = this.document.createTextNode(text)
    this.append(textNode)
    return [
      (newText: string) => {
        textNode.nodeValue = newText
      },
      (removeTree: boolean) => {
        if (removeTree) {
          textNode.remove()
        }
      }
    ]
  }

  createClass(cls: string): [(newClass: string) => void, Clear] {
    let current = extractClassNames(cls)
    current.forEach((className) => {
      this.element.classList.add(className)
    })
    return [
      (newClass: string) => {
        current.forEach((className) => {
          this.element.classList.remove(className)
        })
        current = extractClassNames(newClass)
        current.forEach((className) => {
          this.element.classList.add(className)
        })
      },
      (removeTree: boolean) => {
        if (removeTree) {
          current.forEach((className) => {
            this.element.classList.remove(className)
          })
        }
      }
    ]
  }

  createHandler<T>(name: string, handler: (event: T) => void): Clear {
    this.element.addEventListener(name, handler as unknown as EventListener)
    return (removeTree: boolean) => {
      if (removeTree) {
        this.element.removeEventListener(name, handler as unknown as EventListener)
      }
    }
  }

  private readonly suspendedClears: ((clear: () => void) => void)[] = []
  delayClear(removeTree: boolean, f: (clear: () => void) => void) {
    this.suspendedClears.push(f)
    this.requestClear(removeTree, () => {
      console.log('clearing')
    })
  }

  requestClear(removeTree: boolean, willClear: () => void) {
    if (this.suspendedClears.length === 0) {
      console.log('clear direct')
      willClear()
      this.clear(removeTree)
    } else {
      console.log('clear INdirect')
      const set = createIntegerSet(this.suspendedClears.length)
      console.log("set", set)
      const clearSuspended = (index: number) => {
        set.delete(index)
        console.log("polling", set.size === 0, index)
        if (set.size === 0) {
          willClear()
          this.clear(removeTree)
        }
      }
      this.suspendedClears.forEach((f, i) => f(() => clearSuspended(i)))
      this.suspendedClears.length = 0
    }
  }

  private clear(removeTree: boolean) {
    if (removeTree) {
      if (this.reference !== undefined) {
        this.element.removeChild(this.reference)
      } else {
        this.element.onblur = null
        this.element.parentElement?.removeChild(this.element)
      }
    }
  }

  withProvider<T>(mark: ProviderMark<T>, provider: T): IDOMContext {
    return new DOMContext(this.document, this.element, this.reference, this.ns, {
      ...this.providers,
      [mark]: provider
    })
  }
  getProvider<T>(mark: ProviderMark<T>): T {
    return this.providers[mark] as T
  }

  setStyle(name: string, value: string | undefined | null): void {
    if (value == null) {
      this.element.style.removeProperty(name)
    } else {
      this.element.style.setProperty(name, value)
    }
  }

  createStyle(name: string, value: string | undefined | null): [(newValue: string) => void, Clear] {
    const current = this.element.style.getPropertyValue(name)
    this.setStyle(name, value)
    return [
      (newValue: string) => {
        this.setStyle(name, newValue)
      },
      (removeTree: boolean) => {
        if (removeTree) {
          this.setStyle(name, current)
        }
      }
    ]
  }
}
