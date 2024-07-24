import { attr, html, makeSignal } from '@tempots/dom'
import { CommitsShield } from './commits-shield'
import { PageView } from './page-view'
import { Page } from '../../model/domain'
import { GithubStars } from './github-stars'

export function HomeView(page: Page) {
  return html.div(
    attr.class('relative'),
    html.div(
      attr.class('float-right flex flex-row gap-2'),
      GithubStars('fponticelli', 'tempots'),
      CommitsShield('fponticelli', 'tempots')
    ),
    PageView(makeSignal(page))
  )
}
