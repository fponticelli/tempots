export function stripImportTypes(s: string): string {
  return s.replace(/import\("((?!").)*"\)./g, '')
}
