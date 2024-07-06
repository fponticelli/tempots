const SEPARATOR = '.'

export interface Name {
  name: string
  ns: string[]
}

export const Name = {
  of: (name: string, ns: string[] = []): Name => ({ name, ns }),
  ofFullyQualifiedName: (name: string): Name => {
    const parts = name.split(SEPARATOR)
    if (parts.length === 0) {
      throw new Error(`Invalid name: ${name}`)
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return Name.of(parts.pop()!, parts)
  },

  toFullyQualifiedName(name: Name): string {
    return name.ns.concat(name.name).join(SEPARATOR)
  }
}
