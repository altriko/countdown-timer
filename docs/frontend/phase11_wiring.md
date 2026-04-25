# Phase 11 — Wiring the Design to `timer.ts`

**Goal:** connect all new HTML to the existing TypeScript logic; animate the ring from state.

---

## Topics

### The DOM ID contract

`timer.ts` finds elements by ID using `getElementById`. Every ID it references must exist in `index.html`, exactly as written:

```typescript
// from timer.ts — these IDs must exist in HTML
document.getElementById("minutes-input")
document.getElementById("seconds-input")
document.getElementById("timer-display")
document.getElementById("start-btn")
document.getElementById("pause-btn")
document.getElementById("resume-btn")
document.getElementById("reset-btn")
document.getElementById("status-msg")
```

New IDs added for the ring must also be added to `timer.ts` so `render()` can update them:

```typescript
const ringProgress = document.getElementById("ring-progress") as SVGCircleElement
const ringGlow     = document.getElementById("ring-glow")     as SVGCircleElement
```

---

### Adding `totalSeconds` and `elapsedSeconds` to `AppState`

The ring fill fraction requires knowing how much of the total time has passed:

```
fraction remaining = (totalSeconds - elapsedSeconds) / totalSeconds
dashoffset = circumference × (1 − fraction_remaining)
```

Add two fields to `AppState` in `timer.ts`:

```typescript
interface AppState {
    state: TimerState
    initialDuration: TimerDuration
    remaining: TimerDuration
    intervalId: number | null
    totalSeconds: number      // set when Start is clicked, never changes mid-run
    elapsedSeconds: number    // incremented each tick
}
```

Set them in `handleStart()`:
```typescript
state.totalSeconds = toSeconds({minutes, seconds})
state.elapsedSeconds = 0
```

Increment in the interval (both `handleStart` and `handleResume`):
```typescript
state.elapsedSeconds += 1
```

---

### Updating `render()` to drive the ring

Inside `render()`, compute and apply the ring offset:

```typescript
const CIRCUMFERENCE = 2 * Math.PI * 185  // ≈ 1162.4

function render(state: AppState): void {
    // existing code...
    timerDisplay.textContent = formatDisplay(state.remaining)
    statusMsg.textContent = state.state
    document.body.setAttribute('data-state', state.state)

    // ring animation
    const fraction = state.totalSeconds > 0
        ? (state.totalSeconds - state.elapsedSeconds) / state.totalSeconds
        : 1

    const offset = CIRCUMFERENCE * (1 - fraction)
    ringProgress.style.strokeDashoffset = String(offset)
    ringGlow.style.strokeDashoffset = String(offset)
}
```

---

### Idle mode vs active mode display

In idle state: inputs are visible, `#timer-display` is hidden.
In running/paused/done: `#timer-display` is visible, inputs are hidden.

This is handled by CSS via `data-state`:

```css
/* idle: show inputs, hide display */
[data-state="idle"] .input-group   { display: flex; }
[data-state="idle"] #timer-display { display: none; }

/* active: hide inputs, show display */
[data-state="running"] .input-group,
[data-state="paused"]  .input-group,
[data-state="done"]    .input-group  { display: none; }

[data-state="running"] #timer-display,
[data-state="paused"]  #timer-display,
[data-state="done"]    #timer-display { display: block; }
```

---

### `handleReset` restoring input values

When the timer resets, restore the input values so the user sees the original duration:

```typescript
export function handleReset(state: AppState): void {
    clearInterval(state.intervalId)
    state.intervalId = null
    state.remaining = state.initialDuration
    state.elapsedSeconds = 0                              // reset elapsed
    state.state = "idle"
    minutesInput.value = String(state.initialDuration.minutes)   // restore input
    secondsInput.value = String(state.initialDuration.seconds)
    render(state)
}
```

---

### Restart from done state

The design has a "Restart" label on the main button when in `done` state. Clicking it should reset and immediately start. In `index.html`, the same `#start-btn` is reused — `timer.ts` handles the label change via `render()`, and `handleStart()` re-reads the inputs.

---

## Task

1. Add `totalSeconds: 0` and `elapsedSeconds: 0` to the initial `state` object in `timer.ts`

2. Update `AppState` interface with the two new fields

3. Update `handleStart()` to set `totalSeconds` and reset `elapsedSeconds`

4. Update `handleResume()` to increment `elapsedSeconds` each tick

5. Add `ringProgress` and `ringGlow` DOM references at the top of `timer.ts`

6. Update `render()` to set `strokeDashoffset` and `data-state`

7. Add the idle/active display toggle CSS

8. Update `handleReset()` to restore input values and reset `elapsedSeconds`

9. Full end-to-end test: set 10 seconds, start, watch ring drain, pause, resume, let it finish, check pulse, reset.

---

## Questions & Learning Points

*(Recorded after the task is completed and reviewed)*
