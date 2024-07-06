import { Choice2 } from "./choice"

export type Maybe<V> = V | undefined

function isSome<V>(m: Maybe<V>): m is V {
  return m !== undefined
}
function isNone<V>(m: Maybe<V>): m is undefined {
  return m === undefined
}

export const Maybe = {
  none: undefined,
  isNone,
  isSome,
  map: <A, B>(m: Maybe<A>, f: (a: A) => B): Maybe<B> => {
    if (isSome(m)) {
      return f(m)
    } else {
      return m
    }
  }
}

export type Literal<V> = { type: 'Literal'; value: V }
export type Derived<S, V> = { type: 'Derived'; f: (state: S) => V }

export type Value<S, V> = Literal<V> | Derived<S, V>
function literal<V>(value: V): Literal<V> {
  return { type: 'Literal', value }
}
function derived<S, V>(f: (s: S) => V): Derived<S, V> {
  return { type: 'Derived', f }
}
function isLiteral<S, V>(v: Value<S, V>): v is Literal<V> {
  return v.type === 'Literal'
}
function isDerived<S, V>(v: Value<S, V>): v is Derived<S, V> {
  return v.type === 'Derived'
}
function resolve<S, V>(v: Value<S, V>, s: S): V {
  if (isLiteral(v)) {
    return v.value
  } else {
    return v.f(s)
  }
}
export const Value = {
  isLiteral,
  isDerived,
  resolve,
  literal,
  derived
}

export type Dispatch<A> = (action: A) => void

export type View<S, Q> = {
  change?: (state: S) => void
  destroy?: () => void
  request?: (query: Q) => void
}

function filterMap<A, B>(arr: A[], f: (v: A) => Maybe<B>): B[] {
  return arr.reduce((acc: B[], curr) => {
    let b = f(curr)
    if (Maybe.isSome(b)) {
      acc.push(b)
    }
    return acc
  }, [])
}

export const View = {
  merge: <S, Q>(views: View<S, Q>[]): View<S, Q> => {
    const changes = filterMap(views, view => view.change)
    const requests = filterMap(views, view => view.request)
    const destroys = filterMap(views, view => view.destroy)
    return {
      change:
        changes.length > 0
          ? state => changes.forEach(change => change(state))
          : Maybe.none,
      request:
        requests.length > 0
          ? query => requests.forEach(request => request(query))
          : Maybe.none,
      destroy:
        destroys.length > 0
          ? () => destroys.forEach(destroy => destroy())
          : Maybe.none
    }
  }
}
export type ComponentView<S, A, Q> = View<S, Q> & { dispatch: Dispatch<A> }

export type Update<S, A> = (state: S, action: A) => S

export type MiddlewarePayload<S, A, Q> = {
  current: S
  previous: S
  action: A
  dispatch: (action: A) => void
  request: (query: Q) => void
}

export type Middleware<S, A, Q> = (payload: MiddlewarePayload<S, A, Q>) => void

export type Render<S, A, Q> = (
  state: S,
  element: Element,
  reference: Maybe<Node>,
  dispatch: Dispatch<A>
) => View<S, Q>

export type MakeTransform<S1, A1, Q1> = <R>(
  cont: <S2, A2, Q2>(t: {
    template: Template<S2, A2, Q2>
    transform: (render: Render<S2, A2, Q2>) => Render<S1, A1, Q1>
    isRoot: Maybe<boolean>
  }) => R
) => R

export type TTransform<S, A, Q> = {
  type: 'Transform'
  make: MakeTransform<S, A, Q>
  isRoot: Maybe<boolean>
}

export function makeTransform<S1, A1, Q1, S2, A2, Q2>(
  template: Template<S2, A2, Q2>,
  transform: (render: Render<S2, A2, Q2>) => Render<S1, A1, Q1>,
  isRoot?: boolean
): TTransform<S1, A1, Q1> {
  const make: MakeTransform<S1, A1, Q1> = f =>
    f({ template, transform, isRoot })
  return { type: 'Transform', make, isRoot }
}

export type OneOf2Payload<S, S1, S2, A, Q> = {
  choose: (state: S) => Choice2<S1, S2>
  template1: Template<S1, A, Q>
  template2: Template<S2, A, Q>
}

export type MakeOneOf2<S, A, Q> = <R>(
  cont: <S1, S2>(t: OneOf2Payload<S, S1, S2, A, Q>) => R
) => R

