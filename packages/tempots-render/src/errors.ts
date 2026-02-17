import type { ProviderMark } from '@tempots/core'

/**
 * Error thrown when a provider is not found.
 *
 * @public
 */
export class ProviderNotFoundError extends Error {
  constructor(mark: ProviderMark<unknown>) {
    super(`Provider not found: ${mark.description}`)
  }
}
