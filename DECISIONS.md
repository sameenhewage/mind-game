# MIND VAULT — Architecture & Product Decisions

This file records accepted decisions. Implementation agents must not silently override them. If a decision needs to change, the architect updates this file and the relevant phase prompt first.

## D-001 — Web first
MIND VAULT begins as one responsive web application for phones, tablets, laptops and desktops.

## D-002 — Minimal technology
Use Vite + Vanilla TypeScript + semantic HTML + modern CSS + SVG/browser APIs. No framework or game engine unless a demonstrated future requirement justifies one.

## D-003 — Runtime dependency budget
Default target is zero runtime dependencies. A new dependency requires a concrete current need and explicit justification.

## D-004 — Local-first gameplay
Normal puzzle play saves locally first and must not depend on a cloud response.

## D-005 — Storage responsibilities
- `localStorage`: tiny bootstrap/preferences only (for example selected age group, theme/sound if needed).
- IndexedDB: actual game progress once the concrete model exists (Phase 3 onward).
- Cache Storage/service worker: offline application assets/content when PWA work begins.
- Cloud datastore: optional cross-device progress only in the later cloud-sync phase.

Do not use `localStorage` as the long-term progress database.

## D-006 — Cross-device strategy
If cloud sync is implemented, Google and Apple are identity/sign-in options into one MIND VAULT progress system. Do not build separate Google-save, Apple-save and web-save progress architectures. Use the smallest practical backend and one progress datastore.

## D-007 — Age adaptation
Age changes presentation, reading level, challenge style and starting difficulty. It does not create separate applications. Actual performance then adjusts difficulty gradually.

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

## D-013 — Phase ownership
The architect owns phase scope, phase prompts and acceptance. Implementation agents execute only the current `READY` phase. They may mark completed implementation `REVIEW`, but may not mark it `ACCEPTED` or start the next phase without architect approval.

## D-014 — Child privacy
The game asks for age group only in early phases and does not collect unnecessary child personal information. Any later account system for young players must be reviewed with a parent/guardian-oriented design before implementation.