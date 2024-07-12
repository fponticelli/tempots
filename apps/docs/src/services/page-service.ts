export async function fetchPage(path: string) {
  const res = await fetch(`/public/pages/${path}`)
  return res.text()
}
