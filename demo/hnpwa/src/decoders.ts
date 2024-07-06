/*
Copyright 2019 Google LLC
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    https://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import { Item, ItemUrl, User } from './types'
import { sanitize } from 'dompurify'
import { Marked } from '@ts-stack/markdown'

import {
  ValueDecoder,
  decodeValue,
  objectValue,
  integerValue,
  stringValue,
  arrayValue,
  nullValue
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
  return sanitize(Marked.parse(s))
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
    type: stringValue
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
    karma: integerValue
  },
  ['about']
)

export const decodeUser = decodeValue<User>(userDecoder)
