import { Toc, DemoRef, ProjectRef } from './toc'
import { AsyncResult, notAsked } from 'tempo-std/lib/async_result'
import { HttpError } from './request'
import { Route } from './route'

export type Content =
  | { kind: 'HtmlPage', title: string | undefined, html: string, path: string | undefined }
  | { kind: 'Demos', demos: DemoRef[] }
  | { kind: 'Project', project: ProjectRef }

export const Content = {
  htmlPage(title: string | undefined, html: string, path: string | undefined): Content {
    return { kind: 'HtmlPage', title, html, path }
  },
  demos(demos: DemoRef[]): Content {
    return { kind: 'Demos', demos }
  },
  project(project: ProjectRef): Content {
    return { kind: 'Project', project }
  }
}

export interface State {
  toc: AsyncResult<Toc, HttpError, unknown>
  content: AsyncResult<Content, HttpError, unknown>
  route: Route
}

export const makeState = (route: Route): State => ({
  toc: notAsked,
  content: notAsked,
  route
})
