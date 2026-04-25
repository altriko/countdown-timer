# Phase 5 — Box Model & Button Styling

**Goal:** understand how CSS sizes elements; build the pill-shaped buttons.

---

## Topics

### The Box Model

Every HTML element is a rectangular box made of four layers:

```
┌─────────────────────────────┐
│           margin            │  ← space outside the border (pushes other elements away)
│  ┌───────────────────────┐  │
│  │        border         │  │  ← the visible edge
│  │  ┌─────────────────┐  │  │
│  │  │     padding      │  │  │  ← space between border and content
│  │  │  ┌───────────┐  │  │  │
│  │  │  │  content  │  │  │  │  ← the actual text/image
│  │  │  └───────────┘  │  │  │
│  │  └─────────────────┘  │  │
│  └───────────────────────┘  │
└─────────────────────────────┘
```

```css
.box {
    width: 200px;         /* content width */
    padding: 12px 24px;   /* top/bottom 12px, left/right 24px */
    border: 1px solid red;
    margin: 8px;
}
```

**Important:** by default, `width` only sets the content box. Padding and border are added on top, making the element larger than expected. Fix this with:

```css
*, *::before, *::after {
    box-sizing: border-box;   /* width now includes padding and border */
}
```

Put this at the top of your CSS. It's standard practice in every modern project.

---

### `border-radius`

Rounds the corners of an element:

```css
border-radius: 8px;     /* slightly rounded */
border-radius: 16px;    /* more rounded */
border-radius: 100px;   /* pill shape — works on any element where this exceeds half the height */
border-radius: 50%;     /* perfect circle (only when width = height) */
```

`100px` on a `48px` tall button makes it a pill — the radius exceeds the half-height so the ends become fully round.

---

### Button reset

Browsers apply their own default styles to buttons (grey background, border, system font). Always reset them first:

```css
button {
    all: unset;           /* removes all browser defaults */
    cursor: pointer;      /* hand cursor on hover */
    box-sizing: border-box;
}
```

Then build the style back up from scratch.

---

### Three button variants

| Button | Size | Style |
|---|---|---|
| Main CTA (Start/Resume) | `height: 48px`, `padding: 0 28px` | Filled with accent color, pill shape |
| Icon buttons (Reset ↺, Pause ⏸) | `48×48px` | Dark surface, subtle border, pill shape |

```css
/* shared base for all buttons */
button {
    height: 48px;
    border-radius: 100px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
}

/* icon-only buttons */
.btn-icon {
    width: 48px;
    background: var(--surface);
    border: 1px solid var(--border);
    color: var(--text);
}

/* main CTA button */
.btn-primary {
    padding: 0 28px;
    background: var(--text);   /* white in idle state */
    color: var(--bg);          /* dark text on white */
}
```

---

### `:hover` and `:disabled` pseudo-classes

```css
button:hover {
    opacity: 0.85;    /* slightly dim on hover */
}

button:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}
```

Pseudo-classes target an element in a specific state without adding a class in HTML.

---

## Task

1. Add `*, *::before, *::after { box-sizing: border-box; }` at the top of `style.css`

2. Reset all buttons:
   - Remove browser defaults
   - Set `height: 48px`, `border-radius: 100px`
   - Set font: DM Sans, 14px, weight 500
   - `cursor: pointer`

3. Add class `btn-icon` to the Reset and Pause buttons in `index.html`, and `btn-primary` to Start/Resume. Style each variant.

4. Add `:hover` opacity effect

5. Check in the browser — buttons should be pill-shaped, two distinct styles

---

## Questions & Learning Points

*(Recorded after the task is completed and reviewed)*
