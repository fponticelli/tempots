import { Fragment, HTMLTitle } from '@tempots/dom'
import { Notification } from './notification'

export const NotFound = () =>
  Fragment(
    HTMLTitle(`HNPWA • Page Not Found`),
    Notification('Page Not 404: ' + location.pathname)
  )
