# MIND VAULT — agent notes

## Read before work

Before implementing anything, read in this order:

1. `PHASE-TRACKER.md`
2. `DECISIONS.md`
3. `prompts/EXECUTE-CURRENT-ROADMAP.md`
4. the exact current phase file under `prompts/`
5. this file

The current gameplay milestone may execute sequentially according to the tracker/batch authorization. Do not execute `DEFERRED` phases.

## Verify before committing

```bash
npm run build   # runs `tsc --noEmit` then `vite build`; must pass
npm run dev     # manual/browser check at mobile and desktop widths
```

There is no test runner yet. Add one only when there is real deterministic logic worth testing. Scoring/difficulty in Phase 3 are the first genuine candidates.

## Hard constraints

- No framework (React/Vue/Angular), no game engine (Phaser/PixiJS/Three.js), no state library, no animation or physics library, no UI component kit unless a demonstrated current requirement is architect-approved.
- Keep runtime dependencies at zero by default. Justify any new dependency.
- Current milestone is GAMEPLAY ONLY: no backend, database, authentication, Google/Apple sign-in, cloud sync or parent-account system.
- `localStorage` is for tiny bootstrap/preferences only, such as selected age group.
- Do not introduce IndexedDB during the current gameplay milestone.
- Do not introduce service workers/PWA/offline-cache infrastructure during the current gameplay milestone.
- Brain scores, difficulty and Vault Run state may remain in memory for the active session.
- Do not use native HTML5 drag-and-drop. Use Pointer Events so mouse/touch/pen share one gameplay path.
- Prefer transform/opacity motion; support `prefers-reduced-motion`.
- Never label a player with IQ, mental age or intelligence. In-game skill names only.
- Do not collect unnecessary personal data. Current gameplay asks for age group only.
- Puzzles must be skill-solvable. No hidden random failure.

## Working rules

- Work one executable gameplay phase at a time; never implement phases in parallel.
- The architect owns phase scope and final acceptance.
- Change the active phase to `IN_PROGRESS`, implement it, verify it, create a focused commit, and mark it `COMPLETE` with evidence.
- In the authorized gameplay batch, continue to the next executable `QUEUED` phase without waiting for chat approval.
- Skip `DEFERRED` phases completely.
- Never mark your own work `ACCEPTED`.
- Reuse established puzzle mechanics where they fit rather than creating a new system per puzzle.
- Add files only when the current phase needs them. No repositories, service layers, use-case layers, DI, event buses, plugin systems or speculative abstractions.
- Difficulty is integer 1–5 and changes gradually.
- Branch: `master` only unless the architect explicitly changes the workflow.
- After the final executable gameplay phase, return one consolidated report and STOP.