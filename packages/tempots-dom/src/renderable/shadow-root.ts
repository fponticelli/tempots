import { TNode } from '../types/domain'
import { Fragment } from './fragment'
import { OnDispose } from './on-dispose'
import { renderWithContext } from './render'
import { WithBrowserCtx } from './with-browser-ctx'

export interface ShadowRootOptions {
  mode: 'open' | 'closed'
  delegatesFocus?: boolean
  slotAssignment?: 'named' | 'manual'
  clonable?: boolean
  serializable?: boolean
}

export function ShadowRoot(
  {
    mode,
    delegatesFocus,
    slotAssignment,
    clonable,
    serializable,
  }: ShadowRootOptions,
  ...children: TNode[]
) {
  return WithBrowserCtx(ctx => {
    // Build the options object, only including defined properties
    const options: ShadowRootInit = { mode }
    if (delegatesFocus !== undefined) options.delegatesFocus = delegatesFocus
    if (slotAssignment !== undefined) options.slotAssignment = slotAssignment
    if (clonable !== undefined) options.clonable = clonable
    if (serializable !== undefined) options.serializable = serializable

    const shadowRoot = ctx.element.attachShadow(options)
    const newCtx = ctx.withElement(shadowRoot as unknown as HTMLElement)
    const clear = renderWithContext(Fragment(...children), newCtx)
    return OnDispose(() => clear(true))
  })
}
