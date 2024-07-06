import { Prop } from '@tempots/dom'
import { State, Action, createTodo, Todo, Filter } from './types'

export const filterF = (filter: Filter) => {
  if (filter === Filter.All) {
    return () => true
  } else if (filter === Filter.Completed) {
    return (todo: Todo) => todo.completed
  } else {
    return (todo: Todo) => !todo.completed
  }
}

export const changeF =
  (filter: Filter, state: Prop<State>, dispatch: (_: Action) => void) =>
  () => {
    if (state.get().filter !== filter)
      dispatch({ type: 'ToggleFilter', filter })
  }

export const selectedF =
  (filter: Filter) =>
  (state: State): string | undefined =>
    state.filter === filter ? 'selected' : undefined

export const listCompleted = (list: Todo[]) =>
  list.filter(todo => todo.completed)
export const countCompleted = (list: Todo[]) => listCompleted(list).length

export const update = (state: State, action: Action) => {
  switch (action.type) {
    case 'AddTodo':
      return {
        ...state,
        todos: [...state.todos, createTodo(action.title)]
      }
    case 'ToggleCompleted':
      return {
        ...state,
        todos: state.todos.map(todo => {
          if (todo.id === action.id) {
            return { ...todo, completed: !todo.completed }
          } else {
            return todo
          }
        })
      }
    case 'RemoveTodo':
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.id)
      }
    case 'ToggleFilter':
      return {
        ...state,
        filter: action.filter
      }
    case 'ClearCompleted':
      return {
        ...state,
        todos: state.todos.filter(item => !item.completed)
      }
    case 'UpdateTodo':
      return {
        ...state,
        todos: state.todos.map(todo => {
          if (todo.id === action.todo.id) {
            return action.todo
          } else {
            return todo
          }
        })
      }
    case 'ToggleAllTodo': {
      const allCompleted = countCompleted(state.todos) === state.todos.length
      return {
        ...state,
        todos: state.todos.map(item => {
          if (item.completed !== allCompleted) {
            return item
          } else {
            return { ...item, completed: !allCompleted }
          }
        })
      }
    }
  }
}
