import {
  attr,
  html,
  OnDispose,
  WithBrowserCtx,
  WithElement,
  Signal,
  Task,
  Value,
} from '@tempots/dom'

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
    WithBrowserCtx(() =>
      Task(
        () => import('./monaco'),
        ({ editor: editorApi }) =>
          WithElement((el: HTMLElement) => {
            // Create a model for the editor
            const editor = editorApi.create(el, {
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
                  editorApi.setModelLanguage(editor.getModel()!, language)
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
              const all = [() => editor.dispose(), ...disposers]
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
  )
}
