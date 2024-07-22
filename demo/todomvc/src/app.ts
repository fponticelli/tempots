import {
  attr,
  makeComputed,
  ForEach,
  Fragment,
  html,
  input,
  localStorageProp,
  on,
  OnChecked,
  makeProp,
  Prop,
  Signal,
  When,
  EmitValue,
} from '@tempots/dom'
import { AutoFocus, AutoSelect } from '@tempots/ui'
import { Action, AllFilters, Filter, State, Todo } from './types'
import { changeF, countCompleted, filterF, selectedF, update } from './update'

const FilterLink = ({
  state,
  dispatch,
  filter,
  filterName,
}: {
  state: Prop<State>
  filter: Filter
  dispatch: (action: Action) => void
  filterName: string
}) =>
  html.li(
    html.a(
      attr.href(`#/${filterName.toLowerCase()}`),
      attr.class(state.map(state => selectedF(filter)(state))),
      on.click(changeF(filter, state, dispatch)),
      filterName
    )
  )

const STORE_KEY = 'todomvc-tempo'

export const App = () => {
  const state = localStorageProp<State>({
    defaultValue: { filter: Filter.All, todos: [] },
    key: STORE_KEY,
  })
  const todos = state.at('todos')
  const adding = makeProp('' as string)
  const editing = makeProp(null as null | Todo)
  const dispatch = state.reducer(update)
  return Fragment(
    html.section(
      attr.class('todoapp'),
      html.div(
        html.header(
          attr.class('header'),
          html.h1('todos'),
          input.text(
            AutoFocus(),
            attr.class('new-todo'),
            attr.placeholder('What needs to be done?'),
            attr.value(adding),
            on.keydown(e => {
              if (e.key === 'Enter') {
                EmitValue(adding.set)(e)
                dispatch({ type: 'AddTodo', title: adding.value })
                adding.set('')
              } else if (e.key === 'Escape') {
                adding.set('')
              } else {
                adding.set((e.target as HTMLInputElement).value)
              }
            })
          )
        ),
        html.section(
          attr.class('main'),
          attr.style(
            todos.map((l): string =>
              l.length === 0 ? "visibility: 'hidden'" : ''
            )
          ),
          input.checkbox(
            attr.id('toggle-all'),
            attr.class('toggle-all'),
            attr.checked(todos.map(l => countCompleted(l) === l.length)),
            on.click(() => dispatch({ type: 'ToggleAllTodo' })),
            html.label(attr.for('toggle-all'), 'Mark all as complete')
          ),
          html.ul(
            attr.class('todo-list'),
            ForEach(
              state.map(({ todos, filter }) => todos.filter(filterF(filter))),
              (item: Signal<Todo>) => {
                const isEditing = makeComputed(
                  (): boolean =>
                    editing.value != null && editing.value.id === item.value.id,
                  [editing as Signal<unknown>, item]
                )
                return html.li(
                  attr.class(
                    item
                      .at('completed')
                      .map((v): string | undefined =>
                        v ? 'completed' : undefined
                      )
                  ),
                  attr.class(
                    isEditing.map((v): string => (v ? 'editing' : ''))
                  ),
                  html.div(
                    attr.class('view'),
                    input.checkbox(
                      attr.class('toggle'),
                      attr.checked(item.at('completed')),
                      OnChecked(() => {
                        dispatch({
                          type: 'ToggleCompleted',
                          id: item.value.id,
                        })
                      })
                    ),
                    html.label(
                      on.dblclick(() => editing.set({ ...item.value })),
                      item.at('title')
                    ),
                    html.button(
                      attr.class('destroy'),
                      on.click(() =>
                        dispatch({ type: 'RemoveTodo', id: item.value.id })
                      )
                    )
                  ),
                  When(
                    isEditing,
                    html.input(
                      AutoSelect(),
                      attr.class('edit'),
                      attr.value(editing.map(v => v?.title || '')),
                      on.keydown(e => {
                        if (e.key === 'Enter') {
                          EmitValue(v =>
                            editing.set({ ...editing.value!, title: v })
                          )(e)
                          const todo = editing.value
                          if (todo?.title != null) {
                            dispatch({ type: 'UpdateTodo', todo })
                          } else if (todo?.id != null) {
                            dispatch({ type: 'RemoveTodo', id: todo.id })
                          }
                          editing.set(null)
                        } else if (e.key === 'Escape') {
                          editing.set(null)
                        } else {
                          EmitValue(v =>
                            editing.set({ ...editing.value!, title: v })
                          )(e)
                        }
                      }),
                      on.blur(
                        EmitValue(title => {
                          const todo = { ...editing.value!, title }
                          if (todo.title) {
                            dispatch({ type: 'UpdateTodo', todo })
                          } else {
                            dispatch({ type: 'RemoveTodo', id: todo.id })
                          }
                          editing.set(null)
                        })
                      )
                    )
                  )
                )
              }
            )
          ),
          html.footer(
            attr.class('footer'),
            attr.style(
              todos.map((l): string =>
                l.length === 0 ? "display: 'none'" : ''
              )
            ),
            html.span(
              attr.class('todo-count'),
              state.at('todos').map(todos => {
                const left = todos.length - countCompleted(todos)
                if (left === 1) {
                  return '1 item left'
                } else {
                  return `${left} items left`
                }
              })
            ),
            html.ul(
              attr.class('filters'),
              AllFilters.map(filter =>
                html.li(
                  FilterLink({
                    state,
                    dispatch,
                    filter,
                    filterName: filter.toString(),
                  })
                )
              )
            ),
            When(
              state.map(({ todos }) => countCompleted(todos) > 0),
              html.button(
                attr.class('clear-completed'),
                on.click(() => dispatch({ type: 'ClearCompleted' })),
                'Clear completed'
              )
            )
          )
        )
      )
    ),
    html.footer(
      attr.class('info'),
      html.p('Double-click to edit a todo'),
      html.p(
        'Created by ',
        html.a(attr.href('http://github.com/fponticelli'), 'Franco Ponticelli')
      ),
      html.p('Part of ', html.a(attr.href('http://todomvc.com'), 'TodoMVC'))
    )
  )
}
