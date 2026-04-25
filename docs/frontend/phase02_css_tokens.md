# Phase 2 — CSS Custom Properties & Design Tokens

**Goal:** define the color and spacing system once and reuse it everywhere.

---

## Topics

### How CSS connects to HTML

CSS (Cascading Style Sheets) is a separate language from HTML. It selects elements and applies rules to them.

The basic unit is a **rule**:

```css
selector {
    property: value;
}
```

- **Selector** — which element(s) to target
- **Property** — what to change (`color`, `font-size`, `background`, etc.)
- **Value** — what to set it to

Examples:
```css
p {
    color: red;         /* all <p> elements turn red */
}

#timer-display {
    font-size: 80px;    /* the element with id="timer-display" */
}

.input-group {
    display: flex;      /* all elements with class="input-group" */
}
```

The "cascading" part means rules can overlap — more specific selectors win. `#id` beats `.class` beats `tag`.

---

### CSS Custom Properties (Design Tokens)

A **custom property** (also called a CSS variable) lets you define a value once and reuse it everywhere:

```css
:root {
    --bg: oklch(10% 0.012 240);
}

body {
    background: var(--bg);   /* use it with var() */
}
```

`:root` is the top of the HTML tree — variables defined here are available to every element on the page.

Why this matters for the timer: the accent color changes per state (green → amber → coral). Without tokens you'd have to update that color in 5 different places. With tokens, you change one value.

---

### The `oklch()` color space

`oklch` defines colors using three values:

```
oklch(Lightness%  Chroma  Hue)
```

| Value | What it controls | Range |
|---|---|---|
| **L** — Lightness | How light or dark | `0%` (black) → `100%` (white) |
| **C** — Chroma | How vivid/saturated | `0` (grey) → ~`0.37` (max vivid) |
| **H** — Hue | Which color | `0`–`360` (like a color wheel) |

Hue reference: `0` = red, `65` = amber, `158` = green, `240` = blue

```css
oklch(10% 0.012 240)   /* near-black with a faint blue-grey tint — the background */
oklch(72% 0.18 158)    /* vivid mint green — running state */
oklch(72% 0.18 65)     /* vivid amber — paused state */
oklch(72% 0.18 18)     /* vivid coral red — done state */
oklch(50% 0.012 240)   /* muted grey — idle state */
```

Notice the state colors all share `72% 0.18` — same brightness and vividness, just different hue. That's intentional — the design stays visually consistent while states are clearly distinct.

---

## Design Tokens to Define

From `docs/design/README.md`:

```css
:root {
    --bg:           oklch(10% 0.012 240);   /* page background */
    --surface:      oklch(14% 0.015 240);   /* button/card surface */
    --border:       oklch(22% 0.018 240);   /* subtle borders */
    --text:         oklch(92% 0.008 240);   /* primary text / white */
    --muted:        oklch(50% 0.012 240);   /* secondary text */
    --ring-track:   oklch(20% 0.015 240);   /* ring background track */
    --accent:       oklch(72% 0.18 158);    /* running — mint */
    --accent-pause: oklch(72% 0.18 65);     /* paused — amber */
    --accent-done:  oklch(72% 0.18 18);     /* done — coral */
    --accent-idle:  oklch(50% 0.012 240);   /* idle — grey */
}
```

---

## Task

Open `style.css` and:

1. Define all 10 tokens above inside `:root { }`
2. Add one rule: set `background` on `body` to `var(--bg)` — you should see the page go dark when you open it in the browser
3. Run `npx serve .` and open `http://localhost:3000` to verify

That's it for this phase — no other styling yet.

---

## Questions & Learning Points

*(Recorded after the task is completed and reviewed)*

