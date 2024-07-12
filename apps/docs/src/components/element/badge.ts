import { Value, attr, html } from '@tempots/dom'

export function Badge(text: Value<string>) {
  return html.span(
    attr.class(
      'text-white rounded-xl px-2 py-0.5 text-sm bg-blue-600 whitespace-nowrap'
    ),
    text
  )
}
