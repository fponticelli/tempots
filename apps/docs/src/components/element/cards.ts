import { attr, TNode, html } from '@tempots/dom'

export function Cards(items: TNode[], ...children: TNode[]) {
  return html.ul(
    attr.class('w-full h-full justify-center flex flex-row flex-wrap gap-4'),
    ...items.map(item => html.li(attr.class('w-72'), item)),
    ...children
  )
}
