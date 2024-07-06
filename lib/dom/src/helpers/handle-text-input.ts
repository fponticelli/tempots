export const handleTextInput =
  (callback: (input: string) => void) => (e: Event) => {
    const input = e.target as HTMLInputElement | null
    callback(input?.value ?? '')
  }
