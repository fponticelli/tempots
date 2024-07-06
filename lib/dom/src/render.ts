import { DOMContext } from "./dom-context";
import { JSX, makeRenderable } from "./jsx-runtime";

export function render(renderable: JSX.DOMNode, element: HTMLElement) {
  const ctx = DOMContext.of(element);
  const clear = makeRenderable(renderable).appendTo(ctx);
  return clear
}
