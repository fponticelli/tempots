export type Assertion = ReturnType<typeof expect>

export function expectBody() {
  return expect(document.body.innerHTML)
}

export function expectHead() {
  return expect(document.head.innerHTML)
}
