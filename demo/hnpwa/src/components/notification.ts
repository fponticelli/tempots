import { attr, TNode, html } from '@tempots/dom'

export const Notification = (message: TNode) =>
  html.div(attr.class('notification'), message)
