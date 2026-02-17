/**
 * Utility functions for TypeScript type checking in ESLint rules.
 *
 * These utilities help identify TempoTS renderables by checking TypeScript types
 * rather than relying on naming conventions.
 */

/**
 * Get the TypeScript type checker from the ESLint context.
 * Returns null if TypeScript type information is not available.
 *
 * @param {import('eslint').Rule.RuleContext} context - The ESLint rule context
 * @returns {import('typescript').TypeChecker | null}
 */
const SIGNAL_TYPE_NAMES = new Set(['Signal', 'Computed', 'Prop'])

/**
 * Check if a TypeScript type is a Signal, Computed, or Prop.
 * Returns false for any/unknown types.
 *
 * @param {import('typescript').Type} type - The TypeScript type to check
 * @returns {boolean}
 */
export function isSignalType(type) {
  if (!type) return false

  const flags = type.flags ?? 0
  // Skip any (1) or unknown (2)
  if ((flags & 1) === 1 || (flags & 2) === 2) return false

  const symbol = type.getSymbol?.() ?? type.symbol ?? type.aliasSymbol
  const name = symbol?.getName?.()
  if (name && SIGNAL_TYPE_NAMES.has(name)) return true

  const aliasName = type.aliasSymbol?.getName?.()
  if (aliasName && SIGNAL_TYPE_NAMES.has(aliasName)) return true

  if (type.isUnion?.()) {
    return type.types.some(t => isSignalType(t))
  }

  return false
}

export function getTypeChecker(context) {
  const parserServices =
    context.sourceCode?.parserServices ?? context.parserServices

  if (!parserServices || !parserServices.program) {
    return null
  }

  return parserServices.program.getTypeChecker()
}

/**
 * Check if a TypeScript type name matches one of the expected names.
 * Handles both direct type names and generic types.
 *
 * @param {import('typescript').Type} type - The TypeScript type to check
 * @param {string[]} expectedNames - Array of expected type names
 * @returns {boolean}
 */
function typeNameMatches(type, expectedNames) {
  const symbol = type.getSymbol?.() ?? type.symbol
  if (!symbol) return false

  const typeName = symbol.getName()
  return expectedNames.includes(typeName)
}

/**
 * Check if a type is DOMContext or one of its subtypes (BrowserContext, HeadlessContext).
 *
 * @param {import('typescript').Type} type - The TypeScript type to check
 * @param {import('typescript').TypeChecker} checker - The TypeScript type checker
 * @returns {boolean}
 */
function isDOMContextType(type, checker) {
  // Check direct type name
  if (
    typeNameMatches(type, ['DOMContext', 'BrowserContext', 'HeadlessContext'])
  ) {
    return true
  }

  // Check base types (for interfaces/classes that extend DOMContext)
  const baseTypes = type.getBaseTypes?.() ?? []
  for (const baseType of baseTypes) {
    if (isDOMContextType(baseType, checker)) {
      return true
    }
  }

  return false
}

/**
 * Check if a type is Clear: (removeTree: boolean) => void
 *
 * @param {import('typescript').Type} type - The TypeScript type to check
 * @param {import('typescript').TypeChecker} checker - The TypeScript type checker
 * @returns {boolean}
 */
function isClearType(type, checker) {
  // Check if it's a function type
  const signatures = type.getCallSignatures()
  if (signatures.length === 0) return false

  const signature = signatures[0]
  const parameters = signature.getParameters()

  // Should have exactly 1 parameter
  if (parameters.length !== 1) return false

  // Parameter should be boolean (removeTree)
  const paramType = checker.getTypeOfSymbolAtLocation(
    parameters[0],
    parameters[0].valueDeclaration
  )

  // Check if parameter is boolean
  if (!(paramType.flags & 136)) {
    // 136 = BooleanLiteral | Boolean
    return false
  }

  // Return type should be void
  const returnType = signature.getReturnType()
  return !!(returnType.flags & 16384) // 16384 = Void
}

/**
 * Check if a type is TNode or Renderable.
 *
 * @param {import('typescript').Type} type - The TypeScript type to check
 * @param {import('typescript').TypeChecker} checker - The TypeScript type checker
 * @returns {boolean}
 */
function isTNodeOrRenderableType(type, checker) {
  // Check for TNode or Renderable type name
  if (typeNameMatches(type, ['TNode', 'Renderable'])) {
    return true
  }

  // Check if it's a union type that includes Renderable
  if (type.isUnion?.()) {
    return type.types.some(t => isTNodeOrRenderableType(t, checker))
  }

  // Check if it's a function that returns Clear (Renderable signature)
  const signatures = type.getCallSignatures()
  if (signatures.length > 0) {
    const signature = signatures[0]
    const returnType = signature.getReturnType()

    // Check if return type is Clear
    if (isClearType(returnType, checker)) {
      return true
    }

    // Check if return type is TNode (which can include Renderable)
    if (typeNameMatches(returnType, ['TNode', 'Renderable', 'Clear'])) {
      return true
    }
  }

  return false
}

/**
 * Check if a function node is a TempoTS renderable.
 *
 * A renderable is identified by:
 * 1. Having exactly 1 parameter of type DOMContext (or its subtypes) AND returning Clear
 * 2. OR returning TNode or Renderable (regardless of parameters)
 *
 * Falls back to heuristic (parameter named 'ctx' or 'context') if TypeScript
 * type information is not available.
 *
 * @param {import('eslint').Rule.Node} node - The function node to check
 * @param {import('eslint').Rule.RuleContext} context - The ESLint rule context
 * @returns {boolean}
 */
