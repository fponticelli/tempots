import {
  attr,
  makeComputed,
  Ensure,
  ForEach,
  Fragment,
  html,
  Signal,
  Value,
  When,
} from '@tempots/dom'
import { Library } from '../../model/domain'
import { Styles } from '../styles'
import { NPMShield } from './npm-shield'
import { Tag } from './tag'
import { EmbedHTMLPage } from './embed-html-page'
import { CheckCode } from './check-code'
import { HTMLTitle, UseLocation } from '@tempots/ui'
import { OpenGraph } from './open-graph'
import { EmbedHTMLFragmentFromURL } from './embed-html-fragment'

export function LibraryInfo(library: Value<Library>) {
  return html.div(
    attr.class('flex flex-col gap-4'),
    html.div(
      attr.class('flex items-start justify-between gap-4'),
      html.div(
        attr.class('flex flex-wrap gap-2'),
        ForEach(
          Value.toSignal(library).map(({ keywords }) => keywords),
          Tag
        )
      ),
      html.div(
        attr.class(
          'text-right flex flex-col justify-end items-center gap-2 min-w-20'
        ),
        NPMShield(Value.map(library, ({ title }) => title)),
        CheckCode(
          'packages',
          Value.map(library, ({ name }) => name)
        )
      )
    ),
    html.div(
      attr.class('text-gray-600'),
      Value.map(library, ({ description }) => description ?? '')
    )
  )
}

export function LibraryView(data: Signal<{ library: Library; path?: string }>) {
  return UseLocation(location => {
    const library = data.$.library
    const path = data.$.path
    const isRoot = path.map(v => v == null)
    const apiUrl = makeComputed(() => {
      const prefix = library.value.name.split('-').pop()
      return path.value == null
        ? `/api/${library.value.name}/${prefix}.html`
        : `/api/${library.value.name}/${prefix}.${path.value}.html`
    }, [data, location])
    return html.div(
      attr.class('overflow-auto h-full flex flex-col gap-1 p-4'),
      HTMLTitle(library.map(({ title }) => `Tempo • ${title}`)),
      OpenGraph({
        title: library.map(({ title }) => `${title} • Tempo`),
        description: library.$.description,
        keywords: library.$.keywords as Value<string[] | undefined>,
      }),
      html.h1(attr.class(Styles.heading.large), library.$.title),
      When(
        isRoot,
        Fragment(
          LibraryInfo(library),
          Ensure(
            library.map(v => (v.content === '' ? null : v.content)),
            content =>
              html.div(
                attr.class('p-4 border rounded-md'),
                EmbedHTMLPage(content)
              )
          )
        )
      ),
      EmbedHTMLFragmentFromURL(apiUrl)
    )
  })
}
