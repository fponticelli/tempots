import { DisposalScope, withScope } from "@tempots/core";
import type { Renderable, Providers, ProviderMark, Clear } from "@tempots/dom";
import {
  BrowserContext,
  DOMContext,
  HYDRATION_ID_ATTR,
  HeadlessContext,
} from "@tempots/dom";

/**
 * Options for client-side hydration.
 * @public
 */
export interface HydrateOptions {
  /**
   * Providers to inject during hydration.
   */
  providers?: Providers;

  /**
   * Whether to remove hydration markers after hydration completes.
   * Defaults to true.
   */
  removeMarkers?: boolean;
}

/**
 * Hydrates server-rendered HTML with client-side interactivity.
 *
 * This function takes a server-rendered container and attaches event handlers
 * and reactive updates to the existing DOM nodes without re-creating them.
 *
 * @example
 * ```typescript
 * import { hydrate } from '@tempots/client'
 * import { App } from './App'
 *
 * // Server-rendered HTML is already in the DOM
 * // Hydrate it with client-side interactivity
 * const cleanup = hydrate(App(), document.getElementById('app')!)
 *
 * // Later, to remove all event listeners:
 * cleanup()
 * ```
 *
 * @param renderable - The Renderable to hydrate with (should match server render).
 * @param container - The container element with server-rendered content.
 * @param options - Hydration options.
 * @returns A cleanup function that removes all event listeners and disposes signals.
 * @public
 */
export function hydrate(
  renderable: Renderable,
  container: HTMLElement,
  options: HydrateOptions = {},
): () => void {
  const { providers = {}, removeMarkers = true } = options;

  // Build a map of hydration IDs to elements
  const hydrationMap = buildHydrationMap(container);

  // Create a disposal scope for automatic signal tracking
  const scope = new DisposalScope();

  // Create the hydration context
  const ctx = new HydrationContext(
    container.ownerDocument,
    container,
    undefined,
    providers,
    hydrationMap,
    0,
  );

  // Execute the renderable within the scope
  const clear = withScope(scope, () => renderable.render(ctx));

  // Remove hydration markers if requested
  if (removeMarkers) {
    removeHydrationMarkers(container);
  }

  return (removeTree: boolean = false) => {
    scope.dispose();
    clear(removeTree);
  };
}

/**
 * Builds a map of hydration IDs to DOM elements.
 *
 * @param container - The container to scan for hydration IDs.
 * @returns A map of hydration ID to HTMLElement.
 * @internal
 */
function buildHydrationMap(container: HTMLElement): Map<string, HTMLElement> {
  const map = new Map<string, HTMLElement>();
  const elements = container.querySelectorAll(`[${HYDRATION_ID_ATTR}]`);

  elements.forEach((el) => {
    const id = el.getAttribute(HYDRATION_ID_ATTR);
    if (id) {
      map.set(id, el as HTMLElement);
    }
  });

  return map;
}

/**
 * Removes hydration marker attributes from all elements in the container.
 *
 * @param container - The container to clean up.
 * @internal
 */
function removeHydrationMarkers(container: HTMLElement): void {
  const elements = container.querySelectorAll(`[${HYDRATION_ID_ATTR}]`);
  elements.forEach((el) => {
    el.removeAttribute(HYDRATION_ID_ATTR);
    el.removeAttribute("data-tts-node");
  });
}

/**
 * A DOMContext implementation for hydration that reuses existing DOM nodes.
 *
 * During hydration, instead of creating new DOM elements, this context
 * finds and reuses existing elements that were rendered on the server.
 * Event handlers are attached to the existing elements.
 *
 * @public
 */
export class HydrationContext implements DOMContext {
  constructor(
    readonly document: Document,
    readonly element: HTMLElement,
    readonly reference: Node | undefined,
    readonly providers: Providers,
    private readonly hydrationMap: Map<string, HTMLElement>,
    private childIndex: number,
  ) {}

  /**
   * Finds the next child element instead of creating a new one.
   * Falls back to creating a new element if hydration fails.
   */
  readonly makeChildElement = (
    tagName: string,
    namespace: string | undefined,
  ): DOMContext => {
    // Try to find an existing child element
    const children = this.element.children;

    for (let i = this.childIndex; i < children.length; i++) {
      const child = children[i] as HTMLElement;

      // Check if this element matches by tag name
      if (child.tagName.toLowerCase() === tagName.toLowerCase()) {
        this.childIndex = i + 1;
        return new HydrationContext(
          this.document,
          child,
          undefined,
          this.providers,
          this.hydrationMap,
          0,
        );
      }
    }

    // Fallback: create a new element (hydration mismatch)
    console.warn(
      `Hydration mismatch: could not find element <${tagName}> in container`,
    );
    const newElement =
      namespace !== undefined
        ? (this.document.createElementNS(namespace, tagName) as HTMLElement)
        : this.document.createElement(tagName);
    this.appendOrInsert(newElement);
    return new HydrationContext(
      this.document,
      newElement,
      undefined,
      this.providers,
      this.hydrationMap,
      0,
    );
  };

