import { attr, html } from '@tempots/dom'
import { Library } from '../../model/domain'
import { Styles } from '../styles'
import { Cards } from './cards'
import { Card } from './card'
import { LibraryInfo } from './library-view'

export function LibrariesView(libraries: Library[]) {
  return html.div(
    attr.class('w-full flex flex-col'),
    html.h1(attr.class(Styles.heading.large), 'Libraries'),
    Cards(
      libraries.map(lib =>
        Card({
          description: LibraryInfo(lib),
          href: `/library/${lib.name}`,
          title: lib.title,
        })
      )
    )
  )
}
