export async function fetchPage(path: string) {
  const res = await fetch(`./pages/${path}`)
  return res.text()
}
