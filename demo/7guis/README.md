# 7GUIs Demo

An implementation of the [7GUIs benchmark](https://eugenkiss.github.io/7guis/) using Tempo, showcasing various UI patterns and interactions that are common in desktop and web applications. This demo demonstrates how Tempo handles different types of user interfaces and interaction patterns.

## What This Demo Shows

The 7GUIs benchmark tests a UI framework's ability to handle:

- **Basic Interactions**: Simple user input and output
- **Bidirectional Data Flow**: Two-way data binding
- **Complex State Management**: Managing interdependent state
- **Real-time Updates**: Timer-based updates and animations
- **Data Manipulation**: CRUD operations on collections
- **Custom Drawing**: Canvas-based graphics and interactions
- **Advanced Layouts**: Spreadsheet-like interfaces

## The Seven GUIs

### 1. Counter
**Concepts**: Basic state management, event handling
- Simple increment/decrement counter
- Demonstrates reactive state with `prop()`
- Shows basic event handling with `on.click()`

### 2. Temperature Converter
**Concepts**: Bidirectional data binding, computed values
- Convert between Celsius and Fahrenheit
- Two-way synchronization between input fields
- Demonstrates computed signals and value transformation

### 3. Flight Booker
**Concepts**: Conditional logic, form validation
- Book one-way or round-trip flights
- Date validation and conditional field enabling
- Shows complex form state management

### 4. Timer
**Concepts**: Time-based updates, progress visualization
- Configurable countdown timer with progress bar
- Real-time updates using intervals
- Demonstrates animation and time-based state

### 5. CRUD (Create, Read, Update, Delete)
**Concepts**: List management, filtering, selection
- Manage a list of names with full CRUD operations
- Filter list based on search criteria
- Shows list rendering and item selection patterns

### 6. Circle Drawer
**Concepts**: Canvas drawing, undo/redo, modal dialogs
- Draw circles on a canvas with mouse interactions
- Undo/redo functionality for actions
- Modal dialog for editing circle properties

### 7. Cells (Spreadsheet)
**Concepts**: Complex data structures, formula evaluation
- Simple spreadsheet with cell references and formulas
- Dynamic formula evaluation and dependency tracking
- Advanced grid layout and cell editing

## Additional Demos

### Repeat Demo
**Concepts**: Dynamic list generation
- Demonstrates the `Repeat()` renderable
- Shows how to generate UI elements based on numeric values

### ForEach Demo
**Concepts**: Array iteration and rendering
- Demonstrates the `ForEach()` renderable
- Shows efficient list rendering patterns

## Running the Demo

### Prerequisites
- Node.js (version 16 or higher)
- pnpm (recommended) or npm

### Setup and Run
```bash
# From the project root
cd demo/7guis

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
demo/7guis/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── flex.ts         # Flexbox layout helpers
│   │   └── txt.ts          # Text styling utilities
│   ├── counter.ts          # Counter GUI implementation
│   ├── temperature.ts      # Temperature converter
│   ├── flight-booker.ts    # Flight booking form
│   ├── timer.ts           # Timer with progress bar
│   ├── crud.ts            # CRUD operations demo
│   ├── circle-drawer.ts   # Canvas drawing demo
│   ├── cells.ts           # Spreadsheet implementation
│   ├── repeat-demo.ts     # Repeat renderable demo
│   ├── foreach-demo.ts    # ForEach renderable demo
│   ├── ui.ts              # Common UI components
│   ├── main.ts            # Application entry point
│   └── index.css          # Styling
├── public/
│   └── icon-512x512.png   # App icon
├── index.html             # HTML template
├── package.json           # Dependencies and scripts
└── README.md             # This file
```

## Key Learning Points

### Navigation Pattern
```typescript
const currentDemo = prop<Demo>('Temperature')
// Switch between demos using OneOfValue
OneOfValue(currentDemo, {
  Counter: Counter,
  Temperature: Temperature,
  'Flight Booker': FlightBooker,
  // ...
})
```

### Component Organization
Each GUI is implemented as a separate module, demonstrating:
- **Separation of concerns**: Each demo focuses on specific patterns
- **Reusable components**: Common UI elements in `ui.ts`
- **Modular architecture**: Easy to understand and maintain

### Advanced Patterns
- **Canvas integration**: Direct DOM manipulation for drawing
- **Timer management**: Proper cleanup of intervals and timeouts
- **Form validation**: Complex validation logic with multiple fields
- **Data transformation**: Converting between different data formats
- **Event handling**: Mouse events, keyboard shortcuts, and form events

## Educational Value

This demo is excellent for learning:

1. **Progressive Complexity**: Start with simple counter, progress to complex spreadsheet
2. **Pattern Recognition**: See how similar problems are solved differently
3. **Best Practices**: Learn proper state management and component organization
4. **Real-world Scenarios**: Each GUI represents common application patterns
5. **Framework Capabilities**: Understand what Tempo can do in different contexts

## Comparison with Other Frameworks

The 7GUIs benchmark allows you to compare Tempo's approach with other frameworks:
- **React**: [7GUIs in React](https://github.com/eugenkiss/7guis/tree/master/React)
- **Vue**: [7GUIs in Vue](https://github.com/eugenkiss/7guis/tree/master/Vue)
- **Angular**: [7GUIs in Angular](https://github.com/eugenkiss/7guis/tree/master/Angular2)

## Next Steps

After exploring this demo:

1. **[Hacker News PWA](../hnpwa/README.md)** - See a real-world application
2. **Implement your own**: Try building one of the GUIs from scratch
3. **Extend the demos**: Add new features or improve existing ones
4. **Study the patterns**: Understand how each pattern applies to your projects

## Learn More

- [7GUIs Benchmark](https://eugenkiss.github.io/7guis/)
- [Tempo Documentation](https://tempo-ts.com/)
- [Building Components](https://tempo-ts.com/page/components.html)
- [Advanced Patterns](https://tempo-ts.com/page/examples.html)
