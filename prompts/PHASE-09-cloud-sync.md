# Phase 09 — Optional Cloud Sync and Cross-Device Progress

Status: **PLANNED**

## Objective
Add optional cross-device progress after the local/offline game is already valuable and stable.

## Principle
The game remains local-first. A cloud response must never be required to complete a normal puzzle.

## Target experience
- Guest can play immediately with local IndexedDB progress.
- Later the player/guardian may choose to protect/sync progress.
- Support suitable Google and Apple sign-in paths so iPhone/iPad, Android and web players can use the same MIND VAULT progress system.
- Google/Apple are identity providers, not separate game-progress architectures.
- Use one MIND VAULT cloud progress model/store rather than separate Apple-save, Google-save and web-save systems.

## Sync model
Keep it simple and deterministic.
- Local save first.
- Mark local changes pending sync.
- Sync when online/account-connected.
- Avoid replacing the entire progress document with a naive last-write-wins rule if that can lose progress.
- Merge only the concrete data types the product actually has (e.g. completed IDs union, best run max, attempt IDs deduplicated, settings latest timestamp) and keep conflict rules explicit.

## Children/privacy
For young children, account ownership should be parent/guardian-oriented rather than asking the child for unnecessary personal information. Final design must be reviewed before implementation.

## Backend constraint
Use the smallest practical backend and a single progress datastore. Do not introduce microservices or multiple databases.

The exact provider/backend technology is intentionally NOT selected in this planning file. Re-evaluate current options, privacy requirements, cost and deployment needs before promoting this phase to READY.

## Out of scope
- Social network.
- Chat.
- Ads infrastructure.
- Complex real-time multiplayer.

## Gate
Do not execute until Phase 8 is ACCEPTED and the architect has reviewed and rewritten/confirmed the implementation details for current provider APIs, then marks this phase READY. Finish executed work at `REVIEW` and STOP.