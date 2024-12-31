import { Prop } from '@tempots/dom'

export class Ticker extends Prop<number> {
  readonly tick = () => this.update(v => v + 1)
}

export const makeTicker = (initial: number = 0) =>
  new Ticker(initial, (a, b) => a === b)
