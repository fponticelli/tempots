import { attr, html, makeSignal } from '@tempots/dom'
import { CommitsShield } from './commits-shield'
import { PageView } from './page-view'
import { Page } from '../../model/domain'

export function HomeView(page: Page) {
  return html.div(
    attr.class('relative'),
    html.div(
      attr.class('float-right'),
      CommitsShield('fponticelli', 'tempots')
    ),
    PageView(makeSignal(page))
  )
}
