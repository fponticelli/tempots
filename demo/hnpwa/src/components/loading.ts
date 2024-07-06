import { attr, html } from '@tempots/dom'
import { Notification } from './notification'

export const Loading = () => Notification(html.div(attr.class('spinner')))
