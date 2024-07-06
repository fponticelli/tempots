import { Renderable } from "../renderable";
import { Lifecycle } from "./Lifecycle";

export function Autofocus (): Renderable {
  return Lifecycle({ onMount: (el) => setTimeout(() => el && el.focus(), 10) });
}
