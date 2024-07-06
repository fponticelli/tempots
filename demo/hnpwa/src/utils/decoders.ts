import { Item, ItemUrl, User } from '../types'
import DOMPurify from 'dompurify'
import { Marked } from '@ts-stack/markdown'

const purify = DOMPurify(window)
import {
  ValueDecoder,
  decodeValue,
  objectValue,
  integerValue,
  stringValue,
  arrayValue,
  nullValue,
} from 'partsing/value'

import { lazy } from 'partsing/core/decoder'

const itemUrlDecoder = stringValue.map((s: string): ItemUrl => {
  if (s.indexOf('item?id=') >= 0) {
    return ItemUrl.internal
  } else {
    return ItemUrl.external(s)
  }
})

const markdownToHtml = (s: string) => {
  return purify.sanitize(Marked.parse(s))
}

const itemDecoder: ValueDecoder<Item> = objectValue(
  {
    id: integerValue,
    title: stringValue,
    points: nullValue.map(() => 0).or(integerValue),
    user: nullValue.map(() => '').or(stringValue),
    time_ago: stringValue,
    url: itemUrlDecoder,
    domain: stringValue,
    comments_count: integerValue,
    comments: lazy(() => arrayValue(itemDecoder)),
    content: stringValue.map(markdownToHtml),
    type: stringValue,
  },
  ['comments', 'content', 'domain', 'points', 'title', 'user']
)

export const decodeItem = decodeValue<Item>(itemDecoder)
export const decodeFeed = decodeValue<Item[]>(arrayValue(itemDecoder))

const userDecoder = objectValue(
  {
    about: stringValue.map(markdownToHtml),
    created: stringValue,
    id: stringValue,
    karma: integerValue,
  },
  ['about']
)

export const decodeUser = decodeValue<User>(userDecoder)
