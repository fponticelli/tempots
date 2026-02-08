import {
  view,
  nativeStyle,
  Pressable,
  When,
  type NativeRenderable,
} from '@tempots/native'
import type { Signal } from '@tempots/core'
import { computed } from '@tempots/core'
import type { Navigator } from '@tempots/native'
import { Feed, maxPage, Route } from '../route'
import { styles } from '../styles'

export interface PaginationProps {
  nav: Navigator<Route>
  feed: Signal<Feed>
  page: Signal<number>
}

export const Pagination = ({ nav, feed, page }: PaginationProps): NativeRenderable =>
  view.View(
    nativeStyle.style(styles.pagination),
    // Previous button
    When(
      page.map(v => v > 1),
      () =>
        Pressable(
          () => nav.navigate(Route.feeds(feed.value, page.value - 1)),
          {},
          view.Text('Previous', nativeStyle.style(styles.paginationButtonText)),
          nativeStyle.style(styles.paginationButton)
        ),
      () =>
        view.View(
          nativeStyle.style(styles.paginationButtonDisabled),
          view.Text('Previous', nativeStyle.style(styles.paginationButtonText))
        )
    ),
    // Page info
    view.Text(
      computed(() => `${page.value} / ${maxPage(feed.value)}`, [feed, page]),
      nativeStyle.style(styles.paginationInfo)
    ),
    // Next button
    When(
      computed(() => page.value < maxPage(feed.value), [feed, page]),
      () =>
        Pressable(
          () => nav.navigate(Route.feeds(feed.value, page.value + 1)),
          {},
          view.Text('Next', nativeStyle.style(styles.paginationButtonText)),
          nativeStyle.style(styles.paginationButton)
        ),
      () =>
        view.View(
          nativeStyle.style(styles.paginationButtonDisabled),
          view.Text('Next', nativeStyle.style(styles.paginationButtonText))
        )
    )
  )
