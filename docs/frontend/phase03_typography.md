# Phase 3 — Typography & Google Fonts

**Goal:** load external fonts and apply the design's typographic rules.

---

## Topics

### Loading Google Fonts

Google Fonts hosts free fonts you can load via a URL. Two ways to include them:

**Option A — `@import` in CSS** (what we'll use):
```css
@import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=DM+Sans:wght@300;400;500&display=swap');
```
Put this at the very top of `style.css` — before any rules.

**Option B — `<link>` in HTML**:
```html
<link href="https://fonts.googleapis.com/..." rel="stylesheet">
```

Both work. `@import` keeps all font concerns in the CSS file. `<link>` loads slightly faster. For this project either is fine.

---

### `font-family`

Tells the browser which font to use. Always list fallbacks in case the custom font fails to load:

```css
font-family: 'Space Mono', monospace;
font-family: 'DM Sans', sans-serif;
```

The browser tries left to right — if Space Mono isn't loaded, it falls back to the system monospace font.

---

### Why two fonts?

| Font | Used for | Why |
|---|---|---|
| `Space Mono` | The time numerals (`2:30`) | Monospace — every digit is the same width, so `1:00` and `9:59` don't shift layout |
| `DM Sans` | Labels, buttons, status | Clean, modern sans-serif — easy to read at small sizes |

Monospace fonts are critical for timers and counters — without it, the display jumps left/right as digits change width.

---

### Key typography properties

```css
font-size: 80px;              /* size of the text */
font-weight: 700;             /* thickness: 400 = regular, 500 = medium, 700 = bold */
letter-spacing: 0.25em;       /* space between characters */
text-transform: uppercase;    /* forces ALL CAPS without changing the HTML */
line-height: 1;               /* vertical space between lines (1 = same as font-size) */
```

`em` is a relative unit — `0.25em` means "25% of the current font size". So at `11px`, `0.25em` = ~2.75px of letter spacing.

---

### The `ch` unit

`ch` = the width of the `0` character in the current font.

```css
input { width: 2.2ch; }
```

For the minute/second inputs: `2.2ch` means "wide enough for two digits, with a tiny bit of breathing room." This is font-aware — it adjusts if the font changes, unlike a fixed `px` value.

---

## Design Typography Rules

| Element | Font | Size | Weight | Letter-spacing | Other |
|---|---|---|---|---|---|
| `"COUNTDOWN"` header | DM Sans | 11px | 500 | 0.25em | uppercase |
| Time numerals | Space Mono | 80px | 700 | −0.02em | — |
| Status label | DM Sans | 11px | 500 | 0.2em | uppercase |
| Buttons | DM Sans | 14px | 500 | — | — |

---

## Task

1. Add the `@import` for both fonts at the top of `style.css`
2. Style the `<header> p` (COUNTDOWN label):
   - font: DM Sans, 11px, weight 500
   - letter-spacing: 0.25em
   - text-transform: uppercase
   - color: `var(--muted)`
3. Style `#status-msg`:
   - same font rules as the header label
   - letter-spacing: 0.2em
   - color: `var(--muted)` for now (it'll change per state in Phase 8)
4. Check in the browser — the COUNTDOWN text should be small, spaced, muted grey

---

## Questions & Learning Points

### Q: Why use `.input-group input` instead of just `.input-group` or `input`?

- `.input-group` targets the `<div>` wrapper itself — not the inputs inside it
- `input` targets every input on the page — too broad, would catch unrelated inputs added later
- `.input-group input` means "inputs that are descendants of `.input-group`" — precise and scoped

The space between two parts of a selector means "a descendant of."

---

### Q: Why can I use Comic Sans MS without importing it from Google Fonts?

Comic Sans MS is a system font — pre-installed on the OS. The browser checks system fonts first; if found, no network request is needed.

Two font sources:
- **System fonts** — pre-installed, always available (Arial, Georgia, Comic Sans MS)
- **Web fonts** — hosted externally, must be loaded via `@import` (DM Sans, Space Mono)

This is also why `font-family` has fallbacks: `'DM Sans', sans-serif` — if the web font fails to load, use the system sans-serif instead.
