import { attr, Child, html } from '@tempots/dom'

export function Cards(items: Child[], ...children: Child[]) {
  return html.ul(
    attr.class('w-full h-full justify-center flex flex-row flex-wrap gap-4'),
    ...items.map(item => html.li(attr.class('w-72'), item)),
    ...children
  )
}