export type TOneOf2<S, A, Q> = {
  type: 'OneOf2'
  make: MakeOneOf2<S, A, Q>
}

export function oneOf2<S, S1, S2, A, Q>(
  choose: (state: S) => Choice2<S1, S2>,
  template1: Template<S1, A, Q>,
  template2: Template<S2, A, Q>
): TOneOf2<S, A, Q> {
  const make: MakeOneOf2<S, A, Q> = f => f({ choose, template1, template2 })
  return { type: 'OneOf2', make }
}

export type HandlerPayload<S, A, El extends Element, E extends Event> = {
  dispatch: Dispatch<A>
  element: El
  event: E
  state: S
}

export type HandlerActionPayload<S, El extends Element, E extends Event> = {
  element: El
  event: E
  state: S
}

export type TElement<S, A, Q> = {
  type: 'Element'
  name: string
  ns: Maybe<string>
  children: Template<S, A, Q>[]
}
export type TFragment<S, A, Q> = {
  type: 'Fragment'
  list: Template<S, A, Q>[]
}
export type TText<S> = { type: 'Text'; value: Value<S, string> }
export type TAttribute<S> = {
  type: 'Attribute'
  name: string
  value: Value<S, Maybe<string>>
}

export type MakeProperty<S> = <R>(cont: <V>(t: Value<S, Maybe<V>>) => R) => R

export type TProperty<S> = {
  type: 'Property'
  name: string
  make: MakeProperty<S>
}
export type TStyle<S> = {
  type: 'Style'
  name: string
  value: Value<S, Maybe<string>>
}

export type MakeHandler<S, A> = <R>(
  cont: <El extends Element, E extends Event>(
    t: (payload: HandlerPayload<S, A, El, E>) => void
  ) => R
) => R

export type THandler<S, A> = {
  type: 'Handler'
  name: string
  make: MakeHandler<S, A>
}

export type MakeRespond<Q> = <R>(
  cont: <El>(t: (el: El, query: Q) => void) => R
) => R

export type TRespond<Q> = {
  type: 'Respond'
  make: MakeRespond<Q>
}

export type Template<S, A, Q> =
  | TElement<S, A, Q>
  | TFragment<S, A, Q>
  | TText<S>
  | TAttribute<S>
  | TProperty<S>
  | TStyle<S>
  | THandler<S, A>
  | TTransform<S, A, Q>
  | TOneOf2<S, A, Q>
  | TRespond<Q>

export type LiteralOrDerived<S, V> = ((state: S) => V) | V
export function valueFromLiteralOrDerived<S, V>(v: LiteralOrDerived<S, V>) {
  if (typeof v === 'function') {
    return derived(v as (state: S) => V)
  } else {
    return literal(v)
  }
}

export function el<S, A, Q>(
  name: string,
  ...children: Template<S, A, Q>[]
): TElement<S, A, Q> {
  return { type: 'Element', name, ns: Maybe.none, children }
}

export function elNS<S, A, Q>(
  name: string,
  ns: string,
  ...children: Template<S, A, Q>[]
) {
  return { type: 'Element', name, ns, children }
}

export function svgEl<S, A, Q>(
  name: string,
  ...children: Template<S, A, Q>[]
) {
  return elNS(name, "http://www.w3.org/2000/svg", ...children)
}

export function fragment<S, A, Q>(
  ...list: Template<S, A, Q>[]
): TFragment<S, A, Q> {
  return { type: 'Fragment', list }
}

export function text<S>(value: LiteralOrDerived<S, string>): TText<S> {
  return { type: 'Text', value: valueFromLiteralOrDerived(value) }
}

export function attr<S>(
  name: string,
  value: LiteralOrDerived<S, Maybe<string>>
): TAttribute<S> {
  return { type: 'Attribute', name, value: valueFromLiteralOrDerived(value) }
}

export function prop<S, V>(
  name: string,
  value: LiteralOrDerived<S, Maybe<V>>
): TProperty<S> {
  const value2 = valueFromLiteralOrDerived(value)
  return {
    type: 'Property',
    name,
    make: f => f(value2)
  }
}

export function style<S>(
  name: string,
  value: LiteralOrDerived<S, Maybe<string>>
): TStyle<S> {
  return { type: 'Style', name, value: valueFromLiteralOrDerived(value) }
}

