import { attr, html, Value } from '@tempots/dom'
import { Anchor } from '@tempots/ui'

export function APILink(href: Value<string>) {
  return Anchor(
    href,
    html.span(
      attr.class(
        'border border-gray-700 rounded-xl px-2 py-0.5 text-sm font-semibold text-gray-700'
      ),
      'API'
    )
  )
}
