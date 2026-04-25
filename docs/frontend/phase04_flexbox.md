# Phase 4 — Flexbox Layout

**Goal:** build the full-page vertical layout and the horizontal controls row.

---

## Topics

### What Flexbox is

Flexbox is a CSS layout mode that arranges children in a row or column — and handles alignment, spacing, and sizing automatically.

Without Flexbox, elements stack vertically (block) or flow inline. With Flexbox, you control direction, alignment, and gaps precisely.

You turn it on with one declaration on the **parent**:
```css
.parent {
    display: flex;
}
```

The direct children of `.parent` become **flex items** and are arranged by the rules you set on the parent.

---

### The main properties

```css
.container {
    display: flex;

    flex-direction: row;        /* row (default) = horizontal, column = vertical */
    justify-content: center;    /* alignment along the main axis */
    align-items: center;        /* alignment along the cross axis */
    gap: 48px;                  /* space between children */
}
```

**Main axis vs cross axis:**
- `flex-direction: row` → main axis is horizontal, cross axis is vertical
- `flex-direction: column` → main axis is vertical, cross axis is horizontal

`justify-content` controls spacing along the main axis.
`align-items` controls alignment on the cross axis.

Common values for both:
```css
center        /* centered */
flex-start    /* at the start (left for row, top for column) */
flex-end      /* at the end */
space-between /* first and last touch edges, equal gaps between */
```

---

### `gap` vs `margin`

```css
gap: 48px;        /* space between flex children — set on the parent */
margin: 48px;     /* space around an element — set on the child */
```

`gap` is cleaner — one property handles all spacing between children. `margin` requires setting it on each child and leads to "first child / last child" edge cases.

---

### Centering the full-viewport layout

The page background needs to fill the full screen and center the content:

```css
body {
    min-height: 100vh;    /* at least the full viewport height */
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
```

`100vh` = 100% of the viewport height. `min-height` (not `height`) lets the page grow taller if content overflows.

---

### Nested flex

`<main>` is a vertical column (header → ring → controls).
`<section id="controls">` contains a horizontal row of buttons.

Each container is its own flex context:

```css
main {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 48px;
}

.button-group {
    display: flex;
    flex-direction: row;
    gap: 12px;
}
```

Flex is always scoped to direct children — nesting is fine and common.

---

## Task

1. Style `body`:
   - `min-height: 100vh`
   - `display: flex`, `flex-direction: column`
   - `justify-content: center`, `align-items: center`
   - `background: var(--bg)` (if not already set)
   - Remove default browser margin: `margin: 0`

2. Style `main`:
   - `display: flex`, `flex-direction: column`
   - `align-items: center`
   - `gap: 48px`

3. Style `.button-group`:
   - `display: flex`
   - `gap: 12px`
   - `justify-content: center`

4. Check in the browser — the three sections should be centered vertically and horizontally on the dark background, spaced 48px apart.

---

## Questions & Learning Points

*(Recorded after the task is completed and reviewed)*
