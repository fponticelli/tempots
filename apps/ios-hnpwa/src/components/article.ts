import {
  view,
  nativeStyle,
  Ensure,
  Pressable,
  type NativeRenderable,
} from '@tempots/native'
import type { Signal } from '@tempots/core'
import type { Item } from '../types'
import type { Navigator } from '@tempots/native'
import { Route } from '../route'
import { styles } from '../styles'
import { Comments } from './comment'

export const ArticleView = (
  nav: Navigator<Route>,
  item: Signal<Item>
): NativeRenderable =>
  view.ScrollView(
    view.View(
      nativeStyle.style(styles.articleContainer),
      // Title
      view.Text(
        item.$.title.map(v => v ?? ''),
        nativeStyle.style(styles.articleTitle)
      ),
      // Domain
      Ensure(item.$.domain, domain =>
        view.Text(domain, nativeStyle.style(styles.articleDomain))
      ),
      // Meta: points, user, time
      view.Text(
        item.map(i => {
          if (i.type === 'job') return i.time_ago
          return `${(i.points ?? 0).toLocaleString()} points by ${i.user ?? ''} | ${i.time_ago}`
        }),
        nativeStyle.style(styles.articleMeta)
      ),
      // User link
      Ensure(item.$.user, (user: Signal<string>) =>
        Pressable(
          () => nav.navigate(Route.user(user.value)),
          {},
          view.Text(
            user.map(u => `Profile: ${u}`),
            nativeStyle.style({ fontSize: 13, color: '#ff6600', marginBottom: 12 })
          )
        )
      ),
      // Content
      Ensure(item.$.content, (content: Signal<string>) =>
        view.Text(content, nativeStyle.style(styles.articleContent))
      ),
      // Comments
      Ensure(item.$.comments, (comments: Signal<Item[]>) =>
        Comments(nav, comments)
      )
    )
  )
