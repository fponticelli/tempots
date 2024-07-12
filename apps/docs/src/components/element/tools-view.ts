import { attr, html } from '@tempots/dom'
import { Styles } from '../styles'
import { Cards } from './cards'
import { Card } from './card'

export function ToolsView() {
  return html.div(
    attr.class('w-full h-full flex flex-col'),
    html.div(
      html.h1(attr.class(Styles.heading.large), 'Tools'),
      Cards([
        Card({
          title: 'HTML to Tempo',
          description: 'A simple tool to convert HTML to Tempo code.',
          href: `/tool/html-to-tempo`,
        }),
      ])
    )
  )
}
