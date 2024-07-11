import { attr, html, Signal } from '@tempots/dom'
import { Styles } from '../styles'

export function DemoView(demoId: Signal<string>) {
  return html.div(
    attr.class('w-full h-full flex flex-col'),
    html.h1(
      attr.class(Styles.smallHeading),
      demoId.map(id => `Demo: ${id}`)
    ),
    html.iframe(
      attr.class('w-full h-[calc(100%-6.5rem)] border rounded-md'),
      attr.src(demoId.map(id => `/demo/${id}/index.html`))
    )
  )
}
