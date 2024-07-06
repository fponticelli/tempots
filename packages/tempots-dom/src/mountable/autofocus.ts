import { DOMContext } from '../dom/dom-context'
import type { Mountable } from '../types/domain'

export const AutoFocus =
  (delay: number = 10): Mountable =>
  (ctx: DOMContext) => {
    const timeout = setTimeout(() => {
      ;(ctx.element as HTMLElement)?.focus()
    }, delay)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return (_removeTree: boolean) => clearTimeout(timeout)
  }
