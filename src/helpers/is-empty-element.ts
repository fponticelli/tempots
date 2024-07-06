import { type JSX } from '../jsx-runtime'

export function isEmptyElement (element: JSX.DOMNode): boolean {
  if (Array.isArray(element)) {
    if (element.length === 0) return true
    return element.every(isEmptyElement)
  }
  return element == null || element === ''
}
