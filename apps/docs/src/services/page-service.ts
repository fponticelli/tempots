export async function fetchPage(path: string) {
  console.log('fetchPage', path)
  if (!path.endsWith('.html')) {
    path = `${path}.html`
  }
  const res = await fetch(`/pages/${path}`)
  const text = await res.text()
  return text
}
