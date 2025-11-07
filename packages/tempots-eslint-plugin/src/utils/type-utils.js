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
 * Fallback heuristic for detecting renderables when TypeScript type information
 * is not available. Checks if the function has exactly 1 parameter named 'ctx' or 'context'.
 *
 * @param {import('eslint').Rule.Node} node - The function node
 * @returns {boolean}
 */
function fallbackHeuristicCheck(node) {
  if (node.params.length !== 1) {
    return false
  }

  const param = node.params[0]
  if (param.type !== 'Identifier') {
    return false
  }

  const name = param.name.toLowerCase()
  return name === 'ctx' || name === 'context'
}
