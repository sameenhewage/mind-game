# Phase 03 — Brain Engine (Session Only)

Status: **QUEUED**

## Objective
Introduce the first deterministic cognitive scoring/difficulty model needed for gameplay, without building durable progress persistence yet.

## Cognitive model
Track in-session game-performance values from 0–100 for:
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
- Adjust gradually from recent results inside the current play session.
- Never jump multiple levels abruptly.
- Target the feeling: “I nearly solved that.”

## State scope
Keep the current brain/difficulty state in memory for the active session/run.

It is acceptable for this state to reset when the page/session is reset during this gameplay milestone.

`localStorage` remains limited to tiny bootstrap preferences such as selected age group.

Do NOT implement:
- IndexedDB
- durable attempt history
- cross-device progress
- cloud sync
- authentication
- backend/database

Those belong to the next architecture roadmap after the game is proven.

## Testing
Small focused unit tests are justified for deterministic scoring and difficulty rules if needed. Test the rules, not DOM trivia. Use the smallest suitable setup and avoid unnecessary infrastructure.

## Out of scope
- Persistent player profiles/progress.
- Cloud sync/authentication.
- Leaderboards.
- PWA/offline infrastructure.
- Complex analytics.
- Medical/cognitive claims.

## Completion
When executed in the current gameplay batch, verify the rules, create a focused Phase 3 commit, mark the phase `COMPLETE`, and continue to the next queued gameplay phase.