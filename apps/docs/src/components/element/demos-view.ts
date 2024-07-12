import { attr, html } from '@tempots/dom'
import { Demo } from '../../model/domain'
import { Styles } from '../styles'
import { Card } from './card'
import { Cards } from './cards'

export function DemosView(demos: Demo[]) {
  return html.div(
    attr.class('w-full h-full flex flex-col'),
    html.div(
      html.h1(attr.class(Styles.heading.large), 'Demos'),
      Cards(
        demos.map(demo =>
          Card({
            title: demo.title,
            description: demo.description,
            href: `/demo/${demo.path}`,
          })
        )
      )
    )
  )
}
