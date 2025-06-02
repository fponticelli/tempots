# TodoMVC Demo

A complete implementation of the [TodoMVC](http://todomvc.com) specification using Tempo, demonstrating advanced patterns for building real-world applications with complex state management, forms, and user interactions.

## What This Demo Shows

This demo showcases advanced Tempo concepts and patterns:

- **Complex State Management**: Using reducers and actions for predictable state updates
- **Local Storage Integration**: Persisting state with `localStorageProp()`
- **List Rendering**: Dynamic lists with `ForEach()` and item management
- **Form Handling**: Input validation, keyboard shortcuts, and inline editing
- **Conditional Rendering**: Showing/hiding UI elements based on state
- **Component Composition**: Breaking down complex UI into reusable components
- **Event Handling**: Multiple event types (click, keydown, blur, dblclick)
- **CSS Integration**: Using external CSS frameworks (TodoMVC styles)

## Key Concepts Demonstrated

### 1. State Management with Reducers
```typescript
const state = localStorageProp<State>({
  defaultValue: { filter: Filter.All, todos: [] },
  key: STORE_KEY,
})
const dispatch = state.reducer(update)
```
Uses a reducer pattern for predictable state updates, similar to Redux.

### 2. Persistent State
```typescript
localStorageProp<State>({
  defaultValue: { filter: Filter.All, todos: [] },
  key: STORE_KEY,
})
```
Automatically saves and restores state from localStorage.

### 3. Dynamic List Rendering
```typescript
ForEach(
  state.map(({ todos, filter }) => todos.filter(filterF(filter))),
  (item: Signal<Todo>) => {
    // Render each todo item
  }
)
```
Efficiently renders filtered todo lists with automatic updates.

### 4. Inline Editing
```typescript
const editing = prop(null as null | Todo)
const isEditing = computed(
  (): boolean =>
    editing.value != null && editing.value.id === item.value.id,
  [editing as Signal<unknown>, item]
)
```
Tracks which item is being edited and shows appropriate UI.

### 5. Keyboard Shortcuts
```typescript
on.keydown(e => {
  if (e.key === 'Enter') {
    // Save changes
  } else if (e.key === 'Escape') {
    // Cancel editing
  }
})
```
Provides intuitive keyboard navigation and shortcuts.

## Running the Demo

### Prerequisites
- Node.js (version 16 or higher)
- pnpm (recommended) or npm

### Setup and Run
```bash
# From the project root
cd demo/todomvc

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
demo/todomvc/
├── src/
│   ├── app.ts           # Main application component
│   ├── main.ts          # Application entry point
│   ├── types.ts         # Type definitions
│   ├── update.ts        # State update logic (reducer)
│   └── utils.ts         # Utility functions
├── public/
│   └── icon-512x512.png # App icon
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
└── README.md           # This file
```

## Features Implemented

### ✅ TodoMVC Specification Compliance
- Add new todos
- Mark todos as complete/incomplete
- Edit todo text inline
- Delete individual todos
- Filter todos (All, Active, Completed)
- Clear all completed todos
- Toggle all todos complete/incomplete
- Show count of remaining items
- Persist state across browser sessions

### ✅ User Experience Enhancements
- **Auto-focus**: New todo input is automatically focused
- **Auto-select**: Text is selected when editing begins
- **Keyboard shortcuts**: Enter to save, Escape to cancel
- **Visual feedback**: CSS classes for different states
- **Responsive design**: Works on different screen sizes

## Architecture Patterns

### State Management
The app uses a Redux-like pattern with:
- **State**: Single source of truth for all application data
- **Actions**: Describe what happened (AddTodo, ToggleCompleted, etc.)
- **Reducer**: Pure function that calculates new state from actions
- **Dispatch**: Function to send actions to the reducer

### Component Structure
- **App**: Main container component
- **FilterLink**: Reusable filter navigation component
- **Todo Item**: Inline component for individual todos
- **Form Inputs**: Integrated with Tempo's input helpers

### Data Flow
1. User interaction triggers an event
2. Event handler dispatches an action
3. Reducer calculates new state
4. Signals automatically update affected UI components
5. Changes are persisted to localStorage

## Learning Opportunities

This demo is excellent for learning:
- How to structure larger Tempo applications
- State management patterns and best practices
- Form handling and validation techniques
- List manipulation and filtering
- Component composition strategies
- Integration with external CSS frameworks
- Persistence and data management

## Next Steps

After exploring this demo, try:

1. **[7GUIs Demo](../7guis/README.md)** - Explore various UI patterns and interactions
2. **[Hacker News PWA](../hnpwa/README.md)** - See routing and API integration
3. **Modify this demo**: Add features like due dates, categories, or drag-and-drop

## Learn More

- [Tempo Documentation](https://tempo-ts.com/)
- [Signals Guide](https://tempo-ts.com/page/signals.html)
- [Building Components](https://tempo-ts.com/page/components.html)
- [TodoMVC Specification](https://github.com/tastejs/todomvc/blob/master/app-spec.md)
