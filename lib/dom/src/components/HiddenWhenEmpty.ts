import { Renderable } from "../types/renderable";
import { IDOMContext } from "../types/idom-context";
import { Clear } from "../types/clean";

export class HiddenWhenEmptyImpl implements Renderable {
  appendTo(ctx: IDOMContext): Clear {
    ctx.setStyle(":empty", "display: none")
    return (removeTree) => {
      if (removeTree) ctx.setStyle(":empty", null)
    }
  }
}

export function HiddenWhenEmpty() {
  return new HiddenWhenEmptyImpl()
}
