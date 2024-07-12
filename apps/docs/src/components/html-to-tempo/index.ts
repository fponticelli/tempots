import { attr, html, OnDispose, prop } from '@tempots/dom'
import { htmlToTempo } from './process-html'
import { Styles } from '../styles'
import { MonacoEditor } from '../element/monaco-editor'

export function HtmlToTempo() {
  const content = prop(
    '<div class="message">\n  Hello World!\n  <br/>\n  How are <b>you</b>?\n</div>'
  )
  const tempo = prop('')
  return html.div(
    attr.class('grid grid-cols-2 h-full overflow-hidden'),
    OnDispose(
      content.on(html => {
        try {
          const tempoStr = htmlToTempo(html)
          tempo.set(tempoStr)
        } catch (e) {
          console.warn('Failed to parse HTML', e)
        }
      })
    ),
    html.div(
      attr.class('h-full overflow-hidden p-2 flex flex-col'),
      html.div(attr.class(Styles.heading.small), 'HTML'),
      html.div(
        attr.class(Styles.heading.subSmall),
        'Paste your HTML code here'
      ),
      html.div(
        attr.class('h-[calc(100%_-_7rem)]'),
        MonacoEditor({
          autoFocus: true,
          autoSelect: true,
          content,
          language: 'html',
          onChange: content.set,
        })
      )
    ),
    html.div(
      attr.class('h-full overflow-hidden p-2 flex flex-col'),
      html.div(attr.class(Styles.heading.small), 'TypeScript'),
      html.div(attr.class(Styles.heading.subSmall), 'Copy the Tempo code'),
      html.div(
        attr.class('h-[calc(100%_-_7rem)]'),
        MonacoEditor({
          autoSelect: true,
          content: tempo,
          language: 'html',
          onChange: content.set,
        })
      )
    )
  )
}
