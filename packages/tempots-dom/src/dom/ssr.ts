import { childToRenderable } from '../mountable/element'
import { TNode, Renderable } from '../types/domain'
import { DOMContext } from './dom-context'
import { removeDOMNode } from './dom-utils'

const ATTR_NAME = 'data-tempo-attr'
const CLASS_NAME = 'data-tempo-class'
const NODE_NAME = 'data-tempo-node'
const TEXT_NAME = 'data-tempo-text'

function addAttributeTracker(element: Element, name: string) {
  const value = element.getAttribute(name)
  if (value != null) {
    const dataAttr = element.getAttribute(ATTR_NAME) ?? '{}'
    const data = { ...JSON.parse(dataAttr), name: value }
    element.setAttribute(ATTR_NAME, JSON.stringify(data))
  }
}

export function maybeAddAttributeTracker(ctx: DOMContext, name: string) {
  if (ssr.isSSR() && ctx.isFirstLevel) {
    addAttributeTracker(ctx.element, name)
  }
}

export function removeAttributeTrackers(doc: Document) {
  doc.querySelectorAll(`[${ATTR_NAME}]`).forEach(element => {
    const attr = JSON.parse(element.getAttribute(ATTR_NAME) ?? '{}')
    for (const [key, value] of Object.entries(attr)) {
      element.setAttribute(key, value as string)
    }
    element.removeAttribute(ATTR_NAME)
  })
}

function addClassTracker(element: Element) {
  element.setAttribute(CLASS_NAME, element.className)
}

export function maybeAddClassTracker(ctx: DOMContext) {
  if (ssr.isSSR() && ctx.isFirstLevel) {
    addClassTracker(ctx.element)
  }
}

export function removeClassTrackers(doc: Document) {
  doc.querySelectorAll(`[${CLASS_NAME}]`).forEach(element => {
    const value = element.getAttribute(CLASS_NAME)
    if (value === null) return
    element.className = value
    element.removeAttribute(CLASS_NAME)
  })
}

export function addNodeTracker(element: Element) {
  element.setAttribute(NODE_NAME, '')
}

export function removeNodeTrackers(doc: Document) {
  doc.querySelectorAll(`[${NODE_NAME}]`).forEach(element => {
    removeDOMNode(element)
  })
}

function addTextTracker(element: Element) {
  element.setAttribute(TEXT_NAME, element.textContent ?? '')
}

export function maybeAddTextTracker(ctx: DOMContext) {
  if (ssr.isSSR() && ctx.isFirstLevel) {
    addTextTracker(ctx.element)
  }
}

export function removeTextTrackers(doc: Document) {
  doc.querySelectorAll(`[${TEXT_NAME}]`).forEach(element => {
    element.textContent = element.getAttribute(TEXT_NAME)
    element.removeAttribute(TEXT_NAME)
  })
}

export function clearSSR(doc: Document) {
  removeNodeTrackers(doc)
  removeClassTrackers(doc)
  removeAttributeTrackers(doc)
  removeTextTrackers(doc)
}

// TODO not sure why I have to attach this to window and module variables are not working

function ensureGlobal() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const g = globalThis as any
  if (g.__tempoSSR__ == null) {
    g.__tempoSSR__ = {
      isSSR: false,
      counter: 0,
    }
  }
  return g.__tempoSSR__
}

function setGlobalValue<T>(name: string, value: T) {
  const o = ensureGlobal()
  o[name] = value
}

function getGlobalValue<T>(name: string): T {
  return ensureGlobal()[name]
}

function isSSR(): boolean {
  return getGlobalValue('isSSR')
}

function setSSR(value: boolean) {
  setGlobalValue('isSSR', value)
}

function getCounter(): number {
  return getGlobalValue('counter')
}

function incrementCounter() {
  setGlobalValue('counter', (getCounter() ?? 0) + 1)
}

function decrementCounter() {
  setGlobalValue('counter', (getCounter() ?? 0) - 1)
}

export const startSSR = (timeoutSeconds = 30): Promise<void> => {
  setSSR(true)
  return new Promise((resolve, reject) => {
    let timeout: ReturnType<typeof setTimeout> | undefined = undefined
    const timer = setInterval(() => {
      if (getCounter() <= 0) {
        clearInterval(timer)
        clearTimeout(timeout)
        setSSR(false)
        resolve()
      }
    }, 30)
    timeout = setTimeout(() => {
      clearInterval(timer)
      setSSR(false)
      reject(new Error('SSR Timeout'))
    }, timeoutSeconds * 1000)
  })
}

export const ssr = {
  useDone: (child: (done: () => void) => TNode): Renderable => {
    incrementCounter()
    return childToRenderable(child(decrementCounter))
  },
  isSSR,
}
