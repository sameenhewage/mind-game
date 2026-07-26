# MIND VAULT — Architecture & Product Decisions

This file records accepted decisions. Implementation agents must not silently override them. If a decision needs to change, the architect updates this file and the relevant phase prompt first.

## D-001 — Web first
MIND VAULT begins as one responsive web application for phones, tablets, laptops and desktops.

## D-002 — Minimal technology
Use Vite + Vanilla TypeScript + semantic HTML + modern CSS + SVG/browser APIs. No framework or game engine unless a demonstrated future requirement justifies one.

## D-003 — Runtime dependency budget
Default target is zero runtime dependencies. A new dependency requires a concrete current need and explicit justification.

## D-004 — Gameplay first
The first product milestone is a complete, enjoyable game. Authentication, cross-device sync, durable player-progress persistence and cloud infrastructure are intentionally deferred until the gameplay is proven.

During the gameplay milestone, the game may keep session-only state in memory and may use `localStorage` only for tiny bootstrap preferences such as selected age group. Do not build a progress/account architecture yet.

## D-005 — Future storage responsibilities
When the architect later starts the progress/offline roadmap, the intended separation remains:
- `localStorage`: tiny bootstrap/preferences only.
- IndexedDB: actual local game progress.
- Cache Storage/service worker: offline application assets/content.
- Cloud datastore: optional cross-device progress.

These are future decisions, not authorization to implement them in the current gameplay milestone.

## D-006 — Future cross-device strategy
If cloud sync is later implemented, Google and Apple are identity/sign-in options into one MIND VAULT progress system. Do not build separate Google-save, Apple-save and web-save progress architectures. Backend/provider selection will be reviewed at that time.

## D-007 — Age adaptation
Age changes presentation, reading level, challenge style and starting difficulty. It does not create separate applications. Actual performance then adjusts difficulty gradually inside the current play session.

## D-008 — No IQ claims
Never present MIND VAULT metrics as IQ, intelligence, mental age, diagnosis or medical cognitive assessment. Skill values describe in-game performance only.

## D-009 — Knowledge supports cognition
Mathematics, nature/science, problem solving, language/literature and history are puzzle material. MIND VAULT is not primarily a trivia or school-worksheet app.

## D-010 — Skill-based 4% target
The future ~4% full Vault completion goal is a balancing target for difficult skill-based runs. There is no hidden random 4% win gate, and the target does not apply to young children.

## D-011 — Performance principle
Difficulty increases through rules, memory depth, distractors, reasoning and planning—not heavier graphics, large DOM trees, particles or 3D rendering.

## D-012 — Motion principle
Motion should explain state and feel smooth. Prefer transform/opacity and Pointer Events. No native HTML5 drag-and-drop for core gameplay, no physics/animation library without demonstrated need, and respect `prefers-reduced-motion`.

## D-013 — Current batch ownership
The architect owns roadmap scope and final acceptance. The current gameplay milestone is authorized for sequential execution without stopping between each game phase, provided each phase is separately verified and committed. Implementation agents may mark batch work `COMPLETE`, but never `ACCEPTED`.

## D-014 — Child privacy
The game asks for age group only in the current gameplay milestone and does not collect unnecessary child personal information. Any later account/progress system for young players must be reviewed separately with a parent/guardian-oriented design before implementation.

## D-015 — Deferred infrastructure
For the current gameplay milestone, explicitly do NOT implement:
- IndexedDB progress persistence
- PWA/service-worker offline infrastructure
- authentication
- Google/Apple sign-in
- cloud sync
- backend/database
- parent account system

Those will be designed only after the playable game milestone is reviewed.