export function on<S, A, El extends Element, E extends Event>(
  name: string,
  handler: (payload: HandlerPayload<S, A, El, E>) => void
): THandler<S, A> {
  return { type: 'Handler', name, make: f => f(handler) }
}

export function trigger<S, A, El extends Element, E extends Event>(
  name: string,
  handler: (payload: HandlerActionPayload<S, El, E>) => A
): THandler<S, A> {
  return on<S, A, El, E>(name, ({ element, event, dispatch, state }) =>
    dispatch(handler({ element, state, event }))
  )
}

export function respond<Q, El>(
  respond: (el: El, query: Q) => void
): TRespond<Q> {
  return { type: 'Respond', make: f => f(respond) }
}

export function setAttribute(
  element: Element,
  name: string,
  value: Maybe<string>
) {
  if (Maybe.isSome(value)) element.setAttribute(name, value)
  else element.removeAttribute(name)
}

export function setProperty<T>(
  element: Element,
  name: string,
  value: Maybe<T>
) {
  if (Maybe.isSome(value)) (element as any)[name] = value
  else delete (element as any)[name]
}

export function removeNode(node: Node) {
  node.parentElement?.removeChild(node)
}

export function ignore<T>(_: T) { }

export function makeAttributeRender<S, A, Q>(
  { name, value }: TAttribute<S>,
  isRoot: boolean
): Render<S, A, Q> {
  const makeDestroy = (element: Element) => {
    if (isRoot) {
      return () => {
        element.removeAttribute(name)
      }
    } else {
      return undefined
    }
  }
  switch (value.type) {
    case 'Derived':
      return (
        state: S,
        element: Element,
        reference: Maybe<Node>,
        dispatch: Dispatch<A>
      ) => {
        const f = value.f
        const change = (state: S) => {
          const attrValue = f(state)
          setAttribute(element, name, attrValue)
        }
        change(state)

        return { change, destroy: makeDestroy(element) }
      }
    case 'Literal':
      return (
        _: S,
        element: Element,
        reference: Maybe<Node>,
        dispatch: Dispatch<A>
      ) => {
        setAttribute(element, name, value.value)

        return { destroy: makeDestroy(element) }
      }
  }
}

export function makePropertyRender<S, A, Q>(
  { name, make }: TProperty<S>,
  isRoot: boolean
): Render<S, A, Q> {
  const value = make(v => v)
  const makeDestroy = (element: Element) => {
    if (isRoot) {
      return () => {
        delete (element as any)[name]
      }
    } else {
      return undefined
    }
  }
  switch (value.type) {
    case 'Derived':
      return (
        state: S,
        element: Element,
        reference: Maybe<Node>,
        dispatch: Dispatch<A>
      ) => {
        const f = value.f
        const change = (state: S) => {
          const attrValue = f(state)
          setProperty(element, name, attrValue)
        }
        change(state)

        return { change, destroy: makeDestroy(element) }
      }
    case 'Literal':
      return (
        _: S,
        element: Element,
        reference: Maybe<Node>,
        dispatch: Dispatch<A>
      ) => {
        setProperty(element, name, value.value)

        return { destroy: makeDestroy(element) }
      }
  }
}

export function setStyle(element: Element, name: string, value: Maybe<string>) {
  if (isNone(value)) {
    delete ((element as HTMLElement).style as any)[name]
  } else {
    ; ((element as HTMLElement).style as any)[name] = value
  }
}

export function makeStyleRender<S, A, Q>(
  { name, value }: TStyle<S>,
  isRoot: boolean
): Render<S, A, Q> {
  const makeDestroy = (element: Element) => {
    if (isRoot) {
      return () => {
        delete ((element as HTMLElement).style as any)[name]
      }
    } else {
      return undefined
    }
  }
  switch (value.type) {
    case 'Derived':
      return (
        state: S,
        element: Element,
        reference: Maybe<Node>,
        dispatch: Dispatch<A>
      ) => {
        const f = value.f
        const change = (state: S) => {
          const attrValue = f(state)
          setStyle(element, name, attrValue)
        }
        change(state)

        return { change, destroy: makeDestroy(element) }
      }
    case 'Literal':
      return (
        _: S,
        element: Element,
        reference: Maybe<Node>,
        dispatch: Dispatch<A>
      ) => {
        setStyle(element, name, value.value)

        return { destroy: makeDestroy(element) }
      }
  }
}

