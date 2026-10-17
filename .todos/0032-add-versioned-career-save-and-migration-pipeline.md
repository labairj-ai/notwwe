# 0032 — Add versioned career save and migration pipeline

- **ID:** 0032
- **Status:** proposed
- **Created:** 2026-10-17
- **Priority:** critical
- **Depends:** 0024, 0025, 0026, 0027, 0028, 0029, 0030, 0031

## Problem

Persist canonical career state safely with explicit versioning, untrusted-input validation and duplicate-result protection.

## Goal

Implement this capability inside the documented Not WWE architecture without weakening deterministic simulation, command/event boundaries, mobile viability, save/replay safety or content-originality guardrails.

## Proposed approach

- Keep authoritative decisions in the owning simulation/application layer.
- Express new player/AI mutations through serializable commands and ordered domain events where applicable.
- Keep named wrestlers, moves and presentation assets data-driven; avoid character-specific gameplay branches.
- Use explicit seeded randomness for any gameplay uncertainty.
- Add focused invariant tests before relying on browser/presentation checks.
- Update architecture/review documentation in the same change if the implemented contract differs from the current design.

## Touches

- `src/persistence/schema.js`
- `src/persistence/save.js`
- `src/persistence/migrations/`
- `docs/architecture/save-schema.md`

## Implementation guardrails

- UI, animation, camera and audio cannot become simulation authority.
- Do not use wall-clock/render-frame timing to determine gameplay outcomes.
- Do not add unrelated scope from later TODOs merely because the extension point is visible.
- Preserve deterministic replay and atomic rejection semantics.
- Do not introduce WWE-protected assets, logos, likenesses, music, branded names or one-to-one gimmick copies.
- Human/device acceptance must be recorded as human/device evidence, not inferred from CI.

## Done when

- [ ] CURRENT_SAVE_VERSION and canonical schema are explicit.
- [ ] Parse/migrate/validate/rebuild stages are separate.
- [ ] Unsupported future versions fail safely.
- [ ] Static content is referenced by stable IDs rather than duplicated.
- [ ] Completed match results/story events cannot apply twice after reload.

## QA requirements

- [ ] Round-trip tests.
- [ ] Malformed/untrusted input tests.
- [ ] Frozen fixture created once first production schema exists.
- [ ] Migration harness supports synthetic multi-step chain before first bump.
- [ ] Relevant full-suite tests, build and source checks pass.
- [ ] No new forbidden dependency direction or circular import is introduced.
- [ ] Save/replay impact is reviewed and documented.

## Completion evidence

When implemented, record:

- source commit SHA;
- focused and full test results/counts;
- build/check/CI result;
- deterministic scenario/replay evidence where relevant;
- browser/device/human evidence required by this TODO;
- remaining limitations or acceptance still open.

## Source

Created from the initial Not WWE architecture and product plan on 2026-10-17, using the established Notsims repository documentation/TODO discipline as the process model.
