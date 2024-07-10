import { attr, html } from '@tempots/dom'

export const loader = html.div(
  attr.class('loader'),
  html.div(
    attr.class('title has-text-grey-light is-size-5 loading'),
    'Loading ...'
  )
)
