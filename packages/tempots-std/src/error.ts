export class AbortError extends Error {
  constructor(message: string = 'Operation aborted') {
    super(message)
    this.name = 'AbortError'
  }
}

export class MissingImplementationError extends Error {
  constructor(message: string = 'Missing implementation') {
    super(message)
    this.name = 'MissingImplementationError'
  }
}

export class ParsingError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ParsingError'
  }
}

export class ArgumentError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ArgumentError'
  }
}
