# Product Requirements Document
## Countdown Timer App — v1.0

| Field | Detail |
|---|---|
| **Author** | Altriko |
| **Status** | Draft |
| **Last Updated** | March 18, 2026 |
| **Version** | 1.0 |

---

## 1. Problem Statement

Users need a simple, reliable way to count down from a set duration and be notified when time runs out — without unnecessary complexity.

---

## 2. Goals

Build a functional countdown timer as a coding learning project, with clean UX and zero external dependencies.

---

## 3. Non-Goals

Explicitly out of scope for v1.0:

- No file upload or download
- No user accounts or data persistence
- No multiple concurrent timers
- No alarm sound selection or custom ringtones
- No backend or API calls

---

## 4. User Stories

| # | As a user, I want to... | So that... |
|---|---|---|
| US-1 | Set a duration in minutes and seconds | I can define exactly how long to count down |
| US-2 | Start the timer | It begins counting down |
| US-3 | Pause the timer | I can temporarily stop it without resetting |
| US-4 | Resume the timer | I can continue from where I paused |
| US-5 | Reset the timer | I can start over with the same duration |
| US-6 | See time remaining clearly | I know how much time is left at a glance |
| US-7 | Be alerted when time reaches zero | I don't have to watch the screen constantly |

---

## 5. Functional Requirements

### 5.1 Input

- Two inputs: minutes (0–99) and seconds (0–59)
- Input must be validated — no negative values, no seconds > 59

### 5.2 Controls

- **Start** → begins countdown
- **Pause** → freezes countdown (replaces Start when running)
- **Resume** → continues from paused state
- **Reset** → returns to initial duration, stops timer

### 5.3 Display

- Large, readable countdown in `MM:SS` format
- Updates every 1 second

### 5.4 End State

When timer hits `00:00`:

- Display a visual alert (color change or message)
- Play a browser beep via Web Audio API — no file upload needed
- Timer stops automatically

---

## 6. Timer State Machine

Four states: `idle` → `running` → `paused` → `idle` (via reset or completion)

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

---

## 7. Technical Constraints

| Constraint | Detail |
|---|---|
| Language | TypeScript (compiled to JS) |
| Markup | HTML5 — single file entry point |
| Styling | CSS3 — scoped to one file |
| Audio | Web Audio API — browser-native, no file dependency |
| Build tool | `tsc` — no bundler or framework |
| Runtime | Browser only — no server required |

---

## 8. UX Requirements

- Start / Pause / Resume / Reset buttons clearly labeled
- Disable Start if duration is `00:00`
- Disable Pause / Resume / Reset when in `idle` state
- Visual indicator for each state: running, paused, done
- Mobile-friendly layout (responsive)

---

## 9. Acceptance Criteria

| Criteria | Pass Condition |
|---|---|
| Timer counts down accurately | Each second decrements exactly once |
| Pause / Resume works | Time is preserved across pause |
| Reset works | Returns to original input values, stops timer |
| End state triggers | Alert fires at exactly `00:00` |
| Invalid input handled | Seconds > 59 or empty input is blocked |
| Works on mobile | No overflow, buttons are tappable |

---

## 10. Success Metric

The timer works end-to-end in a single browser tab without errors.