# Phase 01 — Navigation and Player Entry

Status: **READY**

## Objective
Create the minimum player-entry/navigation flow before any puzzle implementation.

## Implement
1. `src/game/types.ts`
   - `AgeGroup = '3-5' | '6-8' | '9-12' | '13-17' | '18+'`
   - `Screen = 'age-select' | 'home' | 'game' | 'results'`
2. A tiny screen controller, e.g. `src/ui/screen.ts`.
   - Swap the active screen into `#app`.
   - Apply the age theme.
   - Move focus appropriately after navigation.
   - No router/history/event bus/state library.
3. `src/ui/age-select.ts`
   - Little Explorer — 3–5
   - Young Explorer — 6–8
   - Young Thinker — 9–12
   - Challenger — 13–17
   - Mind Vault — 18+
   - Ask only for age group; no personal data.
4. Persist only the selected age group in `localStorage`, safely wrapped so storage failure does not break the game.
5. `src/ui/home.ts`
   - MIND VAULT title.
   - `START RUN` primary action.
   - `DAILY VAULT` visible but disabled/Coming Soon.
   - Selected player mode visible.
   - Small way to change age group.
6. `src/ui/game-screen.ts`
   - Structural shell only: header, instruction area, game area, progress area, exit/back if needed.
   - No puzzle/scoring/timer/fake behavior.
7. `src/ui/results.ts`
   - Minimal Run Complete placeholder and Home/Continue action.
8. Allow subtle transform/opacity screen transitions and respect `prefers-reduced-motion`.

## Required flow
First visit: `Age Select → Home`.
Returning visit with age group saved: `Home`.
Run shell: `Home → Game → Results → Home`.
Player can intentionally change age group.

## Explicitly out of scope
- Puzzle implementation.
- IndexedDB progress.
- Brain engine/scoring/difficulty adaptation.
- PWA/service worker/offline cache.
- Cloud sync/authentication.
- Daily Vault implementation.
- Test framework.
- Router/state library/runtime dependency.

## Verification
- `npm run typecheck` and `npm run build` pass.
- Real browser verification at 320×640, a larger phone/tablet size, and 1440×900.
- No horizontal overflow.
- Little Explorer theme applies correctly.
- Age selection persists after reload.
- All four screens are reachable through intended flow.
- Console clean.
- Reduced-motion path works.
- Runtime dependencies remain zero.

## Completion protocol
Create one focused Phase 1 implementation commit, update `PHASE-TRACKER.md` to `REVIEW`, report results, and STOP. Do not start Phase 2. Only the architect may mark the phase `ACCEPTED`.