export function makeElementRender<S, A, Q>(
  { name, ns, children }: TElement<S, A, Q>,
  isRoot: boolean
): Render<S, A, Q> {
  return (
    state: S,
    container: Element,
    reference: Maybe<Node>,
    dispatch: Dispatch<A>
  ) => {
    const element = ns
      ? container.ownerDocument.createElementNS(ns, name)
      : container.ownerDocument.createElement(name)
    const views = children.map(child =>
      makeRender(child, true)(state, element, undefined, dispatch)
    )
    container.insertBefore(element, reference ?? null)
    const childView = View.merge(views)
    const destroy = isRoot ? () => removeNode(element) : undefined
    return View.merge([{ destroy }, childView])
  }
}

export function makeTextRender<S, A, Q>(
  { value }: TText<S>,
  isRoot: boolean
): Render<S, A, Q> {
  function makeDestroy(textNode: Text) {
    if (isRoot) {
      return () => removeNode(textNode)
    } else {
      return undefined
    }
  }
  switch (value.type) {
    case 'Derived':
      return (
        state: S,
        container: Element,
        reference: Maybe<Node>,
        dispatch: Dispatch<A>
      ) => {
        const f = value.f
        const textNode = container.ownerDocument.createTextNode(f(state))
        container.insertBefore(textNode, reference ?? null)
        const change = (state: S) => (textNode.nodeValue = f(state))
        return { change, destroy: makeDestroy(textNode) }
      }
    case 'Literal':
      return (
        state: S,
        container: Element,
        reference: Maybe<Node>,
        dispatch: Dispatch<A>
      ) => {
        const textNode = container.ownerDocument.createTextNode(value.value)
        container.insertBefore(textNode, reference ?? null)
        return { destroy: makeDestroy(textNode) }
      }
  }
}

export function makeHandlerRender<S, A, Q>(
  { name, make }: THandler<S, A>,
  isRoot: boolean
): Render<S, A, Q> {
  return (
    state: S,
    container: Element,
    reference: Maybe<Node>,
    dispatch: Dispatch<A>
  ) =>
    make(handler => {
      let localState: Maybe<S> = state
      let change = (state: S) => (localState = state)
      const listener = (event: Event) => {
        if (Maybe.isSome(localState)) {
          handler({
            dispatch,
            element: container as any,
            event: event as any,
            state: localState
          })
        }
      }
      let destroy = isRoot
        ? () => {
          container.removeEventListener(name, listener)
        }
        : undefined
      container.addEventListener(name, listener)
      return { change, destroy }
    })
}

export function makeFragmentRender<S, A, Q>(
  { list }: TFragment<S, A, Q>,
  isRoot: boolean
): Render<S, A, Q> {
  return (
    state: S,
    container: Element,
    reference: Maybe<Node>,
    dispatch: Dispatch<A>
  ) => {
    const views = list.map(child =>
      makeRender(child, isRoot)(state, container, reference, dispatch)
    )
    return View.merge(views)
  }
}

export function makeOneOf2Render<S, A, Q>(
  { make }: TOneOf2<S, A, Q>,
  isRoot: boolean
) {
  return (
    state: S,
    container: Element,
    reference: Maybe<Node>,
    dispatch: Dispatch<A>
  ) => {
    const ref = container.ownerDocument.createTextNode('')
    container.insertBefore(ref, reference ?? null)
    return make(
      <S1, S2>({
        choose,
        template1,
        template2
      }: OneOf2Payload<S, S1, S2, A, Q>) => {
        function renderChoice(choice: Choice2<S1, S2>) {
          switch (choice.type) {
            case 'Choice1Of2':
              return Choice2.one(
                makeRender(template1, true)(
                  choice.value,
                  container,
                  reference,
                  dispatch
                )
              )
            case 'Choice2Of2':
              return Choice2.two(
                makeRender(template2, true)(
                  choice.value,
                  container,
                  reference,
                  dispatch
                )
              )
          }
        }
        let assignament = renderChoice(choose(state))
        const change = (state: S) => {
          const choice = choose(state)
          switch (choice.type) {
            case 'Choice1Of2':
              switch (assignament.type) {
                case 'Choice1Of2':
                  assignament.value.change?.(choice.value)
                  return
                case 'Choice2Of2':
                  assignament.value.destroy?.()
                  assignament = Choice2.one(
                    makeRender(template1, true)(
                      choice.value,
                      container,
                      reference,
                      dispatch
                    )
                  )
                  return
              }
              return
            case 'Choice2Of2':
              switch (assignament.type) {
                case 'Choice2Of2':
                  assignament.value.change?.(choice.value)
                  return
                case 'Choice1Of2':
                  assignament.value.destroy?.()
                  assignament = Choice2.two(
                    makeRender(template2, true)(
                      choice.value,
                      container,
                      reference,
                      dispatch
                    )
                  )
                  return
              }
          }
        }
        const request = (query: Q) => {
          assignament.value.request?.(query)
        }
        const destroy = isRoot
          ? () => {
            assignament.value.destroy?.()
          }
          : undefined
        return { change, request, destroy }
      }
    )
  }
}

