import { attr, Empty, Ensure, ForEach, html, Signal, Value } from '@tempots/dom'
import { Library } from '../../model/domain'
import { Styles } from '../styles'
import { Anchor } from '@tempots/ui'

export function Tag(text: Value<string>) {
  return html.span(
    attr.class('bg-gray-200 text-gray-600 px-2 py-1 rounded-full'),
    text
  )
}

export function API(href: Value<string>) {
  return Anchor(
    href,
    html.span(
      attr.class(
        'border border-gray-700 rounded-xl px-2 py-0.5 text-sm font-semibold text-gray-700'
      ),
      'API'
    )
  )
}

export function LibraryInfo(library: Value<Library>) {
  return html.div(
    attr.class('flex flex-col gap-2'),
    html.div(
      attr.class('flex justify-between'),
      API('#'),
      html.a(
        attr.class('text-white rounded-xl px-2 py-0.5 text-sm bg-blue-600'),
        attr.href(
          `https://www.npmjs.com/package/${Signal.map(library, ({ title }) => title)}`
        ),
        'npm v.',
        Signal.map(library, ({ version }) => version)
      )
    ),
    html.div(
      attr.class('flex gap-2'),
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
          html.div(
            attr.class('p-2 border rounded-md'),
            html.pre(attr.class('text-sm'), content)
          )
        )
    )
  )
}
