import { Clear } from "../types/clean";
import { IDOMContext } from "../types/idom-context";
import { Renderable } from "../types/renderable";

export class LifecycleImpl implements Renderable {
  constructor(private onMount: (el: HTMLElement) => void, private onUnmount: (el: HTMLElement) => void) { }
  readonly appendTo = (ctx: IDOMContext): Clear => {
    this.onMount(ctx.getElement())

    return () => {
      this.onUnmount(ctx.getElement())
    }
  }
}

export interface LifecycleProps {
  onMount?: (el: HTMLElement) => void
  onUnmount?: (el: HTMLElement) => void
}

export function Lifecycle({ onMount, onUnmount }: LifecycleProps): Renderable {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  return new LifecycleImpl(onMount ?? (() => { }), onUnmount ?? (() => { }))
}