export function isRenderable(node, context) {
  // Try type-aware detection first
  const checker = getTypeChecker(context)
  if (checker) {
    const parserServices =
      context.sourceCode?.parserServices ?? context.parserServices

    try {
      // Get the function's return type
      const fnTsNode = parserServices.esTreeNodeToTSNodeMap.get(node)
      if (fnTsNode) {
        const signature = checker.getSignatureFromDeclaration(fnTsNode)
        if (signature) {
          const returnType = signature.getReturnType()

          // Check if it returns TNode or Renderable (component without context)
          if (isTNodeOrRenderableType(returnType, checker)) {
            return true
          }

          // Check if it returns Clear AND has DOMContext parameter (component with context)
          if (isClearType(returnType, checker)) {
            if (node.params.length === 1) {
              const param = node.params[0]
              if (param.type === 'Identifier') {
                const tsNode = parserServices.esTreeNodeToTSNodeMap.get(param)
                if (tsNode) {
                  const paramType = checker.getTypeAtLocation(tsNode)
                  if (isDOMContextType(paramType, checker)) {
                    return true
                  }
                }
              }
            }
          }
        }
      }
    } catch {
      // If type checking fails, fall back to heuristic
      return fallbackHeuristicCheck(node)
    }
  }

  // Fall back to heuristic if no type information
  return fallbackHeuristicCheck(node)
}

/**
 * Check if a node looks like a renderable return value based on common patterns.
 *
 * @param {import('eslint').Rule.Node} node - The node to check
 * @returns {boolean}
 */
function looksLikeRenderableReturn(node) {
  if (!node) return false

  // Check for html.*, attr.*, on.*, etc. (common Tempo helpers)
  if (
    node.type === 'CallExpression' &&
    node.callee.type === 'MemberExpression' &&
    node.callee.object.type === 'Identifier'
  ) {
    const objectName = node.callee.object.name
    const renderableHelpers = ['html', 'attr', 'on', 'svg', 'math', 'style']
    if (renderableHelpers.includes(objectName)) {
      return true
    }
  }

  // Check for capitalized function calls (component convention)
  // e.g., Fragment(), When(), Portal(), MyComponent()
  // But exclude OnDispose and other disposal-related functions
  if (node.type === 'CallExpression' && node.callee.type === 'Identifier') {
    const name = node.callee.name
    // Exclude disposal-related functions
    const excludedFunctions = ['OnDispose', 'OnMount', 'OnUnmount']
    if (excludedFunctions.includes(name)) {
      return false
    }
    // Check if first character is uppercase
    if (name.length > 0 && name[0] === name[0].toUpperCase()) {
      return true
    }
  }

  return false
}

/**
 * Find all return statements in a function body.
 *
 * @param {import('eslint').Rule.Node} body - The function body
 * @returns {import('eslint').Rule.Node[]}
 */
function findReturnStatements(body) {
  const returns = []
  const visited = new Set()

  // Properties to skip when traversing (to avoid circular references and non-AST data)
  const skipProps = new Set([
    'parent',
    'loc',
    'range',
    'start',
    'end',
    'comments',
    'tokens',
    'leadingComments',
    'trailingComments',
  ])

  function visit(node) {
    if (!node || typeof node !== 'object') return
    if (!node.type) return // Not an AST node

    // Avoid infinite loops
    if (visited.has(node)) return
    visited.add(node)

    if (node.type === 'ReturnStatement') {
      returns.push(node)
      return // Don't traverse into nested functions
    }

    // Don't traverse into nested functions
    if (
      node.type === 'FunctionDeclaration' ||
      node.type === 'FunctionExpression' ||
      node.type === 'ArrowFunctionExpression'
    ) {
      return
    }

    // Traverse child nodes
    for (const key in node) {
      if (skipProps.has(key)) continue

      const child = node[key]
      if (Array.isArray(child)) {
        child.forEach(visit)
      } else if (child && typeof child === 'object') {
        visit(child)
      }
    }
  }

  visit(body)
  return returns
}

/**
 * Fallback heuristic for detecting renderables when TypeScript type information
 * is not available. Checks multiple patterns:
 * 1. Function has exactly 1 parameter named 'ctx' or 'context'
 * 2. Function returns html.*, attr.*, or other common renderable patterns
 * 3. Function returns a capitalized function call (component convention)
 *
 * @param {import('eslint').Rule.Node} node - The function node
 * @returns {boolean}
 */
function fallbackHeuristicCheck(node) {
  // Pattern 1: Check for ctx/context parameter
  if (node.params.length === 1) {
    const param = node.params[0]
    if (param.type === 'Identifier') {
      const name = param.name.toLowerCase()
      if (name === 'ctx' || name === 'context') {
        return true
      }
    }
  }

  // Pattern 2 & 3: Check return value patterns
  // For arrow functions with expression body
  if (
    node.type === 'ArrowFunctionExpression' &&
    node.body.type !== 'BlockStatement'
  ) {
    if (looksLikeRenderableReturn(node.body)) {
      return true
    }
  }

  // For functions with block statement body
  if (node.body && node.body.type === 'BlockStatement') {
    const returnStatements = findReturnStatements(node.body)
    for (const returnStmt of returnStatements) {
      if (looksLikeRenderableReturn(returnStmt.argument)) {
        return true
      }
    }
  }

  return false
}
