Tentative implementation for Server Side Rendering (SSR) with Tempo.

## renderSSR

It contains a single function `renderSSR` to render the content of a `Renderable` to a string.

* The `html` argument is the HTML content of the page.
* The `url` argument is the URL of the page to emulate.
* The `selector` argument is the selector of the element to render the `Renderable` to.
* The `makeApp` argument is a function that returns the `Renderable` to render.

```ts
export async function renderSSR({
  html,
  url,
  selector,
  makeApp,
}: {
  html: string
  url: string
  selector: string
  makeApp: () => Renderable
}): Promise<string>
```
