import { Signal, For, Show, InnerHTML } from '@tempots/dom'
import { NotEmpty } from '@tempots/dom'
import { Route } from '../route'
import { Item } from '../types'
import { LinkRoute } from './link-route'

export interface CommentsProps {
  items: Signal<Item[]>
}

export function Comments({ items }: CommentsProps) {
  return (
    <NotEmpty on={items} display={
      <ul>
        <For of={items}>
          {({ at }: Signal<Item>) => (
            <li>
              <div className="comment-meta">
                <LinkRoute route={at('user').map(Route.user)} />
              </div>
              <div><InnerHTML html={at('content')} /></div>
              <Show when={at('comments')}>
                {(comments: Signal<Item[]>) => (
                  <NotEmpty on={comments} display={<Comments items={comments} />} />
                )}
              </Show>
            </li>
          )}
        </For>
      </ul>
    }/>
  )
}
