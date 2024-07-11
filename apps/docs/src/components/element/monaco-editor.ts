import { OnMount, Signal, Task, Value } from '@tempots/dom'

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
  return Task(
    async () => {
      const monaco = await import('monaco-editor')
      await import(
        'monaco-editor/esm/vs/language/typescript/monaco.contribution'
      )
      await import('monaco-editor/esm/vs/language/html/monaco.contribution')
      monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: true,
        noSyntaxValidation: false,
      })

      monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
        target: monaco.languages.typescript.ScriptTarget.ES2015,
        allowNonTsExtensions: true,
      })
      return monaco
    },
    monaco => {
      return OnMount((el: HTMLElement) => {
        const editor = monaco.editor.create(el, {
          value: Signal.unwrap(content),
          language: Signal.unwrap(language),
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
              selection && editor.setSelection(selection)
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
              if (newValue !== Signal.unwrap(content)) {
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
    }
  )
}
