# MIND VAULT — Execute Current Gameplay Milestone

Status: **AUTHORIZED**

This is the architect authorization to build the playable game first. Authentication, durable progress persistence, offline/PWA infrastructure and cloud sync are intentionally deferred until the completed game milestone is reviewed.

## Execution order

Execute sequentially:

1. Phase 1 — Navigation & Player Entry
2. Phase 2 — Shape Bucket Interaction
3. Phase 3 — Brain Engine (session only)
4. Phase 4 — Little Explorer Content
5. Phase 5 — Age-Adaptive Challenge Sets
6. Phase 6 — Knowledge Domains
7. Phase 8 — Vault Run
8. Phase 10 — Gameplay Polish

Do NOT execute Phase 7 or Phase 9 in this milestone.

Never execute phases in parallel.

## Current product goal

Finish a genuinely playable, interesting, lightweight MIND VAULT game that can be evaluated on gameplay quality before architecture is added for accounts/progress.

The milestone must prove:
- smooth core interaction;
- age-appropriate experiences from 3–5 through 18+;
- adaptive in-session difficulty/brain calculation;
- varied cognitive mechanics;
- maths, nature/science, problem solving, language/literature and history used as puzzle material;
- a replayable Vault Run;
- strong responsive/mobile/desktop UX;
- low resource usage.

## Per-phase protocol

For every executable phase:
1. Read `AGENTS.md`, `DECISIONS.md`, `PHASE-TRACKER.md`, this authorization, and the exact phase prompt.
2. Mark only that phase `IN_PROGRESS`.
3. Implement only that phase.
4. Run all verification required by that phase plus repository-wide build/runtime checks.
5. Do not continue on a failing build or known gameplay regression.
6. Create one focused implementation commit.
7. Update the tracker with commit SHA, verification result and status `COMPLETE`.
8. Immediately continue to the next executable gameplay phase when verification is genuinely PASS.

`COMPLETE` means implemented and verified by the implementation agent. It does not mean architect-accepted.

Do not mark phases `ACCEPTED` yourself.

## Gameplay-first storage rule

During this milestone:
- `localStorage` may hold only tiny bootstrap preferences such as selected age group;
- brain scores/difficulty/run state are session/in-memory gameplay state;
- losing session progress on a hard reload is acceptable for this milestone;
- do not introduce IndexedDB;
- do not introduce a database/backend;
- do not introduce authentication/cloud sync.

The architect will design the durable progress model only after reviewing the completed game.

## Explicitly deferred phases

### Phase 7 — Offline Web App / PWA
DEFERRED. Do not add a service worker, Cache Storage strategy or install/offline architecture yet.

### Phase 9 — Authentication / Cloud Sync
DEFERRED. Do not add Supabase, Google/Apple sign-in, backend/database, parent accounts or cross-device sync yet.

Any previous batch authorization for these phases is superseded by this file.

## Simplicity rule

Keep:
- Vite + Vanilla TypeScript
- semantic HTML/CSS/SVG/browser APIs
- no front-end framework
- no game engine
- no state framework
- no animation/physics library
- minimal runtime dependencies
- one responsive codebase

Difficulty increases through thinking, rules and content—not rendering load.

## Brain engine rule

The game still needs real adaptive behavior now.

Use a small explainable in-session model:
- memory
- attention
- logic
- problem solving
- pattern recognition
- planning
- knowledge

Difficulty remains approximately 1–5 and adapts gradually from recent attempts.

No ML, AI scoring, IQ claims or medical claims.

## Knowledge rule

MIND VAULT must not become a trivia/school worksheet app.

Use maths, nature/science, history and language/literature inside cognitive interactions such as:
- sort/classify
- match
- sequence
- memory
- deduction
- cause/effect
- planning
- choose/reason

Keep content useful but not academically deep.

## Vault Run

Build a short replayable run from proven mechanics. It must be skill based. Do not implement any artificial 4% random win gate.

The ~4% goal remains a future balancing target after real play data exists.

## Final gameplay milestone report

After Phase 10, return one consolidated report containing:
- each executed phase and commit SHA;
- verification result per phase;
- final HEAD / remote sync / working-tree state;
- production build and bundle size;
- runtime dependency count;
- real browser/mobile/touch/desktop evidence;
- puzzle mechanics implemented;
- age-group behavior;
- in-session brain/difficulty behavior;
- knowledge-domain coverage;
- Vault Run behavior;
- known bugs/debt;
- anything that still feels weak or unfun;
- recommended NEXT ROADMAP.

Do not implement authentication, durable progress, PWA/offline or cloud sync as part of the recommended next roadmap until the architect reviews the gameplay result.

Then STOP.