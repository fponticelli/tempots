import {
  attr,
  html,
  OnDispose,
  makeProp,
  TNode,
  Value,
  OnBrowserCtx,
} from '@tempots/dom'
import { htmlToTempo } from './process-html'
import { Styles } from '../styles'
import { MonacoEditor } from '../element/monaco-editor'
import { HTMLTitle } from '@tempots/ui'
import { OpenGraph } from '../element/open-graph'

export function EditorContainer(
  title: Value<string>,
  subTitle: Value<string>,
  ...children: TNode[]
) {
  return html.div(
    attr.class('overflow-hidden flex flex-col h-full flex-stretch'),
    html.div(attr.class(Styles.heading.small), title),
    html.div(attr.class(Styles.heading.subSmall), subTitle),
    html.div(attr.class('flex-auto overflow-hidden rounded-lg'), ...children)
  )
}

export function HtmlToTempo() {
  const content = makeProp(
    '<div class="message">\n  Hello World!\n  <br/>\n  How are <b>you</b>?\n</div>'
  )
  const tempo = makeProp('')
  return html.div(
    attr.class('h-full p-4 flex flex-col gap-2'),
    HTMLTitle('Tempo • HTML to Tempo'),
    OpenGraph({
      title: 'HTML to Tempo • Tempo',
      description: 'A simple tool to convert HTML to Tempo code.',
    }),
    attr.class(
      'grid grid-rows-2 grid-cols-1 md:grid-rows-1 md:grid-cols-2 h-[calc(100dvh_-_6rem)] overflow-hidden gap-2'
    ),
    OnBrowserCtx(ctx =>
      OnDispose(
        content.on(html => {
          try {
            const tempoStr = htmlToTempo(html)
            tempo.set(tempoStr)
          } catch (e) {
            console.warn('Failed to parse HTML', e)
          }
        })
      )(ctx)
    ),
    EditorContainer(
      'HTML',
      'Paste your HTML code here',
      MonacoEditor({
        autoFocus: true,
        autoSelect: true,
        content,
        language: 'html',
        onChange: content.set,
      })
    ),
    EditorContainer(
      'TypeScript',
      'Copy the Tempo code',
      MonacoEditor({
        autoSelect: true,
        content: tempo,
        language: 'typescript',
      })
    )
  )
}
