import { attr, TNode, html, Value } from '@tempots/dom'
import { Anchor } from '@tempots/ui'

export function Card({
  title,
  description,
  href,
}: {
  title: TNode
  description: TNode
  href: Value<string>
}) {
  return Anchor(
    href,
    html.div(
      attr.class('bg-white border rounded-lg shadow-md min-h-36'),
      html.h2(
        attr.class(
          'text-lg font-bold p-4 py-2 border-b text-center text-gray-600'
        ),
        title
      ),
      html.div(
        attr.class('p-4 py-2'),
        html.p(attr.class('text-gray-600'), description)
      )
    )
  )
}
