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


| Button                          | Size                              | Style                                   |
| ------------------------------- | --------------------------------- | --------------------------------------- |
| Main CTA (Start/Resume)         | `height: 48px`, `padding: 0 28px` | Filled with accent color, pill shape    |
| Icon buttons (Reset ↺, Pause ⏸) | `48×48px`                         | Dark surface, subtle border, pill shape |


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

### Q: Why is `box-sizing: border-box` repeated on `button` if `*` already sets it?

`all: unset` on `button` resets everything — including `box-sizing` — wiping out what `*` set. So it must be restored explicitly after `all: unset`. Without it, the button reverts to `content-box` and padding/border are added on top of the height.

Without `all: unset`, writing `box-sizing: border-box` on `button` would be redundant — `*` already covers it.

---

### Q: What is the difference between `class` and `id` on the same element?

They serve different purposes and are used by different things:

| | `class` | `id` |
|---|---|---|
| Used by | CSS | JavaScript |
| Uniqueness | Shared across many elements | Must be unique on the page |
| Purpose | Describes the visual role | Identifies the specific element |

```html
<button class="btn-primary" id="start-btn">Start</button>
```

- CSS reads `btn-primary` → applies primary button styles to all buttons with that class
- JS reads `start-btn` → finds this specific button to attach a click handler

Think of it like a person: `id` is your name (unique), `class` is your job title (shared with others in the same role).

---

### Q: Do I need a wrapper div to apply a class to buttons?

No. If the class describes the button's own style, put it directly on the `<button>` element:

```html
<!-- wrong — class on wrapper div, not the button -->
<div class="btn-icon">
    <button id="pause-btn">Pause</button>
</div>

<!-- correct — class on the button itself -->
<button class="btn-icon" id="pause-btn">Pause</button>
```

Keep wrapper divs only for layout purposes (like `button-group` for flex spacing). Remove them when they exist only to carry a style class.

---

### Q: How do you read `*, *::before, *::after { box-sizing: border-box; }`?

One rule with three selectors separated by commas — all three get the same property:

- `*` — every element on the page
- `*::before` — every `::before` pseudo-element
- `*::after` — every `::after` pseudo-element

`box-sizing: border-box` makes `width` include padding and border. Without it, padding and border are added on top of `width`, making elements larger than expected. With it, elements stay exactly the size you set. Standard practice — put it once at the top and forget about it.

---

### Q: Why were all four buttons visible on page load even though `render()` had the right visibility logic?

`render(state)` was never called on page load — only on user interactions (clicks, input). The browser just displays all HTML elements as written, with no hiding applied.

The fix: call `render(state)` once at the very bottom of the wiring section, after all event listeners are set up. This applies the initial state (idle → show only Start) immediately when the page loads.

```ts
// at the bottom of the wiring section
render(state)  // applies idle state visibility on load
```