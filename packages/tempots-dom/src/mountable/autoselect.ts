import { DOMContext } from '../dom/dom-context'
import type { Mountable } from '../types/domain'

export const AutoSelect =
  (delay: number = 10): Mountable =>
  (ctx: DOMContext) => {
    const timeout = setTimeout(() => {
      ;(ctx.element as HTMLInputElement)?.select()
    }, delay)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return (_removeTree: boolean) => {
      clearTimeout(timeout)
    }
  }
