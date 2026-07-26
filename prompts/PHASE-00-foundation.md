# Phase 00 — Foundation

Status: **ACCEPTED**
Accepted commit: `1da1983e673483d709580d0a1cbcaf67f7ef4041`

## Objective
Establish the smallest clean web foundation for MIND VAULT before gameplay exists.

## Accepted scope
- Vite + strict Vanilla TypeScript.
- Semantic HTML, modern CSS and SVG where useful.
- Zero runtime dependencies.
- Mobile-first layout from 320px upward; constrained stage on desktop.
- Age-theme hook so one UI can adapt visually without separate apps.
- `prefers-reduced-motion` support from the start.
- No gameplay, navigation, scoring, backend, database, authentication or game engine.

## Product constraints established
- Simple to play, difficult to master.
- Difficulty increases cognitive load, not rendering load.
- Touch and mouse must eventually share one interaction path via Pointer Events.
- No IQ/mental-age/intelligence claims.
- No hidden random failure.
- Build only what the current phase needs.

## Verification accepted
- Typecheck/build passed.
- Real Chrome verification at 320×640 and 1440×900 passed.
- No horizontal overflow at 320px.
- Age-theme hook verified.
- Production bundle was ~6.49 kB total / ~2.8 kB gzip.

This file records accepted history. Do not rewrite Phase 0 requirements to match later architectural decisions.