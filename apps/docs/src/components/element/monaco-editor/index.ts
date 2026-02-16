import {
  attr,
  html,
  OnDispose,
  WithElement,
  Signal,
  Task,
  Value,
} from '@tempots/dom'
// monaco-editor 0.55+ deprecated monaco.languages.typescript in types
// (typed as { deprecated: true }) but the runtime API is unchanged.
// Define the subset of the TS namespace we need.
type MonacoTSDefaults = {
  setCompilerOptions(options: Record<string, unknown>): void
  addExtraLib(content: string, filePath?: string): { dispose(): void }
}
type MonacoTSNamespace = {
  typescriptDefaults: MonacoTSDefaults
  ScriptTarget: { ES2020: number }
  ModuleResolutionKind: { NodeJs: number }
  ModuleKind: { ESNext: number }
  JsxEmit: { React: number }
}

function throttle<T extends (...args: unknown[]) => void>(
  fn: T,
  wait: number
): T {
  let time = Date.now()
  return ((...args: unknown[]) => {
    if (Date.now() - time >= wait) {
      time = Date.now()
      fn(...args)
    }
  }) as T
}

const VERSION = '0.49.0'

const BASE = `https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/${VERSION}/min/vs`

type Asset = {
  type: 'style' | 'inline-script' | 'script'
  url: string
}

const SCRIPTS: Asset[] = [
  { type: 'style', url: `${BASE}/editor/editor.main.css` },
  { type: 'inline-script', url: `var require = { paths: { vs: "${BASE}" } };` },
  { type: 'script', url: `${BASE}/loader.js` },
  { type: 'script', url: `${BASE}/editor/editor.main.nls.js` },
  { type: 'script', url: `${BASE}/editor/editor.main.js` },
]

const loadedAssets = new Map<string, Promise<void>>()

function loadAsset(type: Asset['type'], url: string): Promise<void> {
  const key = `${type}:${url}`
  if (loadedAssets.has(key)) {
    return loadedAssets.get(key)!
  }
  const promise = (() => {
    if (type === 'style') {
      return new Promise<void>((resolve, reject) => {
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = url
        link.onload = () => resolve()
        link.onerror = reject
        document.head.appendChild(link)
      })
    }
    if (type === 'inline-script') {
      return new Promise<void>((resolve, reject) => {
        const script = document.createElement('script')
        script.text = url
        script.onerror = reject
        document.head.appendChild(script)
        resolve()
      })
    }
    return new Promise<void>((resolve, reject) => {
      const script = document.createElement('script')
      script.src = url
      script.onload = () => resolve()
      script.onerror = reject
      document.head.appendChild(script)
    })
  })()
  loadedAssets.set(key, promise)
  return promise
}

async function loadAssetsInOrder(urls: Asset[]): Promise<void> {
  for (const { type, url } of urls) {
    await loadAsset(type, url)
  }
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

export function MonacoEditor({
  autoSelect = false,
  autoFocus = false,
  content,
  language,
  onChange,
}: {
  autoSelect?: boolean
  autoFocus?: boolean
  content: Value<string>
  language: Value<string>
  onChange?: (value: string) => void
}) {
  return html.div(
    attr.class('w-full h-full overflow-hidden bg-gray-800 py-2 px-2'),
    Task(
      async () => {
        await loadAssetsInOrder(SCRIPTS)
        return {}
      },
      () =>
        WithElement((el: HTMLElement) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const monaco = (window as any)
            .monaco as typeof import('monaco-editor')

          // monaco-editor 0.55+ deprecated the languages.typescript namespace
          // in its public types, but the runtime API is unchanged.
          // Cast to our local type to access it safely.
          const ts = monaco.languages.typescript as unknown as MonacoTSNamespace

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

          // Create a model for the editor
          const editor = monaco.editor.create(el, {
            value: Value.get(content),
            language: Value.get(language),
            'semanticHighlighting.enabled': true,
            renderControlCharacters: true,
            renderWhitespace: 'all',
            tabSize: 2,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            wrappingIndent: 'indent',
            automaticLayout: true,
            theme: 'vs-dark',
            fontSize: 14,
            formatOnType: true,
            // Enable TypeScript features
            quickSuggestions: true,
            suggestOnTriggerCharacters: true,
            acceptSuggestionOnEnter: 'on',
            tabCompletion: 'on',
            snippetSuggestions: 'inline',
          })

          const disposers: (() => void)[] = []
          if (Signal.is<string>(content)) {
            disposers.push(
              content.on(value => {
                const selection = editor.getSelection()
                editor.setValue(value)
                if (selection != null) {
                  editor.setSelection(selection)
                }
              })
            )
          }
          if (Signal.is<string>(language)) {
            disposers.push(
              language.on(language =>
                monaco.editor.setModelLanguage(editor.getModel()!, language)
              )
            )
          }
          if (onChange != null) {
            editor.onDidChangeModelContent(
              throttle(() => {
                const newValue = editor.getValue()
                if (newValue !== Value.get(content)) {
                  onChange(newValue)
                }
              }, 100)
            )
          }
          if (autoSelect) {
            editor.onDidFocusEditorText(() => {
              editor.setSelection({
                startLineNumber: 1,
                startColumn: 1,
                endLineNumber: editor.getModel()!.getLineCount(),
                endColumn: editor
                  .getModel()!
                  .getLineMaxColumn(editor.getModel()!.getLineCount()),
              })
            })
          }

          if (autoFocus) {
            editor.focus()
          }

          return OnDispose(() => {
            const all = [editor.dispose, ...disposers]
            all.forEach(d => {
              try {
                d()
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
              } catch (_) {
                // do nothing
              }
            })
          })
        })
    )
  )
}
