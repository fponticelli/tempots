import EditorWorker from 'monaco-editor/editor/editor.worker?worker'
import HtmlWorker from 'monaco-editor/languages/features/html/html.worker?worker'
import TypeScriptWorker from 'monaco-editor/languages/features/typescript/ts.worker?worker'
import * as ts from 'monaco-editor/languages/features/typescript/register'
import 'monaco-editor/features/register.all'
import 'monaco-editor/languages/definitions/html/register'
import 'monaco-editor/languages/definitions/typescript/register'
import 'monaco-editor/languages/features/html/register'

export { editor } from 'monaco-editor/editor'

globalThis.MonacoEnvironment = {
  getWorker(_workerId, label) {
    if (label === 'typescript' || label === 'javascript') {
      return new TypeScriptWorker()
    }
    if (label === 'html') {
      return new HtmlWorker()
    }
    return new EditorWorker()
  },
}

// Create a comprehensive type definition for @tempots/dom
// This approach avoids the need to load and parse multiple .d.ts files
function createTempotsTypeDefinition() {
  // Create a comprehensive type definition that includes all the essential types and functions
  return `
declare module '@tempots/dom' {
  // Core types
  export type DOMContext = {
    readonly document: Document;
    readonly parent: Node;
    readonly providers: Record<symbol & { readonly __type: unknown }, [unknown, undefined | (() => void)]>;
  };

  export type Clear = (removeTree: boolean) => void;

  export type Renderable<CTX extends DOMContext = DOMContext> = (ctx: CTX) => Clear;

  export type TNode<CTX extends DOMContext = DOMContext> =
    | Renderable<CTX>
    | Value<string>
    | undefined
    | null
    | Renderable<CTX>[];

  // Value and Signal types
  export type Value<T> = Signal<T> | T;

  export interface Signal<T> {
    readonly value: T;
    readonly $: { [K in keyof T]: Signal<T[K]> };
    on(listener: (value: T) => void, options?: { immediate?: boolean }): () => void;
    map<U>(mapper: (value: T) => U): Signal<U>;
    mapAsync<U>(mapper: (value: T) => Promise<U>, defaultValue: U): Signal<U>;
  }

  export namespace Signal {
    export function is<T>(value: unknown): value is Signal<T>;
  }

  export interface Prop<T> extends Signal<T> {
    set(value: T): void;
  }

  export function prop<T>(initialValue: T): Prop<T>;

  // HTML helpers
  export const html: {
    [K in keyof HTMLElementTagNameMap]: (...args: TNode[]) => Renderable;
  };

  export const attr: {
    class: (className: string | Value<string>) => Renderable;
    id: (id: string | Value<string>) => Renderable;
    style: (style: string | Value<string>) => Renderable;
    [key: string]: (value: string | Value<string>) => Renderable;
  };

  // Core functions
  export function Fragment(...children: TNode[]): Renderable;
  export function render(renderable: Renderable, container: Element): () => void;
  export function OnDispose(dispose: () => void): Renderable;
  export function WithElement<T extends Element>(fn: (el: T) => Renderable | void): Renderable;
  export function Task<T>(task: () => Promise<T>, render: (result: T) => Renderable): Renderable;

  // Additional common functions
  export function When<T>(condition: Value<T>, render: (value: Signal<T>) => Renderable): Renderable;
  export function ForEach<T>(items: Value<T[]>, render: (item: Signal<T>, index: Signal<number>) => Renderable): Renderable;
}
  `
}

// Configure TypeScript compiler options
ts.typescriptDefaults.setCompilerOptions({
  target: ts.ScriptTarget.ES2020,
  allowNonTsExtensions: true,
  moduleResolution: ts.ModuleResolutionKind.NodeJs,
  module: ts.ModuleKind.ESNext,
  noEmit: true,
  typeRoots: ['node_modules/@types'],
  jsx: ts.JsxEmit.React,
  jsxFactory: 'html',
  allowSyntheticDefaultImports: true,
  esModuleInterop: true,
})

// Use the comprehensive type definition
const typeDefinition = createTempotsTypeDefinition()

// Add the type definition to Monaco
ts.typescriptDefaults.addExtraLib(
  typeDefinition,
  'file:///node_modules/@tempots/dom/index.d.ts'
)

// Create a helper module to make imports easier
const moduleContent = `
import * as tempoDOM from '@tempots/dom';
// This helps Monaco understand the module structure
export const html = tempoDOM.html;
export const attr = tempoDOM.attr;
export const Fragment = tempoDOM.Fragment;
export type TNode = tempoDOM.TNode;
export type Renderable = tempoDOM.Renderable;
`

// Add this as a helper module
ts.typescriptDefaults.addExtraLib(
  moduleContent,
  'file:///node_modules/@tempots/dom-helper.ts'
)
