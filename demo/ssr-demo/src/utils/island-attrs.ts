import { Attr, Renderable } from "@tempots/dom";
import {
  ISLAND_ATTR,
  ISLAND_PROPS_ATTR,
  ISLAND_HYDRATE_ATTR,
} from "@tempots/client";

/**
 * Island marker helper - creates attributes for island hydration.
 * In a real app, you might use the islandMarker() function from @tempots/client.
 */
export const createIslandAttrs = (
  name: string,
  props: unknown,
  strategy: string,
): Renderable[] => [
  Attr(ISLAND_ATTR, name),
  Attr(ISLAND_PROPS_ATTR, JSON.stringify(props)),
  Attr(ISLAND_HYDRATE_ATTR, strategy),
];
