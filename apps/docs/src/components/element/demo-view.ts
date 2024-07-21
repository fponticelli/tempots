import { attr, html, Signal } from '@tempots/dom'
import { Styles } from '../styles'
import { Demo } from '../../model/domain'
import { CheckCode } from './check-code'
import { HTMLTitle } from '@tempots/ui'
import { OpenGraph } from './open-graph'

export function DemoView(demo: Signal<Demo & { id: string }>) {
  return html.div(
    HTMLTitle(demo.map(({ title }) => `Tempo • ${title}`)),
    OpenGraph({
      title: demo.map(({ title }) => `${title} • Tempo`),
      description: demo.$.description as Signal<string | undefined>,
    }),
    attr.class('w-full h-full flex flex-col p-2'),
    html.h1(
      attr.class(Styles.heading.small),
      attr.class('flex justify-between items-center gap-2'),
      html.span(
        html.span(attr.class('text-gray-600 font-normal'), 'Demo: '),
        demo.$.title
      ),
      CheckCode('demo', demo.$.path)
    ),
    html.h2(attr.class(Styles.heading.subSmall), demo.$.description),
    html.iframe(
      attr.class('w-full h-full border rounded-md'),
      attr.src(demo.map(({ id }) => `/demos/${id}/index.html`))
    )
  )
}
