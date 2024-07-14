import { attr, Ensure, ForEach, html, Signal, Value } from '@tempots/dom'
import { Library } from '../../model/domain'
import { Styles } from '../styles'
import { NPMShield } from './npm-shield'
import { Tag } from './tag'

export function LibraryInfo(library: Value<Library>) {
  return html.div(
    attr.class('flex flex-col gap-4'),
    html.div(
      attr.class('flex items-start justify-between gap-4'),
      html.div(
        attr.class('flex flex-wrap gap-2'),
        ForEach(
          Signal.wrap(library).map(({ keywords }) => keywords),
          Tag
        )
      ),
      html.div(
        attr.class('min-w-40 text-right'),
        NPMShield(Signal.map(library, ({ title }) => title))
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
    attr.class(
      'w-full h-full print:overflow-visible overflow-auto p-2 flex flex-col gap-2'
    ),
    html.h1(attr.class(Styles.heading.large), data.$.title),
    LibraryInfo(data),
    Ensure(
      data.map(v => (v.content === '' ? null : v.content)),
      content =>
        html.div(
          attr.class('p-4 border rounded-md'),
          attr.class(Styles.prose),
          attr.innerHTML(content)
        )
    )
  )
}
