import { attr, html } from '@tempots/dom'
import { Styles } from '../styles'
import { Cards } from './cards'
import { Card } from './card'
import { HTMLTitle } from '@tempots/ui'
import { OpenGraph } from './open-graph'

export function ToolsView() {
  return html.div(
    HTMLTitle('Tempo • Tools'),
    OpenGraph({
      title: 'Tools • Tempo',
      description: 'Tempo tools',
    }),
    html.h1(attr.class(Styles.heading.large), 'Tools'),
    Cards([
      Card({
        title: 'HTML to Tempo',
        description: 'A simple tool to convert HTML to Tempo code.',
        href: `/tool/html-to-tempo.html`,
      }),
    ])
  )
}
