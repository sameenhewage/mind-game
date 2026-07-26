# MIND VAULT

Short, age-adaptive puzzles that train how you think.

MIND VAULT is not a quiz app. Each puzzle exercises a cognitive ability — memory,
attention, observation, pattern recognition, logic, problem solving, planning,
sequencing, classification, spatial reasoning, adaptability — and uses
age-appropriate knowledge (mathematics, nature and science, problem solving,
language and literature, history, general knowledge) as the puzzle material.

The goal is not to replace school. The goal is: **learn something useful while
exercising the brain.**

## Product rules

- Simple to play, difficult to master.
- Very lightweight; works on phone, tablet, laptop and desktop.
- Touch and mouse must both feel natural.
- Difficulty grows through rules, memory depth, decisions, distractors and reasoning steps — never through heavier graphics.
- No IQ score, no mental age, no intelligence label. Skill values are in-game performance metrics only.
- All puzzles are skill-solvable. There is never hidden random failure.

## Current milestone — build the game first

The current roadmap intentionally focuses on proving the game itself before building account/progress infrastructure.

Current milestone includes:
- navigation/player entry;
- smooth Shape Bucket interaction;
- in-session brain scoring and adaptive difficulty;
- Little Explorer content for ages 3–5;
- challenge sets for 6–8, 9–12, 13–17 and 18+;
- maths, nature/science, problem solving, language/literature and history as puzzle material;
- a replayable Vault Run;
- gameplay polish across mobile, tablet and desktop.

Intentionally deferred until after gameplay review:
- durable IndexedDB progress;
- PWA/service-worker offline architecture;
- authentication;
- Google/Apple sign-in;
- cloud/backend/database;
- cross-device sync.

Losing in-session scores/run state on a hard reload is acceptable during this milestone. Selected age group may persist as a tiny preference.

## Technology

| Area | Choice |
| --- | --- |
| Build tool | Vite |
| Language | Vanilla TypeScript (strict) |
| UI | Semantic HTML + modern CSS, SVG where useful |
| Interaction | Browser Pointer Events (mouse/touch/pen, one path) |
| Animation | CSS transitions/animations; Web Animations API only where JS control is required |
| Tiny preferences | `localStorage` |
| Current brain/run state | In memory for the active session |

Runtime dependencies currently: **zero**. Dev dependencies: `vite`, `typescript`.

Deliberately not used in the current architecture: React, Vue, Angular, Phaser,
PixiJS, Three.js, Redux, RxJS, animation libraries, physics libraries or UI
component kits.

## Simplicity and performance principles

- The game should challenge the player's brain, not their device.
- Animate `transform` and `opacity`; avoid layout-heavy animation.
- Animation communicates game state — it is not decoration, and it never delays play.
- Respect `prefers-reduced-motion`.
- Mobile-first from 320px up; the game area stays centred on wide screens instead of stretching.
- Large touch targets, especially for young players.
- Build only what the current phase needs. No speculative architecture.

## Privacy

The gameplay milestone collects only an age *group* — never a name, exact date of birth, school, address, phone or email. No account exists in the current milestone.

Any later progress/account design for young players will be architected separately.

## Getting started

```bash
npm install
npm run dev
npm run dev:lan
npm run build
npm run preview
npm run typecheck
```

## Project structure

```text
index.html
public/favicon.svg
src/
  main.ts
  styles.css

prompts/            architect-owned phase implementation prompts
PHASE-TRACKER.md    authoritative phase status/gate
DECISIONS.md        accepted architecture/product decisions
AGENTS.md           hard execution constraints
```

Gameplay files are added only by the phase that actually needs them.

## Age groups

| Group | Name | Focus |
| --- | --- | --- |
| 3–5 | Little Explorer | shapes, colours, matching, sorting, size, counting to 5, visual memory; almost no reading, no stressful timer, gentle feedback |
| 6–8 | Young Explorer | basic arithmetic, sequences, categories, simple logic, nature, vocabulary, story order |
| 9–12 | Young Thinker | arithmetic reasoning, pattern combinations, spatial reasoning, deduction, comprehension, multi-step puzzles |
| 13–17 | Challenger | multi-rule puzzles, planning, deduction, mathematical/scientific reasoning, optimisation, rule changes |
| 18+ | Mind Vault | full set: memory, logic, deduction, planning, rule mutation, abstract reasoning without depending on reaction speed |

Themes change per age group; the core application stays shared.

## Puzzle mechanics

The initial reusable mechanic set is **Sort Into Bucket**, **Match**, **Sequence**,
**Memory**, and **Choose / Reason**. Reuse them where they fit; add a new mechanic
only when a real cognitive interaction cannot be represented cleanly by the
existing set.

## Development workflow

Authoritative project control lives in:

- [`PHASE-TRACKER.md`](PHASE-TRACKER.md)
- [`prompts/EXECUTE-CURRENT-ROADMAP.md`](prompts/EXECUTE-CURRENT-ROADMAP.md)
- [`prompts/`](prompts/)
- [`DECISIONS.md`](DECISIONS.md)
- [`AGENTS.md`](AGENTS.md)

The current gameplay batch executes sequentially in this order:

**1 → 2 → 3 → 4 → 5 → 6 → 8 → 10**

Phases 7 (PWA/offline infrastructure) and 9 (auth/cloud sync) are explicitly deferred.

Difficulty remains a small integer 1–5 and moves gradually based on evidence. The aim is "I nearly solved that", not "this is impossible".

The ~4% figure refers only to future balancing of a difficult full Vault Run after real play data exists. It is not a random win gate, and it does not apply to young children.