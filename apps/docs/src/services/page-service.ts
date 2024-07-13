export async function fetchPage(path: string) {
  if (!path.endsWith('.html')) {
    path = `${path}.html`
  }
  console.log('fetching page', path)
  const res = await fetch(`/pages/${path}`)
  return res.text()
}
