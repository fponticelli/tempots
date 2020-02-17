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

import { DifferentiateAt } from 'tempo-std/lib/types/differentiate'
import { DOMTemplate, DOMChild } from './template'
import { DOMContext } from './context'
import { domChildToTemplate, removeNode } from './utils/dom'
import { IndexType } from 'tempo-std/lib/types/index_type'
import { ObjectWithPath, TypeAtPath, ObjectWithField } from 'tempo-std/lib/types/objects'
import { Option } from 'tempo-std/lib/option'
import { mapState, mapField } from './map'
import { Maybe, Just } from 'tempo-std/lib/maybe'
import { Result } from 'tempo-std/lib/result'
import { Async, Outcome } from 'tempo-std/lib/async'
import { AsyncResult } from 'tempo-std/lib/async_result'
import { Attribute, resolveAttribute } from './value'

class MatchTemplate<
  Path extends IndexType[],
  State extends ObjectWithPath<Path, any>,
  Action,
  Query
> implements DOMTemplate<State, Action, Query> {
  constructor(
    readonly path: Path,
    readonly matcher: {
      [k in TypeAtPath<Path, State>]: DOMTemplate<DifferentiateAt<Path, State, k>, Action, Query>
    },
    readonly refId: string
  ) {}
  render(ctx: DOMContext<Action>, state: State) {
    const { ctx: newCtx, ref } = ctx.withAppendToReference(this.refId)
    let key = this.path.reduce((acc: any, key) => acc[key], state) as TypeAtPath<Path, State>
    let view = this.matcher[key].render(newCtx, state as any)
    const { matcher, path } = this
    return {
      change: (state: State) => {
        const newKey = path.reduce((acc: any, key) => acc[key], state) as TypeAtPath<Path, State>
        if (newKey === key) {
          view.change(state as any)
        } else {
          view.destroy()
          key = newKey
          view = matcher[newKey].render(newCtx, state as any)
        }
      },
      destroy: () => {
        removeNode(ref)
        view.destroy()
      },
      request: (query: Query) => {
        view.request(query)
      }
    }
  }
}

export function match<
  Path extends IndexType[],
  State extends ObjectWithPath<Path, any>,
  Action,
  Query = unknown
>(props: {
  path: Path,
  matchers: {
    [k in TypeAtPath<Path, State>]: DOMChild<DifferentiateAt<Path, State, k>, Action, Query>
  },
  refId?: string
}): DOMTemplate<State, Action, Query> {
  return new MatchTemplate<Path, State, Action, Query>(
    props.path,
    Object.keys(props.matchers).reduce((acc, key) => {
      return {
        ...acc,
        [key]: domChildToTemplate(props.matchers[key as keyof typeof props.matchers])
      }
    }, {} as {
      [k in TypeAtPath<Path, State>]: DOMTemplate<DifferentiateAt<Path, State, k>, Action, Query>
    }),
    props.refId || 't:match'
  )
}

export function matchKind<State extends ObjectWithField<'kind', any>, Action, Query = unknown>(props: {
  matchers: {
    [k in State['kind']]: DOMChild<DifferentiateAt<['kind'], State, k>, Action, Query>
  },
  refId?: string
}
): DOMTemplate<State, Action, Query> {
  const refId = props.refId ?? 't-match-kind'
  return match<['kind'], State, Action, Query>({ path: ['kind'], matchers: props.matchers, refId })
}

class MatchBoolTemplate<
  State,
  Action,
  Query
> implements DOMTemplate<State, Action, Query> {
  constructor(
    readonly condition: Attribute<State, boolean>,
    readonly trueTemplate: DOMTemplate<State, Action, Query>,
    readonly falseTemplate: DOMTemplate<State, Action, Query>,
    readonly refId: string
  ) {}
  render(ctx: DOMContext<Action>, state: State) {
    const { ctx: newCtx, ref } = ctx.withAppendToReference(this.refId)
    const { trueTemplate, falseTemplate } = this
    const condition = resolveAttribute(this.condition)
    let lastEvaluation = condition(state)
    let view = lastEvaluation ? trueTemplate.render(newCtx, state) : falseTemplate.render(newCtx, state)
    return {
      change: (state: State) => {
        const newEvaluation = condition(state)
        if (newEvaluation === lastEvaluation) {
          view.change(state)
        } else {
          view.destroy()
          lastEvaluation = newEvaluation
          view = newEvaluation ?
            trueTemplate.render(newCtx, state) :
            falseTemplate.render(newCtx, state)
        }
      },
      destroy: () => {
        removeNode(ref)
        view.destroy()
      },
      request: (query: Query) => {
        view.request(query)
      }
    }
  }
}

export function matchBool<State, Action, Query = unknown>(
  props: {
    condition: Attribute<State, boolean>,
    true: DOMChild<State, Action, Query>,
    false: DOMChild<State, Action, Query>,
    refId?: string
  }
): DOMTemplate<State, Action, Query> {
  return new MatchBoolTemplate<State, Action, Query>(
    props.condition,
    domChildToTemplate(props.true),
    domChildToTemplate(props.false),
    props.refId || 't:match-bool'
  )
}

class MatchValueTemplate<
  State,
  Action,
  Query
