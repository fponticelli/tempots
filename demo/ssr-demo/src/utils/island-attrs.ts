import { Attr, Renderable } from "@tempots/dom";
import {
  ISLAND_ATTR,
  ISLAND_OPTIONS_ATTR,
  ISLAND_HYDRATE_ATTR,
} from "@tempots/client";

/**
 * Island marker helper - creates attributes for island hydration.
 * In a real app, you might use the islandMarker() function from @tempots/client.
 */
export const createIslandAttrs = (
  name: string,
  options: unknown,
  strategy: string,
): Renderable[] => [
  Attr(ISLAND_ATTR, name),
  Attr(ISLAND_OPTIONS_ATTR, JSON.stringify(options)),
  Attr(ISLAND_HYDRATE_ATTR, strategy),
];
