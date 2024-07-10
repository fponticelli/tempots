import { Child, attr, html } from '@tempots/dom'

export const flex = {
  row: (...children: Child[]) =>
    html.div(attr.class('flex flex-row'), ...children),
  col: (...children: Child[]) =>
    html.div(attr.class('flex flex-col'), ...children),
}
