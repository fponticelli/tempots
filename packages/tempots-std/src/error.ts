/**
 * Represents an error that is thrown when an operation is aborted.
 */
export class AbortError extends Error {
  constructor(message: string = 'Operation aborted') {
    super(message)
    this.name = 'AbortError'
  }
}

/**
 * Represents an error that is thrown when a required implementation is missing.
 */
export class MissingImplementationError extends Error {
  constructor(message: string = 'Missing implementation') {
    super(message)
    this.name = 'MissingImplementationError'
  }
}

/**
 * Represents an error that occurs during parsing.
 */
export class ParsingError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ParsingError'
  }
}

/**
 * Represents an error that occurs when an invalid argument is passed to a function or method.
 */
export class ArgumentError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ArgumentError'
  }
}
