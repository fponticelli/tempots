import { attr, html, OnElement, Signal, Task, Value } from '@tempots/dom'

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
      () => loadAssetsInOrder(SCRIPTS),
      () =>
        OnElement((el: HTMLElement) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const monaco = (window as any)
            .monaco as typeof import('monaco-editor')
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

          return () => {
            disposers.forEach(dispose => dispose())
            editor.dispose()
          }
        })
    )
  )
}
