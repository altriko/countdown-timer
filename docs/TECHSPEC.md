# Technical Specification
## Countdown Timer App — v1.0

| Field | Detail |
|---|---|
| **Author** | Altriko |
| **Status** | Draft |
| **Last Updated** | March 18, 2026 |
| **Version** | 1.0 |
| **Related PRD** | PRD-countdown-timer.md |

---

## 1. Purpose of This Document

The PRD defines *what* to build and *why*. This tech spec defines *how* — the architecture, data structures, component breakdown, and implementation decisions that will be followed during build.

---

## 2. Tech Stack Decision

| Layer | Choice | Reason |
|---|---|---|
| Language | TypeScript | Type safety catches bugs at compile time, not runtime |
| Markup | HTML5 | Single file, no framework needed |
| Styling | CSS3 | Scoped to one file, no build step |
| Audio | Web Audio API | No file dependency, browser-native |
| Build tool | `tsc` | Compile `.ts` → `.js`, no bundler overhead |

---

## 3. File Structure

```
countdown-timer/
├── index.html          # Entry point + markup
├── timer.ts            # All logic (source)
├── timer.js            # Compiled output (referenced in HTML)
├── style.css           # Styles
└── tsconfig.json       # TypeScript config
```

---

## 4. Type Definitions

Define all types before writing any logic. These are the contracts the entire codebase depends on.

```typescript
// The 4 possible states of the timer
type TimerState = "idle" | "running" | "paused" | "done";

// Represents a point-in-time duration
interface TimerDuration {
  minutes: number;  // 0–99
  seconds: number;  // 0–59
}

// Single source of truth for the full application state
interface AppState {
  state: TimerState;
  initialDuration: TimerDuration;  // What the user originally set
  remaining: TimerDuration;        // What's left on the clock
  intervalId: number | null;       // setInterval reference; null when not running
}
```

---

## 5. State Machine

Four valid states with defined transitions. Any action outside this table is a no-op.

```
[idle] ──── Start ────► [running]
              ◄─── Reset ────┤
                             │ Pause
                             ▼
                          [paused]
                             │ Resume
                             ▼
                          [running]
                             │ reaches 00:00
                             ▼
                           [done]
                             │ Reset
                             ▼
                           [idle]
```

### Allowed Transitions

| From | Action | To |
|---|---|---|
| `idle` | Start | `running` |
| `running` | Pause | `paused` |
| `running` | Reaches `00:00` | `done` |
| `running` | Reset | `idle` |
| `paused` | Resume | `running` |
| `paused` | Reset | `idle` |
| `done` | Reset | `idle` |

---

## 6. Core Function Signatures

Define the signature and responsibility of every function before writing the body. This is the implementation contract.

```typescript
// Convert TimerDuration to total seconds (for arithmetic)
function toSeconds(duration: TimerDuration): number

// Convert total seconds back to TimerDuration (for display)
function fromSeconds(totalSeconds: number): TimerDuration

// Format TimerDuration as "MM:SS" string
function formatDisplay(duration: TimerDuration): string

// Validate user input before allowing Start
// Returns false if duration is 00:00 or seconds > 59
function isValidDuration(duration: TimerDuration): boolean

// Decrement remaining by 1 second. Returns new remaining.
function tick(remaining: TimerDuration): TimerDuration

// Generate a beep using Web Audio API on timer completion
function playAlert(): void

// Render current AppState to the DOM
// Responsible for: display value, button visibility, status message
function render(state: AppState): void

// State transition handlers — called by button click events
function handleStart(): void
function handlePause(): void
function handleResume(): void
function handleReset(): void
```

---

## 7. DOM Contract

Every element the TypeScript logic touches must have a stable ID. These are the only IDs the script is allowed to query.

```typescript
// Inputs
const minutesInput = document.getElementById("minutes-input") as HTMLInputElement;
const secondsInput = document.getElementById("seconds-input") as HTMLInputElement;

// Display
const timerDisplay = document.getElementById("timer-display") as HTMLElement;

// Buttons
const startBtn  = document.getElementById("btn-start")  as HTMLButtonElement;
const pauseBtn  = document.getElementById("btn-pause")  as HTMLButtonElement;
const resumeBtn = document.getElementById("btn-resume") as HTMLButtonElement;
const resetBtn  = document.getElementById("btn-reset")  as HTMLButtonElement;

// Status message — shows "Running", "Paused", "Time's up!", etc.
const statusMsg = document.getElementById("status-msg") as HTMLElement;
```

> **Rule:** No logic outside `timer.ts` should manipulate these elements. The `render()` function is the single point of DOM mutation.

---

## 8. Button Visibility Rules

The `render()` function controls button visibility based on state. Use a lookup table — not scattered `if-else` logic.

| State | Start | Pause | Resume | Reset |
|---|---|---|---|---|
| `idle` | Visible, enabled | Hidden | Hidden | Hidden |
| `running` | Hidden | Visible, enabled | Hidden | Visible, enabled |
| `paused` | Hidden | Hidden | Visible, enabled | Visible, enabled |
| `done` | Hidden | Hidden | Hidden | Visible, enabled |

---

## 9. Audio Implementation

No audio file needed. Generate a 1-second sine wave beep using Web Audio API:

```typescript
function playAlert(): void {
  const ctx = new AudioContext();
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.type = "sine";
  oscillator.frequency.value = 880; // Hz — clean beep tone

  gainNode.gain.setValueAtTime(1, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1);

  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + 1);
}
```

> **Note:** `AudioContext` requires a user gesture to start in modern browsers. Since `playAlert()` is triggered by the timer reaching zero (which follows from the user clicking Start), this is satisfied by default.

---

## 10. tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ES2020",
    "strict": true,
    "noImplicitAny": true,
    "lib": ["ES2020", "DOM"],
    "outDir": "./",
    "sourceMap": true
  },
  "include": ["timer.ts"]
}
```

Key flags:

- `strict: true` — enables all strict type checks
- `noImplicitAny: true` — every variable must have an explicit or inferable type
- `sourceMap: true` — maps compiled `.js` back to `.ts` for browser debugging

---

## 11. Open Questions / Deferred Decisions

| # | Question | Default for v1 |
|---|---|---|
| OQ-1 | Should seconds input auto-correct if user types 75? | Clamp to 59 on blur |
| OQ-2 | What if user changes input while timer is paused? | Not allowed — inputs disabled when not `idle` |
| OQ-3 | Should the page `<title>` update with remaining time? | Out of scope for v1 |