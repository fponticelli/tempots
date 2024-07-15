import { DOMContext, type Renderable } from '@tempots/dom'

export const AutoFocus =
  (delay: number = 10): Renderable =>
  (ctx: DOMContext) => {
    const timeout = setTimeout(() => {
      ;(ctx.element as HTMLElement)?.focus()
    }, delay)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return (_removeTree: boolean) => clearTimeout(timeout)
  }
