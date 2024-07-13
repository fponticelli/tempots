import { attr, html, signal } from '@tempots/dom'
import { CommitsShield } from './commits-shield'
import { PageView } from './page-view'

export function HomeView() {
  return html.div(
    html.div(
      attr.class('float-right'),
      CommitsShield('fponticelli', 'tempots')
    ),
    PageView(
      signal({
        path: 'index.html',
        title: 'Tempo TS',
      })
    )
  )
}
