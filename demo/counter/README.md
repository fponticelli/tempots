# Counter Demo

A simple counter application demonstrating the core concepts of Tempo: reactive state management with signals, event handling, and DOM manipulation.

## What This Demo Shows

This demo illustrates the fundamental building blocks of a Tempo application:

- **Reactive State**: Using `prop()` to create reactive state that automatically updates the UI
- **Event Handling**: Responding to user interactions with `on.click()`
- **Conditional Logic**: Disabling buttons based on state using computed signals
- **DOM Manipulation**: Creating elements with the `html` object
- **Styling**: Applying CSS classes with `attr.class()`

## Key Concepts Demonstrated

### 1. Reactive State with Signals
```typescript
const count = prop(0)  // Creates a reactive property
```
The `count` signal automatically notifies the UI when its value changes.

### 2. Computed Values
```typescript
const disabled = count.map(v => v === 0)  // Computed signal
```
The `disabled` signal is automatically recalculated whenever `count` changes.

### 3. Event Handling
```typescript
on.click(() => count.value++)  // Increment counter
on.click(() => count.value--)  // Decrement counter
```
Event handlers directly modify the reactive state.

### 4. Conditional Attributes
```typescript
attr.disabled(disabled)  // Button disabled when count is 0
```
Attributes can be bound to signals for dynamic behavior.

## Running the Demo

### Prerequisites
- Node.js (version 16 or higher)
- pnpm (recommended) or npm

### Setup and Run
```bash
# From the project root
cd demo/counter

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
```

The demo will be available at `http://localhost:5173` (or the next available port).

## Code Structure

```
demo/counter/
├── src/
│   └── main.ts          # Main application code
├── public/
│   └── icon-512x512.png # App icon
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
└── README.md           # This file
```

## Understanding the Code

The entire application is contained in `src/main.ts`:

```typescript
function App(): Renderable {
  const count = prop(0)
  const disabled = count.map(v => v === 0)
  return html.div(
    attr.class('app'),
    html.div(attr.class('count count-small'), 'count'),
    html.div(
      attr.class('count'),
      count.map(v => v.toLocaleString()),
      html.div(
        attr.class('buttons'),
        html.button(
          attr.disabled(disabled),
          on.click(() => count.value--),
          '-'
        ),
        html.button(
          on.click(() => count.value++),
          '+'
        )
      )
    )
  )
}
```

### Breakdown:
1. **State Creation**: `prop(0)` creates a reactive counter starting at 0
2. **Computed State**: `disabled` is automatically true when count equals 0
3. **UI Structure**: Nested `html.div()` calls create the DOM structure
4. **Data Binding**: `count.map(v => v.toLocaleString())` formats the display
5. **Event Binding**: Click handlers modify the counter value
6. **Conditional Logic**: Minus button is disabled when count is 0

## Next Steps

After exploring this demo, try:

1. **[TodoMVC Demo](../todomvc/README.md)** - Learn about lists, forms, and more complex state
2. **[7GUIs Demo](../7guis/README.md)** - Explore various UI patterns and interactions
3. **[Hacker News PWA](../hnpwa/README.md)** - See a real-world application with routing and API calls

## Learn More

- [Tempo Documentation](https://tempo-ts.com/)
- [Signals Guide](https://tempo-ts.com/page/signals.html)
- [Building Components](https://tempo-ts.com/page/components.html)
- [Quick Start Guide](https://tempo-ts.com/page/quick-start.html)
