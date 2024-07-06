/** @jsxImportSource .. */
import { removeNode } from '../core/dom-helpers'
import { makeRendarableOfElement } from '../core/render'
import { Scope } from '../core/scope'
import { JSX } from '../jsx-runtime'

export interface ShadowProps {
  mode?: 'open' | 'closed'
  children?: JSX.Element
  callback?: (shadow: ShadowRoot) => void
}

export const Shadow = ({ children, mode, callback }: ShadowProps) => {
  return (scope: Scope) => {
    const element =
      scope.reference.nodeType === Node.ELEMENT_NODE
        ? (scope.reference as Element)
        : scope.reference.parentElement
    if (!element)
      throw new Error(`Parent element not found for ${scope.reference}`)
    const shadow = element.attachShadow({ mode: mode || 'open' })
    const newScope = scope.withReference(shadow)
    const cancel = makeRendarableOfElement(children)?.(newScope)
    callback?.(shadow)
    return (removeTree: boolean) => {
      newScope.cancel()
      if (removeTree) {
        removeNode(shadow)
      }
      cancel?.(removeTree)
    }
  }
}
