# Phase 9 — Animations & Done State

**Goal:** understand `@keyframes` and implement the pulse ring on completion.

---

## Topics

### `transition` vs `animation`

| | `transition` | `animation` |
|---|---|---|
| Trigger | A state change (hover, class added) | Runs on its own, or when a class is applied |
| Control | Start → End | Full control over every step |
| Loop | No | Yes (`infinite`) |
| Use case | Smooth state changes | Ongoing effects (pulse, spin, fade loop) |

Transitions react to something. Animations run independently.

---

### `@keyframes`

Defines the steps of an animation:

```css
@keyframes pulse {
    0%   { transform: scale(1);   opacity: 0.6; }
    100% { transform: scale(1.5); opacity: 0; }
}
```

- Percentages represent points in time through the animation (0% = start, 100% = end)
- You can add as many steps as needed
- `from` and `to` are shorthand for `0%` and `100%`

---

### `animation` shorthand

```css
.element {
    animation: name duration easing delay iteration-count direction;
}

/* example */
.pulse-ring {
    animation: pulse 1.5s ease-out 0s infinite;
}
```

| Part | Value | Meaning |
|---|---|---|
| `name` | `pulse` | Which `@keyframes` to use |
| `duration` | `1.5s` | How long one cycle takes |
| `easing` | `ease-out` | Speed curve |
| `delay` | `0s` | Wait before starting |
| `iteration-count` | `infinite` | Loop forever |

---

### `::before` and `::after` pseudo-elements

Pseudo-elements let you insert a virtual element before or after an element's content — without adding HTML:

```css
.ring-center::before {
    content: '';          /* required — even if empty */
    display: block;
    /* now style it like any element */
}
```

`::before` inserts before the content. `::after` inserts after.

For the pulse ring: a `::before` on `.ring-center` creates an expanding circle that scales out and fades — no extra HTML needed.

---

### The pulse ring

The effect: a circle that starts at the ring's size, scales outward, and fades to invisible — looping while in the `done` state.

```css
@keyframes pulse-ring {
    0%   { transform: scale(0.95); opacity: 0.6; }
    100% { transform: scale(1.3);  opacity: 0; }
}

[data-state="done"] .ring-center::before {
    content: '';
    position: absolute;
    width: 370px;        /* roughly the ring diameter */
    height: 370px;
    border-radius: 50%;
    border: 2px solid var(--accent-done);
    animation: pulse-ring 1.5s ease-out infinite;
}
```

It only appears in the `done` state — the `[data-state="done"]` selector ensures that.

---

### Three-tone beep (Web Audio API)

The design specifies an ascending three-tone beep on completion: `523Hz`, `659Hz`, `784Hz` (C5, E5, G5 — a major chord), each ~350ms, staggered 180ms apart.

This replaces the single-tone `playAlert()` in `timer.ts`:

```typescript
function playAlert(): void {
    const ctx = new AudioContext()
    const tones = [523, 659, 784]

    tones.forEach((freq, i) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.connect(gain)
        gain.connect(ctx.destination)

        osc.frequency.value = freq
        osc.type = 'sine'

        const start = ctx.currentTime + i * 0.18
        gain.gain.setValueAtTime(0.6, start)
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.35)
        osc.start(start)
        osc.stop(start + 0.35)
    })
}
```

---

## Task

1. Add the `@keyframes pulse-ring` definition to `style.css`

2. Add the `::before` pulse rule scoped to `[data-state="done"] .ring-center`

3. Check in the browser — set a short timer (5 seconds), let it run to done, confirm the pulse ring fires and the color shifts to coral

4. *(Optional)* Update `playAlert()` in `timer.ts` to use the three-tone ascending beep

---

## Questions & Learning Points

*(Recorded after the task is completed and reviewed)*
