import { type Signal } from '../prop'
import { type Renderable } from '../renderable'
import { type Clear } from '../clean'
import { subscribeToSignal } from './Text'
import { type DOMContext } from '../dom-context'

export class ClassNameImpl implements Renderable {
  constructor (private readonly cls: Signal<string> | Signal<string | undefined>) { }

  readonly appendTo = (ctx: DOMContext): Clear => {
    const [set, clear] = ctx.createClass(this.cls.get() ?? '')
    return subscribeToSignal(this.cls.map(v => v ?? ''), set, clear)
  }
}

export interface ClassNameProps {
  value: Signal<string> | Signal<string | undefined>
}

export function ClassName ({ value }: ClassNameProps): Renderable {
  return new ClassNameImpl(value)
}
