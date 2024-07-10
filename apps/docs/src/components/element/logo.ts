import { aria, attr, html } from '@tempots/dom'

export function Logo() {
  return html.img(
    attr.class('h-12 w-auto'),
    attr.src('assets/icon-512x512.png'),
    attr.alt('Tempo Logo'),
    aria.hidden(true)
  )
}
