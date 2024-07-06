function makeID() {
  return Math.random().toString().slice(2)
}

export enum Filter {
  All = 'All',
  Active = 'Active',
  Completed = 'Completed',
}

export const AllFilters = [Filter.All, Filter.Active, Filter.Completed]

export interface State {
  filter: Filter
  todos: Todo[]
}

export interface TodoEdit {
  id: string
  title: string
}

export interface Todo {
  id: string
  title: string
  completed: boolean
}

export interface AddTodo {
  type: 'AddTodo'
  title: string
}

export interface ToggleCompleted {
  type: 'ToggleCompleted'
  id: string
}

export interface ToggleAllTodo {
  type: 'ToggleAllTodo'
}

export interface RemoveTodo {
  type: 'RemoveTodo'
  id: string
}

export interface ToggleFilter {
  type: 'ToggleFilter'
  filter: Filter
}

export interface ClearCompleted {
  type: 'ClearCompleted'
}

export interface UpdateTodo {
  type: 'UpdateTodo'
  todo: Todo
}

export type Action =
  | AddTodo
  | ToggleCompleted
  | RemoveTodo
  | ToggleFilter
  | ClearCompleted
  | UpdateTodo
  | ToggleAllTodo

export const Action = {
  addTodo: (title: string): Action => ({
    type: 'AddTodo',
    title,
  }),
  toggleCompleted: (id: string): Action => ({
    type: 'ToggleCompleted',
    id,
  }),
  removeTodo: (id: string): Action => ({
    type: 'RemoveTodo',
    id,
  }),
  toggleFilter: (filter: Filter): Action => ({
    type: 'ToggleFilter',
    filter,
  }),
  clearCompleted: (): Action => ({
    type: 'ClearCompleted',
  }),
  updateTodo: (todo: Todo): Action => ({
    type: 'UpdateTodo',
    todo,
  }),
  toggleAllTodo: (): Action => ({
    type: 'ToggleAllTodo',
  }),
}

export const createTodo = (title: string): Todo => ({
  id: makeID(),
  title,
  completed: false,
})

export const emptyState = (): State => ({
  filter: Filter.All,
  todos: [],
})
