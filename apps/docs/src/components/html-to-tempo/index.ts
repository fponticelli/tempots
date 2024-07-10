import { attr, AutoSelect, emit, html, on, OnDispose, prop } from '@tempots/dom'
import { htmlToTempo } from './process-html'
import { Styles } from '../styles'
import { SelectOnFocus } from '@tempots/ui'

export function HtmlToTempo() {
  const content = prop('')
  const tempo = prop('')
  return html.div(
    attr.class('grid grid-cols-2 gap-2 h-full overflow-hidden'),
    OnDispose(
      content.on(html => {
        try {
          const tempoStr = htmlToTempo(html)
          tempo.set(tempoStr)
        } catch (e) {
          console.error('Failed to parse HTML', e)
        }
      })
    ),
    html.div(
      attr.class('h-full overflow-hidden p-2 flex flex-col gap-2'),
      html.h1(attr.class(Styles.smallHeading), 'HTML'),
      html.div(
        attr.class('h-[calc(100%_-_7rem)]'),
        html.textarea(
          AutoSelect(),
          SelectOnFocus(),
          attr.class(Styles.block.code),
          attr.class(Styles.input.focus),
          attr.placeholder('Enter HTML here'),
          on.input(emit.value(content.set)),
          content
        )
      )
    ),
    html.div(
      attr.class('h-full overflow-hidden p-2 flex flex-col gap-2'),
      html.h1(attr.class(Styles.smallHeading), 'TypeScript'),
      html.div(
        attr.class('h-[calc(100%_-_7rem)]'),
        html.textarea(
          attr.class(Styles.block.code),
          attr.class(Styles.input.focus),
          SelectOnFocus(),
          tempo
        )
      )
    )
  )
}