export function makeTransformRender<S, A, Q>(
  { make }: TTransform<S, A, Q>,
  isRootContainer: boolean
) {
  return make(({ template, transform, isRoot }) => {
    return transform(makeRender(template, isRoot ?? isRootContainer))
  })
}

export function makeRespondRender<S, A, Q>(
  { make }: TRespond<Q>,
  isRoot: boolean
): Render<S, A, Q> {
  return (
    state: S,
    element: Element,
    reference: Maybe<Node>,
    dispatch: Dispatch<A>
  ) => {
    const respond = make<(el: any, q: Q) => void>(r => r)
    const request = (q: Q) => {
      respond(element, q)
    }
    return { request }
  }
}

export function makeRender<S, A, Q>(
  template: Template<S, A, Q>,
  isRoot: boolean
): Render<S, A, Q> {
  switch (template.type) {
    case 'Element':
      return makeElementRender(template, isRoot)
    case 'Attribute':
      return makeAttributeRender(template, isRoot)
    case 'Property':
      return makePropertyRender(template, isRoot)
    case 'Style':
      return makeStyleRender(template, isRoot)
    case 'Handler':
      return makeHandlerRender(template, isRoot)
    case 'Text':
      return makeTextRender(template, isRoot)
    case 'Fragment':
      return makeFragmentRender(template, isRoot)
    case 'OneOf2':
      return makeOneOf2Render(template, isRoot)
    case 'Transform':
      return makeTransformRender(template, isRoot)
    case 'Respond':
      return makeRespondRender(template, isRoot)
  }
}

export function mapState<S1, S2, A, Q>(
  map: (state1: S1) => S2,
  template: Template<S2, A, Q>
): Template<S1, A, Q> {
  return makeTransform(
    template,
    (render: Render<S2, A, Q>): Render<S1, A, Q> => {
      return (
        state: S1,
        element: Element,
        reference: Maybe<Node>,
        dispatch: Dispatch<A>
      ) => {
        const view = render(map(state), element, reference, dispatch)
        const change = view.change && ((state: S1) => view.change!(map(state)))
        return { change, request: view.request, destroy: view.destroy }
      }
    }
  )
}

export function mapAction<S, A1, A2, Q>(
  map: (action2: A2) => Maybe<A1>,
  template: Template<S, A2, Q>
): Template<S, A1, Q> {
  return makeTransform(
    template,
    (render: Render<S, A2, Q>): Render<S, A1, Q> => {
      return (
        state: S,
        element: Element,
        reference: Maybe<Node>,
        dispatch: Dispatch<A1>
      ) => {
        function mappedDispatch(a: A2) {
          const mapped = map(a)
          if (Maybe.isSome(mapped)) dispatch(mapped)
        }
        return render(state, element, reference, mappedDispatch)
      }
    }
  )
}

export function mapQuery<S, A, Q1, Q2>(
  map: (query1: Q1) => Maybe<Q2>,
  template: Template<S, A, Q2>
): Template<S, A, Q1> {
  return makeTransform(
    template,
    (render: Render<S, A, Q2>): Render<S, A, Q1> => {
      return (
        state: S,
        element: Element,
        reference: Maybe<Node>,
        dispatch: Dispatch<A>
      ) => {
        const view = render(state, element, reference, dispatch)
        const request = (query1: Q1) => {
          const mapped = map(query1)
          if (Maybe.isSome(mapped)) view.request?.(mapped)
        }
        return { ...view, request }
      }
    }
  )
}

