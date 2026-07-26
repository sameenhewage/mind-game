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
- Difficulty grows through rules, memory depth, decisions, distractors and
  reasoning steps — never through heavier graphics.
- No IQ score, no mental age, no intelligence label. Progress is reported as
  in-game skills only: Memory, Logic, Focus, Problem Solving, Patterns,
  Planning, Knowledge.
- All puzzles are skill-solvable. There is never hidden random failure.

## Technology

| Area | Choice |
| --- | --- |
| Build tool | Vite |
| Language | Vanilla TypeScript (strict) |
| UI | Semantic HTML + modern CSS, SVG where useful |
| Interaction | Browser Pointer Events (mouse/touch/pen, one path) |
| Animation | CSS transitions/animations; Web Animations API only where JS control is required |
| Tiny preferences | `localStorage` |
| Real local progress | Native IndexedDB from the phase where a real progress model exists |
| Offline application assets | Service Worker + Cache Storage in the later PWA phase |
| Cross-device progress | Optional later cloud sync using one MIND VAULT progress model |

Runtime dependencies currently: **zero**. Dev dependencies: `vite`, `typescript`.

Deliberately not used in the current architecture: React, Vue, Angular, Phaser,
PixiJS, Three.js, Redux, RxJS, animation libraries, physics libraries or UI
component kits. Backend/authentication/cloud storage are later concerns only if the
approved cloud-sync phase is reached.

## Simplicity and performance principles

- The game should challenge the player's brain, not their device.
- Animate `transform` and `opacity`; avoid layout-heavy animation.
- Animation communicates game state — it is not decoration, and it never delays play.
- Respect `prefers-reduced-motion`.
- Mobile-first from 320px up; the game area stays centred on wide screens instead
  of stretching.
- Large touch targets, especially for young players (`--touch-min`).
- Build only what the current phase needs. No repositories, service layers,
  event buses, DI or plugin systems without a demonstrated need.

## Progress and offline direction

MIND VAULT is local-first.

- A normal puzzle saves locally first and must not wait for cloud sync.
- `localStorage` is only for tiny bootstrap/preferences such as selected age group.
- Actual scores, attempts, run state and adaptive progress belong in IndexedDB once
  that model exists.
- PWA caching is a separate responsibility from player progress.
- Optional cross-device sync comes later and uses one MIND VAULT progress system;
  Google/Apple sign-in must not become separate game-save architectures.

## Privacy

Early phases collect only an age *group* — never a name, exact date of birth,
school, address, phone or email. No account is required for the local-first game.
Any later cloud/account design for young players must be reviewed separately with a
parent/guardian-oriented approach.

## Getting started

```bash
npm install
npm run dev        # dev server
npm run dev:lan    # dev server exposed on the LAN, for real phone testing
npm run build      # typecheck + production build to dist/
npm run preview    # serve the production build
npm run typecheck  # types only
```

## Project structure

```text
index.html          document shell
public/favicon.svg
src/
  main.ts           entry point; renders into #app
  styles.css        reset, design tokens, age themes, app layout

prompts/            architect-owned phase implementation prompts
PHASE-TRACKER.md    authoritative phase status/gate
DECISIONS.md        accepted architecture/product decisions
AGENTS.md           hard execution constraints
```

Gameplay files are added only by the phase that actually needs them.

## Age groups

| Group | Name | Focus |
| --- | --- | --- |
| 3–5 | Little Explorer | shapes, colours, matching, sorting, size, counting to 5, visual memory. Almost no reading, no stressful timer, gentle feedback. |
| 6–8 | Young Explorer | basic arithmetic, sequences, categories, simple logic, nature, vocabulary, story order. |
| 9–12 | Young Thinker | arithmetic reasoning, pattern combinations, spatial reasoning, deduction, comprehension, multi-step puzzles. |
| 13–17 | Challenger | multi-rule puzzles, planning, deduction, mathematical and scientific reasoning, optimisation, rule changes. |
| 18+ | Mind Vault | full set: memory, logic, deduction, planning, rule mutation, abstract reasoning — without depending on reaction speed. |

Themes change per age group; the core UI stays the same.

## Puzzle mechanics

The initial reusable mechanic set is **Sort Into Bucket**, **Match**, **Sequence**,
**Memory**, and **Choose / Reason**. Reuse them where they fit; add a new mechanic
only when a real cognitive interaction cannot be represented cleanly by the
existing set.

## Development workflow

Implementation is phase-gated.

- Authoritative status: [`PHASE-TRACKER.md`](PHASE-TRACKER.md)
- Architect-owned prompts: [`prompts/`](prompts/)
- Accepted decisions: [`DECISIONS.md`](DECISIONS.md)
- Agent execution rules: [`AGENTS.md`](AGENTS.md)

Only a phase marked `READY` may start. An implementation agent finishes at
`REVIEW`; only the architect promotes work to `ACCEPTED` and unlocks the next phase.

Difficulty remains a small integer 1–5 and moves gradually based on evidence. The
aim is "I nearly solved that", not "this is impossible".

The ~4% figure refers only to balancing a difficult full Vault Run once the game is
mature. It is not a random win gate, and it does not apply to young children.