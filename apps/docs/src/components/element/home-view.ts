import { attr, html } from '@tempots/dom'
import { CommitsShield } from './commits-shield'

export function HomeView() {
  return html.div(
    attr.class('w-full flex flex-col'),
    CommitsShield('fponticelli', 'tempots')
  )
}
