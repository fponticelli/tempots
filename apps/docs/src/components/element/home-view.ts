import { attr, html, signal } from '@tempots/dom'
import { CommitsShield } from './commits-shield'
import { PageView } from './page-view'
import { Page } from '../../model/domain'
import { GithubStars } from './github-stars'

export function HomeView(page: Page) {
  return html.div(
    attr.class('relative h-full overflow-auto'),
    html.div(
      attr.class('float-right flex flex-row gap-2 m-4'),
      GithubStars('fponticelli', 'tempots'),
      CommitsShield('fponticelli', 'tempots')
    ),
    PageView(signal(page))
  )
}
