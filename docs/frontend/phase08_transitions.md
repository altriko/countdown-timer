# Phase 8 — CSS Transitions & State Colors

**Goal:** smoothly shift color when the timer state changes; connect CSS to JavaScript state.

---

## Topics

### `transition`

A transition animates a property from its old value to a new value over time:

```css
.element {
    transition: property duration easing;
}

/* example */
button {
    background: green;
    transition: background 0.4s ease;
}

button:hover {
    background: blue;   /* animates smoothly over 0.4s */
}
```

Multiple transitions separated by commas:
```css
transition: stroke 0.4s ease, opacity 0.2s ease;
```

Common easing values:
| Value | Behavior |
|---|---|
| `linear` | Constant speed — good for progress bars |
| `ease` | Slow start, fast middle, slow end — natural feel |
| `ease-in` | Slow start |
| `ease-out` | Slow end |

For the ring:
- `stroke-dashoffset 1s linear` — matched to the 1-second tick for a smooth drain effect
- `stroke 0.4s ease` — color shifts when state changes

---

### Connecting CSS to JavaScript state

The problem: buttons and colors change per state, but CSS can't read JavaScript variables directly.

The solution: set a `data-state` attribute on a root element from JavaScript, then write CSS rules that respond to it.

In `timer.ts`, inside `render()`:
```typescript
document.body.setAttribute('data-state', state.state)
// or on <main>: document.querySelector('main').setAttribute('data-state', state.state)
```

In `style.css`:
```css
/* idle — default, no attribute needed */
#ring-progress { stroke: var(--accent-idle); }

/* running */
[data-state="running"] #ring-progress { stroke: var(--accent); }

/* paused */
[data-state="paused"]  #ring-progress { stroke: var(--accent-pause); }

/* done */
[data-state="done"]    #ring-progress { stroke: var(--accent-done); }
```

`[data-state="running"]` is an **attribute selector** — it targets any element that has that attribute with that value. Child elements inherit the context, so `#ring-progress` inside a `[data-state="running"]` parent gets the right color.

---

### Why `data-*` attributes and not classes?

You could use `classList.add('running')` / `classList.remove('running')` instead. Both work. `data-state` is slightly cleaner for a state machine because:
- You can only be in one state at a time — one attribute, one value
- Classes can accidentally stack (`running paused` at the same time if you forget to remove one)

---

### Button color per state

The main CTA button also changes color:

```css
/* idle: white button */
[data-state="idle"] .btn-primary,
[data-state="done"] .btn-primary {
    background: var(--text);
    color: var(--bg);
}

[data-state="running"] .btn-primary { background: var(--accent); color: var(--bg); }
[data-state="paused"]  .btn-primary { background: var(--accent-pause); color: var(--bg); }
[data-state="done"]    .btn-primary { background: var(--accent-done); color: var(--bg); }
```

---

### Status label text per state

The design shows different text per state: `"Set a duration"` / `"Running"` / `"Paused"` / `"Done"`. This is handled by `render()` in `timer.ts` — it already sets `statusMsg.textContent`. The color can be driven by CSS:

```css
[data-state="running"] #status-msg { color: var(--accent); }
[data-state="paused"]  #status-msg { color: var(--accent-pause); }
[data-state="done"]    #status-msg { color: var(--accent-done); }
```

---

## Task

1. In `timer.ts`, add one line to `render()`:
   ```typescript
   document.body.setAttribute('data-state', state.state)
   ```

2. In `style.css`, add transitions to the ring progress and glow:
   ```css
   #ring-progress, #ring-glow {
       transition: stroke-dashoffset 1s linear, stroke 0.4s ease;
   }
   ```

3. Add state-aware color rules for:
   - `#ring-progress` and `#ring-glow` stroke color
   - `.btn-primary` background
   - `#status-msg` color

4. Check in the browser — start the timer and watch the ring color shift to green, pause and watch it shift to amber.

---

## Questions & Learning Points

*(Recorded after the task is completed and reviewed)*
