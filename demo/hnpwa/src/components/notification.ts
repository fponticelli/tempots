import { attr, Child, html } from '@tempots/dom'

export const Notification = (message: Child) =>
  html.div(attr.class('notification'), message)
