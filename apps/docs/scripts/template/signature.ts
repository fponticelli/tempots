import { attr, html, Signal } from '@tempots/dom'
import Prism from 'prismjs'

export const Signature = (text: Signal<string>) =>
  html.pre(
    attr.class('ts language-ts signature'),
    attr.innerHTML(
      text.map(s =>
        Prism.highlight(s, Prism.languages.typescript, 'typescript')
      )
    )
  )
