export async function sleep(ms: number = 10): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