export function iterator<S1, S2, A, Q>(
  map: (state1: S1) => S2[],
  template: Template<S2, A, Q>
): Template<S1, A, Q> {
  return makeTransform(
    template,
    (render: Render<S2, A, Q>): Render<S1, A, Q> => {
      return (
        state: S1,
        element: Element,
        reference: Maybe<Node>,
        dispatch: Dispatch<A>
      ) => {
        const views = map(state).map(state =>
          render(state, element, reference, dispatch)
        )
        const change = (state: S1) => {
          const states = map(state)
          const min = Math.min(views.length, states.length)
          for (let i = 0; i < min; i++) {
            views[i].change?.(states[i])
          }
          for (let i = min; i < views.length; i++) {
            views[i].destroy?.()
          }
          views.splice(min)
          for (let i = min; i < states.length; i++) {
            views.push(render(states[i], element, reference, dispatch))
          }
        }
        const request = (query: Q) => {
          views.forEach(view => view.request?.(query))
        }
        const destroy = () => {
          views.forEach(view => view.destroy?.())
        }
        return { change, request, destroy }
      }
    }
  )
}

export function portal<S, A, Q>(
  container: string | Element,
  template: Template<S, A, Q>
): Template<S, A, Q> {
  return makeTransform(
    template,
    (render: Render<S, A, Q>): Render<S, A, Q> => {
      return (
        state: S,
        element: Element,
        reference: Maybe<Node>,
        dispatch: Dispatch<A>
      ) => {
        const containerEl =
          typeof container === 'string'
            ? element.ownerDocument.querySelector(container)
            : container
        return render(state, containerEl!, undefined, dispatch)
      }
    },
    true
  )
}

export function innerHTML<S, A, Q>(
  content: LiteralOrDerived<S, string>
): Template<S, A, Q> {
  return prop("innerHTML", content)
}

export function component<S, A, Q>(
  update: Update<S, A>,
  template: Template<S, A, Q>
): Template<S, A, Q> {
  return makeTransform(template, (render: Render<S, A, Q>): Render<S, A, Q> => {
    return (
      state: S,
      element: Element,
      reference: Maybe<Node>,
      dispatch: Dispatch<A>
    ) => {
      let localState = state
      function dispatchUpdate(a: A) {
        localState = update(localState, a)
        view.change?.(localState)
        dispatch(a)
      }
      const view = render(state, element, reference, dispatchUpdate)
      return view
    }
  })
}

export type RenderOptions<S, A, Q> = {
  template: Template<S, A, Q>
  update: Update<S, A>
  state: S
  container?: Element | string
  middleware?: Middleware<S, A, Q>
}

export function render<S, A, Q>({
  template,
  update,
  state,
  container,
  middleware
}: RenderOptions<S, A, Q>) {
  const r = makeRender(template, true)
  const containerEl =
    typeof container === 'string'
      ? document.querySelector(container)
      : (container ?? document.body)
  let localState = state
  const middlewarePayload = {
    current: localState,
    previous: localState,
    action: undefined as any as A, // cheat
    dispatch,
    request
  }
  function dispatch(action: A) {
    const newState = update(localState, action)
    view.change?.(newState)
    middlewarePayload.action = action
    middleware?.(middlewarePayload)
    localState = newState
  }
  function request(query: Q) {
    view.request?.(query)
  }

  const view = r(state, containerEl!, undefined, dispatch)
  return { ...view, dispatch }
}

export type RenderSimpleOptions<S, Q> = {
  template: Template<S, S, Q>
  state: S
  container?: Element | string
  middleware?: Middleware<S, S, Q>
}

export function renderSimple<S, Q>({
  template,
  state,
  container,
  middleware
}: RenderSimpleOptions<S, Q>) {
  const update = (_: S, a: S) => a
  return render({ template, update, state, container, middleware })
}

export function when<S, A, Q>(predicate: (state: S) => boolean, template: Template<S, A, Q>) {
  return oneOf2((s: S) => predicate(s) ? Choice2._1(s) : Choice2._2(null), template, text(""))
}

export function until<S, A, Q>(predicate: (state: S) => boolean, template: Template<S, A, Q>) {
  return oneOf2((s: S) => !predicate(s) ? Choice2._1(s) : Choice2._2(null), template, text(""))
}

export function ifElse<S, A, Q>(predicate: (state: S) => boolean, whenTrue: Template<S, A, Q>, whenFalse: Template<S, A, Q>) {
  return oneOf2((s: S) => !predicate(s) ? Choice2._1(s) : Choice2._2(s), whenTrue, whenFalse)
}

