import { attr, html, Signal } from '@tempots/dom';
import { replace } from '@tempots/std/string'

const mapName = (s: string) => replace(s, '_', ' ')

export const Title = (data: Signal<{ name: string; kind: string }>) => html.h3(
  attr.id(data.$.name),
  attr.class('is-family-monospace has-text-grey-dark'),
  data.$.name,
  html.span(
    attr.class('kind is-family-sans-serif has-text-grey-light is-size-6'),
    data.$.kind.map(mapName)
  )
)
