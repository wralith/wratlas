---
name: preact-signals
description: Comprehensive guide for state management with Preact Signals (@preact/signals). Covers signal(), computed(), effect(), batch(), untracked(), createModel(), hook variants, factory stores, performance optimizations, and patterns found in this codebase. Use this skill when implementing or refactoring state logic in Preact components, especially when emphasizing fine-grained reactivity, zero-overhead re-renders, and no prop drilling.
license: MIT
---

# Preact Signals

Use this skill when implementing or refactoring state management with **Preact Signals**. It emphasizes fine-grained reactivity, minimal re-renders, immutable update patterns, and clean separation between state and UI.

## When to Apply

Use this skill when tasks include:

- Creating reactive state with `signal()`, `computed()`, `effect()`
- Managing component-local state with `useSignal()`, `useComputed()`, `useSignalEffect()`
- Grouping signal writes with `batch()` for performance
- Reading signals without subscribing with `untracked()` or `.peek()`
- Building reusable store factories (e.g. `create_canvas_store()`)
- Connecting signals to imperative/DOM lifecycle via `useSignalEffect`
- Deriving state from other signals with `computed()`
- Persisting state to localStorage or other side effects via `effect()`
- Using `<Show>` and `<For>` utility components from `@preact/signals/utils`

## Core Mental Model

Signals are objects with a `.value` property. The signal reference never changes — only its value does. This means:

- Passing a signal through props or context does **not** cause re-renders
- Only components that access `.value` re-render when the signal changes
- Signals track reads and writes automatically (no manual subscription/unsubscription)
- Computed signals are lazy — they only re-compute when their value is read

```ts
import { signal } from '@preact/signals'

const count = signal(0)
count.value = 1          // write
console.log(count.value) // read
```

## Installation

Already installed in this project via `@preact/signals`. No additional setup needed.

## API Overview

### `signal(initialValue)` / `useSignal(initialValue)`

Use `signal()` for module-level/global state. Use `useSignal()` for component-local state.

```ts
// global
import { signal } from '@preact/signals'
export const count = signal(0)

// local (within a component)
import { useSignal } from '@preact/signals'
const count = useSignal(0)
```

`useSignal` is memoized — same signal instance across renders.

### `computed(fn)` / `useComputed(fn)`

Derived state that auto-updates when dependencies change. Read-only.

```ts
const count = signal(0)
const doubled = computed(() => count.value * 2)
```

Use `useComputed()` inside components for local derived state.

### `effect(fn)`

Runs a callback when any accessed signal changes. Returns a dispose function.

```ts
const dispose = effect(() => {
  console.log(count.value)
})
dispose() // clean up
```

The callback can return a cleanup function (runs before next run):

```ts
effect(() => {
  Chat.connect(username.value)
  return () => Chat.disconnect(username.value)
})
```

### `batch(fn)`

Groups multiple signal writes into a single commit. Nested batches flush at the outermost boundary.

```ts
batch(() => {
  zoom_level.value = 2
  pan_x.value = 100
  pan_y.value = 200
})
```

### `untracked(fn)`

Reads signal values inside `effect()` or `computed()` without creating a subscription.

```ts
effect(() => {
  // read count without subscribing to it
  const snapshot = untracked(() => count.value)
  console.log(snapshot, delta.value)
})
```

### `.peek()`

Alternative to `untracked` for a single signal — reads value without subscribing.

```ts
effect(() => {
  // write to count without re-triggering
  count.value = count.peek() + delta.value
})
```

### `createModel(factory)` / `useModel(modelOrFactory)`

Structured state containers with auto-batched actions and automatic effect cleanup on dispose.

```ts
import { signal, computed, createModel } from '@preact/signals'

const CounterModel = createModel((initialCount = 0) => {
  const count = signal(initialCount)
  const doubled = computed(() => count.value * 2)

  return {
    count,
    doubled,
    increment() { count.value++ },
    decrement() { count.value-- },
  }
})

const counter = new CounterModel(5)
counter[Symbol.dispose]() // clean up effects
```

In components:

```tsx
function Counter() {
  const model = useModel(CounterModel)
  return <button onClick={() => model.increment()}>{model.count}</button>
}
```

**Note:** This project currently does NOT use `createModel`. State is managed through factory functions (see "Store Factory Pattern" below).

