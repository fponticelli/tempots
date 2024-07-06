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

function makeID() {
  return Math.random().toString().slice(2)
}

export enum Filter {
  All,
  Active,
  Completed
}

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
    title
  }),
  toggleCompleted: (id: string): Action => ({
    type: 'ToggleCompleted',
    id
  }),
  removeTodo: (id: string): Action => ({
    type: 'RemoveTodo',
    id
  }),
  toggleFilter: (filter: Filter): Action => ({
    type: 'ToggleFilter',
    filter
  }),
  clearCompleted: (): Action => ({
    type: 'ClearCompleted'
  }),
  updateTodo: (todo: Todo): Action => ({
    type: 'UpdateTodo',
    todo
  }),
  toggleAllTodo: (): Action => ({
    type: 'ToggleAllTodo'
  })
}

export const createTodo = (title: string): Todo => ({
  id: makeID(),
  title,
  completed: false
})

export const emptyState = (): State => ({
  filter: Filter.All,
  todos: []
})
