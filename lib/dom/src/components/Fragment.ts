import { Renderable } from "../types/renderable";
import { Clear } from "../types/clean";
import { IDOMContext } from "../types/idom-context";
import { JSX } from "../jsx";
import { makeRenderables } from "../jsx-runtime";

export class FragmentImpl implements Renderable {
  constructor(private children: Renderable[]) { }
  readonly appendTo = (ctx: IDOMContext): Clear => {
    const clears = this.children.map(child => child.appendTo(ctx));
    return (removeTree: boolean) => {
      clears.forEach(clear => clear(removeTree));
    };
  }
}

export function Fragment({ children }: { children: JSX.DOMNode }): Renderable {
  return new FragmentImpl(makeRenderables(children));
}
