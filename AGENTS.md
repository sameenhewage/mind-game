# MIND VAULT — agent notes

## Verify before committing

```bash
npm run build   # runs `tsc --noEmit` then `vite build`; must pass
npm run dev     # manual check at 320px width and desktop width
```

There is no test runner yet. Add one only when there is real logic to test
(scoring and difficulty in Phase 3 are the first genuine candidates).

## Hard constraints

- No framework (React/Vue/Angular), no game engine (Phaser/PixiJS/Three.js), no
  state library, no animation or physics library, no UI component kit.
- No backend, no database, no authentication. `localStorage` only.
- Keep runtime dependencies at zero. Justify any new dependency in the commit.
- Do not use native HTML5 drag-and-drop. Use Pointer Events so mouse and touch
  share one code path.
- Animate `transform` and `opacity` only; support `prefers-reduced-motion`.
- Never label a player with IQ, mental age or intelligence. In-game skill names only.
- Never store personal data: no name, date of birth, school, address, phone, email.
  Age *group* only.
- Puzzles must be skill-solvable. No hidden random failure.

## Working rules

- Work one phase at a time (see the phase table in `README.md`). Finish and commit
  a phase before starting the next.
- Reuse the five puzzle mechanics (sort, match, sequence, memory, choice) instead
  of building a new system per puzzle.
- Add files only when the current phase needs them. No repositories, service
  layers, use-case layers, DI, event buses or plugin systems.
- Difficulty is an integer 1–5 and moves one step at a time.
- Branch: `master` only.
