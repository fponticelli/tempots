import { TNode, attr, html } from '@tempots/dom'

export const flex = {
  row: (...children: TNode[]) =>
    html.div(attr.class('flex flex-row'), ...children),
  col: (...children: TNode[]) =>
    html.div(attr.class('flex flex-col'), ...children),
}
