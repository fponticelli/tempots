import { Fragment, Portal, Signal, Value, attr, useSignal } from '@tempots/dom'
import { UseLocation, getFullURL } from '@tempots/ui'

export interface OpenGraphProps {
  title: Value<string>
  description?: Value<string | undefined>
  image?: Value<string | undefined>
  keywords?: Value<string[] | undefined>
}

export function OpenGraph(props: OpenGraphProps) {
  const { title, description, image, keywords } = props
  const imageSignal =
    Signal.maybeWrap<string | undefined>(image) ??
    useSignal(undefined as string | undefined)
  const card = Signal.map<string | undefined, string>(
    imageSignal,
    (image): string => {
      return image == null ? 'summary' : 'summary_large_image'
    }
  )

  return UseLocation(location =>
    Fragment(
      Portal('meta[property="og:url"]', attr.content(location.map(getFullURL))),
      Portal('meta[property="og:title"]', attr.content(title)),
      Portal('meta[property="og:description"]', attr.content(description)),
      Portal('meta[property="og:image"]', attr.content(image)),
      Portal('meta[property="twitter:card"]', attr.content(card)),
      Portal('meta[property="twitter:title"]', attr.content(title)),
      Portal('meta[property="twitter:description"]', attr.content(description)),
      Portal('meta[property="twitter:image"]', attr.content(image)),
      Portal(
        'meta[name="keywords"]',
        attr.content(Signal.map(keywords, k => k?.join(', ')))
      ),
      Portal('meta[name="description"]', attr.content(description))
    )
  )
}
