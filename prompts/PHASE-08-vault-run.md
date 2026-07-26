# Phase 08 — Vault Run

Status: **QUEUED**

## Objective
Combine the proven puzzle mechanics into a short replayable MIND VAULT run with a meaningful final challenge.

## Initial run shape
A simple first version may use roughly:
- Puzzle 1
- Puzzle 2
- Puzzle 3
- Puzzle 4
- Puzzle 5
- Final Challenge

Exact count can be tuned from playtesting; do not build a complex procedural campaign system.

## Run design
- Mix cognitive skills and knowledge domains.
- Difficulty progresses fairly within the player's age/performance envelope.
- Failure must be skill-related, never a hidden random gate.
- Keep current/deepest/run result state in memory for the active session only.
- The final challenge should meaningfully combine information/rules learned during the run where practical.
- A completed run should feel replayable rather than like a one-time quiz.

## 4% principle
The long-term ~4% figure is a balancing target for difficult full Vault completion among appropriately skilled players—not a random win probability and not a target for young children.

Do not hard-code artificial 4% success logic.

## Out of scope
- Durable best-run/progress persistence.
- IndexedDB.
- Accounts/cloud sync.
- Global leaderboards.
- Monetary/prize/gambling mechanics.
- Huge campaign map.
- Complex procedural-generation architecture without evidence it is needed.

## Completion
Verify the full run end-to-end across appropriate age modes, create a focused Phase 8 implementation commit, mark the phase `COMPLETE`, and continue to the final gameplay-polish phase.