  /**
   * Finds the next text node instead of creating a new one.
   */
  readonly makeChildText = (text: string): DOMContext => {
    // Find the next text node in children
    const childNodes = this.element.childNodes;

    for (let i = this.childIndex; i < childNodes.length; i++) {
      const child = childNodes[i];

      if (child.nodeType === Node.TEXT_NODE) {
        this.childIndex = i + 1;
        // Update the text content if needed
        if (child.textContent !== text) {
          child.textContent = text;
        }
        return new HydrationContext(
          this.document,
          this.element,
          child as Text,
          this.providers,
          this.hydrationMap,
          this.childIndex,
        );
      }
    }

    // Fallback: create a new text node
    const textNode = this.document.createTextNode(text);
    this.appendOrInsert(textNode);
    return new HydrationContext(
      this.document,
      this.element,
      textNode,
      this.providers,
      this.hydrationMap,
      this.childIndex,
    );
  };

  readonly setText = (text: string): void => {
    if (this.reference) {
      this.reference.nodeValue = text;
    }
  };

  readonly getText = (): string => {
    return this.reference?.nodeValue ?? this.element.textContent ?? "";
  };

  readonly makeRef = (): DOMContext => {
    // Find an existing empty text node or create one
    const childNodes = this.element.childNodes;

    for (let i = this.childIndex; i < childNodes.length; i++) {
      const child = childNodes[i];

      if (
        child.nodeType === Node.TEXT_NODE &&
        (child.textContent === "" || child.textContent === null)
      ) {
        this.childIndex = i + 1;
        return new HydrationContext(
          this.document,
          this.element,
          child as Text,
          this.providers,
          this.hydrationMap,
          this.childIndex,
        );
      }
    }

    // Create a new empty text node
    const ref = this.document.createTextNode("");
    this.appendOrInsert(ref);
    return new HydrationContext(
      this.document,
      this.element,
      ref,
      this.providers,
      this.hydrationMap,
      this.childIndex,
    );
  };

  readonly makePortal = (selector: string | HTMLElement): DOMContext => {
    const target =
      typeof selector === "string"
        ? (this.document.querySelector(selector) as HTMLElement | null)
        : selector;

    if (target == null) {
      throw new Error(
        `Cannot find element by selector for portal: ${selector}`,
      );
    }

    return new HydrationContext(
      this.document,
      target,
      undefined,
      this.providers,
      this.hydrationMap,
      0,
    );
  };

  private readonly appendOrInsert = (child: Node): void => {
    if (this.reference === undefined) {
      this.element.appendChild(child);
    } else {
      this.element.insertBefore(child, this.reference);
    }
  };

  readonly setProvider = <T>(
    mark: ProviderMark<T>,
    value: T,
    onUse: undefined | (() => void),
  ): DOMContext =>
    new HydrationContext(
      this.document,
      this.element,
      this.reference,
      { ...this.providers, [mark]: [value, onUse] },
      this.hydrationMap,
      this.childIndex,
    );

  readonly getProvider = <T>(mark: ProviderMark<T>) => {
    if (this.providers[mark] === undefined) {
      throw new Error(`Provider not found: ${String(mark)}`);
    }
    const [value, onUse] = this.providers[mark]! as [
      T,
      undefined | (() => void),
    ];
    return { value, onUse };
  };

  readonly clear = (removeTree: boolean): void => {
    if (removeTree) {
      if (this.reference !== undefined) {
        this.reference.parentNode?.removeChild(this.reference);
      } else {
        this.element.parentNode?.removeChild(this.element);
      }
    }
  };

  readonly addClasses = (tokens: string[]): void => {
    this.element.classList.add(...tokens);
  };

  readonly removeClasses = (tokens: string[]): void => {
    this.element.classList.remove(...tokens);
  };

  readonly getClasses = (): string[] => {
    return Array.from(this.element.classList);
  };

  readonly on = <E>(
    event: string,
    listener: (event: E, ctx: HydrationContext) => void,
    options?: AddEventListenerOptions,
  ): Clear => {
    const handler = (event: Event) => listener(event as E, this);
    this.element.addEventListener(event, handler, options);
    return (removeTree: boolean) => {
      if (removeTree) {
        this.element.removeEventListener(event, handler, options);
      }
    };
  };

  readonly isBrowserDOM = (): this is BrowserContext => false;
  readonly isBrowser = (): this is BrowserContext => false;
  readonly isHeadlessDOM = (): this is HeadlessContext => false;
  readonly isHeadless = (): this is HeadlessContext => false;

  readonly setStyle = (name: string, value: string): void => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.element.style[name as any] = value;
  };

  readonly getStyle = (name: string): string => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.element.style[name as any];
  };

  readonly makeAccessors = (
    name: string,
  ): { get(): unknown; set(value: unknown): void } => {
    const el = this.element as unknown as Record<string, unknown>;
    return {
      get: () => el[name],
      set: (value: unknown) => {
        el[name] = value;
      },
    };
  };
}

// Re-export useful types
export type { Renderable, Providers };
export { HYDRATION_ID_ATTR };
