# Handoff: Countdown Timer

## Overview
A polished countdown timer web app. The user sets a duration in minutes and seconds, then starts, pauses, resumes, and resets the timer. A visual ring shrinks as time elapses, and the UI changes color + plays a beep when the timer finishes.

---

## About the Design Files
The file `Countdown Timer.html` in this bundle is a **design reference created in HTML** — a high-fidelity prototype showing the intended look and behavior. It is **not production code to ship directly**.

Your task is to **recreate this design in your existing codebase** using its established patterns, framework, and libraries (e.g. React, Vue, plain TS/JS). The original project (`timer.ts`) is already TypeScript with no framework — you can build directly on top of it.

---

## Fidelity
**High-fidelity.** Colors, typography, spacing, ring geometry, animations, and interaction states are all final. Recreate the UI pixel-accurately, wiring it to the existing `timer.ts` logic.

---

## Screens / Views

### Single Screen — Timer

The entire app is one centered view on a dark background.

#### Layout
- Full-viewport dark background: `oklch(10% 0.012 240)` — near-black with a faint blue-grey tint
- Subtle radial gradient overlays (decorative, low opacity) add depth — optional
- Content is a single vertical flex column, centered both axes, `gap: 48px`
- Three sections stacked vertically: **Header → Ring → Controls**

---

### Section 1: Header
- Text: `"COUNTDOWN"` (or `"Countdown"`)
- Font: `DM Sans`, 11px, weight 500, letter-spacing `0.25em`, `text-transform: uppercase`
- Color: `oklch(50% 0.012 240)` — muted grey

---

### Section 2: Ring + Display

A `400×400px` container (300px on mobile ≤480px) with:

#### SVG Ring (behind content)
- `pointer-events: none` — critical, otherwise it blocks input clicks
- Rotated `−90deg` so progress starts at 12 o'clock
- **Track circle**: radius `185`, stroke `oklch(20% 0.015 240)`, stroke-width `5`
- **Progress circle**: same radius, stroke-width `5`, `stroke-linecap: round`
  - `stroke-dasharray` = circumference = `2 × π × 185 ≈ 1162.4`
  - `stroke-dashoffset` = `circumference × (1 − fraction_remaining)`
  - Transition: `stroke-dashoffset 1s linear` (matches the 1-second tick), `stroke 0.4s ease` for color changes
- **Glow circle**: same as progress but stroke-width ~2.5, opacity 0.3, `filter: blur(4px)` — gives the neon glow
- **Tick marks**: 60 SVG `<line>` elements around the ring at radius 185 inward; major ticks (every 5) go 10px inward, minor ticks 6px inward; opacity 0.15

#### State-aware ring colors
| State   | Ring + Glow stroke color           |
|---------|------------------------------------|
| idle    | `oklch(50% 0.012 240)` (grey)      |
| running | `oklch(72% 0.18 158)` (mint green) |
| paused  | `oklch(72% 0.18 65)` (amber)       |
| done    | `oklch(72% 0.18 18)` (coral red)   |

#### Center content (overlaid on ring)
Two modes depending on state:

**Idle mode** — two `<input type="number">` fields side by side with a `:` separator:
- Font: `Space Mono`, 80px (56px mobile), weight 700, letter-spacing `−0.02em`
- Width: `2.2ch` each; `text-align: center`; no spinner arrows; no border; transparent background
- Minutes input: `min=0 max=99`; Seconds input: `min=0 max=59`
- Pressing `Enter` in either input triggers Start

**Active mode** (running / paused / done) — a read-only `<div>` showing `M:SS` format:
- Same font/size as inputs
- Color: white normally; coral (`oklch(72% 0.18 18)`) when state is `done`

**Status label** (below the display/inputs in all states):
- Font: `DM Sans`, 11px, weight 500, letter-spacing `0.2em`, uppercase
- Text per state: `"Set a duration"` / `"Running"` / `"Paused"` / `"Done"`
- Color matches the ring accent for current state

---

### Section 3: Controls

A horizontal flex row, `gap: 12px`, centered.

#### Button styles
All buttons: `height: 48px`, `border-radius: 100px` (pill shape), `font: DM Sans 14px weight 500`

| Button     | Visible in states          | Style                                                  |
|------------|----------------------------|--------------------------------------------------------|
| Reset      | running, paused, done      | Icon-only (↺), 48×48px, dark surface + muted border    |
| Main (CTA) | all                        | Primary — filled with state accent color (see below)   |
| Pause      | running only               | Icon-only (⏸), 48×48px, dark surface + muted border    |

