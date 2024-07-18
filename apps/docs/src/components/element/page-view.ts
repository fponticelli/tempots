import { attr, html, Signal } from '@tempots/dom'
import { Page } from '../../model/domain'
import { fetchPage } from '../../services/page-service'
import { EmbedHTMLPage } from './embed-html-page'
import { HTMLTitle } from '@tempots/ui'
import { OpenGraph } from './open-graph'

export function PageView(page: Signal<Page>) {
  const editPath = page.map(p => {
    const value = `${p.path}.md`
    return `https://github.com/fponticelli/tempots/edit/main/apps/docs/pages/${value}`
  })
  return html.div(
    HTMLTitle(page.$.title.map(t => `Tempo • ${t}`)),
    OpenGraph({
      title: page.$.title.map(title => `${title} • Tempo`),
      description: page.$.description,
    }),
    attr.class('w-full h-full print:overflow-visible overflow-auto p-2'),
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
    html.div(
      attr.class('px-4'),
      html.div(EmbedHTMLPage(page.$.path.mapAsync(fetchPage, 'loading...')))
    )
  )
}
