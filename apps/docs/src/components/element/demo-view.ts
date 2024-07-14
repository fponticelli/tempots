import { attr, html, Signal } from '@tempots/dom'
import { Styles } from '../styles'
import { Demo } from '../../model/domain'

export function DemoView(demo: Signal<Demo & { id: string }>) {
  return html.div(
    attr.class('w-full h-full flex flex-col p-2'),
    html.h1(
      attr.class(Styles.heading.small),
      html.span(attr.class('text-gray-600 font-normal'), 'Demo: '),
      demo.$.title
    ),
    html.h2(attr.class(Styles.heading.subSmall), demo.$.description),
    html.iframe(
      attr.class('w-full h-full border rounded-md'),
      attr.src(demo.map(({ id }) => `/demo/${id}/index.html`))
    )
  )
}