> implements DOMTemplate<State, Action, Query> {
  constructor(
    readonly path: IndexType[],
    readonly matchers: {
      [_ in (string | number)]: DOMTemplate<State, Action, Query>
    },
    readonly orElse: DOMTemplate<State, Action, Query>,
    readonly refId: string
  ) {}
  render(ctx: DOMContext<Action>, state: State) {
    const { matchers, orElse } = this
    const { ctx: newCtx, ref } = ctx.withAppendToReference(this.refId)
    let oldKey = this.path.reduce((acc: any, key) => acc[key], state)
    const template = this.matchers[oldKey] || this.orElse
    let view = template.render(newCtx, state)
    return {
      change: (state: State) => {
        const newKey = this.path.reduce((acc: any, key) => acc[key], state)
        if (newKey === oldKey) {
          view.change(state)
        } else {
          view.destroy()
          oldKey = newKey
          const template = matchers[newKey] || orElse
          view = template.render(newCtx, state)
        }
      },
      destroy: () => {
        removeNode(ref)
        view.destroy()
      },
      request: (query: Query) => {
        view.request(query)
      }
    }
  }
}

export function matchValue<Path extends IndexType[], State extends ObjectWithPath<Path, string>, Action, Query = unknown>(props: {
  path: Path,
  matchers: {
    [_ in (string | number)]: DOMChild<State, Action, Query>
  },
  orElse: DOMChild<State, Action, Query>,
  refId?: string
}): DOMTemplate<State, Action, Query> {
  return new MatchValueTemplate<State, Action, Query>(
    props.path,
    Object.keys(props.matchers).reduce((acc: { [_ in (string | number)]: DOMTemplate<State, Action, Query> }, key: string) => {
      return {
        ...acc,
        [key]: domChildToTemplate(props.matchers[key])
      }
    }, {}),
    domChildToTemplate(props.orElse),
    props.refId || 't:match-value'
  )
}

export function matchOption<State, Action, Query = unknown>(props: {
  Some:  DOMChild<State, Action, Query>,
  None: DOMChild<unknown, Action, Query>
  refId?: string
}): DOMTemplate<Option<State>, Action, Query> {
  const refId = props.refId ?? 't-match-option'
  return matchKind({
    matchers: {
      Some:  mapField({ field: 'value' }, props.Some),
      None:  mapState({ map: () => null }, props.None)
    },
    refId
  })
}

export function matchMaybe<State, Action, Query = unknown>(props: {
  Just: DOMChild<State, Action, Query>,
  Nothing?: DOMChild<unknown, Action, Query>
  refId?: string
}): DOMTemplate<Maybe<State>, Action, Query> {
  const refId = props.refId ?? 't-match-maybe'
  return new MatchBoolTemplate<Maybe<State>, Action, Query>(
    v => typeof v !== 'undefined',
    mapState(
      { map: (opt: Maybe<State>) => (opt as Just<State>) },
      domChildToTemplate(props.Just)
    ),
    domChildToTemplate(props.Nothing),
    refId
  )
}

export function matchResult<State, Error, Action, Query = unknown>(props: {
  Success:  DOMChild<State, Action, Query>,
  Failure: DOMChild<Error, Action, Query>,
  refId?: string
}): DOMTemplate<Result<State, Error>, Action, Query> {
  const refId = props.refId ?? 't-match-result'
  return matchKind({
    matchers: {
      Success:  mapField({ field: 'value' }, props.Success),
      Failure:  mapField({ field: 'error' }, props.Failure)
    },
    refId
  })
}

export function matchAsync<State, Progress, Action, Query = unknown>(props: {
  Outcome:  DOMChild<State, Action, Query>,
  NotAsked: DOMChild<unknown, Action, Query>,
  Loading:  DOMChild<Progress, Action, Query>
  refId?: string
}
): DOMTemplate<Async<State, Progress>, Action, Query> {
  const refId = props.refId ?? 't-match-async'
  return matchKind({
    matchers: {
      Outcome:  mapField({ field: 'value' }, props.Outcome),
      Loading:  mapField({ field: 'progress' }, props.Loading),
      NotAsked: mapState({ map: () => null }, props.NotAsked)
    },
    refId
  })
}

export function matchAsyncResult<State, Error, Progress, Action, Query = unknown>(props: {
  Success:  DOMChild<State, Action, Query>,
  Failure:  DOMChild<Error, Action, Query>,
  NotAsked: DOMChild<unknown, Action, Query>,
  Loading:  DOMChild<Progress, Action, Query>,
  refId?: string
}): DOMTemplate<AsyncResult<State, Error, Progress>, Action, Query> {
  const refId = props.refId ?? 't-match-async-result'
  return matchKind<AsyncResult<State, Error, Progress>, Action, Query>({
    matchers: {
      Outcome:  mapState(
        { map: (o: Outcome<Result<State, Error>>) => o.value },
        matchResult<State, Error, Action, Query>({
          Success: props.Success,
          Failure: props.Failure,
          refId: `${refId}-sub`
        })
      ),
      Loading:  mapField({ field: 'progress' }, props.Loading),
      NotAsked: mapState({ map: () => null }, props.NotAsked)
    },
    refId
  })
}
