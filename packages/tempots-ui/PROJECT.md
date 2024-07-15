## Routing

### Router

```ts
export function Router&lt;
  T extends {
    [K in keyof T]: (
      info: K extends string
        ? Signal&lt;RouteInfo&lt;MakeParams&lt;ExtractParams&lt;K&gt;&gt;, K&gt;&gt;
        : never
    ) =&gt; TNode
  },
&gt;(routes: T): Renderable

export interface RouteInfo&lt;P, R = string&gt; {
  params: P
  route: R
  path: string
  search: Record&lt;string, string&gt;
  hash?: string
}
```

### Location

```ts
export function ProvideLocation(child: TNode): Renderable
```

```ts
export function UseLocation(fn: (location: Prop&lt;Location&gt;) =&gt; TNode): Renderable
```

### Location Utilities

```ts
export function setLocationFromUrl(prop: Prop&lt;Location&gt;, url: string): Prop&lt;Location&gt;
```

### Anchor

```ts
export function Anchor(href: Value&lt;string&gt;, ...children: TNode[]): Renderable
```
## Other Renderables

### ResultView

```ts
export function ResultView&lt;T, E&gt;(
  result: Value&lt;Result&lt;T, E&gt;&gt;,
  options:
    | {
        success: (value: Signal&lt;T&gt;) =&gt; TNode
        failure?: (error: Signal&lt;E&gt;) =&gt; TNode
      }
    | ((value: Signal&lt;T&gt;) =&gt; TNode)
): Renderable
```

### AsyncResultView

```ts
export function AsyncResultView&lt;T, E&gt;(
  result: Value&lt;AsyncResult&lt;T, E&gt;&gt;,
  options:
    | {
        success: (value: Signal&lt;T&gt;) =&gt; TNode
        failure?: (error: Signal&lt;E&gt;) =&gt; TNode
        notAsked?: () =&gt; TNode
        loading?: (previousValue: Signal&lt;T | undefined&gt;) =&gt; TNode
      }
    | ((value: Signal&lt;T&gt;) =&gt; TNode)
): Renderable
```

### PopOver

```ts
export type Placement =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'right'
  | 'right-start'
  | 'right-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'left-start'
  | 'left-end'

export interface PopOverProps {
  open: Value&lt;boolean&gt;
  content: () =&gt; TNode
  placement?: Placement
  offset?: {
    mainAxis?: number
    crossAxis?: number
  }
}

export function PopOver({
  content,
  open,
  placement,
  offset: { mainAxis, crossAxis } = { mainAxis: 0, crossAxis: 0 },
}: PopOverProps): Renderable
```

### SelectOnFocus

```ts
export function SelectOnFocus(): Renderable
```