**Main button labels per state:**
- idle → `"Start"`
- running → `"Running…"` (disabled)
- paused → `"Resume"`
- done → `"Restart"`

**Main button background per state:**
- idle → white (`var(--text)`) with dark text
- running → mint `oklch(72% 0.18 158)`
- paused → amber `oklch(72% 0.18 65)`
- done → coral `oklch(72% 0.18 18)`

---

## Interactions & Behavior

### State machine
```
idle ──[Start]──► running ──[Pause]──► paused
                      ▲                  │
                      └──[Resume]────────┘
                      │
              [reaches 00:00]
                      ▼
                    done ──[Reset / Restart]──► idle
```

### Timer tick
- `setInterval` at 1000ms; each tick decrements remaining by 1 second
- When remaining hits 0: clear interval, set state = `done`, play beep, render

### Pause
- `clearInterval`, set state = `paused`, preserve `remaining`

### Resume
- Restart `setInterval` from current `remaining`

### Reset
- `clearInterval`, set `remaining = initialDuration`, set state = `idle`
- Restore input values to `initialDuration.minutes` / `initialDuration.seconds`

### Restart (from done)
- Same as Reset then immediately Start

### Input validation
- Clamp minutes to 0–99, seconds to 0–59
- Disallow start if both are 0

### Ring animation
- `stroke-dashoffset` transitions with `1s linear` to stay in sync with the tick
- Color transitions with `0.4s ease`

### Done state extras
- A `pulse-ring` animation: a pseudo-element circle that scales outward and fades, `1.5s ease-out infinite`
- Three-tone ascending beep via Web Audio API (`523Hz`, `659Hz`, `784Hz`, each `~350ms`, staggered `180ms`)

---

## Design Tokens

### Colors
```
--bg:            oklch(10% 0.012 240)   /* page background */
--surface:       oklch(14% 0.015 240)   /* button/card surface */
--border:        oklch(22% 0.018 240)   /* subtle borders */
--text:          oklch(92% 0.008 240)   /* primary text / white */
--muted:         oklch(50% 0.012 240)   /* secondary text */
--ring-track:    oklch(20% 0.015 240)   /* ring background track */
--accent:        oklch(72% 0.18 158)    /* running — mint */
--accent-pause:  oklch(72% 0.18 65)     /* paused — amber */
--accent-done:   oklch(72% 0.18 18)     /* done — coral */
--accent-idle:   oklch(50% 0.012 240)   /* idle — grey */
```

### Typography
```
Numerals:  Space Mono, 700, 80px (56px mobile)
Labels:    DM Sans, 500, 11px, letter-spacing 0.2–0.25em, uppercase
Buttons:   DM Sans, 500, 14px
```

### Spacing
```
App gap (header → ring → controls): 48px
Control gap (between buttons):       12px
Ring size:                           400px (300px on mobile ≤480px)
Ring radius:                         185
Ring stroke-width:                   5
Button height:                       48px
Icon button size:                    48×48px
Primary button padding:              0 28px
```

### Border radius
- Buttons: `100px` (full pill)
- Tweaks panel: `16px`

---

## State Management

```ts
type TimerState = 'idle' | 'running' | 'paused' | 'done';

interface AppState {
  state: TimerState;
  initialDuration: { minutes: number; seconds: number };
  remaining: { minutes: number; seconds: number };
  totalSeconds: number;       // set on Start, used to compute ring fraction
  elapsedSeconds: number;     // incremented each tick
  intervalId: number | null;
}
```

Ring fill fraction = `(totalSeconds - elapsedSeconds) / totalSeconds`

---

## Assets
- **Fonts**: `Space Mono` (400, 700) and `DM Sans` (300, 400, 500) — load from Google Fonts or bundle locally
- **Icons**: Simple SVG inline icons (reset ↺ and pause ⏸) — no icon library needed, see `Countdown Timer.html` for the SVG paths

---

## Files in This Package
| File | Purpose |
|------|---------|
| `Countdown Timer.html` | Full hi-fi design reference — open in browser to see final look & behavior |
| `README.md` | This document |

---

## How to Use This in Claude Code

Paste the following prompt into Claude Code to get started:

```
I have a countdown timer project (TypeScript, no framework). I want to redesign 
its UI to match the hi-fi design in `design_handoff_countdown_timer/Countdown Timer.html`.
Read the README at `design_handoff_countdown_timer/README.md` for full specs.

Please:
1. Read the existing timer.ts logic — keep it as-is
2. Rewrite index.html and style.css to match the design exactly
3. Wire up all the DOM interactions per the README state machine
4. Add the Web Audio beep on completion
5. Ensure pointer-events: none on the SVG ring so inputs remain clickable
```
