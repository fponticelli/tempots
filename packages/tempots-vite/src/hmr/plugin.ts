import type { Plugin } from 'vite'

const VIRTUAL_MODULE_ID = 'virtual:tempo-hmr-runtime'
const RESOLVED_VIRTUAL_MODULE_ID = '\0virtual:tempo-hmr-runtime'

const HMR_RUNTIME_SOURCE = `\
const _snapshot = new Map()

function snapshotProps(props, moduleId) {
  for (const p of props) {
    if (p.__hmr_label != null && p.$__prop__ === true) {
      _snapshot.set(moduleId + ':' + p.__hmr_label, p.value)
    }
  }
}

function restoreProps(props, moduleId) {
  for (const p of props) {
    if (p.__hmr_label != null && p.$__prop__ === true) {
      const key = moduleId + ':' + p.__hmr_label
      if (_snapshot.has(key)) {
        p.set(_snapshot.get(key))
        _snapshot.delete(key)
      }
    }
  }
}

export function createHmrBoundary(render, factory, target, options, moduleProps, moduleId) {
  let clear = null

  const doRender = (f) => {
    const renderable = f()
    clear = render(renderable, target, options)
  }

  doRender(factory)

  if (moduleProps != null && moduleId != null) {
    restoreProps(moduleProps, moduleId)
  }

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
      if (moduleProps != null && moduleId != null) {
        snapshotProps(moduleProps, moduleId)
      }
      if (clear != null) {
        clear()
        clear = null
      }
    },
  }
}

const __hmr_registry = new Map()

export function hmrNotify(moduleId, newModule) {
  const boundaries = __hmr_registry.get(moduleId)
  if (boundaries == null) return
  for (const boundary of boundaries) {
    try {
      boundary.update(newModule)
    } catch (e) {
      const error = e instanceof Error ? e : new Error(String(e))
      console.error('[tempo:hmr] Error updating boundary for ' + moduleId + ':', error)
    }
  }
}

export function componentBoundary(moduleId, exportName, factory, initialComponent, createRenderable) {
  return createRenderable((ctx) => {
    const markerCtx = ctx.makeRef()
    let clear = null

    function doRender(component) {
      const renderable = factory(component)
      if (renderable != null && typeof renderable.render === 'function') {
        clear = renderable.render(markerCtx)
      }
    }

    doRender(initialComponent)

    const instance = {
      update(newModule) {
        const newComp = newModule[exportName]
        if (newComp == null) {
          console.error('[tempo:hmr] Export ' + exportName + ' not found in ' + moduleId)
          return
        }
        if (clear != null) { clear(true); clear = null }
        try {
          doRender(newComp)
        } catch (e) {
          const error = e instanceof Error ? e : new Error(String(e))
          if (import.meta.hot) {
            import.meta.hot.send('vite:error', {
              err: { message: error.message, stack: error.stack || '' },
            })
          }
        }
      },
      dispose() {
        const set = __hmr_registry.get(moduleId)
        if (set) set.delete(instance)
      },
    }

    if (!__hmr_registry.has(moduleId)) __hmr_registry.set(moduleId, new Set())
    __hmr_registry.get(moduleId).add(instance)

    return (removeTree) => {
      instance.dispose()
      if (clear != null) { clear(removeTree); clear = null }
      markerCtx.clear(removeTree)
    }
  })
}
`

