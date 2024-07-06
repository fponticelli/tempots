import { Clear } from "./clean"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type ProviderMark<T> = symbol

export function makeProviderMark<T>(): ProviderMark<T> {
  return Symbol()
}

export interface IDOMContext {
  makeReference(): IDOMContext
  makeElement(tagName: string): IDOMContext
  getBooleanAttribute(name: string): boolean
  setBooleanAttribute(name: string, value: boolean): void
  createBooleanAttribute(name: string, value: boolean): [(newValue: boolean) => void, Clear]
  getAttribute(name: string): string | null
  setAttribute(name: string, value: string | null): void
  createAttribute(name: string, value: string): [(newValue: string) => void, Clear]
  getProperty<T>(name: string): T
  setProperty<T>(name: string, value: T): void
  createProperty<T>(name: string, value: T): [(newValue: T) => void, Clear]
  createText(text: string): [(newText: string) => void, Clear]
  createClass(cls: string): [(newClass: string) => void, Clear]
  createHandler<T>(name: string, handler: (value: T) => void): Clear
  delayClear(removeTree: boolean, f: (finalize: () => void) => void): void
  requestClear(removeTree: boolean, willClear: () => void): void
  getElement(): HTMLElement
  getDocument(): Document
  withProvider<T>(mark: ProviderMark<T>, provider: T): IDOMContext
  getProvider<T>(mark: ProviderMark<T>): T
  setStyle(name: string, value: string | undefined | null): void
  createStyle(name: string, value: string | undefined | null): [(newValue: string) => void, Clear]
}
