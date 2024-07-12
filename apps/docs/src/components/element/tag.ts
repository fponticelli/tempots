import { attr, html, Value } from '@tempots/dom'

export function Tag(text: Value<string>) {
  return html.span(
    attr.class(
      'bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap'
    ),
    text
  )
}
