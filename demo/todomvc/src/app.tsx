import { ClassName, For, handleTextInput, If, Prop, When } from '@tempots/dom'
import { useDataStoreFlow } from './data-store'
import { Action, Filter, State, Todo } from './types'
import { changeF, countCompleted, filterF, selectedF, update } from './update'
import { JSX } from '@tempots/dom'

const FilterLink = ({
  state,
  dispatch,
  filter,
  filterName
}: {
  state: Prop<State>
  filter: Filter
  dispatch: (action: Action) => void
  filterName: string
}) => (
  <li>
    <a
      href={`#/${filterName.toLowerCase()}`}
      class={state.map(selectedF(filter))}
      onClick={changeF(filter, state, dispatch)}
    >
      {filterName}
    </a>
  </li>
)

export const App = () => {
  const state = useDataStoreFlow()
  const todos = state.at('todos')
  const adding = Prop.of('' as string)
  const editing = Prop.of(null as null | Todo)
  const dispatch = state.reducer(update)

  return (
    <>
      <section class="todoapp">
        <div>
          <header class="header">
            <h1>todos</h1>
            <input
              type="text"
              autofocus={true}
              class="new-todo"
              placeholder="What needs to be done?"
              value={adding}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  handleTextInput(adding.set)(e)
                  dispatch(Action.addTodo(adding.get()))
                  adding.set('')
                } else if (e.key === 'Escape') {
                  adding.set('')
                } else {
                  handleTextInput(adding.set)(e)
                }
              }}
            />
          </header>
          <section
            class="main"
            style={todos.map((l) => (l.length === 0 ? {visibility: 'hidden' } as JSX.CSSProperties : undefined))}
          >
            <input
              type="checkbox"
              id="toggle-all"
              class="toggle-all"
              checked={todos.map(l => countCompleted(l) === l.length)}
              onClick={() => dispatch(Action.toggleAllTodo())}
            />
            <label htmlFor="toggle-all">Mark all as complete</label>
            <ul class="todo-list">
              <For
                of={todos.combine(state.at('filter'), (list, filter) =>
                  list.filter(filterF(filter))
                )}
              >
                {(item: Prop<Todo>) => {
                  return (
                  <li>
                    <ClassName value={item.at('completed').map(v => v ? 'completed' as string : undefined)} />
                    <ClassName value={item.combine(editing, (it, editing) => editing && editing.id === it.id ? 'editing' as string : undefined)} />
                    <div class="view">
                      <input
                        type="checkbox"
                        class="toggle"
                        checked={item.at('completed')}
                        onChange={() =>
                          dispatch(Action.toggleCompleted(item.get().id))
                        }
                      />
                      <label onDblClick={() => editing.set({ ...item.get() })}>
                        {item.at('title')}
                      </label>
                      <button
                        class="destroy"
                        onClick={() =>
                          dispatch(Action.removeTodo(item.get().id))
                        }
                      ></button>
                    </div>
                    <When
                      is={editing.combine(
                        item,
                        (editing, current) =>
                          (editing && editing.id === current.id) || false
                      )}
                    >
                      <input
                        type="text"
                        class="edit"
                        value={editing.map(v => v?.title || '')}
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            handleTextInput(v =>
                              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                              editing.set({ ...editing.get()!, title: v })
                            )(e)
                            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                            const todo = editing.get()!
                            if (todo.title) {
                              dispatch(Action.updateTodo(todo))
                            } else {
                              dispatch(Action.removeTodo(todo.id))
                            }
                            editing.set(null)
                          } else if (e.key === 'Escape') {
                            editing.set(null)
                          } else {
                            handleTextInput(v =>
                              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                              editing.set({ ...editing.get()!, title: v })
                            )(e)
                          }
                        }}
                        onBlur={handleTextInput(title => {
                          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                          const todo = { ...editing.get()!, title }
                          if (todo.title) {
                            dispatch(Action.updateTodo(todo))
                          } else {
                            dispatch(Action.removeTodo(todo.id))
                          }
                          editing.set(null)
                        })}
                      />
                    </When>
                  </li>
                )}}
              </For>
            </ul>
          </section>
          <footer
            class="footer"
            style={todos.map((l) => (l.length === 0 ? {display: 'none' } as JSX.CSSProperties : undefined))}
          >
            <span class="todo-count">
              {state.map(({ todos }) => {
                const left = todos.length - countCompleted(todos)
                if (left === 1) {
                  return '1 item left'
                } else {
                  return `${left} items left`
                }
              })}
            </span>
            <ul class="filters">
              <li>
                <FilterLink
                  dispatch={dispatch}
                  filter={Filter.All}
                  filterName="All"
                  state={state}
                />
              </li>
              <li>
                <FilterLink
                  dispatch={dispatch}
                  filter={Filter.Active}
                  filterName="Active"
                  state={state}
                />
              </li>
              <li>
                <FilterLink
                  dispatch={dispatch}
                  filter={Filter.Completed}
                  filterName="Completed"
                  state={state}
                />
              </li>
            </ul>
            <When is={state.map(({ todos }) => countCompleted(todos) > 0)}>
              <button
                class="clear-completed"
                onClick={() => dispatch(Action.clearCompleted())}
              >
                Clear completed
              </button>
            </When>
          </footer>
        </div>
      </section>
      <footer class="info">
        <p>Double-click to edit a todo</p>
        <p>
          Created by{' '}
          <a href="http://github.com/fponticelli">Franco Ponticelli</a>
        </p>
        <p>
          Part of <a href="http://todomvc.com">TodoMVC</a>
        </p>
      </footer>
    </>
  )
}
