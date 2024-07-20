import { renderableOfTNode } from '../renderable/element'
import { TNode, Renderable } from '../types/domain'
import { DOMContext } from './dom-context'
import { removeDOMNode } from './dom-utils'

const ATTR_NAME = 'data-tempo-attr'
const CLASS_NAME = 'data-tempo-class'
const NODE_NAME = 'data-tempo-node'
const TEXT_NAME = 'data-tempo-text'

const addAttributeTracker = (element: Element, name: string) => {
  const value = element.getAttribute(name)
  if (value != null) {
    const dataAttr = element.getAttribute(ATTR_NAME) ?? '{}'
    const data = { ...JSON.parse(dataAttr), name: value }
    element.setAttribute(ATTR_NAME, JSON.stringify(data))
  }
}

/**
 * @internal
 */
export const _maybeAddAttributeTracker = (ctx: DOMContext, name: string) => {
  if (isSSR() && ctx.isFirstLevel) {
    addAttributeTracker(ctx.element, name)
  }
}

/**
 * @internal
 */
export const _removeAttributeTrackers = (doc: Document) => {
  doc.querySelectorAll(`[${ATTR_NAME}]`).forEach(element => {
    const attr = JSON.parse(element.getAttribute(ATTR_NAME) ?? '{}')
    for (const [key, value] of Object.entries(attr)) {
      element.setAttribute(key, value as string)
    }
    element.removeAttribute(ATTR_NAME)
  })
}

function _addClassTracker(element: Element) {
  element.setAttribute(CLASS_NAME, element.className)
}

/**
 * @internal
 */
export const _maybeAddClassTracker = (ctx: DOMContext) => {
  if (isSSR() && ctx.isFirstLevel) {
    _addClassTracker(ctx.element)
  }
}

/**
 * @internal
 */
export const _removeClassTrackers = (doc: Document) => {
  doc.querySelectorAll(`[${CLASS_NAME}]`).forEach(element => {
    const value = element.getAttribute(CLASS_NAME)
    if (value === null) return
    element.className = value
    element.removeAttribute(CLASS_NAME)
  })
}

/**
 * @internal
 */
export const _addNodeTracker = (element: Element) => {
  element.setAttribute(NODE_NAME, '')
}

/**
 * @internal
 */
export const _removeNodeTrackers = (doc: Document) => {
  doc.querySelectorAll(`[${NODE_NAME}]`).forEach(element => {
    removeDOMNode(element)
  })
}

const _addTextTracker = (element: Element) => {
  element.setAttribute(TEXT_NAME, element.textContent ?? '')
}

/**
 * @internal
 */
export const _maybeAddTextTracker = (ctx: DOMContext) => {
  if (isSSR() && ctx.isFirstLevel) {
    _addTextTracker(ctx.element)
  }
}

/**
 * @internal
 */
export const _removeTextTrackers = (doc: Document) => {
  doc.querySelectorAll(`[${TEXT_NAME}]`).forEach(element => {
    element.textContent = element.getAttribute(TEXT_NAME)
    element.removeAttribute(TEXT_NAME)
  })
}

/**
 * @internal
 */
export const _clearSSR = (doc: Document) => {
  _removeNodeTrackers(doc)
  _removeClassTrackers(doc)
  _removeAttributeTrackers(doc)
  _removeTextTrackers(doc)
}

// TODO not sure why I have to attach this to window and module variables are not working

const ensureGlobal = () => {
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

const setGlobalValue = <T>(name: string, value: T) => {
  const o = ensureGlobal()
  o[name] = value
}

const getGlobalValue = <T>(name: string): T => {
  return ensureGlobal()[name]
}

const setSSR = (value: boolean) => {
  setGlobalValue('isSSR', value)
}

const getCounter = (): number => {
  return getGlobalValue('counter')
}

const incrementCounter = () => {
  setGlobalValue('counter', (getCounter() ?? 0) + 1)
}

const decrementCounter = () => {
  setGlobalValue('counter', (getCounter() ?? 0) - 1)
}

/**
 * Prepares for server-side rendering (SSR) by setting a timeout. The returned
 * promise resolves when all the `useSSRDone` calls have been completed.
 *
 * @param timeoutSeconds - The timeout duration in seconds (default: 30 seconds).
 * @returns A promise that resolves when all useSSRDone calls have been completed.
 * @public
 */
export const prepareSSR = (timeoutSeconds = 30): Promise<void> => {
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

/**
 * Provides a way to signal that a renderable has been rendered on the server.
 * Multiple ussSSRDone calls can be made in parallel, and the promise returned
 * by `prepareSSR` will resolve when all the `useSSRDone` calls have been completed.
 *
 * @param child - A function that takes a `done` callback and returns a `TNode`.
 * @returns A renderable value.
 * @public
 */
export const useSSRDone = (child: (done: () => void) => TNode): Renderable => {
  incrementCounter()
  return renderableOfTNode(child(decrementCounter))
}

/**
 * Checks if the code is running on the server-side (SSR - Server-Side Rendering).
 * The flag is set by running the `prepareSSR` function.
 *
 * @returns Returns true if the code is running on the server-side, false otherwise.
 * @public
 */
export const isSSR = (): boolean => getGlobalValue('isSSR')
