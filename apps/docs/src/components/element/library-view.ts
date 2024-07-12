import { attr, Empty, Ensure, ForEach, html, Signal, Value } from '@tempots/dom'
import { Library } from '../../model/domain'
import { Styles } from '../styles'
import { APILink } from './api-link'
import { NPMShield } from './npm-shield'
import { Tag } from './tag'

export function LibraryInfo(library: Value<Library>) {
  return html.div(
    attr.class('flex flex-col gap-2'),
    html.div(
      attr.class('flex justify-between'),
      APILink('#'),
      NPMShield(Signal.map(library, ({ title }) => title))
    ),
    html.div(
      attr.class('flex flex-wrap gap-2'),
      ForEach(
        Signal.wrap(library).map(({ keywords }) => keywords),
        Tag
      )
    ),
    html.div(
      attr.class('text-gray-600'),
      Signal.map(library, ({ description }) => description ?? '')
    )
  )
}

export function LibraryView(data: Signal<Library>) {
  return html.div(
    attr.class('w-full h-full flex flex-col'),
    html.h1(
      attr.class(Styles.heading.large),
      html.span(attr.class('text-gray-600 font-normal'), 'Library: '),
      data.$.title
    ),
    LibraryInfo(data),
    (data.$.description &&
      Ensure(data.$.description, des =>
        html.h2(attr.class(Styles.heading.subSmall), des)
      )) ||
      Empty,
    Ensure(
      data.map(v => (v.content === '' ? null : v.content)),
      content =>
        html.div(
          attr.class('mt-4'),
          html.h2(attr.class(Styles.heading.subSmall), 'Content'),
          html.div(attr.class('p-2 border rounded-md'), attr.innerHTML(content))
        )
    )
  )
}