### `useSignalEffect(fn)`

The hook equivalent of `effect()` — runs inside components and cleans up on unmount.

```tsx
useSignalEffect(() => {
  const canvas = fabric_canvas.value
  if (!canvas) return

  // set up event listeners
  const handler = () => { ... }
  canvas.on('mouse:down', handler)

  return () => {
    canvas.off('mouse:down', handler)
  }
})
```

This is the **primary pattern** in the canvas package for bridging signals with imperative/DOM APIs.

### `action(fn)`

Wraps a function to run in a batched + untracked context. Useful for standalone mutation functions outside models.

```ts
const incrementBy = action((amount: number) => {
  count.value += amount
})
```

## Patterns Found in This Codebase

### Immutable Signal Updates

Signals are **never mutated in place**. Always use whole-object replacement:

```ts
// ✅ Correct
storage.value = { ...storage.value, activeCanvasId: id }

// ✅ Correct
storage.value = {
  ...storage.value,
  canvases: storage.value.canvases.map(c =>
    c.id === id ? { ...c, ...snapshot } : c
  ),
}

// ❌ Wrong — do not mutate nested objects or arrays
storage.value.canvases.push(newCanvas)
```

### Store Factory Pattern

Instead of raw module-level signals, encapsulate related signals + computed values + methods in a factory function:

```ts
// store pattern (from canvas/internal/store.ts)
function create_canvas_store() {
  const storage = signal<CanvasStorage>({ canvases: [], activeCanvasId: null })

  const active_canvas = computed(() => {
    const active = storage.value.activeCanvasId
    return storage.value.canvases.find(c => c.id === active) ?? null
  })

  const canvas_list = computed(() => storage.value.canvases)

  function set_active_canvas(id: string) {
    storage.value = { ...storage.value, activeCanvasId: id }
  }

  return {
    // expose signals (for read/write access)
    active_canvas_id: storage.activeCanvasId,
    // expose computed (read-only)
    active_canvas,
    canvas_list,
    // expose methods
    set_active_canvas,
  }
}
```

### useSignalEffect as DOM Bridge

Every canvas hook follows this pattern to connect signals to imperative Fabric.js/DOM lifecycle:

```ts
useSignalEffect(() => {
  const canvas = fabric_canvas.value
  if (!canvas) return // guard: no-op before canvas is ready

  // ... setup ...

  return () => {
    // ... teardown ...
  }
})
```

Key points:
- Guard with early return if the signal dependency isn't ready yet
- Cleanup function runs before next invocation and on unmount
- The effect automatically re-runs when `fabric_canvas` changes

### batch for Grouped Writes

Use when multiple related signals change together (e.g., viewport state):

```ts
function sync_viewport_signals() {
  batch(() => {
    zoom_level.value = newZoom
    pan_x.value = newPanX
    pan_y.value = newPanY
  })
}
```

### untracked for One-Time Reads

Use when you need an initial value inside `useSignalEffect` without subscribing to future changes:

```ts
useSignalEffect(() => {
  const canvas = fabric_canvas.value
  if (!canvas) return

  // read initial viewport without subscribing to it
  const viewport = untracked(() => active_canvas.value.viewport)

  canvas.setZoom(viewport.zoom)
  canvas.viewportTransform = [...viewport.transform]
})
```

### `effect()` for Persistence

Use for side effects like saving to localStorage:

```ts
effect(() => {
  debounced_save(storage.value)
})
```

Add a dispose call to clean up the debounce timeout on app teardown:

```ts
let timer: ReturnType<typeof setTimeout>
const dispose = effect(() => {
  clearTimeout(timer)
  timer = setTimeout(() => save(storage.value), 200)
})
```

## When to Use Which

| Scenario | Solution |
|---|---|
| Module-level app state | `signal()` at module scope |
| Component-local UI state | `useSignal()` inside component |
| Derived/transformed state | `computed()` or `useComputed()` |
| Side effects (logs, localStorage, analytics) | `effect()` outside components, `useSignalEffect()` inside components |
| Grouping signal writes | `batch()` |
| Reading without subscribing | `untracked()` or `.peek()` |
| Group of related signals + methods | Factory function returning `{ signals, computed, methods }` |
| Complex state with auto-cleanup | `createModel` + `useModel` |
| Conditional rendering from signal | `<Show when={signal}>` (from `@preact/signals/utils`) |
| List rendering from signal array | `<For each={signalArray}>` (from `@preact/signals/utils`) |

