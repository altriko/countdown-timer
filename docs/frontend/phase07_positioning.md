# Phase 7 — Positioning & Layering

**Goal:** stack the time display on top of the SVG ring.

---

## Topics

### The positioning problem

The ring (SVG) and the center content (inputs / timer display) both need to occupy the same space — one on top of the other. Normal document flow puts elements one after another — it doesn't allow overlap. Positioning breaks out of that flow.

---

### `position: relative` and `position: absolute`

These always work as a pair — a parent and a child.

```css
.parent {
    position: relative;   /* establishes a positioning context */
}

.child {
    position: absolute;   /* positioned relative to the nearest 'relative' ancestor */
    top: 0;
    left: 0;
}
```

- `position: relative` on the parent says: "my children can use me as their coordinate origin"
- `position: absolute` on the child removes it from normal flow and positions it relative to that parent

**Without `position: relative` on a parent**, an absolute child walks up the tree until it finds one — defaulting to the `<html>` element (the whole page).

---

### Centering an absolute element

Use `inset: 0` (shorthand for `top: 0; right: 0; bottom: 0; left: 0`) with `margin: auto`:

```css
.child {
    position: absolute;
    inset: 0;
    margin: auto;
    width: fit-content;
    height: fit-content;
}
```

This works because `margin: auto` distributes leftover space equally on all sides.

---

### `z-index` — controlling layer order

When elements overlap, `z-index` controls which one appears on top:

```css
.behind { z-index: 0; }   /* lower = further back */
.front  { z-index: 1; }   /* higher = closer to viewer */
```

Only works on elements with a `position` set (not `static`, which is the default).

---

### The ring container structure

The `<section id="ring">` needs to be the positioning parent. The SVG sits behind, the center content sits in front:

```
<section id="ring">             ← position: relative, fixed size 400×400px
    <svg id="ring-svg">         ← position: absolute, fills the container, z-index: 0
    <div class="ring-center">   ← position: absolute, centered, z-index: 1
        <div class="input-group">
        <div id="timer-display">
        <p id="status-msg">
    </div>
```

---

### `display: grid` alternative for centering

Another common approach — using grid instead of absolute positioning:

```css
#ring {
    display: grid;
    place-items: center;   /* centers both axes at once */
}

#ring > * {
    grid-area: 1 / 1;      /* all children share the same grid cell = overlap */
}
```

This is cleaner than absolute positioning when all you want is overlap + centering. We'll use the absolute approach since it's more universal.

---

## Task

1. In `index.html`, wrap the `.input-group` and `#timer-display` in a `<div class="ring-center">`. Move `#status-msg` inside it too.

2. In `style.css`:

```css
#ring {
    position: relative;
    width: 400px;
    height: 400px;
}

#ring-svg {
    position: absolute;
    inset: 0;
}

.ring-center {
    position: absolute;
    inset: 0;
    margin: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 1;
}
```

3. Check in the browser — the inputs and timer display should be centered inside the ring.

---

## Questions & Learning Points

*(Recorded after the task is completed and reviewed)*
