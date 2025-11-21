# @tempots/unovis

Tempo renderables for Unovis charts. This package exposes:
- DOM bridge renderables that embed Unovis containers in a Tempo DOM tree.
- Unovis renderables (new renderable brand) that map directly to Unovis primitives (e.g., Line, Axis, Tooltip) and are consumed by the bridge.

## Installation

```bash
pnpm add @tempots/unovis @tempots/dom @unovis/ts
```

## Usage

```ts
import { signal } from '@tempots/dom'
import { UnovisXYContainer, UVisLine, UVisAxis, UVisTooltip } from '@tempots/unovis'

const points = signal([
  { x: 0, y: 2 },
  { x: 1, y: 5 },
])

const chart = UnovisXYContainer(
  { data: points, config: { margin: { top: 12 } } },
  UVisLine({ config: { lineWidth: 3, x: d => d.x, y: d => d.y } }),
  UVisAxis({ role: 'x' }),
  UVisAxis({ role: 'y' }),
  UVisTooltip()
)
```

Drop `chart` into any Tempo DOM tree. Data/config are `Value`-driven (plain values or signals). Unovis renderables must be children of a bridge renderable (e.g., `UnovisXYContainer`); they are not directly inserted into DOM trees.
