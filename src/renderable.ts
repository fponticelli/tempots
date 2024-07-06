import { type DOMContext } from './dom-context'
import { type Clear } from './clean'

export interface Renderable {
  appendTo: (ctx: DOMContext) => Clear
}
