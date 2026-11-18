let rollbacks: Array<() => void> | undefined

/** @internal */
export function getRenderRollbacks(): Array<() => void> | undefined {
  return rollbacks
}

/** @internal */
export function withRenderRollback<T>(render: () => T): T {
  const previous = rollbacks
  const actions: Array<() => void> = []
  rollbacks = actions
  try {
    return render()
  } catch (error) {
    // Cleanup itself can run user code. It belongs to neither render attempt.
    rollbacks = undefined
    for (let i = actions.length - 1; i >= 0; i--) {
      try {
        actions[i]()
      } catch (cleanupError) {
        console.error('Error during render rollback:', cleanupError)
      }
    }
    throw error
  } finally {
    rollbacks = previous
  }
}
