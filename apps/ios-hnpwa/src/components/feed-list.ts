import {
  view,
  nativeStyle,
  ForEach,
  Ensure,
  When,
  Fragment,
  Pressable,
  type NativeRenderable,
} from '@tempots/native'
import type { Signal, ElementPosition } from '@tempots/core'
import type { Item, PageFeed } from '../types'
import type { Navigator } from '@tempots/native'
import { Route } from '../route'
import { styles } from '../styles'
import { Pagination } from './pagination'

const StoryItem = (
  nav: Navigator<Route>,
  item: Signal<Item>,
  pos: ElementPosition,
  page: Signal<number>
): NativeRenderable =>
  Pressable(
    () => {
      const i = item.value
      if (i.url.type === 'External') {
        // In native, navigate to the article detail instead of opening browser
        nav.navigate(Route.item(i.id))
      } else {
        nav.navigate(Route.item(i.id))
      }
    },
    {},
    view.View(
      nativeStyle.style(styles.feedItem),
      // Index number
      view.Text(
        page.map(p => String((p - 1) * 30 + pos.counter)),
        nativeStyle.style(styles.feedIndex)
      ),
      // Content
      view.View(
        nativeStyle.style(styles.feedContent),
        // Title
        view.Text(
          item.$.title.map(v => v ?? ''),
          nativeStyle.style(styles.feedTitle)
        ),
        // Domain
        Ensure(item.$.domain, domain =>
          view.Text(domain, nativeStyle.style(styles.feedDomain))
        ),
        // Meta
        When(
          item.map(i => i.type === 'job'),
          () => view.Text(item.$.time_ago, nativeStyle.style(styles.feedMeta)),
          () =>
            view.Text(
              item.map(i =>
                `${(i.points ?? 0).toLocaleString()} pts by ${i.user ?? ''} | ${i.time_ago} | ${i.comments_count.toLocaleString()} comments`
              ),
              nativeStyle.style(styles.feedMeta)
            )
        )
      )
    )
  )

export const FeedList = (
  nav: Navigator<Route>,
  pageFeed: Signal<PageFeed>
): NativeRenderable =>
  Fragment(
    view.ScrollView(
      view.View(
        ForEach(
          pageFeed.$.items,
          (item: Signal<Item>, pos: ElementPosition) =>
            StoryItem(nav, item, pos, pageFeed.$.page)
        ),
        Pagination({
          nav,
          feed: pageFeed.$.feed,
          page: pageFeed.$.page,
        })
      )
    )
  )
