import {
  ForEach,
  Ensure,
  Signal,
  html,
  attr,
  ElementPosition,
  When,
  Fragment,
} from '@tempots/dom'
import { HTMLTitle } from '@tempots/ui'
import { Route } from '../route'
import { Item, PageFeed } from '../types'
import { LinkRoute } from './link-route'
import { Pagination } from './pagination'

export const ItemLink = (item: Signal<Item>) =>
  LinkRoute({
    route: item.map(i => {
      if (i.url.type === 'External') return Route.externalRoute(i.url.path)
      else return Route.item(i.id)
    }),
    children: item.at('title').map(v => v ?? ''),
  })

export const ItemMainLink = (item: Signal<Item>) => html.h2(ItemLink(item))

export const ItemFooter = (item: Signal<Item>) =>
  html.footer(
    When(
      item.map(i => i.type === 'job'),
      item.at('time_ago'),
      Fragment(
        item.at('points').map(v => (v ?? 0).toLocaleString()),
        ' points by ',
        LinkRoute({ route: item.at('user').map(Route.user) }),
        ' ',
        item.at('time_ago'),
        ' | ',
        LinkRoute({
          route: item.map(i => Route.item(i.id)),
          children: item.at('comments_count').map(v => v.toLocaleString()),
        })
      )
    )
  )

export function PageFeedView(page: Signal<PageFeed>) {
  return html.section(
    HTMLTitle(
      page.at('feed').map(v => `HNPWA • ${v} news - ${page.value.page}`)
    ),
    attr.class('list-view'),
    html.ul(
      ForEach(page.at('items'), (item: Signal<Item>, pos: ElementPosition) =>
        html.li(
          html.aside(page.map(p => String((p.page - 1) * 30 + pos.counter))),
          html.div(
            ItemLink(item),
            Ensure(item.at('domain'), domain =>
              html.span(attr.class('domain'), domain)
            ),
            ItemFooter(item)
          )
        )
      )
    ),
    Pagination({ feed: page.at('feed'), page: page.at('page') })
  )
}
