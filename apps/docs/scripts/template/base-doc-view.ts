import { BaseDoc } from '../parse/jsdoc'
import { Maybe } from '@tempots/std/maybe'
import { markdown } from '../utils/markdown'
import { highlight } from '../utils/highlight'
import { attr, Ensure, ForEach, Fragment, html, NotEmpty, Signal } from '@tempots/dom'

export const Description = (data: Signal<BaseDoc>) => Ensure(
  data.$.description,
  desc => html.div(
    attr.innerHTML(desc.map(s => markdown(s, s => s)))
  )
)

export const ToDos = (data: Signal<BaseDoc>) => {
  const todos = data.map(doc => doc.todos)
  return NotEmpty(todos, html.div(
    attr.class('todos'),
    html.h2('TODOs'),
    html.ul(
      attr.class('list'),
      ForEach(todos, todo => html.li(
        attr.class('list-item'),
        html.input(attr.type('checkbox'), attr.disabled(true)),
        ' ',
        todo
      ))
    )
  ))
}

export const Examples = (data: Signal<BaseDoc>) => {
  const examples = data.$.examples
  return NotEmpty(examples, html.div(
    html.h2('Examples'),
    html.ul(
      attr.class('list examples'),
      ForEach(examples, example => html.li(
        attr.class('list-item'),
        html.pre(
          attr.class('ts language-ts example'),
          attr.innerHTML(example.mapAsync(v => v, '').map(highlight))
        )
      ))
    )
  ))
}

export const Tags = (data: Signal<BaseDoc>) => {
  const tags = data.map(doc => {
    const tags = [] as { type: string; name: string }[]
    if (doc.isDeprecated) tags.push({ type: 'danger', name: 'deprecated' })
    if (Maybe.isJust(doc.since))
      tags.push({ type: 'info', name: `since v${doc.since}` })
    return tags
  })
  return NotEmpty(tags, html.div(
    attr.class('tags'),
    ForEach(tags, tag => html.span(
      attr.class(tag.$.type),
      tag.$.name
    ))
  ))
}

export const BaseDocView = (data: Signal<BaseDoc>) => Fragment(
  Tags(data),
  Description(data),
  ToDos(data),
  Examples(data)
)
