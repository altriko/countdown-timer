# Phase 6 — SVG Ring

**Goal:** understand inline SVG and build the animated progress ring.

---

## Topics

### What SVG is

SVG (Scalable Vector Graphics) is a way to draw shapes directly in HTML using coordinates, not pixels. Unlike images (`.png`, `.jpg`), SVG scales to any size without blurring.

Written inline in HTML:
```html
<svg width="400" height="400" viewBox="0 0 400 400">
    <circle cx="200" cy="200" r="185" />
</svg>
```

- `width` / `height` — the space the SVG occupies on the page
- `viewBox` — the internal coordinate system (`x y width height`). Here `0 0 400 400` means: "the drawing canvas starts at 0,0 and is 400×400 units"
- `cx`, `cy` — center x, center y of the circle
- `r` — radius

---

### Drawing a ring (not a filled circle)

A circle is filled by default. To make a ring, remove the fill and add a stroke:

```html
<circle
    cx="200" cy="200" r="185"
    fill="none"
    stroke="oklch(20% 0.015 240)"
    stroke-width="5"
/>
```

- `fill="none"` — hollow interior
- `stroke` — the outline color
- `stroke-width` — thickness of the outline

Two circles = track (background) + progress (foreground):
```html
<circle ... stroke="var(--ring-track)" />   <!-- grey background ring -->
<circle ... stroke="var(--accent)" />        <!-- colored progress ring -->
```

---

### `stroke-dasharray` and `stroke-dashoffset` — the animation mechanic

This is the core of the ring animation.

`stroke-dasharray` turns a solid stroke into a dashed line — alternating drawn segments and gaps:

```css
stroke-dasharray: 100 50;   /* 100px drawn, 50px gap, repeat */
```

If you set the dash length to the full circumference of the circle, and the gap to the same, you get one single dash that covers the entire ring:

```
Circumference = 2 × π × r = 2 × 3.14159 × 185 ≈ 1162.4
stroke-dasharray: 1162.4;   /* one dash covering the full ring */
```

`stroke-dashoffset` shifts where that dash starts:
```
offset = 0        → full ring drawn (100% remaining)
offset = 581.2    → half ring drawn (50% remaining)
offset = 1162.4   → nothing drawn (0% remaining)
```

Formula:
```
offset = circumference × (1 − fraction_remaining)
```

In TypeScript, `render()` will compute this and set it as an inline style each tick.

---

### Starting at 12 o'clock

By default, SVG starts drawing at 3 o'clock (right side). Rotate the whole SVG −90° to start at 12:

```css
svg {
    transform: rotate(-90deg);
}
```

---

### `pointer-events: none`

Critical — without this, the SVG sits on top of the inputs and blocks clicks:

```css
svg {
    pointer-events: none;
    position: absolute;   /* placed over the center content, covered in Phase 7 */
}
```

---

### Tick marks

60 `<line>` elements evenly distributed around the ring. JavaScript (or a loop at build time) generates them — you don't write 60 lines by hand. In Phase 11 we'll generate them from `timer.ts`. For now, the track and progress circles are enough.

---

### Glow effect

A third circle, identical to the progress circle but thinner and blurred, creates the neon glow:

```html
<circle
    id="ring-glow"
    cx="200" cy="200" r="185"
    fill="none"
    stroke="var(--accent)"
    stroke-width="2.5"
    opacity="0.3"
    style="filter: blur(4px)"
/>
```

---

## Task

Add an SVG ring inside `<section id="ring">` in `index.html`, before the `.input-group`:

```html
<svg id="ring-svg" width="400" height="400" viewBox="0 0 400 400">
    <!-- track: full background ring -->
    <circle id="ring-track" cx="200" cy="200" r="185"
        fill="none" stroke-width="5" />

    <!-- glow: blurred duplicate of progress -->
    <circle id="ring-glow" cx="200" cy="200" r="185"
        fill="none" stroke-width="2.5" opacity="0.3" />

    <!-- progress: the animated ring -->
    <circle id="ring-progress" cx="200" cy="200" r="185"
        fill="none" stroke-width="5" stroke-linecap="round"
        stroke-dasharray="1162.4" stroke-dashoffset="0" />
</svg>
```

In `style.css`:
```css
#ring-svg {
    transform: rotate(-90deg);
    pointer-events: none;
}

#ring-track  { stroke: var(--ring-track); }
#ring-progress { stroke: var(--accent); }
#ring-glow   { stroke: var(--accent); filter: blur(4px); }
```

Check in the browser — you should see a grey track ring and a green progress ring on top of it.

---

## Questions & Learning Points

**Q: What does `stroke-dasharray: 1162.4` mean and why that number?**
A: It sets one dash equal to the full circumference of the circle, making it look like a solid ring. 1162.4 = 2 × π × 185 (the radius).

**Q: What does `stroke-dashoffset` control?**
A: How far the dash is shifted along the stroke. Offset 0 = full ring drawn. Offset = circumference = nothing drawn.

**Q: How do you calculate the offset for 50% remaining?**
A: `offset = circumference × (1 − fraction_remaining)` → `1162.4 × 0.5 = 581.2`. We subtract from 1 because the offset represents how much has been *used*, not how much is *left*.

**Q: Why does the SVG need to be inside `<section id="ring">`?**
A: Phase 7 uses `position: absolute` to overlay the SVG on top of the section content. A child can only be positioned relative to its parent container — if the SVG is outside the section, it can't be anchored to it.

**Mistakes caught during review:**
- `heights` typo in SVG attribute (should be `height`)
- `filter: blur(4px)` was on `#ring-progress` instead of `#ring-glow`
- Missing semicolon in CSS: `stroke: var(--accent) filter:blur(4px)` — broke both declarations
- SVG was placed outside `<section id="ring">` instead of inside it
