# Phase 03 — Brain Engine and Local Progress

Status: **PLANNED**

## Objective
Introduce the first deterministic cognitive scoring/difficulty model and the real local player-progress store.

## Cognitive model
Track game-performance values from 0–100 for:
- memory
- attention
- logic
- problemSolving
- patternRecognition
- planning
- knowledge

These are MIND VAULT game metrics only. Never describe them as IQ, intelligence or mental age.

## Attempt signals
Use only simple, explainable signals:
- correct/incorrect
- puzzle difficulty
- response time where relevant
- hints used
- retries

Do not use machine learning or opaque AI adaptation.

## Difficulty
Difficulty remains integer 1–5.
- Start from age-group defaults.
- Adjust gradually from recent results.
- Never jump multiple levels abruptly.
- Target the feeling: “I nearly solved that.”

## Local storage architecture
Introduce native IndexedDB for actual game progress only when the concrete progress model exists in this phase.

Store only necessary game data, e.g.:
- profile id/local profile metadata
- age group reference
- skill scores
- current difficulty
- attempt/result summaries needed for adaptation
- current/best run state when those fields exist
- schema/version metadata

`localStorage` remains limited to tiny bootstrap/preferences such as selected age group/theme/sound if appropriate.

Do not add Dexie or another IndexedDB library unless a demonstrated implementation problem justifies it.

## Testing
This is the first phase where small focused unit tests are justified. Test scoring and difficulty rules, not DOM trivia. Use the smallest suitable test setup only if needed.

## Out of scope
- Cloud sync/authentication.
- Leaderboards.
- PWA cache/offline app shell (later phase).
- Complex analytics.
- Medical/cognitive claims.

## Gate
Do not execute until Phase 2 is ACCEPTED and this prompt is promoted to READY by the architect. Finish executed work at `REVIEW` and STOP.