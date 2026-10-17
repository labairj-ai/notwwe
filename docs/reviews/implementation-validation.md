# Implementation candidate — 2026-10-17

Scope: all 40 TODOs were worked through as requested. Software for 0001–0037 and 0039 exists. 0038 requires people and physical devices; 0040 requires that certification before production activation. These remain open. None of the human acceptance checkboxes has been silently satisfied.

## Implemented capability map

| TODO | Implementation | Evidence / remaining review |
| --- | --- | --- |
| 0001–0004 | Content validation, serializable match/session, seeded RNG, layered imports | Schema tests, fixed-tick chunk equivalence; source dependency check |
| 0005–0016 | Ring movement, explicit semantic states, strikes/grapples, regional damage/stamina, reversals, recovery, pin counts, submissions/rope breaks, signatures/finishers, crowd/quality, legal deterministic AI | `tests/match.test.js`; 36 full matches replay exactly |
| 0017–0019 | Procedural original Three.js ring, arena, 12 color/style variants of articulated capsule wrestlers, paired event choreography and state locomotion | Projection uses match x/z directly; read-only/pause/reduced-motion tests. Browser WebGL, visual contact quality and naturalness review pending |
| 0020–0021 | Contextual legal actions, directional and mat-tap movement, run, keyboard, camera orbit/pinch zoom, safe-area mobile bottom sheet | JSDOM workflow and canceled/drag/multitouch tests; physical phone comfort and orientation/performance pending |
| 0022–0031 | 12 fictional roster entries with distinct ratings/archetypes; career, results, ranks, rivalries, deterministic weekly booking, major events, belt/history, promos, training/rest/injuries, contracts/merchandise | Two identical 20-week seasons, idempotency/bounds tests. All wrestlers currently share 12 generic move definitions; deeper bespoke movesets/content and human originality/balance review remain |
| 0032–0033 | Versioned parse/migrate/validate/rebuild, bounded save import, frozen v1 fixture, deterministic trace/replay | Corrupt/future/oversized save rejection, active match continuation and exact event/result replay. This is first shipped schema; no historical released schema requires migration yet |
| 0034–0035 | Synthesized semantic audio, five device volume buses, trusted gesture unlock, pause/visibility lifecycle; bounded orbit/broadcast camera and reduced motion | Mock audio lifecycle, read-only presentation tests. Synthesized cues are a prototype sound palette; audible output, music/ambience quality and browser autoplay pending |
| 0036–0037 | Data-driven singles/championship/No-DQ policy, team/legal-participant contracts | Rule-specific rope tests, full scenario matrix, four-participant foundation test. No tag match mode or tag UI claimed |
| 0038 | Acceptance checklist retained | No controllable browser registered by CUA; Chrome tab creation returned “Browser is not available”. No desktop visual, physical iOS/Android, audible or subjective gameplay certification performed |
| 0039–0040 | CI, exact source/hash build metadata, release integrity/HTTP MIME verifier, certification-gated atomic activation and rollback | Local integrity/corruption/uncertified-rejection/rollback tests. Production game activation withheld until exact-SHA human acceptance; existing planning landing page remains |

## Reproducible checks

- `npm test`: 27 tests, covering deterministic matches, career seasons, save corruption, replay, UI workflow, gestures, audio/camera isolation and release integrity/rollback.
- `npm run check`: syntax, complete content validation, 37-module dependency graph, forbidden runtime dependencies and cycle detection.
- `npm run scenarios`: 36 complete AI matches (12 seeds × 3 match types); exact ordered-event and final-state replay. This sample ends by pin in 44–114 simulated seconds. Results are diagnostic, not proof of balance or fun; the default first wrestler wins most seeds and needs human balance review.
- `npm run build`: full static package including local Three.js module/core/license, SHA-256 manifest and source identity. A development build truthfully records a dirty source tree; release verification rejects it.
- `tests/fixtures/save-v1.json`: frozen active-career/match save for compatibility checks.
- CI and clean-source release rehearsal results are recorded in `release-validation.md` once the candidate commit exists.

## Authority and implementation contracts

Gameplay advances in 100 ms ticks, accumulating integer microseconds. Rendering receives a read-only match and ordered events, interpolates independently, and freezes during pause. Hidden documents/settings pause the browser loop without simulating elapsed wall time on return. Domain has no DOM, Three.js or wall-clock dependencies.

Each command resolves on a structured clone and commits only on success. Invalid commands emit no partial mutations. Reversal readiness has stamina/cooldown costs; attacks spend resources, roll reversal/hit from saved RNG, then apply damage/semantic states. Pins count on simulation ticks. Submissions use regional damage and defense; rope rules come from the selected match policy. One terminal result freezes subsequent simulation.

Career mutations remain in the owning career module rather than separate stub files per TODO. Match ID protects result application. Rankings use bounded performance scores; quality can improve popularity on a loss. Booking scores ranking proximity, rivalry, rematch fatigue and alignment with a seeded tie-break. One playable booking is generated per week, with title contexts on major weeks; a fully simulated off-screen promotion card is not implemented.

## Known limits

Procedural bodies and generic paired gestures need visual wrestling review; they are not motion-captured or certified contact animation. No real licensed wrestling likeness/music/assets are used. “Harbor Circuit” and all roster identities still require human originality review. The arena is WebGL with a tactical 2D fallback, not a verified performance claim. Tag-team work is architecture only. No network multiplayer or cloud saves were requested or added.
