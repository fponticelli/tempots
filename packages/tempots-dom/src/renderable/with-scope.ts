import { DOMContext } from '../dom/dom-context'
import { DisposalScope } from '../std/disposal-scope'
import { withScope } from '../std/scope-stack'
import { Renderable, TNode } from '../types/domain'
import { renderableOfTNode } from './element'

/**
 * Creates a renderable that provides explicit access to a DisposalScope.
 * 
 * This is useful when you need to create signals in async contexts (like setTimeout,
 * fetch callbacks, event handlers) where automatic scope tracking doesn't work.
 * 
 * @example
 * ```typescript
 * // Using scope in async context
 * WithScope(scope => {
 *   setTimeout(() => {
 *     const signal = scope.prop(42)
 *     // signal will be disposed when component unmounts
 *   }, 1000)
 *   
 *   return html.div('Loading...')
 * })
 * ```
 * 
 * @example
 * ```typescript
 * // Using scope with fetch
 * WithScope(scope => {
 *   fetch('/api/data').then(response => {
 *     const data = scope.prop(response.data)
 *     // data will be disposed when component unmounts
 *   })
 *   
 *   return html.div('Fetching...')
 * })
 * ```
 * 
 * @param fn - Function that receives the scope and returns content to render
 * @returns A renderable that manages the scope lifecycle
 * @public
 */
export const WithScope = (
  fn: (scope: DisposalScope) => TNode
): Renderable => {
  return (ctx: DOMContext) => {
    const scope = new DisposalScope()
    const clear = withScope(scope, () => renderableOfTNode(fn(scope))(ctx))
    
    return (removeTree: boolean) => {
      scope.dispose()
      clear(removeTree)
    }
  }
}

