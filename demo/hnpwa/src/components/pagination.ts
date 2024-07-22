import {
  aria,
  attr,
  makeComputed,
  ForEach,
  html,
  Signal,
  When,
} from '@tempots/dom'
import { Feed, maxPage, Route } from '../route'
import { LinkRoute } from './link-route'

export interface PaginationProps {
  feed: Signal<Feed>
  page: Signal<number>
}

const pageRange = (
  feed: Feed,
  current: number
): { feed: Feed; current: number; page: number }[] =>
  Array.from({ length: maxPage(feed) }, (_, i) => ({
    feed,
    current,
    page: i + 1,
  }))

export const Pagination = ({ feed, page }: PaginationProps) =>
  html.section(
    attr.class('pagination'),
    html.section(
      When(
        page.map(v => v === 1),
        html.span(attr.class('inactive'), 'Previous'),
        LinkRoute({
          route: makeComputed(
            () => Route.feeds(feed.value, page.value),
            [feed, page]
          ),
          children: 'Previous',
        })
      )
    ),
    html.nav(
      ForEach(
        makeComputed(() => pageRange(feed.value, page.value), [feed, page]),
        res =>
          When(
            res.map(({ current, page }) => current === page),
            html.span(aria.current('page'), res.at('page').map(String)),
            LinkRoute({
              route: makeComputed(
                () => Route.feeds(res.value.feed, res.value.page),
                [res]
              ),
              children: res.at('page').map(String),
            })
          )
      )
    ),
    html.div(
      attr.class('mobile'),
      html.span(page.map(String)),
      html.span('/'),
      html.span(feed.map(maxPage).map(String))
    ),
    html.section(
      When(
        makeComputed(() => maxPage(feed.value) === page.value, [feed, page]),
        html.span(attr.class('inactive'), 'Next'),
        LinkRoute({
          route: makeComputed(
            () => Route.feeds(feed.value, page.value + 1),
            [feed, page]
          ),
          children: 'Next',
        })
      )
    )
  )
