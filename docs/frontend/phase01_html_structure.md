# Phase 1 — HTML Document Structure

**Goal:** understand how a browser reads an HTML file and lay out the page skeleton.

---

## Topics

### The four outer tags

```
<!DOCTYPE html>   ← tells the browser: "this is modern HTML5"
<html>            ← root of the entire tree
  <head>          ← metadata the browser reads but doesn't display
  </head>
  <body>          ← everything the user actually sees
  </body>
</html>
```

`<head>` is invisible — it's where you put:
- `<title>` — the browser tab name
- `<meta>` — configuration (charset, viewport)
- `<link>` — connecting external files like CSS

`<body>` is everything the user sees. All rendered content goes here.

---

### Two meta tags your `<head>` needs

```html
<meta charset="UTF-8">
```
Tells the browser how to decode characters. Without it, special characters (accents, symbols) may display as garbage.

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```
Without this, a phone browser pretends the screen is ~980px wide and shrinks everything. This tag says: "use the actual device width." Critical for mobile.

```html
<link rel="stylesheet" href="style.css">
```
Connects your CSS file. `rel="stylesheet"` tells the browser what kind of file it is.

---

### Inline vs block elements

| Type | Behavior | Examples |
|---|---|---|
| **Block** | Takes full width of its container, starts on a new line | `<div>`, `<p>`, `<h1>`, `<section>`, `<header>`, `<main>` |
| **Inline** | Only as wide as its content, flows with surrounding content | `<span>`, `<button>`, `<input>` |

This matters for layout — block elements stack vertically by default. In Phase 4 (Flexbox) you'll learn how to override this.

---

### Semantic elements

The design has three distinct sections. HTML has tags that let you express what content *is*, not just wrap it:

| Tag | Meaning |
|---|---|
| `<header>` | Introductory content for the page or a section |
| `<main>` | The primary content of the page — use only once |
| `<section>` | A standalone thematic grouping |
| `<div>` | Generic container with no semantic meaning — use when nothing else fits |

Benefits of semantic tags: screen readers understand your page, and other developers can read the structure without decoding the styling.

---

## Task

Rewrite `index.html` with this structure.

**Rules:**
- Keep all existing IDs exactly as they are (`minutes-input`, `seconds-input`, `timer-display`, `start-btn`, `pause-btn`, `resume-btn`, `reset-btn`, `status-msg`) — `timer.ts` depends on them
- Add `<meta charset>`, `<meta viewport>`, and `<link rel="stylesheet">` to `<head>`
- Wrap the body content in a `<main>` element
- Inside `<main>`, three children in order:
  1. `<header>` — add a `<p>` with the text `"COUNTDOWN"` inside
  2. `<section>` for the ring area — the inputs and timer display (ring SVG comes in Phase 6)
  3. `<section>` for the controls — the four buttons and status message
- Move the `<script>` tag to the **bottom of `<body>`**, after all HTML — this ensures DOM elements exist before the script queries them

`style.css` can stay empty for now. The page will look identical to before.

---

## Questions & Learning Points

### Q: Why does `<header>` need to be inside `<main>`?

Technically it doesn't — both are valid HTML. The difference is semantic:

- `<header>` outside `<main>` means: "this belongs to the whole site, it appears on every page" — navigation bars, logos, site-wide branding
- `<header>` inside `<main>` means: "this belongs to this page's content specifically"

For a single-page tool with no navigation or other pages, the "COUNTDOWN" label is part of the timer UI — not a site-wide header. So it belongs inside `<main>`. The browser renders both identically; the distinction is about correctness and building the right habit for multi-page sites.

---

### Q: What's the difference between `<section id="">` and `<div id="">`?

The `id` attribute works the same on both — it's the tag that differs. The tag is about meaning, not the id.

- `<section>` — a standalone, meaningful chunk of the page. Could have its own heading. Use for the ring area, controls area.
- `<div>` — a generic grouping box with no inherent meaning. Use for layout containers inside sections: input pair, button group.

Rule: `<section>` when the chunk means something on its own. `<div>` when you just need a box.

---

### Q: What's the difference between `id` and `class`?

Both are attributes that label an element — the difference is in usage:

- `id` — unique, one per page. Used when targeting one specific element. How `timer.ts` finds elements: `document.getElementById("id")`. CSS selector: `#name`
- `class` — reusable, many elements can share it. Used when multiple elements share the same style. CSS selector: `.name`

