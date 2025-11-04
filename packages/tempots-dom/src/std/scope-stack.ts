import { DisposalScope } from './disposal-scope'

/**
 * Global scope stack for tracking active disposal scopes.
 * The last element in the array is the current scope.
 *
 * @internal
 */
export const scopeStack: DisposalScope[] = []

/**
 * Push a scope onto the stack, making it the current scope.
 *
 * @param scope - The scope to push
 * @internal
 */
export const pushScope = (scope: DisposalScope): void => {
  scopeStack.push(scope)
}

/**
 * Pop the current scope from the stack.
 *
 * @throws Error if the stack is empty
 * @internal
 */
export const popScope = (): void => {
  if (scopeStack.length === 0) {
    throw new Error('Cannot pop from empty scope stack')
  }
  scopeStack.pop()
}

/**
 * Get the current active scope.
 *
 * @returns The current scope, or null if no scope is active
 * @public
 */
export const getCurrentScope = (): DisposalScope | null => {
  return scopeStack[scopeStack.length - 1] ?? null
}

/**
 * Get the full scope stack.
 * Useful for debugging scope hierarchy.
 *
 * @advanced Most users don't need this. Use getCurrentScope() instead.
 * @returns Read-only array of active scopes
 * @public
 */
export const getScopeStack = (): readonly DisposalScope[] => {
  return scopeStack
}

/**
 * Get the parent scope of the current scope.
 *
 * @advanced Most users don't need this. Accessing parent scopes can lead to
 * unexpected behavior. Only use this for debugging or advanced use cases.
 * @returns The parent scope or null if no parent exists
 * @public
 */
export const getParentScope = (): DisposalScope | null => {
  return scopeStack[scopeStack.length - 2] ?? null
}

/**
 * Execute a function within a scope context.
 * The scope is pushed before the function executes and popped after.
 * The scope is NOT disposed - the caller is responsible for disposal.
 *
 * @param scope - The scope to use
 * @param fn - The function to execute
 * @returns The result of the function
 * @public
 */
export const withScope = <T>(scope: DisposalScope, fn: () => T): T => {
  pushScope(scope)
  try {
    return fn()
  } finally {
    popScope()
  }
}

/**
 * Execute a function in a new scope and dispose the scope immediately after.
 * Useful for one-off scoped operations.
 *
 * @param fn - The function to execute, receives the scope as parameter
 * @returns The result of the function
 * @public
 */
export const scoped = <T>(fn: (scope: DisposalScope) => T): T => {
  const scope = new DisposalScope()
  try {
    return withScope(scope, () => fn(scope))
  } finally {
    scope.dispose()
  }
}

/**
 * Execute a function without any scope tracking.
 * Signals created inside will NOT be automatically tracked.
 *
 * @param fn - The function to execute
 * @returns The result of the function
 * @public
 */
export const untracked = <T>(fn: () => T): T => {
  // Save the current stack
  const savedStack = scopeStack.slice()
  // Clear the stack
  scopeStack.length = 0
  try {
    return fn()
  } finally {
    // Restore the stack
    scopeStack.length = 0
    scopeStack.push(...savedStack)
  }
}
