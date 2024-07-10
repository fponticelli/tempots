import { attr, Child, Ensure, html, Mountable, on, Signal } from '@tempots/dom'
import { Action } from '../action'
import { toHref, Route } from '../route'
import { Maybe } from '@tempots/std/maybe'

export const maybeLink = (
  route: Signal<Maybe<Route>>,
  ...children: Child[]
): Mountable =>
  Ensure(
    route,
    route => link(route, ...children),
    () => html.span(attr.class('is-active'), ...children)
  )

export const link = (route: Signal<Route>, ...children: Child[]): Mountable =>
  html.a(
    attr.href(route.map(toHref)),
    on.click(e => {
      e.preventDefault()
      const url = toHref(route.value)
      history.pushState(null, '', url || './')
      return Action.goTo(route.value)
    }),
    ...children
  )