They can coexist: `<button id="start-btn" class="btn-primary">` — id for JavaScript behavior, class for CSS appearance. This is the most common pattern. In the timer: existing IDs stay as-is (the DOM contract), classes are added on top for styling.

---

### Q: What is `<span>`?

`<span>` is an inline container with no semantic meaning — the inline equivalent of `<div>`.

- `<div>` groups block content (stacks vertically)
- `<span>` groups inline content (sits alongside other elements on the same line)

Most common use: wrap a small piece of text to style just that part without breaking the surrounding flow. In the timer, `<span>` is used for the `:` separator between the two inputs — all three stay on the same line because they're all inline elements.

---

### Q: How is the `<body>` usually structured with header, main, section, and div?

The general pattern:
```
<body>
  <header>    ← site-level header (logo, nav, title)
  <main>      ← the page's primary content — use only once
    <section> ← a meaningful chunk within main
    <section> ← another chunk
  <footer>    ← site-level footer
```

`<div>` is the fallback when no semantic tag fits — use it for smaller groupings inside sections (e.g. a pair of inputs side by side). Rule: use semantic tags as far down as they make sense, then switch to `<div>`.

For the timer: no nav or footer needed. The whole app is `<main>`, with `<header>` for the label and two `<section>` elements for ring and controls. `<header>` inside `<main>` is valid — it means "header for this region", not just for the whole page.

---

### Q: What is the advantage of ASCII over UTF-8 — memory or latency?

For pure English text, **none**. UTF-8 encodes characters 0–127 identically to ASCII — same 1 byte per character, same speed.

UTF-8 is variable-width: English stays 1 byte, accented letters use 2, most CJK 3, emoji 4. The leading bits on each byte signal how many bytes the character uses.

The only real trade-off: you can't jump to character N by byte index (byte 50 ≠ character 50) — you have to walk from the start. This matters for text editors and compilers, not for a browser rendering HTML.

ASCII's advantage is historical — simpler to implement in the 1960s when memory was scarce. Today UTF-8 costs nothing extra for English and supports 140,000+ characters. Always use UTF-8.

---

### Q: What is UTF-8, and are there other charsets?

A charset is a translation table between numbers and characters — computers only store numbers, so every character (`A`, `é`, `中`, `😊`) has a number assigned to it. The charset tells the browser which table to use.

| Charset | Coverage | Problem |
|---|---|---|
| `ASCII` | 128 characters — English only | No accents, no non-Latin scripts |
| `ISO-8859-1` | Western European languages | No Chinese, Arabic, emoji |
| `UTF-16` | All Unicode characters | Wastes space for English text |
| `UTF-8` | All Unicode characters (~140,000+) | Variable-width, efficient, universal |

UTF-8 won because it encodes common characters (English, digits, symbols) in 1 byte — same as ASCII — and expands to 2–4 bytes only when needed. Without it, the browser guesses the charset and occasionally gets it wrong, showing garbled characters like `CafÃ©` instead of `Café`.

---

### Q: What does the viewport meta tag actually do?

Without it, mobile browsers pretend the page is ~980px wide (to fit old desktop sites), then zoom out — everything looks tiny and unclickable.

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

- `width=device-width` — use the real screen width instead of the fake 980px
- `initial-scale=1.0` — don't zoom on load

Without this, `@media (max-width: 480px)` never triggers on a phone — the browser thinks the page is 980px wide even on a 375px screen.

