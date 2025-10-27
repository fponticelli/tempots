/**
 * ESLint rule to detect signals created within renderables that aren't properly disposed.
 *
 * This rule helps prevent memory leaks by ensuring that signals created within components
 * are properly disposed when the component is unmounted.
 *
 * @type {import('eslint').Rule.RuleModule}
 */

const SIGNAL_CREATION_METHODS = new Set([
  'prop',
  'signal',
  'computed',
  'computedOf',
])

const SIGNAL_TRANSFORM_METHODS = new Set([
  'map',
  'filter',
  'flatMap',
  'filterMap',
  'scan',
  'debounce',
  'throttle',
  'distinct',
  'distinctUntilChanged',
  'take',
  'takeWhile',
  'skip',
  'skipWhile',
  'deriveProp',
])

const RENDERABLE_CREATORS = new Set([
  'Fragment',
  'Portal',
  'When',
  'NotEmpty',
  'Ensure',
  'ForEach',
  'Repeat',
  'OneOf',
  'OneOfValue',
  'WithCtx',
  'DOMNode',
  'Empty',
])

export default {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Require proper disposal of signals created within renderables',
      category: 'Best Practices',
      recommended: true,
    },
    messages: {
      undisposedSignal:
        'Signal "{{name}}" created via {{method}} should be disposed with OnDispose({{name}}.dispose)',
      undisposedTransform:
        'Signal transformation "{{name}}" created via .{{method}}() should be disposed with OnDispose({{name}}.dispose)',
    },
    schema: [
      {
        type: 'object',
        properties: {
          checkTransforms: {
            type: 'boolean',
            default: true,
          },
          checkCreations: {
            type: 'boolean',
            default: true,
          },
        },
        additionalProperties: false,
      },
    ],
  },

  create(context) {
    const options = context.options[0] || {}
    const checkTransforms = options.checkTransforms !== false
    const checkCreations = options.checkCreations !== false

    // Track signals created in the current scope
    const scopeStack = []

    function getCurrentScope() {
      return scopeStack[scopeStack.length - 1]
    }

    function hasRenderableReturnType(node) {
      // Check for TypeScript return type annotation: `: Renderable`
      if (node.returnType && node.returnType.typeAnnotation) {
        const typeAnnotation = node.returnType.typeAnnotation
        if (
          typeAnnotation.type === 'TSTypeReference' &&
          typeAnnotation.typeName.type === 'Identifier' &&
          typeAnnotation.typeName.name === 'Renderable'
        ) {
          return true
        }
      }
      return false
    }

    function returnsRenderableCreator(node) {
      // Check if the function body returns a call to a known renderable creator
      let body = node.body

      // For arrow functions with implicit return
      if (
        node.type === 'ArrowFunctionExpression' &&
        body.type !== 'BlockStatement'
      ) {
        return isRenderableCreatorCall(body)
      }

      // For functions with block statement body
      if (body.type === 'BlockStatement') {
        // Look for return statements
        for (const stmt of body.body) {
          if (stmt.type === 'ReturnStatement' && stmt.argument) {
            if (isRenderableCreatorCall(stmt.argument)) {
              return true
            }
          }
        }
      }

      return false
    }

    function isRenderableCreatorCall(node) {
      if (!node) return false

      // Direct call: Fragment(...), Portal(...), etc.
      if (node.type === 'CallExpression') {
        const callee = node.callee

        // Direct identifier: Fragment(...)
        if (
          callee.type === 'Identifier' &&
          RENDERABLE_CREATORS.has(callee.name)
        ) {
          return true
        }

        // Member expression: html.div(...), svg.circle(...), etc.
        if (
          callee.type === 'MemberExpression' &&
          callee.object.type === 'Identifier' &&
          (callee.object.name === 'html' || callee.object.name === 'svg')
        ) {
          return true
        }
      }

      return false
    }

    function isRenderableFunction(node) {
      // Pattern 1: Low-level renderable with ctx parameter
      // (ctx: DOMContext) => (removeTree: boolean) => void
      if (
        (node.type === 'ArrowFunctionExpression' ||
          node.type === 'FunctionExpression') &&
        node.params.length === 1
      ) {
        const param = node.params[0]
        if (param.type === 'Identifier' && param.name === 'ctx') {
          return true
        }
      }

      // Pattern 2: High-level component with Renderable return type
      // function MyComponent(): Renderable { ... }
      if (hasRenderableReturnType(node)) {
        return true
      }

      // Pattern 3: Function that returns a renderable creator
      // function MyComponent() { return html.div(...) }
      if (returnsRenderableCreator(node)) {
        return true
      }

      return false
    }

    function isOnDisposeCall(node, signalName) {
      // Check for OnDispose(signalName.dispose), OnDispose(signalName), or OnDispose(() => signalName.dispose())
      if (node.type !== 'CallExpression') return false
      if (node.callee.type !== 'Identifier' || node.callee.name !== 'OnDispose')
        return false

      for (const arg of node.arguments) {
        // Direct: OnDispose(signal.dispose)
        if (
          arg.type === 'MemberExpression' &&
          arg.object.type === 'Identifier' &&
          arg.object.name === signalName &&
          arg.property.name === 'dispose'
        ) {
          return true
        }

        // Direct signal: OnDispose(signal)
        if (arg.type === 'Identifier' && arg.name === signalName) {
          return true
        }

        // Arrow function: OnDispose(() => signal.dispose())
        if (
          (arg.type === 'ArrowFunctionExpression' ||
            arg.type === 'FunctionExpression') &&
          arg.body.type === 'CallExpression' &&
          arg.body.callee.type === 'MemberExpression' &&
          arg.body.callee.object.type === 'Identifier' &&
          arg.body.callee.object.name === signalName &&
          arg.body.callee.property.name === 'dispose'
        ) {
          return true
        }

        // Block statement: OnDispose(() => { signal.dispose() })
        if (
          (arg.type === 'ArrowFunctionExpression' ||
            arg.type === 'FunctionExpression') &&
          arg.body.type === 'BlockStatement'
        ) {
          for (const stmt of arg.body.body) {
            if (
              stmt.type === 'ExpressionStatement' &&
              stmt.expression.type === 'CallExpression' &&
              stmt.expression.callee.type === 'MemberExpression' &&
              stmt.expression.callee.object.type === 'Identifier' &&
              stmt.expression.callee.object.name === signalName &&
              stmt.expression.callee.property.name === 'dispose'
            ) {
              return true
            }
          }
        }
      }

      return false
    }

    function checkForDisposal(scope, signalName, node) {
      // Look for OnDispose calls in the same scope
      const parent = node.parent
      let current = parent

      // Search up the tree for OnDispose calls
      while (current && current !== scope.node) {
        if (
          current.type === 'CallExpression' &&
          isOnDisposeCall(current, signalName)
        ) {
          return true
        }

        // Check siblings in block statements
        if (current.type === 'BlockStatement' || current.type === 'Program') {
          for (const stmt of current.body || []) {
            if (
              stmt.type === 'ExpressionStatement' &&
              isOnDisposeCall(stmt.expression, signalName)
            ) {
              return true
            }
            // Check in return statements (Fragment, etc.)
            if (stmt.type === 'ReturnStatement' && stmt.argument) {
              if (containsOnDispose(stmt.argument, signalName)) {
                return true
              }
            }
          }
        }

        current = current.parent
      }

      return false
    }

    function containsOnDispose(node, signalName) {
      if (!node) return false

      if (isOnDisposeCall(node, signalName)) {
        return true
      }

      // Check in call expression arguments (like Fragment, html.div, etc.)
      if (node.type === 'CallExpression') {
        for (const arg of node.arguments) {
          if (containsOnDispose(arg, signalName)) {
            return true
          }
        }
      }

      // Check in array expressions
      if (node.type === 'ArrayExpression') {
        for (const element of node.elements) {
          if (containsOnDispose(element, signalName)) {
            return true
          }
        }
      }

      // Check in conditional expressions (ternary operator)
      // This handles cases like: Signal.is(signal) ? OnDispose(signal) : null
      if (node.type === 'ConditionalExpression') {
        if (
          containsOnDispose(node.consequent, signalName) ||
          containsOnDispose(node.alternate, signalName)
        ) {
          return true
        }
      }

      // Check inside arrow functions and function expressions
      // This handles cases like: NotEmpty(signal, value => html.div(OnDispose(...), ...))
      if (
        node.type === 'ArrowFunctionExpression' ||
        node.type === 'FunctionExpression'
      ) {
        const body = node.body
        // For implicit return (arrow function without braces)
        if (body.type !== 'BlockStatement') {
          if (containsOnDispose(body, signalName)) {
            return true
          }
        } else {
          // For block statement body
          for (const stmt of body.body) {
            if (stmt.type === 'ReturnStatement' && stmt.argument) {
              if (containsOnDispose(stmt.argument, signalName)) {
                return true
              }
            }
            // Also check expression statements in case OnDispose is called directly
            if (
              stmt.type === 'ExpressionStatement' &&
              containsOnDispose(stmt.expression, signalName)
            ) {
              return true
            }
          }
        }
      }

      return false
    }

    function findDisposedSignals(node, disposedSignals) {
      // Recursively search for OnDispose calls and extract signal names
      if (!node) return

      if (node.type === 'CallExpression') {
        // Check if this is an OnDispose call
        if (
          node.callee.type === 'Identifier' &&
          node.callee.name === 'OnDispose'
        ) {
          // Check each argument to OnDispose
          for (const arg of node.arguments) {
            // OnDispose(signal) - direct signal reference
            if (arg.type === 'Identifier') {
              disposedSignals.add(arg.name)
            }
            // OnDispose(signal.dispose) - signal with .dispose
            else if (
              arg.type === 'MemberExpression' &&
              arg.object.type === 'Identifier' &&
              arg.property.name === 'dispose'
            ) {
              disposedSignals.add(arg.object.name)
            }
            // OnDispose(() => signal.dispose()) - arrow function
            else if (
              (arg.type === 'ArrowFunctionExpression' ||
                arg.type === 'FunctionExpression') &&
              arg.body.type === 'CallExpression' &&
              arg.body.callee.type === 'MemberExpression' &&
              arg.body.callee.object.type === 'Identifier' &&
              arg.body.callee.property.name === 'dispose'
            ) {
              disposedSignals.add(arg.body.callee.object.name)
            }
            // OnDispose(() => { signal.dispose() }) - block statement
            else if (
              (arg.type === 'ArrowFunctionExpression' ||
                arg.type === 'FunctionExpression') &&
              arg.body.type === 'BlockStatement'
            ) {
              for (const stmt of arg.body.body) {
                if (
                  stmt.type === 'ExpressionStatement' &&
                  stmt.expression.type === 'CallExpression' &&
                  stmt.expression.callee.type === 'MemberExpression' &&
                  stmt.expression.callee.object.type === 'Identifier' &&
                  stmt.expression.callee.property.name === 'dispose'
                ) {
                  disposedSignals.add(stmt.expression.callee.object.name)
                }
              }
            }
          }
        }

        // Recursively check arguments
        for (const arg of node.arguments) {
          findDisposedSignals(arg, disposedSignals)
        }
      }

      // Recursively check array elements
      if (node.type === 'ArrayExpression') {
        for (const element of node.elements) {
          findDisposedSignals(element, disposedSignals)
        }
      }

      // Recursively check arrow function and function expression bodies
      if (
        node.type === 'ArrowFunctionExpression' ||
        node.type === 'FunctionExpression'
      ) {
        if (node.body.type !== 'BlockStatement') {
          findDisposedSignals(node.body, disposedSignals)
        } else {
          for (const stmt of node.body.body) {
            if (stmt.type === 'ReturnStatement' && stmt.argument) {
              findDisposedSignals(stmt.argument, disposedSignals)
            }
            if (stmt.type === 'ExpressionStatement') {
              findDisposedSignals(stmt.expression, disposedSignals)
            }
          }
        }
      }

      // Check block statements and return statements
      if (node.type === 'BlockStatement') {
        for (const stmt of node.body) {
          if (stmt.type === 'ReturnStatement' && stmt.argument) {
            findDisposedSignals(stmt.argument, disposedSignals)
          }
          if (stmt.type === 'ExpressionStatement') {
            findDisposedSignals(stmt.expression, disposedSignals)
          }
        }
      }

      if (node.type === 'ReturnStatement' && node.argument) {
        findDisposedSignals(node.argument, disposedSignals)
      }
    }

    /**
     * Check if a signal is disposed in the given scope or any parent scope.
     * This function scans parent scopes for disposed signals on-demand.
     */
    function isSignalDisposed(signalName, currentScope) {
      // Check current scope first
      if (currentScope.disposedSignals.has(signalName)) {
        return true
      }

      // Check all parent scopes from current to root
      // We need to scan each parent scope for disposed signals because
      // parent scopes haven't been scanned yet (they're scanned on exit)
      for (let i = scopeStack.length - 1; i >= 0; i--) {
        const parentScope = scopeStack[i]

        // If this parent scope hasn't been scanned yet, scan it now
        if (parentScope.disposedSignals.size === 0 && parentScope.node.body) {
          findDisposedSignals(
            parentScope.node.body,
            parentScope.disposedSignals
          )
        }

        if (parentScope.disposedSignals.has(signalName)) {
          return true
        }
      }
      return false
    }

    /**
     * Find signal info in the given scope or any parent scope.
     */
    function findSignalInfo(signalName, currentScope) {
      // Check current scope first
      const currentSignalInfo = currentScope.signals.get(signalName)
      if (currentSignalInfo) {
        return currentSignalInfo
      }

      // Check all parent scopes from current to root
      for (let i = scopeStack.length - 1; i >= 0; i--) {
        const signalInfo = scopeStack[i].signals.get(signalName)
        if (signalInfo) {
          return signalInfo
        }
      }
      return null
    }

    /**
     * Check if a signal or any of its ancestors is disposed or is a function parameter.
     * This handles transitive disposal chains like: accounts -> count -> deleteDisabled
     * Also handles signals disposed in parent scopes.
     */
    function isSignalOrAncestorDisposed(signalName, scope) {
      // Check if the signal itself is disposed (in current or parent scopes)
      if (isSignalDisposed(signalName, scope)) {
        return true
      }

      // Check if the signal is a function parameter (only in current scope)
      if (scope.parameters.has(signalName)) {
        return true
      }

      // Look up the signal's info to find its parent (check current and all parent scopes)
      const signalInfo = findSignalInfo(signalName, scope)
      if (!signalInfo) {
        return false
      }

      // If it has a single parent signal, recursively check the parent
      if (signalInfo.parentSignal) {
        return isSignalOrAncestorDisposed(signalInfo.parentSignal, scope)
      }

      // If it has multiple parent signals (computed/computedOf), check if ALL are disposed
      if (signalInfo.parentSignals && signalInfo.parentSignals.length > 0) {
        return signalInfo.parentSignals.every(parent =>
          isSignalOrAncestorDisposed(parent, scope)
        )
      }

      return false
    }

    return {
      // Track function scopes
      'ArrowFunctionExpression, FunctionExpression, FunctionDeclaration'(node) {
        if (isRenderableFunction(node)) {
          // Track function parameters as managed signals
          const parameters = new Set()
          if (node.params) {
            for (const param of node.params) {
              if (param.type === 'Identifier') {
                parameters.add(param.name)
              }
            }
          }

          scopeStack.push({
            node,
            signals: new Map(),
            disposedSignals: new Set(),
            parameters,
          })
        }
      },

      'ArrowFunctionExpression, FunctionExpression, FunctionDeclaration:exit'(
        node
      ) {
        if (isRenderableFunction(node)) {
          const scope = scopeStack.pop()

          // First, scan the entire function body to find all disposed signals
          findDisposedSignals(node.body, scope.disposedSignals)

          // Check all signals in this scope for disposal
          for (const [name, info] of scope.signals) {
            // Skip if this signal or any of its ancestors is disposed or is a parameter
            if (isSignalOrAncestorDisposed(name, scope)) {
              continue
            }

            if (!checkForDisposal(scope, name, info.node)) {
              context.report({
                node: info.node,
                messageId: info.isTransform
                  ? 'undisposedTransform'
                  : 'undisposedSignal',
                data: {
                  name,
                  method: info.method,
                },
              })
            }
          }
        }
      },

      // Track signal creations
      VariableDeclarator(node) {
        if (!getCurrentScope()) return
        if (!checkCreations && !checkTransforms) return

        const scope = getCurrentScope()

        if (node.init && node.init.type === 'CallExpression') {
          const callee = node.init.callee

          // Check for direct signal creation: const x = prop(...) or computed(...)
          if (
            checkCreations &&
            callee.type === 'Identifier' &&
            SIGNAL_CREATION_METHODS.has(callee.name)
          ) {
            if (node.id.type === 'Identifier') {
              // For computed, extract dependencies from second argument
              let parentSignals = null
              if (
                callee.name === 'computed' &&
                node.init.arguments.length >= 2
              ) {
                const depsArg = node.init.arguments[1]
                if (depsArg.type === 'ArrayExpression') {
                  parentSignals = depsArg.elements
                    .filter(el => el && el.type === 'Identifier')
                    .map(el => el.name)
                }
              }

              scope.signals.set(node.id.name, {
                node: node.init,
                method: callee.name,
                isTransform: false,
                parentSignal: null,
                parentSignals,
              })
            }
          }

          // Check for signal transformations: const x = signal.map(...)
          if (
            checkTransforms &&
            callee.type === 'MemberExpression' &&
            callee.property.type === 'Identifier' &&
            SIGNAL_TRANSFORM_METHODS.has(callee.property.name) &&
            callee.object.type === 'Identifier' // Only track if parent is an identifier
          ) {
            if (node.id.type === 'Identifier') {
              // Extract parent signal name
              const parentSignal = callee.object.name

              scope.signals.set(node.id.name, {
                node: node.init,
                method: callee.property.name,
                isTransform: true,
                parentSignal,
                parentSignals: null,
              })
            }
          }

          // Check for computedOf: const x = computedOf(a, b)((a, b) => ...)
          if (
            checkCreations &&
            callee.type === 'CallExpression' &&
            callee.callee.type === 'Identifier' &&
            callee.callee.name === 'computedOf'
          ) {
            if (node.id.type === 'Identifier') {
              // Extract parent signals from computedOf arguments
              const parentSignals = callee.arguments
                .filter(arg => arg.type === 'Identifier')
                .map(arg => arg.name)

              scope.signals.set(node.id.name, {
                node: node.init,
                method: 'computedOf',
                isTransform: false,
                parentSignal: null,
                parentSignals: parentSignals.length > 0 ? parentSignals : null,
              })
            }
          }
        }
      },
    }
  },
}
