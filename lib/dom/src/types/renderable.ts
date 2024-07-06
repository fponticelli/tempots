import { IDOMContext } from "./idom-context";
import { Clear } from "./clean";

export interface Renderable {
  appendTo(ctx: IDOMContext): Clear
}
