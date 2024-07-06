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

import { HttpError } from './http_error'
import { Route, Feed } from './route'

export interface State {
  readonly route: Route
  readonly page: Page
}

export const createState = (route: Route, page: Page): State => ({
  route,
  page
})

export interface PageFeed {
  readonly type: 'PageFeed'
  readonly feed: Feed
  readonly page: number
  readonly items: Item[]
}

export interface Article {
  readonly type: 'Article'
  readonly item: Item
}

export interface Profile {
  readonly type: 'Profile'
  readonly user: User
}

export interface Loading {
  readonly type: 'Loading'
}

export interface Error {
  readonly type: 'Error'
  readonly error: HttpError
}

export interface NotFound {
  readonly type: 'NotFound'
}

export type Page = PageFeed | Article | Profile | Loading | Error | NotFound

export const Page = {
  feed: (feed: Feed, page: number, items: Item[]): Page => ({
    type: 'PageFeed',
    feed,
    page,
    items
  }),
  article: (item: Item): Page => ({ type: 'Article', item }),
  profile: (user: User): Page => ({ type: 'Profile', user }),
  loading: { type: 'Loading' } as Page,
  error: (error: HttpError): Page => ({ type: 'Error', error }),
  notFound: { type: 'NotFound' } as Page
}

export interface Item {
  readonly id: number
  readonly title?: string
  readonly points?: number
  readonly user?: string
  readonly time_ago: string
  readonly url: ItemUrl
  readonly domain?: string
  readonly comments_count: number
  readonly comments?: Item[]
  readonly content?: string
  readonly type: string
}

export interface User {
  readonly about?: string
  readonly created: string
  readonly id: string
  readonly karma: number
}

export interface External {
  readonly type: 'External'
  readonly path: string
}

export interface Internal {
  readonly type: 'Internal'
}

export type ItemUrl = External | Internal

export const ItemUrl = {
  external: (path: string): ItemUrl => ({ type: 'External', path }),
  internal: { type: 'Internal' } as ItemUrl
}
