import { Action } from '../action'
import { toHref, Route } from '../route'
import { A, SPAN, Fragment } from 'tempo-dom/lib/html'
import { getUnsafe, Option, toBoolean } from 'tempo-std/lib/option'
import {
  Attribute,
  mapAttribute,
  attributeToHandler
} from 'tempo-dom/lib/value'
import { DOMChild } from 'tempo-dom/lib/template'
import { IBuilder } from 'tempo-dom/lib/impl/dom_builder'
import 'tempo-core/lib/value'

export const maybeLink = <State>(attrs: {
  label: DOMChild<State, Action> | IBuilder<State, Action, unknown>
  route: Attribute<State, Option<Route>>
  class?: Attribute<State, string>
}): IBuilder<State, Action, unknown> =>
  Fragment<State, Action, unknown>($ =>
    $.MatchBool({
      condition: mapAttribute(attrs.route, toBoolean),
      false: SPAN($ =>
        $.class(
          mapAttribute(attrs.class || '', v =>
            (v ? [v] : []).concat(['is-active']).join(' ')
          )
        ).Append(attrs.label)
      ),
      true: link({
        label: attrs.label,
        route: mapAttribute(attrs.route, getUnsafe),
        class: attrs.class
      })
    })
  )

export const link = <State>(attrs: {
  label: DOMChild<State, Action> | IBuilder<State, Action, unknown>
  route: Attribute<State, Route>
  class?: Attribute<State, string>
}): IBuilder<State, Action, unknown> =>
  A<State, Action, unknown>($ =>
    $.class(attrs.class)
      .href(
        mapAttribute<State, Route, string>(attrs.route, route => toHref(route))
      )
      .onClick(
        attributeToHandler(
          attrs.route,
          (route: Route, e: Event): Action => {
            e.preventDefault()
            const url = toHref(route)
            history.pushState(null, '', url || './')
            return Action.goTo(route)
          }
        )
      )
      .Append(attrs.label)
  )
