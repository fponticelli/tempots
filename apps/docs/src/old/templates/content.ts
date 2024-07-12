import { htmlContent, HtmlContentProps } from './html_content'
import { Content } from '../state'
import { AsyncResult } from '@tempots/std/async-result'
import { HttpError } from '../request'
import { demosContent } from './demos_content'
import { projectContent } from './project_content'
import { loader } from './loader'
import { attr, html, oneof, Signal } from '@tempots/dom'
import { DemoRef } from '../toc'

export const contentTemplate = (
  data: Signal<AsyncResult<Content, HttpError>>
) =>
  oneof.type(data, {
    Failure: e =>
      html.article(
        attr.class('content message is-danger'),
        html.div(attr.class('message-body'), e.$.error.$.message)
      ),
    Loading: () => loader,
    NotAsked: () => loader,
    Success: d =>
      oneof.kind(d.$.value, {
        HtmlPage: v => htmlContent(v.map(c => c as HtmlContentProps)),
        Demos: s => demosContent(s.map(c => c.demos as DemoRef[])),
        Project: s => projectContent(s.$.project),
      }),
  })