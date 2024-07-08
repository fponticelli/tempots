import { DIV } from 'tempo-dom/lib/html'

export const loader = DIV<any, any, unknown>($ =>
  $.class('loader').DIV($ =>
    $.class('title has-text-grey-light is-size-5 loading').text('Loading ...')
  )
)
