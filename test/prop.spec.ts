import { Prop } from '../src/prop'

describe('Prop', () => {
  test('get/set', () => {
    const prop = new Prop(1)
    expect(prop.get()).toBe(1)
    prop.set(2)
    expect(prop.get()).toBe(2)
  })
})
