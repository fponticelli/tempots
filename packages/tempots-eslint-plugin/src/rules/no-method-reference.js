/**
 * ESLint rule to detect Tempo class methods passed by reference instead of
 * being called via dot notation. Since Tempo classes use prototype methods
 * (not arrow function fields), extracting a method loses the `this` binding.
 *
 * @example
 * ```js
 * // BAD — method extracted without calling, loses `this`
 * signal.onDispose(other.dispose)
 * signal.on(prop.set)
 * signal.onChange(ctx.setText)
 *
 * // GOOD — wrapped in lambda, preserves `this`
 * signal.onDispose(() => other.dispose())
 * signal.on(v => prop.set(v))
 * signal.onChange(v => ctx.setText(v))
 * ```
 *
 * @type {import('eslint').Rule.RuleModule}
 */

// Methods that should never be passed by reference
const KNOWN_METHODS = new Set([
  // Signal / Computed / Prop
  'dispose',
  'get',
  'set',
  'update',
  'on',
  'onChange',
  'map',
  'flatMap',
  'tap',
  'at',
  'filter',
  'filterMap',
  'mapAsync',
  'mapAsyncGenerator',
  'mapMaybe',
  'feedProp',
  'deriveProp',
  'derive',
  'count',
  'setDerivative',
  'setDirty',
  'scheduleIfDirty',
  'reducer',
  'iso',
  'atProp',
  'isDisposed',
  'hasListeners',
  'onDispose',
  // DOMContext / BrowserContext / HeadlessContext
  'setText',
  'getText',
  'clear',
  'makeRef',
  'makeMarker',
  'makeChildElement',
  'makeChildText',
  'createElement',
  'createText',
  'appendOrInsert',
  'withElement',
  'withReference',
  'makePortal',
  'setProvider',
  'getProvider',
  'addClasses',
  'removeClasses',
  'getClasses',
  'setStyle',
  'getStyle',
  'makeAccessors',
  'getWindow',
  'moveRangeBefore',
  'removeRange',
  'isBrowser',
  'isHeadless',
  'isBrowserDOM',
  'isHeadlessDOM',
  // KeyedPosition / ElementPosition
  'setIndex',
])

export default {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Disallow passing Tempo class methods by reference (loses `this` binding)',
      category: 'Possible Errors',
      recommended: true,
    },
    messages: {
      noMethodReference:
        'Do not pass `{{object}}.{{method}}` by reference — wrap in a lambda to preserve `this` binding. Use `() => {{object}}.{{method}}(...)` instead.',
    },
    schema: [],
  },

  create(context) {
    /**
     * Check if a node is a MemberExpression referencing a known method
     * that is NOT being called (i.e., used as a value, not as `obj.method()`).
     */
    function checkArgument(node) {
      if (
        node.type === 'MemberExpression' &&
        !node.computed &&
        node.property.type === 'Identifier' &&
        KNOWN_METHODS.has(node.property.name)
      ) {
        // Check that the parent is NOT a CallExpression with this node as callee
        // (i.e., `obj.method()` is fine, `fn(obj.method)` is not)
        const parent = node.parent
        if (parent.type === 'CallExpression' && parent.callee === node) {
          // This is obj.method() — fine
          return
        }

        const objectText =
          node.object.type === 'Identifier'
            ? node.object.name
            : context.sourceCode.getText(node.object)

        context.report({
          node,
          messageId: 'noMethodReference',
          data: {
            object: objectText,
            method: node.property.name,
          },
        })
      }
    }

    return {
      // Check arguments of function calls: fn(obj.method)
      'CallExpression > MemberExpression'(node) {
        // Only flag if this member expression is an argument, not the callee
        const parent = node.parent
        if (parent.type === 'CallExpression' && parent.callee !== node) {
          checkArgument(node)
        }
      },

      // Check variable assignments: const x = obj.method
      'VariableDeclarator > MemberExpression'(node) {
        checkArgument(node)
      },

      // Check assignments: x = obj.method
      'AssignmentExpression > MemberExpression'(node) {
        const parent = node.parent
        if (parent.right === node) {
          checkArgument(node)
        }
      },

      // Check array elements: [obj.method, ...]
      'ArrayExpression > MemberExpression'(node) {
        checkArgument(node)
      },

      // Check object property values: { key: obj.method }
      'Property > MemberExpression'(node) {
        const parent = node.parent
        if (parent.value === node) {
          checkArgument(node)
        }
      },

      // Check return statements: return obj.method
      'ReturnStatement > MemberExpression'(node) {
        checkArgument(node)
      },
    }
  },
}
