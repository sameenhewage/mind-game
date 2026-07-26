# MIND VAULT — agent notes

## Read before work

Before implementing anything, read in this order:

1. `PHASE-TRACKER.md`
2. `DECISIONS.md`
3. the exact current file under `prompts/`
4. this file

Only a phase marked `READY` may start.

## Verify before committing

```bash
npm run build   # runs `tsc --noEmit` then `vite build`; must pass
npm run dev     # manual check at 320px width and desktop width
```

There is no test runner yet. Add one only when there is real logic to test.
Scoring/difficulty in Phase 3 are the first genuine candidates.

## Hard constraints

- No framework (React/Vue/Angular), no game engine (Phaser/PixiJS/Three.js), no
  state library, no animation or physics library, no UI component kit unless a
  demonstrated current requirement is reviewed and approved.
- Keep runtime dependencies at zero by default. Justify any new dependency.
- No backend/database/authentication in current early phases. Cloud work exists only
  in its explicitly approved later phase.
- `localStorage` is for tiny bootstrap/preferences only. Do not put long-term game
  progress there.
- Actual local game progress belongs in native IndexedDB once Phase 3 establishes a
  concrete progress model.
- Offline application caching belongs to the later PWA phase and is separate from
  player progress storage.
- Do not use native HTML5 drag-and-drop. Use Pointer Events so mouse/touch/pen share
  one gameplay path.
- Prefer transform/opacity motion; support `prefers-reduced-motion`.
- Never label a player with IQ, mental age or intelligence. In-game skill names only.
- Do not collect unnecessary personal data. Early phases use age group only.
- Puzzles must be skill-solvable. No hidden random failure.

## Working rules

- Work one phase at a time.
- The architect owns phase scope, prompts and acceptance.
- At implementation start, change only the current phase from `READY` to
  `IN_PROGRESS`.
- After verified implementation and a focused commit, update that phase to `REVIEW`
  with commit/verification details, report, and STOP.
- Never mark your own work `ACCEPTED`.
- Never promote or start the next phase yourself.
- Reuse the established puzzle mechanics where they fit rather than creating a new
  system per puzzle.
- Add files only when the current phase needs them. No repositories, service layers,
  use-case layers, DI, event buses, plugin systems or speculative abstractions.
- Difficulty is integer 1–5 and changes gradually.
- Branch: `master` only unless the architect explicitly changes the workflow.