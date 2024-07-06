import { type Clear } from '../clean'
import { type DOMContext } from '../dom-context'
import { type Renderable } from '../renderable'

export class LifecycleImpl implements Renderable {
  constructor (private readonly onMount: (el: HTMLElement) => void, private readonly onUnmount: (el: HTMLElement, removeTree: boolean) => void) { }
  readonly appendTo = (ctx: DOMContext): Clear => {
    this.onMount(ctx.getElement())

    return (removeTree) => {
      this.onUnmount(ctx.getElement(), removeTree)
    }
  }
}

export interface LifecycleProps {
  onMount?: (el: HTMLElement) => void
  onUnmount?: (el: HTMLElement, removeTree: boolean) => void
}

export function Lifecycle ({ onMount, onUnmount }: LifecycleProps): Renderable {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  return new LifecycleImpl(onMount ?? (() => { }), onUnmount ?? (() => { }))
}