/**
 * Escapes special regex characters in a string.
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

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
export function transformTempoHmr(code: string, id: string): string | null {
  // Only process ts/js files, skip built files and dependencies
  if (!/\.[tjm]sx?$/.test(id)) {
    return null
  }
  if (/node_modules|\/dist\//.test(id)) {
    return null
  }

  // Find render import from @tempots/dom
  const importRegex = /import\s*\{([^}]*)\}\s*from\s*['"]@tempots\/dom['"]/
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

  // Find prop factory imports from @tempots/dom and @tempots/core
  const PROP_FACTORIES = [
    'prop',
    'localStorageProp',
    'sessionStorageProp',
    'storedProp',
  ]
  const propFactoryLocalNames: string[] = []

  const allImportRegex =
    /import\s*\{([^}]*)\}\s*from\s*['"]@tempots\/(?:dom|core)['"]/g
  let impMatch: RegExpExecArray | null
  while ((impMatch = allImportRegex.exec(code)) !== null) {
    const specifiers = impMatch[1]
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)
    for (const spec of specifiers) {
      const aliasM = /^(\w+)\s+as\s+(\w+)$/.exec(spec)
      if (aliasM) {
        if (PROP_FACTORIES.includes(aliasM[1])) {
          propFactoryLocalNames.push(aliasM[2])
        }
      } else if (PROP_FACTORIES.includes(spec)) {
        propFactoryLocalNames.push(spec)
      }
    }
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

    // Separate target (first rest arg) and options (second rest arg)
    const targetArg = site.restArgs.length > 0 ? site.restArgs[0] : ''
    const optionsArg = site.restArgs.length > 1 ? site.restArgs[1] : 'undefined'
    const targetStr = targetArg ? ', ' + targetArg : ''
    const optionsStr = ', ' + optionsArg

    const replacement =
      `const ${varName} = __createHmrBoundary(${renderName}, ${factoryExpr}${targetStr}${optionsStr}, __hmr_props, '${id}')\n` +
      `if (import.meta.hot) {\n` +
      `  import.meta.hot.dispose(() => { ${varName}.dispose() })\n` +
      `  import.meta.hot.accept()\n` +
      `}`

    result = result.slice(0, site.start) + replacement + result.slice(site.end)
  }

  // Label prop assignments and collect names
  const labeledPropNames: string[] = []

  if (propFactoryLocalNames.length > 0) {
    const escapedNames = propFactoryLocalNames.map(escapeRegex).join('|')
    const propAssignRegex = new RegExp(
      `((?:const|let|var)\\s+(\\w+)\\s*=\\s*(?:${escapedNames})\\s*\\()`,
      'g'
    )

    interface PropSite {
      varName: string
      insertPos: number
    }

    const propSites: PropSite[] = []
    let propMatch: RegExpExecArray | null

    while ((propMatch = propAssignRegex.exec(result)) !== null) {
      const parenStart = propMatch.index + propMatch[0].length - 1
      const parenEnd = findBalancedParen(result, parenStart)
      if (parenEnd === -1) continue

      propSites.push({
        varName: propMatch[2],
        insertPos: parenEnd + 1,
      })
    }

    // Process from end to start to preserve indices
    for (let i = propSites.length - 1; i >= 0; i--) {
      const site = propSites[i]
      const label = `; ${site.varName}.__hmr_label = '${site.varName}'`
      result =
        result.slice(0, site.insertPos) + label + result.slice(site.insertPos)
    }

    // Collect names in order
    for (const site of propSites) {
      labeledPropNames.push(site.varName)
    }
  }

  // Insert __hmr_props array before the first __hmr boundary declaration
  const propsArray = `const __hmr_props = [${labeledPropNames.join(', ')}]\n`
  const hmrDeclIndex = result.indexOf('const __hmr')
  result =
    result.slice(0, hmrDeclIndex) + propsArray + result.slice(hmrDeclIndex)

  // Add virtual module import at top
  const virtualImport = `import { createHmrBoundary as __createHmrBoundary } from '${VIRTUAL_MODULE_ID}'\n`
  result = virtualImport + result

  return result
}

/**
 * Transform source code to wrap PascalCase function calls imported from
 * relative paths in `__componentBoundary()` calls, and add
 * `import.meta.hot.accept()` for each dependency.
 *
 * Exported for testing.
 */
