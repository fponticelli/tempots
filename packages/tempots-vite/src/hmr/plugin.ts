import type { Plugin } from 'vite'
import { DEVTOOLS_PANEL_SOURCE } from './devtools-panel'

const VIRTUAL_MODULE_ID = 'virtual:tempo-hmr-runtime'
const RESOLVED_VIRTUAL_MODULE_ID = '\0virtual:tempo-hmr-runtime'

const HMR_RUNTIME_SOURCE = `\
const _snapshot = new Map()
const _knownModules = new Set()

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

  var renderStart = typeof performance !== 'undefined' ? performance.now() : 0
  doRender(factory)
  var renderTime = typeof performance !== 'undefined' ? performance.now() - renderStart : 0

  if (moduleId != null && _knownModules.has(moduleId) && typeof devtoolsRecordHmr === 'function') {
    devtoolsRecordHmr(moduleId + ' (full)', 0, renderTime)
  }
  if (moduleId != null) _knownModules.add(moduleId)

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
  if (boundaries == null || boundaries.size === 0) {
    return false
  }
  const start = typeof performance !== 'undefined' ? performance.now() : 0
  let count = 0
  for (const boundary of boundaries) {
    try {
      boundary.update(newModule)
      count++
    } catch (e) {
      const error = e instanceof Error ? e : new Error(String(e))
      console.error('[tempo:hmr] Error updating boundary for ' + moduleId + ':', error)
    }
  }
  if (typeof performance !== 'undefined' && typeof devtoolsRecordHmr === 'function') {
    devtoolsRecordHmr(moduleId, count, performance.now() - start)
  }
  return true
}

const _devSignals = new Map()
const _devSignalUpdates = new Map()
const _devRenderStats = new Map()
const _devHmrLog = []

export function devtoolsRegister(prop, label, moduleId) {
  _devSignals.set(moduleId + ':' + label, { ref: new WeakRef(prop), label, moduleId })
}

export function devtoolsSignalUpdate(key) {
  _devSignalUpdates.set(key, (_devSignalUpdates.get(key) || 0) + 1)
}

export function devtoolsRecordRender(moduleId, exportName, duration) {
  const key = moduleId + ':' + exportName
  const existing = _devRenderStats.get(key)
  if (existing != null) {
    existing.renderCount++
    existing.totalTime += duration
    existing.avgTime = existing.totalTime / existing.renderCount
    existing.maxTime = Math.max(existing.maxTime, duration)
  } else {
    _devRenderStats.set(key, {
      renderCount: 1, totalTime: duration, avgTime: duration, maxTime: duration
    })
  }
}

export function devtoolsRecordHmr(moduleId, boundaryCount, duration) {
  _devHmrLog.unshift({ moduleId, boundaryCount, duration, timestamp: Date.now() })
  if (_devHmrLog.length > 20) _devHmrLog.length = 20
}

export function devtoolsWrapSet(prop, key) {
  var origSet = prop.set.bind(prop)
  prop.set = function(v) { devtoolsSignalUpdate(key); origSet(v) }
  var proto = Object.getPrototypeOf(prop)
  var desc = Object.getOwnPropertyDescriptor(proto, 'value')
  if (desc && desc.set) {
    var origValueSet = desc.set
    Object.defineProperty(prop, 'value', {
      get: desc.get,
      set: function(v) { devtoolsSignalUpdate(key); origValueSet.call(prop, v) },
      configurable: true,
    })
  }
}

export function devtoolsGetSignals() {
  var result = []
  _devSignals.forEach(function(entry, key) {
    var prop = entry.ref.deref()
    if (!prop || (typeof prop.isDisposed === 'function' && prop.isDisposed())) {
      _devSignals.delete(key)
    } else {
      result.push({ prop: prop, label: entry.label, moduleId: entry.moduleId })
    }
  })
  return result
}
export function devtoolsGetRenderStats() { return _devRenderStats }
export function devtoolsGetSignalUpdates() { return _devSignalUpdates }
export function devtoolsGetHmrLog() { return _devHmrLog }

if (typeof window !== 'undefined') {
  window.__tempo_devtools_data = {
    getSignals: devtoolsGetSignals,
    getRenderStats: devtoolsGetRenderStats,
    getSignalUpdates: devtoolsGetSignalUpdates,
    getHmrLog: devtoolsGetHmrLog,
    clearRenderStats: function() { _devRenderStats.clear() },
    clearSignalUpdates: function() { _devSignalUpdates.clear() },
  }
}

export function componentBoundary(moduleId, exportName, factory, initialComponent, createRenderable, ScopeClass, scopeWith) {
  return createRenderable((ctx) => {
    const markerCtx = ctx.makeRef()
    let clear = null
    let currentScope = null

    function doRender(component) {
      const start = typeof performance !== 'undefined' ? performance.now() : 0
      if (currentScope) { currentScope.dispose(); currentScope = null }
      currentScope = new ScopeClass()
      const renderable = scopeWith(currentScope, function() { return factory(component) })
      if (renderable != null && typeof renderable.render === 'function') {
        clear = scopeWith(currentScope, function() { return renderable.render(markerCtx) })
      }
      if (typeof performance !== 'undefined' && typeof devtoolsRecordRender === 'function') {
        devtoolsRecordRender(moduleId, exportName, performance.now() - start)
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
        if (currentScope) { currentScope.dispose(); currentScope = null }
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
        if (currentScope) { currentScope.dispose(); currentScope = null }
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
/**
 * Returns the brace nesting depth at a given position in the code.
 * Depth 0 means module scope.
 */
function braceDepthAt(code: string, pos: number): number {
  let depth = 0
  for (let i = 0; i < pos && i < code.length; i++) {
    if (code[i] === '{') depth++
    else if (code[i] === '}') depth--
  }
  return depth
}

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
export function transformTempoHmr(
  code: string,
  id: string,
  devtools = false
): string | null {
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
      isModuleScope: boolean
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
        isModuleScope: braceDepthAt(result, propMatch.index) === 0,
      })
    }

    // Process from end to start to preserve indices
    for (let i = propSites.length - 1; i >= 0; i--) {
      const site = propSites[i]
      let label = `; ${site.varName}.__hmr_label = '${site.varName}'`
      if (devtools) {
        label +=
          `; __devtoolsRegister(${site.varName}, '${site.varName}', '${id}')` +
          `; __devtoolsWrapSet(${site.varName}, '${id}:${site.varName}')`
      }
      result =
        result.slice(0, site.insertPos) + label + result.slice(site.insertPos)
    }

    // Collect only module-scope props for __hmr_props
    for (const site of propSites) {
      if (site.isModuleScope) {
        labeledPropNames.push(site.varName)
      }
    }
  }

  // Insert __hmr_props array before the first __hmr boundary declaration
  const propsArray = `const __hmr_props = [${labeledPropNames.join(', ')}]\n`
  const hmrDeclIndex = result.indexOf('const __hmr')
  result =
    result.slice(0, hmrDeclIndex) + propsArray + result.slice(hmrDeclIndex)

  // Add virtual module import at top
  const virtualImport = devtools
    ? `import { createHmrBoundary as __createHmrBoundary, devtoolsRegister as __devtoolsRegister, devtoolsWrapSet as __devtoolsWrapSet } from '${VIRTUAL_MODULE_ID}'\n`
    : `import { createHmrBoundary as __createHmrBoundary } from '${VIRTUAL_MODULE_ID}'\n`
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
      `(${site.localName}) => ${factoryBody}, ${site.localName}, __domRenderable, __DisposalScope, __withScope)`

    result = result.slice(0, site.start) + replacement + result.slice(site.end)
  }

  // Append dependency acceptance — only for modules that had actual call sites wrapped
  const wrappedModules = new Set<string>()
  for (const site of callSites) {
    wrappedModules.add(site.moduleSpecifier)
  }
  const acceptLines: string[] = []
  for (const modSpec of wrappedModules) {
    acceptLines.push(
      `  import.meta.hot.accept('${modSpec}', (mod) => { if (!__hmrNotify('${modSpec}', mod)) import.meta.hot.invalidate() })`
    )
  }
  result += `\nif (import.meta.hot) {\n${acceptLines.join('\n')}\n}`

  // Prepend imports
  const imports =
    `import { componentBoundary as __componentBoundary, hmrNotify as __hmrNotify } from '${VIRTUAL_MODULE_ID}'\n` +
    `import { domRenderable as __domRenderable, DisposalScope as __DisposalScope, withScope as __withScope } from '@tempots/dom'\n`
  result = imports + result

  return result
}

/**
 * Transform any file that imports prop factories to add devtools registration.
 * Runs on ALL source files (not just entry files), when devtools is enabled.
 *
 * Exported for testing.
 */
export function transformPropDevtools(code: string, id: string): string | null {
  if (!/\.[tjm]sx?$/.test(id)) return null
  if (/node_modules|\/dist\//.test(id)) return null
  // Skip if already processed by transformTempoHmr with devtools
  if (code.includes('__devtoolsRegister')) return null

  // Find prop factory imports
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
      .map((s: string) => s.trim())
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

  if (propFactoryLocalNames.length === 0) return null

  // Find prop assignments
  const escapedNames = propFactoryLocalNames.map(escapeRegex).join('|')
  const propAssignRegex = new RegExp(
    `((?:const|let|var)\\s+(\\w+)\\s*=\\s*(?:${escapedNames})\\s*\\()`,
    'g'
  )

  interface PropSite {
    varName: string
    insertPos: number
  }

  let result = code
  const propSites: PropSite[] = []
  let propMatch: RegExpExecArray | null

  while ((propMatch = propAssignRegex.exec(result)) !== null) {
    const parenStart = propMatch.index + propMatch[0].length - 1
    const parenEnd = findBalancedParen(result, parenStart)
    if (parenEnd === -1) continue
    propSites.push({ varName: propMatch[2], insertPos: parenEnd + 1 })
  }

  if (propSites.length === 0) return null

  // Insert devtools calls from end to start
  for (let i = propSites.length - 1; i >= 0; i--) {
    const site = propSites[i]
    const insert =
      `; __devtoolsRegister(${site.varName}, '${site.varName}', '${id}')` +
      `; __devtoolsWrapSet(${site.varName}, '${id}:${site.varName}')`
    result =
      result.slice(0, site.insertPos) + insert + result.slice(site.insertPos)
  }

  // Add virtual module import
  const devImport = `import { devtoolsRegister as __devtoolsRegister, devtoolsWrapSet as __devtoolsWrapSet } from '${VIRTUAL_MODULE_ID}'\n`
  result = devImport + result

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
      const entryResult = transformTempoHmr(code, id, devtools)

      // Component-level transform (PascalCase wrapping + dep acceptance)
      const componentInput = entryResult ?? code
      const componentResult = transformComponentHmr(componentInput, id)

      let result = componentResult ?? entryResult

      // Devtools prop registration (all files with prop imports)
      if (devtools) {
        const devtoolsInput = result ?? code
        const devtoolsResult = transformPropDevtools(devtoolsInput, id)
        result = devtoolsResult ?? result
      }

      return result
    },

    transformIndexHtml(html) {
      if (!devtools) return html
      const panelScript = `<script type="module">\n${DEVTOOLS_PANEL_SOURCE}\n</script>`
      return html.replace('</body>', `${panelScript}\n</body>`)
    },
  }
}
