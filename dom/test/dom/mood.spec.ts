import { createContext } from './common'
import { Mood, component, div } from '../../src'
import { Store, Property } from '@mood/store'

describe('Mood', () => {
  it('render', () => {
    const ctx = createContext()
    const store = new Store(
      new Property('hello'),
      (state: string, action: string) => action
    )

    const comp = component(
      { store },
      div({}, a => a)
    )
    const view = Mood.renderComponent({
      el: ctx.doc.body,
      component: comp,
      document: ctx.doc
    })
    expect(ctx.doc.body.innerHTML).toEqual('<div>hello</div>')
    view.store.property.set('world')
    expect(ctx.doc.body.innerHTML).toEqual('<div>world</div>')
    view.store.process('foo')
    expect(ctx.doc.body.innerHTML).toEqual('<div>foo</div>')
    view.destroy()
    expect(ctx.doc.body.innerHTML).toEqual('')
  })

  it('render with observe', () => {
    const ctx = createContext()
    let result = ['', '']

    const store = new Store(
      new Property('hello'),
      (state: string, action: string) => action.toUpperCase(),
      (s: string, a: string) => {
        result[0] = s
        result[1] = a
      }
    )

    const comp = component(
      { store },
      div({}, a => a)
    )

    const view = Mood.renderComponent({
      el: ctx.doc.body,
      component: comp,
      document: ctx.doc
    })
    expect(result[0]).toEqual('')
    expect(result[1]).toEqual('')
    view.store.process('foo')
    expect(result[0]).toEqual('FOO')
    expect(result[1]).toEqual('foo')
  })
})