export function transformComponentHmr(code: string, id: string): string | null {
  if (!/\.[tjm]sx?$/.test(id)) return null
  // Skip built files and dependencies
  if (/node_modules|\/dist\//.test(id)) return null

  // Collect PascalCase imports from relative paths only
  const relativeImportRegex =
    /import\s*\{([^}]*)\}\s*from\s*['"](\.[^'"]+)['"]/g

  interface ComponentImport {
    localName: string
    exportName: string
    moduleSpecifier: string
  }

  const componentImports: ComponentImport[] = []
  const moduleSpecifiers = new Set<string>()

  let impMatch: RegExpExecArray | null
  while ((impMatch = relativeImportRegex.exec(code)) !== null) {
    const specifiers = impMatch[1]
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)
    const moduleSpec = impMatch[2]

    for (const spec of specifiers) {
      const aliasM = /^(\w+)\s+as\s+(\w+)$/.exec(spec)
      const exportName = aliasM ? aliasM[1] : spec
      const localName = aliasM ? aliasM[2] : spec

      if (/^[A-Z]/.test(exportName)) {
        componentImports.push({
          localName,
          exportName,
          moduleSpecifier: moduleSpec,
        })
        moduleSpecifiers.add(moduleSpec)
      }
    }
  }

  if (componentImports.length === 0) return null

  // Find call sites for each component import
  interface ComponentCallSite {
    start: number
    end: number
    localName: string
    exportName: string
    moduleSpecifier: string
    argsStr: string
  }

  const callSites: ComponentCallSite[] = []

  for (const ci of componentImports) {
    const callRegex = new RegExp(`\\b${escapeRegex(ci.localName)}\\s*\\(`, 'g')
    let cm: RegExpExecArray | null
    while ((cm = callRegex.exec(code)) !== null) {
      const parenStart = cm.index + cm[0].length - 1
      const parenEnd = findBalancedParen(code, parenStart)
      if (parenEnd === -1) continue

      callSites.push({
        start: cm.index,
        end: parenEnd + 1,
        localName: ci.localName,
        exportName: ci.exportName,
        moduleSpecifier: ci.moduleSpecifier,
        argsStr: code.slice(parenStart + 1, parenEnd).trim(),
      })
    }
  }

  if (callSites.length === 0) return null

  // Sort descending by position for safe replacement
  callSites.sort((a, b) => b.start - a.start)

  let result = code

  for (const site of callSites) {
    const factoryBody = site.argsStr
      ? `${site.localName}(${site.argsStr})`
      : `${site.localName}()`

    const replacement =
      `__componentBoundary('${site.moduleSpecifier}', '${site.exportName}', ` +
      `(${site.localName}) => ${factoryBody}, ${site.localName}, __domRenderable)`

    result = result.slice(0, site.start) + replacement + result.slice(site.end)
  }

  // Append dependency acceptance
  const acceptLines: string[] = []
  for (const modSpec of moduleSpecifiers) {
    acceptLines.push(
      `  import.meta.hot.accept('${modSpec}', (mod) => __hmrNotify('${modSpec}', mod))`
    )
  }
  result += `\nif (import.meta.hot) {\n${acceptLines.join('\n')}\n}`

  // Prepend imports
  const imports =
    `import { componentBoundary as __componentBoundary, hmrNotify as __hmrNotify } from '${VIRTUAL_MODULE_ID}'\n` +
    `import { domRenderable as __domRenderable } from '@tempots/dom'\n`
  result = imports + result

  return result
}

/**
 * Creates the Tempo HMR Vite plugin.
 *
 * @param enabled - Whether HMR transform is enabled. Defaults to true.
 * @param devtools - Whether DevTools is enabled. Defaults to false.
 * @returns A Vite plugin.
 */
export function tempoHmrPlugin(enabled = true, devtools = false): Plugin {
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

      // Entry-file transform (render() wrapping + prop labeling)
      const entryResult = transformTempoHmr(code, id)

      // Component-level transform (PascalCase wrapping + dep acceptance)
      const componentInput = entryResult ?? code
      const componentResult = transformComponentHmr(componentInput, id)

      return componentResult ?? entryResult
    },
  }
}
