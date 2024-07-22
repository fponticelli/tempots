import { attr, html } from '@tempots/dom'
import { Library } from '../../model/domain'
import { Styles } from '../styles'
import { Cards } from './cards'
import { Card } from './card'
import { LibraryInfo } from './library-view'
import { HTMLTitle } from '@tempots/ui'
import { OpenGraph } from './open-graph'

export function LibrariesView(libraries: Library[]) {
  return html.div(
    HTMLTitle('Tempo • Libraries'),
    OpenGraph({
      title: 'Libraries • Tempo',
      description: 'Tempo libraries',
    }),
    attr.class('w-full flex flex-col'),
    html.h1(attr.class(Styles.heading.large), 'Libraries'),
    Cards(
      libraries.map(lib =>
        Card({
          description: LibraryInfo(lib),
          href: `/library/${lib.name}.html`,
          title: lib.title,
        })
      )
    )
  )
}
