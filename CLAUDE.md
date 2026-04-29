# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Objective

A learning project to understand building a simple TypeScript app. Guidance over code — the user writes the code; Claude guides with explanations and asks questions to reinforce understanding.

- PRD: `docs/PRD.md`
- Tech spec (implementation phases): `docs/TECHSPEC.md`
- Design spec (HTML/CSS): `docs/design/README.md`
- Backend learning log (TypeScript/logic): `docs/LEARNING_backend.md`
- Frontend curriculum + learning curves: `docs/frontend/LEARNING_frontend.md`
- Frontend phase detail files: `docs/frontend/phase01_html_structure.md`, `phase02_...`, etc.

## Role of Claude

- Guide the user through phases defined in `docs/TECHSPEC.md` (backend) and the 11-phase HTML/CSS curriculum in `docs/frontend/LEARNING_frontend.md`
- Each frontend phase has a detail file in `docs/frontend/` — record Q&A and learning points there after the phase is done
- Record backend Q&A on the docs/LEARNING_backend.md as well
- Each new module need to be recorded into a new file when started; add the learning curve on the processes
- Minimal direct code writing — prefer explaining, asking, and reviewing

## Commands

```bash
npm install          # install typescript
npx tsc --watch      # compile timer.ts → timer.js on every save
npx serve .          # serve at http://localhost:3000 (required — ES modules block file:// protocol)
```

To run tests: swap `index.html` to load `timer.test.js` instead of `timer.js`, open the browser console, then switch back when done.

## Architecture

All logic lives in a single file: `timer.ts`. It is structured in four ordered regions:

1. **Types & Interfaces** — `TimerState` union type, `TimerDuration` interface, `AppState` interface (the single source of truth)
2. **DOM** — all element references declared once at the top (IDs from `index.html`)
3. **Functions** — pure math (`toSeconds`, `fromSeconds`, `formatDisplay`), logic (`isValidDuration`, `tick`), side effects (`render`, `playAlert`), and event handlers (`handleStart`, `handlePause`, `handleResume`, `handleReset`)
4. **Wiring** — `AppState` singleton + `addEventListener` calls binding handlers to buttons

### Key invariants

- `render(state)` is the **only** function that writes to the DOM. Handlers update `state`, then call `render`.
- Button visibility is controlled by a lookup table inside `render`, keyed by `state.state` — not scattered if/else in handlers.
- `intervalId` on `AppState` is the only `setInterval` reference. It is set to `null` whenever the interval is cleared (`pause`, `reset`, `done`) to signal "no interval running".
- `initialDuration` never changes after `handleStart` — it is the reset target. `remaining` counts down each tick.
- `handleStart` and `handleResume` both update `state.remaining = current_` inside the interval, so pause always knows where to resume from.

### State machine

```
idle ──Start──► running ──Pause──► paused ──Resume──► running
 ▲                │                  │
 └──Reset─────────┘                  │
 ▲                                   │
 └──Reset─────────────────────────── ┘
                  │ reaches 00:00
                  ▼
                done ──Reset──► idle
```

### Test file

`timer.test.ts` imports exported functions from `timer.js` and runs inline assertions. It is compiled alongside `timer.ts` (both listed in `tsconfig.json` `include`). To run: temporarily point `index.html`'s `<script>` to `timer.test.js`.