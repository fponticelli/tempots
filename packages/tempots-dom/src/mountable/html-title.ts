import { Value } from '../std/signal'
import { attr } from './attribute'
import { Portal } from './portal'

export const HTMLTitle = (title: Value<string>) =>
  Portal('head title', attr.innerText(title))
