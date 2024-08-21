import { Fragment, Portal, Value, attr, makeSignal } from '@tempots/dom'
import { UseLocation, urlFromLocation } from '@tempots/ui'

export type OpenGraphProps = {
  readonly title: Value<string>
  readonly description?: Value<string | undefined>
  readonly image?: Value<string | undefined>
  readonly keywords?: Value<string[] | undefined>
}

export function OpenGraph(props: OpenGraphProps) {
  const { title, description, image, keywords } = props
  const imageSignal =
    Value.maybeToSignal<string | undefined>(image) ??
    makeSignal(undefined as string | undefined)
  const card = Value.map<string | undefined, string>(
    imageSignal,
    (image): string => {
      return image == null ? 'summary' : 'summary_large_image'
    }
  )

  return UseLocation(location =>
    Fragment(
      Portal(
        'meta[property="og:url"]',
        attr.content(location.map(urlFromLocation))
      ),
      Portal('meta[property="og:title"]', attr.content(title)),
      Portal('meta[property="og:description"]', attr.content(description)),
      Portal('meta[property="og:image"]', attr.content(image)),
      Portal('meta[property="twitter:card"]', attr.content(card)),
      Portal('meta[property="twitter:title"]', attr.content(title)),
      Portal('meta[property="twitter:description"]', attr.content(description)),
      Portal('meta[property="twitter:image"]', attr.content(image)),
      Portal(
        'meta[name="keywords"]',
        attr.content(Value.map(keywords, k => k?.join(', ')))
      ),
      Portal('meta[name="description"]', attr.content(description))
    )
  )
}
