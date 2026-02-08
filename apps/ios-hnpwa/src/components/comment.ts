import {
  view,
  nativeStyle,
  ForEach,
  Ensure,
  NotEmpty,
  Pressable,
  type NativeRenderable,
} from '@tempots/native'
import type { Signal } from '@tempots/core'
import type { Item } from '../types'
import type { Navigator } from '@tempots/native'
import { Route } from '../route'
import { styles } from '../styles'

export const Comments = (
  nav: Navigator<Route>,
  items: Signal<Item[]>,
  depth: number = 0
): NativeRenderable =>
  NotEmpty(items, (items) =>
    ForEach(items, (item: Signal<Item>) =>
      view.View(
        nativeStyle.style(styles.commentIndent(depth)),
        // Comment meta (author)
        Ensure(item.$.user, (user: Signal<string>) =>
          Pressable(
            () => nav.navigate(Route.user(user.value)),
            {},
            view.Text(user, nativeStyle.style(styles.commentMeta))
          )
        ),
        // Comment content
        Ensure(item.$.content, (content: Signal<string>) =>
          view.Text(content, nativeStyle.style(styles.commentContent))
        ),
        // Nested comments
        Ensure(item.$.comments, (comments: Signal<Item[]>) =>
          NotEmpty(comments, (comments) =>
            Comments(nav, comments, depth + 1)
          )
        )
      )
    )
  )
