import {
  ARTICLE,
  Fragment,
  MatchAsyncResult,
  MatchKind,
  MapField
} from 'tempo-dom/lib/html'
import { htmlContent } from './html_content'
import { Content } from '../state'
import { Action } from '../action'
import { AsyncResult } from 'tempo-std/lib/async_result'
import { HttpError } from '../request'
import { demosContent } from './demos_content'
import { projectContent } from './project_content'
import { loader } from './loader'

export const contentTemplate = Fragment<
  AsyncResult<Content, HttpError, unknown>,
  Action,
  unknown
>($ =>
  $.Append(
    MatchAsyncResult({
      Failure: ARTICLE($ =>
        $.class('content message is-danger').DIV($ =>
          $.class('message-body').text(s => s.message)
        )
      ),
      Loading: loader,
      NotAsked: loader,
      Success: MatchKind<Content, Action, unknown>({
        HtmlPage: htmlContent,
        Demos: MapField('demos', $ => $.Append(demosContent)),
        Project: MapField('project', $ => $.Append(projectContent))
      })
    })
  )
)
