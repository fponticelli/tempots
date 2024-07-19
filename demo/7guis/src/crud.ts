import { Txt } from './components/txt'
import {
  html,
  attr,
  type Renderable,
  on,
  emit,
  useComputed,
  useProp,
  ForEach,
} from '@tempots/dom'
import { Button, InputText, Select } from './ui'
import { flex } from './components/flex'

interface Person {
  name: string
  surname: string
}

export function Crud(): Renderable {
  let counter = 0
  const makeId = () => String(counter++)
  const currentId = useProp<string | null>(null)
  const person = useProp<Person>({ name: '', surname: '' })
  const isValid = person.map(
    person => person.name === '' || person.surname === ''
  )
  const isNotSelected = currentId.map(id => id == null)
  const name = person.map(p => p.name)
  const surname = person.map(p => p.surname)
  const db = useProp<Record<string, Person>>({})
  const filter = useProp('')
  const filteredList = useComputed(() => {
    const filtered = filter.value.toLocaleLowerCase()
    const values = Object.entries(db.value).filter(
      ([, { name, surname }]) =>
        name.toLocaleLowerCase().includes(filtered) ||
        surname.toLocaleLowerCase().includes(filtered)
    )
    return values
  }, [db, filter])

  return flex.row(
    attr.class('gap-4 items-center'),
    flex.col(
      attr.class('gap-2'),
      flex.row(
        attr.class('gap-2 items-center'),
        html.span(attr.class('w-20'), Txt('Name: ')),
        InputText(
          on.input(
            emit.value((value: string) =>
              person.update(curr => ({
                ...(curr ?? { id: 0, surname: surname.value }),
                name: value,
              }))
            )
          ),
          attr.value(name)
        )
      ),
      flex.row(
        attr.class('gap-2 items-center'),
        html.span(attr.class('w-20'), Txt('Surname: ')),
        InputText(
          on.input(
            emit.value((value: string) =>
              person.update(curr => ({
                ...(curr ?? { id: 0, name: name.value }),
                surname: value,
              }))
            )
          ),
          attr.value(surname)
        )
      ),
      flex.row(
        attr.class('gap-2 items-center justify-center'),
        Button(
          attr.disabled(isValid),
          'Create',
          on.click(() => {
            const id = makeId()
            db.update(db => {
              const newDb = { ...db }
              newDb[id] = person.value
              return newDb
            })
            currentId.set(id)
          })
        ),
        Button(
          attr.disabled(
            useComputed(
              () => isValid.value || isNotSelected.value,
              [isValid, isNotSelected]
            )
          ),
          'Update',
          on.click(() => {
            const id = currentId.value
            if (id != null) {
              db.update(db => {
                const newDb = { ...db }
                newDb[id] = { ...person.value }
                return newDb
              })
            }
          })
        ),
        Button(
          attr.disabled(isNotSelected),
          'Delete',
          on.click(() => {
            const id = currentId.value
            if (id != null) {
              db.update(db => {
                const newDb = { ...db }

                delete newDb[id]
                return newDb
              })
              currentId.set(null)
            }
          })
        )
      )
    ),
    flex.col(
      attr.class('gap-2'),
      flex.row(
        attr.class('gap-2 items-center'),
        Txt('Filter prefix: '),
        InputText(
          attr.value(filter),
          on.input(emit.value((value: string) => filter.set(value)))
        ),
        Button(
          'Clear',
          on.click(() => filter.set(''))
        )
      ),
      flex.row(
        Select(
          attr.class('w-full'),
          attr.size(5),
          on.change(
            emit.value((value: string) => {
              currentId.set(value)
              person.set(db.value[value])
            })
          ),
          ForEach(filteredList, el => {
            const id = el.map(el => el[0])
            const label = el.map(el => `${el[1].name}, ${el[1].surname}`)
            return html.option(
              attr.selected(
                useComputed(() => currentId.value === id.value, [currentId, id])
              ),
              attr.value(id),
              label
            )
          })
        )
      )
    )
  )
}
