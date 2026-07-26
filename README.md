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

| Area        | Choice                                            |
| ----------- | ------------------------------------------------- |
| Build tool  | Vite                                              |
| Language    | Vanilla TypeScript (strict)                       |
| UI          | Semantic HTML + modern CSS, SVG where useful      |
| Interaction | Browser Pointer Events (mouse and touch, one path)|
| Animation   | CSS transitions/animations; Web Animations API only where JS control is required |
| Storage     | `localStorage` for age group, difficulty, skills, progress |

Runtime dependencies: **zero**. Dev dependencies: `vite`, `typescript`.

Deliberately not used: React, Vue, Angular, Phaser, PixiJS, Three.js, Redux,
RxJS, animation libraries, physics libraries, UI component kits, backend, database,
authentication.

## Simplicity and performance principles

- The game should challenge the player's brain, not their device.
- Animate `transform` and `opacity`; avoid layout-heavy animation.
- Animation communicates game state — it is not decoration, and it never delays play.
- Respect `prefers-reduced-motion`.
- Mobile-first from 320px up; the game area stays centred on wide screens instead
  of stretching.
- Large touch targets, especially for young players (`--touch-min`).
- Build only what the current phase needs. No repositories, service layers,
  event buses, DI or plugin systems.

## Privacy

No account, no server, no analytics. Only an age *group* is chosen — never a name,
date of birth, school, address, phone or email. All progress stays in the browser's
`localStorage` on the player's own device.

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
```

Gameplay files (`game/`, `puzzles/`, `content/`, `ui/`) are added by the phases
below, as each one is actually needed.

## Age groups

| Group | Name            | Focus                                                              |
| ----- | --------------- | ------------------------------------------------------------------ |
| 3–5   | Little Explorer | shapes, colours, matching, sorting, size, counting to 5, visual memory. Almost no reading, no stressful timer, gentle feedback. |
| 6–8   | Young Explorer  | basic arithmetic, sequences, categories, simple logic, nature, vocabulary, story order. |
| 9–12  | Young Thinker   | arithmetic reasoning, pattern combinations, spatial reasoning, deduction, comprehension, multi-step puzzles. |
| 13–17 | Challenger      | multi-rule puzzles, planning, deduction, mathematical and scientific reasoning, optimisation, rule changes. |
| 18+   | Mind Vault      | full set: memory, logic, deduction, planning, rule mutation, abstract reasoning — without depending on reaction speed. |

Themes change per age group; the core UI stays the same.

## Puzzle mechanics

Five reusable mechanics carry all content: **Sort Into Bucket**, **Match**,
**Sequence**, **Memory**, **Choose / Reason**. New content reuses these engines
rather than adding a new system per puzzle.

## Phases

| Phase | Scope                                                        | State |
| ----- | ------------------------------------------------------------ | ----- |
| 0     | Foundation: Vite + TypeScript, CSS reset, theme tokens, responsive container, verified dev/build | done |
| 1     | Basic navigation: age select, home, game shell, result — tiny screen controller, no router | next |
| 2     | Sort Into Bucket for ages 3–5, pointer-based drag and drop; sets the interaction quality bar | planned |
| 3     | First brain engine: attempts, recent results, difficulty 1–5, basic skill values | planned |
| 4     | Expand Little Explorer content on the existing mechanics      | planned |
| 5     | Content for 6–8, 9–12, 13–17, 18+                             | planned |
| 6     | Balanced knowledge domains: maths, nature/science, problem solving, language, history | planned |
| 7     | Vault Run: five puzzles plus a final challenge, recorded results | planned |
| 8     | Polish: transitions, drag smoothness, layouts, accessibility, size | planned |

Difficulty is a small integer 1–5. It starts from the age group and moves one
step at a time based on recent results — never several levels at once. The aim is
"I nearly solved that", not "this is impossible".

The ~4% figure refers only to completing a hard full Vault Run once the game is
balanced. It is not a random win gate, and it does not apply to young children.
