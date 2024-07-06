import { InnerHTML, Show } from '@tempots/dom'
import type { Signal } from '@tempots/dom'
import { Item } from '../types'
import { ItemFooter, ItemMainLink } from './page-feed'
import { Comments } from './comments'

export interface ArticleProps {
  item: Signal<Item>
}

export const Article = ({ item }: ArticleProps) => {
  return (
    <article>
      <section>
        <ItemMainLink item={item} />
        <Show when={item.at('domain')}>
          {(domain: Signal<string>) => <span className="domain">{domain}</span>}
        </Show>
        <ItemFooter item={item} />
      </section>
      <Show when={item.at('content')}>
        {(content: Signal<string>) => <div><InnerHTML html={content} /></div>}
      </Show>
      <Show when={item.at('comments')}>
        {(comments: Signal<Item[]>) => (
          <section className="comments-view">
            <Comments items={comments} />
          </section>
        )}
      </Show>
    </article>
  )
}
