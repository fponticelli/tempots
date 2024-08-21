import { attr, html, Value } from '@tempots/dom'

export function CheckCode(prefix: string, name: Value<string>) {
  return html.a(
    attr.class(
      'inline-block border border-gray-300 border-gray-800 rounded-md px-1 py-0.5 text-xs hover:bg-gray-700 hover:text-white whitespace-nowrap'
    ),
    attr.target('_blank'),
    attr.href(
      Value.map(
        name,
        n => `https://github.com/fponticelli/tempots/tree/main/${prefix}/${n}`
      )
    ),
    'Check the code'
  )
}
