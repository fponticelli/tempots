import type { Plugin } from 'vite'

const VIRTUAL_MODULE_ID = 'virtual:tempo-hmr-runtime'
const RESOLVED_VIRTUAL_MODULE_ID = '\0virtual:tempo-hmr-runtime'

const HMR_RUNTIME_SOURCE = `\
export function createHmrBoundary(render, factory, target, options) {
  let clear = null

  const doRender = (f) => {
    const renderable = f()
    clear = render(renderable, target, options)
  }

  doRender(factory)

  return {
    update(newFactory) {
      if (clear != null) {
        clear()
        clear = null
      }
      try {
        doRender(newFactory)
      } catch (e) {
        const error = e instanceof Error ? e : new Error(String(e))
        if (import.meta.hot) {
          import.meta.hot.send('vite:error', {
            err: {
              message: error.message,
              stack: error.stack || '',
            },
          })
        } else {
          console.error('[tempo:hmr] Error during hot update:', error)
        }
      }
    },
    dispose() {
      if (clear != null) {
        clear()
        clear = null
      }
    },
  }
}
`

/**
 * Finds the end index of a balanced parenthesized expression
 * starting from the opening paren at `start`.
 */
function findBalancedParen(code: string, start: number): number {
  let depth = 0
  for (let i = start; i < code.length; i++) {
    if (code[i] === '(') depth++
    else if (code[i] === ')') {
      depth--
      if (depth === 0) return i
    }
  }
  return -1
}

/**
 * Splits a top-level argument list by commas, respecting
 * nested parens, brackets, and braces.
 */
function splitArgs(argsStr: string): string[] {
  const args: string[] = []
  let depth = 0
  let current = ''

  for (let i = 0; i < argsStr.length; i++) {
    const ch = argsStr[i]
    if (ch === '(' || ch === '[' || ch === '{') {
      depth++
      current += ch
    } else if (ch === ')' || ch === ']' || ch === '}') {
      depth--
      current += ch
    } else if (ch === ',' && depth === 0) {
      args.push(current.trim())
      current = ''
    } else {
      current += ch
    }
  }

  if (current.trim()) {
    args.push(current.trim())
  }

  return args
}

/**
 * Transform source code to add HMR boundaries around render() calls
 * from @tempots/dom.
 *
 * Exported for testing.
 */
export function transformTempoHmr(
  code: string,
  id: string
): string | null {
  // Only process ts/js files
  if (!/\.[tjm]sx?$/.test(id)) {
    return null
  }

  // Find render import from @tempots/dom
  const importRegex =
    /import\s*\{([^}]*)\}\s*from\s*['"]@tempots\/dom['"]/
  const importMatch = importRegex.exec(code)
  if (!importMatch) {
    return null
  }

  // Find the render identifier (may be aliased)
  const imports = importMatch[1]
  const renderAliasRegex = /\brender\s+as\s+(\w+)\b/
  const aliasMatch = renderAliasRegex.exec(imports)

  let renderName: string
  if (aliasMatch) {
    renderName = aliasMatch[1]
  } else if (/\brender\b/.test(imports)) {
    renderName = 'render'
  } else {
    return null
  }

  // Find all render() call sites
  const callRegex = new RegExp(`\\b${renderName}\\s*\\(`, 'g')

  interface CallSite {
    start: number
    end: number
    firstArg: string
    restArgs: string[]
  }

  const callSites: CallSite[] = []
  let callMatch: RegExpExecArray | null

  while ((callMatch = callRegex.exec(code)) !== null) {
    const parenStart = callMatch.index + callMatch[0].length - 1
    const parenEnd = findBalancedParen(code, parenStart)
    if (parenEnd === -1) continue

    const argsStr = code.slice(parenStart + 1, parenEnd)
    const args = splitArgs(argsStr)
    if (args.length === 0) continue

    callSites.push({
      start: callMatch.index,
      end: parenEnd + 1,
      firstArg: args[0],
      restArgs: args.slice(1),
    })
  }

  if (callSites.length === 0) {
    return null
  }

  // Build transformed code - process call sites from end to start
  // to preserve indices
  let result = code
  const useSuffix = callSites.length > 1

  for (let i = callSites.length - 1; i >= 0; i--) {
    const site = callSites[i]
    const varName = useSuffix ? `__hmr_${i}` : '__hmr'
    const factoryExpr = `() => ${site.firstArg}`
    const restArgsStr =
      site.restArgs.length > 0 ? ', ' + site.restArgs.join(', ') : ''

    const replacement =
      `const ${varName} = __createHmrBoundary(${renderName}, ${factoryExpr}${restArgsStr})\n` +
      `if (import.meta.hot) {\n` +
      `  import.meta.hot.accept(() => { ${varName}.update(${factoryExpr}) })\n` +
      `  import.meta.hot.dispose(() => { ${varName}.dispose() })\n` +
      `}`

    result =
      result.slice(0, site.start) + replacement + result.slice(site.end)
  }

  // Add virtual module import at top
  const virtualImport = `import { createHmrBoundary as __createHmrBoundary } from '${VIRTUAL_MODULE_ID}'\n`
  result = virtualImport + result

  return result
}

/**
 * Creates the Tempo HMR Vite plugin.
 *
 * @param enabled - Whether HMR transform is enabled. Defaults to true.
 * @returns A Vite plugin.
 */
export function tempoHmrPlugin(enabled = true): Plugin {
  return {
    name: 'tempo:hmr',
    apply: 'serve',

    resolveId(id) {
      if (id === VIRTUAL_MODULE_ID) {
        return RESOLVED_VIRTUAL_MODULE_ID
      }
    },

    load(id) {
      if (id === RESOLVED_VIRTUAL_MODULE_ID) {
        return HMR_RUNTIME_SOURCE
      }
    },

    transform(code, id) {
      if (!enabled) return null
      return transformTempoHmr(code, id)
    },
  }
}
