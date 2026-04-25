# Learning Log
## Countdown Timer — Frontend (HTML & CSS)

---

## Curriculum

### Phase 1 — HTML Document Structure
**Goal:** understand how a browser reads an HTML file and lay out the page skeleton.

Topics:
- `<!DOCTYPE>`, `<html>`, `<head>`, `<body>` and why each exists
- `<meta charset>` and `<meta viewport>` (why viewport matters for mobile)
- Linking a CSS file via `<link>`
- Semantic structure: `<header>`, `<main>`, `<section>`
- Inline vs block elements

Checkpoint: write the bare HTML skeleton for the three sections — Header, Ring container, Controls — with no styling yet.

---

### Phase 2 — CSS Custom Properties & Design Tokens
**Goal:** define the color and spacing system once and reuse it everywhere.

Topics:
- How CSS connects to HTML (selectors, the cascade)
- `:root` and `--variable` syntax (custom properties)
- `oklch()` color space — what L, C, H mean and why the design uses it
- Defining all 9 color tokens from the design (`--bg`, `--accent`, `--accent-pause`, etc.)

Checkpoint: define the full token set in `style.css`. Understand why tokens make state-aware color changes easier.

---

### Phase 3 — Typography & Google Fonts
**Goal:** load external fonts and apply the design's typographic rules.

Topics:
- `@import` from Google Fonts (Space Mono + DM Sans)
- `font-family`, `font-weight`, `font-size`, `letter-spacing`, `text-transform`
- Monospace (Space Mono for numerals) vs sans-serif (DM Sans for labels)
- `ch` unit — why the inputs use `width: 2.2ch`

Checkpoint: style the `"COUNTDOWN"` header label and the status label to match the spec exactly.

---

### Phase 4 — Flexbox Layout
**Goal:** build the full-page vertical layout and the horizontal controls row.

Topics:
- `display: flex`, `flex-direction`, `justify-content`, `align-items`
- `gap` vs `margin`
- Centering a full-viewport layout (`min-height: 100vh`)
- Nested flex: controls row is a horizontal flex container inside the vertical page

Checkpoint: arrange the three sections centered on the dark background with `48px` gap, no content yet.

---

### Phase 5 — Box Model & Button Styling
**Goal:** understand how CSS sizes elements; build the pill-shaped buttons.

Topics:
- The box model: `content → padding → border → margin`
- `border-radius: 100px` (pill shape)
- `height`, `padding`, sizing icon-only vs text buttons
- `:hover` and `:disabled` pseudo-classes
- `cursor: pointer`

Checkpoint: build all three button variants (Reset icon, Main CTA, Pause icon) — correct shape and size, unstyled for color.

---

### Phase 6 — SVG Ring
**Goal:** understand inline SVG and build the animated progress ring.

Topics:
- SVG coordinate system (`viewBox`, `cx`, `cy`, `r`)
- `<circle>`: `stroke`, `stroke-width`, `fill: none`
- Tick marks: `<line>` elements at angles around the ring
- `stroke-dasharray` and `stroke-dashoffset` — the core ring animation mechanic
- `transform: rotate(-90deg)` — why the ring starts at 12 o'clock
- `pointer-events: none` — why the SVG must not block clicks on inputs beneath it

Checkpoint: render the static ring (track + progress circle at 100%) centered in a 400×400 container with the correct grey color.

---

### Phase 7 — Positioning & Layering
**Goal:** stack the time display on top of the SVG ring.

Topics:
- `position: absolute` vs `position: relative` — the parent/child relationship
- `inset: 0` + `margin: auto` for centering an absolute element
- `z-index` — why the SVG sits behind the display
- `display: grid` with `place-items: center` as an alternative

Checkpoint: place the input fields (idle mode) and the time display div (active mode) correctly centered over the ring.

---

### Phase 8 — CSS Transitions & State Colors
**Goal:** smoothly shift color when the timer state changes; connect CSS to JavaScript state.

Topics:
- `transition: property duration easing`
- `stroke-dashoffset 1s linear` — synced to the 1-second tick
- `stroke 0.4s ease` — color transition on state switch
- Adding a `data-state` attribute from JavaScript vs setting inline `style`

Checkpoint: update `render()` in `timer.ts` to set `data-state="running"` (etc.) on a root element; write CSS rules that change accent color per state using that attribute.

---

### Phase 9 — Animations & Done State
**Goal:** understand `@keyframes` and implement the pulse ring on completion.

Topics:
- `@keyframes` syntax — defining animation steps
- `animation` shorthand: name, duration, easing, iteration
- `::before` / `::after` pseudo-elements — adding the pulse ring without extra HTML
- `transform: scale()` + `opacity` for the expanding fade

Checkpoint: implement the `pulse-ring` animation that fires only in the `done` state.

---

### Phase 10 — Responsive Design
**Goal:** adapt the layout to mobile screens (≤480px).

Topics:
- `@media` queries — how they work, `max-width` breakpoint
- Scaling the ring from 400px → 300px
- Scaling the numeral font from 80px → 56px
- `min-width` on inputs for touch targets

Checkpoint: verify the layout at 375px width (iPhone SE) with no overflow.

---

### Phase 11 — Wiring the Design to `timer.ts`
**Goal:** connect all new HTML IDs to the existing TypeScript logic; add the ring fraction to state.

Topics:
- DOM ID contract: new HTML must match every `getElementById` in `timer.ts`
- New `totalSeconds` / `elapsedSeconds` fields on `AppState` to compute the ring fill fraction
- Updating `render()` to drive `stroke-dashoffset` and state-aware classes

Checkpoint: the full app runs end-to-end — ring animates, colors shift, pulse fires on done.

---

## Questions & Learning Points

*(Recorded here after each phase is completed)*

---

---

## Learning Curves

*(Things that took extra time, caused confusion, or clicked in a non-obvious way — recorded as they happen)*