## Performance Optimizations

### Pass Signals into JSX Directly

When a signal is rendered as text content or as a DOM element prop, pass the signal itself instead of `.value` to bypass Virtual DOM diffing:

```tsx
// ❌ Re-renders the component on every change
function Counter() {
  return <p>{count.value}</p>
}

// ✅ Updates DOM in-place without component re-render
function Counter() {
  return <p>{count}</p>
}
```

This optimization works **only** for:
- Text content in JSX (`{signal}`)
- Props on native DOM elements (e.g., `<input value={signal} />`)
- It does **NOT** work for component props — pass `.value` in that case

### Use batch to Prevent Cascading Updates

When multiple signals change at once, wrap in `batch()` to trigger a single update:

```ts
batch(() => {
  todos.value = [...todos.value, newTodo]
  text.value = ''
})
```

### Use untracked / peek to Break Unnecessary Subscriptions

If an effect writes to a signal but shouldn't re-run when that signal changes, read with `.peek()` or `untracked()`.

### Laziness of computed

`computed()` only re-computes when its value is read. This is free performance — don't worry about "stale" computed values.

### Subscribe Selectively with useSignalEffect

`useSignalEffect` only re-runs when its accessed signals change. The component itself does not re-render — only the effect callback runs.

## Common Pitfalls to Avoid

- **Mutating objects in-place** — always replace the whole value (`storage.value = { ... }`)
- **Reading `.value` in JSX text position** — pass the signal directly for DOM text optimization
- **Forgetting cleanup in `useSignalEffect`** — always return a cleanup function when setting up listeners/intervals
- **Creating signals inside `computed()` or `effect()`** — create them once, not in reactive callbacks
- **Calling `effect()` inside components** — use `useSignalEffect()` instead (auto-cleanup)
- **Using `.value` inside `untracked()` for no reason** — `untracked()` exists to suppress tracking; only use it when you need that behavior
- **Over-using `useSignal` for state that should be module-level** — if multiple components need it, lift it up
- **Passing signals as component props without reading `.value`** — Preact signals only auto-unwrap in DOM text/prop positions, not in component props
- **Not guarding `useSignalEffect`** — always check that the signal dependency is ready before proceeding
- **Nesting signals deeply** — flatten state whenever possible; signals work best with shallow structures

## Utility Components (`@preact/signals/utils`)

### `<Show>`

Declarative conditional rendering based on a signal's truthiness:

```tsx
import { Show } from '@preact/signals/utils'

const isVisible = signal(false)

// With fallback
<Show when={isVisible} fallback={<p>Hidden</p>}>
  <p>Visible</p>
</Show>

// With value accessor
<Show when={count}>{value => <p>The count is {value}</p>}</Show>
```

### `<For>`

Render lists from signal arrays with automatic caching:

```tsx
import { For } from '@preact/signals/utils'

const items = signal(['A', 'B', 'C'])

<For each={items} fallback={<p>No items</p>}>
  {(item, index) => <div key={index}>Item: {item}</div>}
</For>
```

## Debugging

- Use `@preact/signals/debug` for console logging of signal updates, effect executions, and computed recalculations — development only
- Use `@preact/signals/devtools` for an embeddable real-time visualization UI
- These are installed as optional dev dependencies

## Review Checklist

Before finalizing implementation, verify:

- [ ] Signal scope is appropriate (module-level vs `useSignal`)
- [ ] No in-place mutations — always whole-object replacement
- [ ] `batch()` used when multiple related signals change together
- [ ] `useSignalEffect` has proper guards and cleanup return
- [ ] `untracked()` / `.peek()` used intentionally, not by default
- [ ] No `effect()` inside components (should be `useSignalEffect`)
- [ ] Signals passed to DOM elements directly when possible (optimization)
- [ ] Signal not accessed with `.value` in JSX text/DOM prop position (unless component prop)
- [ ] `computed()` used for derived state instead of manual sync
- [ ] Effects have cleanup that runs before re-execution (if applicable)
- [ ] Debounce/throttle applied for persistence/storage effects
