import { attr, html, Signal } from '@tempots/dom'
import { Page } from '../../model/domain'
import { fetchPage, type PageSnapshot } from '../../services/page-service'
import { EmbedHTMLPage } from './embed-html-page'
import { HTMLTitle } from '@tempots/ui'
import { OpenGraph } from './open-graph'

export function PageView(page: Signal<Page>, initialPage?: PageSnapshot) {
  const editPath = page.map(p => {
    const value = `${p.path}.md`
    return `https://github.com/fponticelli/tempots/edit/main/apps/docs/pages/${value}`
  })
  const path = page.$.path
  const content = path.mapAsync(
    (path, { abortSignal }) =>
      initialPage?.path === path
        ? Promise.resolve(initialPage.html)
        : fetchPage(path, abortSignal),
    initialPage?.path === path.value ? initialPage.html : 'loading...',
    () => 'Unable to load this page.'
  )
  return html.div(
    attr.class('p-4'),
    HTMLTitle(page.$.title.map(t => `Tempo • ${t}`)),
    OpenGraph({
      title: page.$.title.map(title => `${title} • Tempo`),
      description: page.$.description,
    }),
    html.div(
      attr.class('text-center mb-2'),
      html.a(
        attr.target('_blank'),
        attr.class(
          'bg-sky-700 text-white text-sm rounded-md px-2 py-1 hover:bg-sky-800'
        ),
        attr.href(editPath),
        'edit this page'
      )
    ),
    EmbedHTMLPage(content, path)
  )
}
