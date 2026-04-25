# Phase 10 — Responsive Design

**Goal:** adapt the layout to mobile screens (≤480px).

---

## Topics

### What responsive design means

The same HTML and CSS file serves every screen size — phone, tablet, desktop. Instead of building separate versions, you write CSS that **adapts** based on the screen width.

This is why the `<meta viewport>` tag from Phase 1 was critical — without it, media queries don't work on phones.

---

### `@media` queries

A media query wraps CSS rules in a condition — the rules only apply when the condition is true:

```css
/* applies always */
body {
    font-size: 16px;
}

/* applies only when screen width is 480px or less */
@media (max-width: 480px) {
    body {
        font-size: 14px;
    }
}
```

The browser evaluates the condition on load and whenever the window is resized. Rules inside the query override the rules outside it (when the condition is met).

---

### Mobile-first vs desktop-first

Two approaches:

**Desktop-first** (what this project uses): write styles for desktop, then use `max-width` queries to override for smaller screens:
```css
/* desktop default */
#ring { width: 400px; }

/* override for mobile */
@media (max-width: 480px) {
    #ring { width: 300px; }
}
```

**Mobile-first**: write styles for mobile, then use `min-width` queries to enhance for larger screens:
```css
/* mobile default */
#ring { width: 300px; }

/* enhance for desktop */
@media (min-width: 481px) {
    #ring { width: 400px; }
}
```

Mobile-first is generally better practice (forces you to prioritize the constrained case), but desktop-first is fine for a project this size.

---

### What changes at ≤480px

From the design spec:

| Element | Desktop | Mobile (≤480px) |
|---|---|---|
| Ring container | `400×400px` | `300×300px` |
| Time numerals | `80px` | `56px` |
| SVG dimensions | `400×400` | `300×300` |
| SVG `cx`, `cy` | `200` | `150` |
| Circumference | `1162.4` | `871.8` (2 × π × 185 stays the same radius, but SVG scales) |

Actually for the ring, the simpler approach is to scale the SVG with CSS rather than changing attributes:

```css
@media (max-width: 480px) {
    #ring {
        width: 300px;
        height: 300px;
    }

    #ring-svg {
        width: 300px;
        height: 300px;
    }
}
```

The SVG `viewBox` stays `0 0 400 400` — the browser scales the drawing to fit the new dimensions automatically.

---

### Touch targets

On mobile, buttons need to be large enough to tap reliably. Apple's HIG recommends a minimum of 44×44px. Your buttons are already 48×48px — no change needed. But check that nothing is cramped or overflowing on a small screen.

---

### Testing responsive design

In Chrome DevTools (F12):
1. Click the device toolbar icon (top-left of DevTools)
2. Select a preset device (iPhone SE = 375px wide) or type a custom width
3. The page re-renders at that size

---

## Task

Add a single `@media (max-width: 480px)` block to `style.css`:

```css
@media (max-width: 480px) {
    #ring {
        width: 300px;
        height: 300px;
    }

    #ring-svg {
        width: 300px;
        height: 300px;
    }

    #timer-display,
    .input-group input {
        font-size: 56px;
    }
}
```

Check in Chrome DevTools at 375px width — no overflow, buttons are tappable, ring fits the screen.

---

## Questions & Learning Points

*(Recorded after the task is completed and reviewed)*
