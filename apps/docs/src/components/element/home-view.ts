import { attr, html, useSignal } from '@tempots/dom'
import { CommitsShield } from './commits-shield'
import { PageView } from './page-view'
import { Page } from '../../model/domain'

export function HomeView(page: Page) {
  return html.div(
    attr.class('h-full overflow-y-auto pb-8'),
    html.div(
      attr.class('relative'),
      html.div(
        attr.class('float-right mt-4 mr-4'),
        CommitsShield('fponticelli', 'tempots')
      ),
      PageView(useSignal(page))
    )
  )
}
