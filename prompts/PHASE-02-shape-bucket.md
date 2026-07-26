# Phase 02 — Shape Bucket Interaction

Status: **PLANNED**

## Objective
Build the first real MIND VAULT gameplay interaction and establish the quality bar for touch/mouse motion.

## Scope
Start only with Little Explorer (age 3–5) and one mechanic: sort shapes into matching buckets.

Implement:
- Circle, triangle and square draggable objects.
- Matching target buckets.
- Pointer Events; one interaction path for touch/mouse/pen.
- Do not use native HTML5 drag-and-drop.
- Pick: subtle scale/elevation feedback.
- Move: object follows the pointer smoothly with no perceptible lag.
- Hover/near valid target: subtle bucket reaction.
- Correct drop: smooth snap into target + small positive response.
- Incorrect drop: smooth return to origin; no harsh failure screen.
- Simple round progress.
- Keyboard-accessible fallback where practical without compromising the main interaction.
- `prefers-reduced-motion` alternative.

## Performance rules
- No physics engine.
- No animation library.
- Prefer transform/opacity.
- Avoid per-frame layout reads/writes.
- Keep DOM small.
- Must remain pleasant on low-end mobile hardware.

## Out of scope
- Other puzzle mechanics.
- Brain scoring/adaptive difficulty.
- Cloud/offline architecture changes.
- Large content set.
- Complex rewards/particles.

## Verification target
Test real touch and mouse behavior, not only automated DOM state. The interaction must feel premium before proceeding.

## Gate
Phase 2 cannot become READY until Phase 1 is ACCEPTED by the architect. When eventually executed, finish with tracker status `REVIEW` and STOP.