export async function fetchPage(path: string) {
  if (!path.endsWith('.html')) {
    path = `${path}.html`
  }
  path = `/pages/${path}`
  const res = await fetch(path)
  const text = await res.text()
  return text
}
