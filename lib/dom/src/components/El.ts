import { IDOMContext } from "../types/idom-context";
import { Clear } from "../types/clean";
import { Renderable } from "../types/renderable";
import { JSX } from "../jsx";
import { makeRenderables } from "../jsx-runtime";

export class ElImpl implements Renderable {
  constructor(private tagName: string, private children: Renderable[]) { }
  readonly appendTo = (ctx: IDOMContext): Clear => {
    const newCtx = ctx.makeElement(this.tagName);
    const clears = this.children.map(child => child.appendTo(newCtx));
    return (removeTree: boolean) => {
      console.log("El will clear")
      newCtx.requestClear(removeTree, () => {
        console.log("El clearing ...")
        clears.forEach(clear => clear(false));
      })
    };
  }
}

export interface ElProps {
  tagName: string
  children?: JSX.DOMNode
}

export function El({ tagName, children }: ElProps): Renderable {
  return new ElImpl(tagName, makeRenderables(children))
}
