# Unovis Demo

Tempo renderables driving Unovis charts. This demo mounts two XY charts: a noisy random-walk line and a smooth sine wave, both fully reactive via Tempo signals.

## Run

```bash
pnpm --filter unovis-demo dev
```

## What to look for
- DOM bridge renderable: `UnovisXYContainer` hosts Unovis visuals inside the DOM tree.
- Primitive renderables: `UnovisLine`, `UnovisAxis`, `UnovisTooltip` map directly to Unovis components.
- Reactivity: Dataset signals update charts and metric cards.
