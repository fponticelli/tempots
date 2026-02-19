import {
  Signal,
  ForEach,
  Ensure,
  html,
  attr,
  Renderable,
  NotEmpty,
} from '@tempots/dom'
import { Route } from '../route'
import { Item } from '../types'
import { LinkRoute } from './link-route'

export interface CommentsProps {
  items: Signal<Item[]>
}

export function Comments({ items }: CommentsProps): Renderable {
  return NotEmpty(items, items =>
    html.ul(
      ForEach(items, (item: Signal<Item>) =>
        html.li(
          html.div(
            attr.class('comment-meta'),
            LinkRoute({ route: item.at('user').map(Route.user) })
          ),
          html.div(attr.innerHTML(item.at('content'))),
          Ensure(item.at('comments'), (comments: Signal<Item[]>) =>
            NotEmpty(comments, comments =>
              html.div(Comments({ items: comments }))
            )
          )
        )
      )
    )
  )
}
