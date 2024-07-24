import { attr, html } from '@tempots/dom'
import { Demo } from '../../model/domain'
import { Styles } from '../styles'
import { Card } from './card'
import { Cards } from './cards'
import { HTMLTitle } from '@tempots/ui'
import { OpenGraph } from './open-graph'

export function DemosView(demos: Demo[]) {
  return html.div(
    HTMLTitle('Tempo • Demos'),
    OpenGraph({
      title: 'Demos • Tempo',
      description: 'Tempo demos',
    }),
    html.h1(attr.class(Styles.heading.large), 'Demos'),
    Cards(
      demos.map(demo =>
        Card({
          title: demo.title,
          description: demo.description,
          href: `/demos/${demo.path}/index.html`,
          external: true,
        })
      )
    )
  )
}
