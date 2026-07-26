# MIND VAULT — Execute Current Roadmap

Status: **AUTHORIZED**

This is the architect authorization to execute the currently defined implementation roadmap continuously instead of stopping for approval after every phase.

This file supersedes only the old per-phase gate wording that says to STOP and wait for architect acceptance before the next phase. It does **not** supersede any phase scope, constraints, performance rules, privacy rules, or verification requirements.

## Execution order

Execute sequentially:

1. Phase 1 — Navigation & Player Entry
2. Phase 2 — Shape Bucket Interaction
3. Phase 3 — Brain Engine & Local Progress
4. Phase 4 — Little Explorer Content
5. Phase 5 — Age-Adaptive Challenge Sets
6. Phase 6 — Knowledge Domains
7. Phase 7 — Offline Web App / PWA
8. Phase 8 — Vault Run
9. Phase 9 — Optional Cloud Sync & Cross-Device Progress
10. Phase 10 — Polish & Release Readiness

Never execute phases in parallel.

## Per-phase protocol

For every phase:

1. Read `AGENTS.md`, `DECISIONS.md`, `PHASE-TRACKER.md`, this authorization, and the exact phase prompt.
2. Mark only that phase `IN_PROGRESS`.
3. Implement only that phase.
4. Run all verification required by that phase plus the repository-wide build/runtime checks.
5. Do not continue on a failing build or a known regression.
6. Create one focused implementation commit.
7. Update the tracker with commit SHA, verification result, bundle/runtime notes where relevant, and status `COMPLETE`.
8. Immediately continue to the next phase if the current phase verification is genuinely PASS.

`COMPLETE` in batch mode means implemented and verified by the implementation agent. It does **not** mean architect-accepted. Final architect review happens after the current roadmap batch completes.

Do not mark phases `ACCEPTED` yourself.

## Blocker policy

Do not stop for ordinary implementation choices that are already constrained by the phase prompt. Make the smallest reasonable choice and document it.

If a real external blocker exists (credentials, provider console setup, unavailable external service, legal/privacy activation gate, etc.):

- mark the affected phase `BLOCKED`;
- record exactly what is complete and what cannot be verified;
- do not claim PASS for the blocked portion;
- continue with later phases only when they are technically independent of the blocked item;
- preserve local/offline gameplay as fully functional.

## Simplicity rule

Do not use batch authorization as permission to over-engineer.

Keep the established constraints:

- Vite + Vanilla TypeScript
- semantic HTML/CSS/SVG/browser APIs
- no front-end framework
- no game engine
- no unnecessary state library
- no animation/physics library
- runtime dependencies remain minimal
- cognitive difficulty grows through logic/content, not graphics/resource load
- one shared responsive codebase for phone/tablet/laptop/desktop

## Storage progression

- Phase 1: `localStorage` only for tiny bootstrap preference such as age group.
- Phase 3 onward: native IndexedDB is the local source of truth for real game progress.
- Phase 7: service worker/Cache Storage stores app shell and offline game assets/content; do not mix this with player progress.
- Phase 9: cloud remains optional and local-first.

## Phase 9 current architect direction

Keep Phase 9 small.

Target architecture:

- one optional cloud progress system;
- one progress datastore, not separate Apple/Google/web databases;
- Google and Apple are identity providers, not separate game-save architectures;
- local IndexedDB remains the immediate save target;
- sync happens only when online and account-connected;
- guest/offline play must remain fully usable.

For the first cloud implementation, use **Supabase Auth + one Supabase Postgres project** unless a concrete repository/runtime incompatibility is found during implementation. Supabase currently supports Google and Apple sign-in for web applications and integrates Auth with its Postgres/RLS model.

Do not create microservices or a custom authentication server.

### Children/privacy gate

MIND VAULT includes an experience for ages 3–5 and therefore child-directed/mixed-audience privacy requirements are material.

Do not directly collect unnecessary child identity/contact data.

For under-13 gameplay:

- local/offline play must require no account;
- do not ask the child for email, social login, full name, school, address, phone, or exact date of birth;
- any future cloud account for a child profile must be parent/guardian-oriented;
- do not claim production child-cloud-sync compliance merely because the technical OAuth flow works;
- if verifiable parental-consent/privacy-policy requirements are not implemented and validated, keep child cloud sync disabled and mark that activation item BLOCKED rather than weakening the privacy rule.

This does not block adult/eligible-user technical cloud-sync work if it can be safely isolated.

## Phase 10

Phase 10 may proceed after Phase 8 even if an external-only portion of Phase 9 is blocked, as long as Phase 10 does not fake cross-device evidence. Verify cross-device sync only if Phase 9 is genuinely working.

## Final batch report

After the final executable phase, return one consolidated report with:

- phase-by-phase status;
- implementation commit SHA for each phase;
- verification result for each phase;
- files/features introduced;
- final production bundle size;
- runtime dependency list/count;
- mobile/touch verification;
- desktop verification;
- IndexedDB persistence verification;
- offline/PWA verification;
- Vault Run verification;
- cloud-sync verification or exact external blocker;
- privacy/child-cloud activation status;
- known issues/debt;
- suggested next product plan.

Then STOP for architect review.