export function makeCaptureState<S1, S2, S3, A, Q>() {
  let localState1: Maybe<S1> = Maybe.none
  let localState2: Maybe<S2> = Maybe.none
  function hold(template: Template<S1, A, Q>) {
    return makeTransform<S1, A, Q, S1, A, Q>(template, (render: Render<S1, A, Q>) => (state: S1, container: Element, reference: Maybe<Node>, dispatch: Dispatch<A>) => {
      const view = render(state, container, reference, dispatch)
      localState1 = state
      function change(s: S1) { localState1 = s }
      return View.merge([view, { change }])
    })
  }
  function release(
    merge: (state1: S1, state2: S2) => S3,
    template: Template<S3, A, Q>
  ) {
    return makeTransform<S2, A, Q, S3, A, Q>(template, (render: Render<S3, A, Q>) => (state: S2, container: Element, reference: Maybe<Node>, dispatch: Dispatch<A>) => {
      localState2 = state
      const merged = merge(localState1!, localState2!)
      const view = render(merged, container, reference, dispatch)
      function change(s: S2) {
        localState2 = s
        const merged = merge(localState1!, localState2!)
        view.change?.(merged)
      }
      return { change, request: view.request, destroy: view.destroy }
    })
  }
  return { hold, release }
}

export function onMount<S, A, Q>(handler: (el: Element, state: S) => void) {
  return makeTransform<S, A, Q, S, A, Q>(fragment(), (render: Render<S, A, Q>) => (state: S, container: Element, reference: Maybe<Node>, dispatch: Dispatch<A>) => {
    const view = render(state, container, reference, dispatch)
    handler(container, state)
    return view
  })
}

export function onUpdate<S, A, Q>(handler: (el: Element, state: S) => void) {
  return makeTransform<S, A, Q, S, A, Q>(fragment(), (render: Render<S, A, Q>) => (state: S, container: Element, reference: Maybe<Node>, dispatch: Dispatch<A>) => {
    const view = render(state, container, reference, dispatch)
    handler(container, state)
    function change(state: S) {
      handler(container, state)
    }
    return View.merge([view, { change }])
  })
}

export function onRemove<S, A, Q>(handler: (el: Element) => void) {
  return makeTransform<S, A, Q, S, A, Q>(fragment(), (render: Render<S, A, Q>) => (state: S, container: Element, reference: Maybe<Node>, dispatch: Dispatch<A>) => {
    const view = render(state, container, reference, dispatch)
    function destroy() {
      handler(container)
    }
    return View.merge([view, { destroy }])
  })
}

export function lifecycle<S, A, Q, P>({ afterRender, beforeChange, afterChange, beforeRemove }: {
  afterRender: (payload: { element: Element, state: S }) => P,
  beforeChange?: (payload: { element: Element, state: S, payload: P }) => [boolean, P],
  afterChange: (payload: { element: Element, state: S, payload: P }) => P,
  beforeRemove: (payload: { element: Element, payload: P }) => void
}) {
  const beforeChangeF = beforeChange ?? (({ payload }) => [true, payload])
  return makeTransform<S, A, Q, S, A, Q>(fragment(), (render: Render<S, A, Q>) => (state: S, container: Element, reference: Maybe<Node>, dispatch: Dispatch<A>) => {
    const view = render(state, container, reference, dispatch)
    let p = afterRender({ element: container, state })
    function change(state: S) {
      const [shouldChange, newP] = beforeChangeF({ element: container, state, payload: p })
      if (shouldChange) {
        p = newP
        view.change?.(state)
        p = afterChange({ element: container, state, payload: p })
      }
    }
    function destroy() {
      beforeRemove({ element: container, payload: p })
    }
    return { change, destroy, request: view.request }
  })
}

export function filterChange<S, A, Q>(
  predicate?: (previousState: S, currentState: S) => boolean
) {
  const predicateF = predicate ?? ((a, b) => a !== b)
  return makeTransform<S, A, Q, S, A, Q>(fragment(), (render: Render<S, A, Q>) => (state: S, container: Element, reference: Maybe<Node>, dispatch: Dispatch<A>) => {
    let localState = state
    const view = render(localState, container, reference, dispatch)
    function change(state: S) {
      if (predicateF(localState, state)) {
        localState = state
        view.change?.(localState)
      }
    }
    return { change, destroy: view.destroy, request: view.request }
  })
}