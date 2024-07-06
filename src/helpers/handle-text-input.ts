export const handleTextInput =
  (f: (input: string) => void) => (e: Event) => {
    const input = e.target as HTMLInputElement | null
    f(input?.value ?? '')
  }
