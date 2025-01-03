import { ProviderMark } from '../types/domain'

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
