import { Value, attr, Portal } from '@tempots/dom'

export const HTMLTitle = (title: Value<string>) =>
  Portal('head title', attr.innerText(title))
