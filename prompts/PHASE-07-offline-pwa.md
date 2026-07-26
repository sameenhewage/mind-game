# Phase 07 — Offline Web App / PWA

Status: **PLANNED**

## Objective
Make the existing web game reliably playable offline across supported modern browsers/devices without changing core gameplay.

## Scope
- Add the minimum web app manifest/install metadata needed for an installable web experience where supported.
- Add a lightweight service worker/offline cache strategy for the app shell and the core puzzle/content bundle.
- Preserve IndexedDB as the source of truth for local player progress.
- Ensure the game can launch and continue previously available gameplay with no network.
- Online-only features must degrade clearly rather than breaking gameplay.
- Support iPhone/iPad Safari web-app use, Android browsers/PWA installation, and desktop browsers as one codebase.

## Data separation
- Cache Storage/service worker: HTML/CSS/JS/SVG/sounds/core puzzle assets/content.
- IndexedDB: player progress, scores, attempts and run state.
- `localStorage`: tiny bootstrap/preferences only.

Do not mix cache data and player data.

## Out of scope
- Cloud account/sync.
- Google/Apple authentication.
- App Store/Play Store native packaging.
- Background complexity that is not required for reliable offline play.

## Verification
Test online first load, offline reload/launch where supported, gameplay while offline, local progress persistence, and recovery when network returns.

## Gate
Do not execute until Phase 6 is ACCEPTED and the architect marks this phase READY. Finish executed work at `REVIEW` and STOP.