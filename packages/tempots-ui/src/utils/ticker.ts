import { Prop, strictEquals } from '@tempots/dom'

/**
 * A property that can be used to force an update. Internally, it's a number that is incremented by one on each tick.
 * Extends the Prop class with a number value.
 *
 * It can be used as a counter Signal.
 * @public
 */
export class Ticker extends Prop<number> {
  /**
   * Triggers an update of the Ticker by incrementing its internal value.
   * @returns void
   */
  readonly tick = () => this.update(v => v + 1)
}

/**
 * Creates a new Ticker instance with an optional initial value.
 * @param initial - The initial value for the ticker (defaults to 0)
 * @returns A new Ticker instance that only updates when the value changes
 * @public
 */
export const ticker = (initial: number = 0) => new Ticker(initial, strictEquals)
