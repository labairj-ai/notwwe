# 0024 — Implement career progression and rankings

- **ID:** 0024
- **Status:** proposed
- **Created:** 2026-10-17
- **Priority:** critical
- **Depends:** 0023, 0015

## Problem

Translate match outcomes and quality into long-term popularity, momentum and ranking changes.

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

- `src/systems/career/progression.js`
- `src/systems/career/rankings.js`

## Implementation guardrails

- UI, animation, camera and audio cannot become simulation authority.
- Do not use wall-clock/render-frame timing to determine gameplay outcomes.
- Do not add unrelated scope from later TODOs merely because the extension point is visible.
- Preserve deterministic replay and atomic rejection semantics.
- Do not introduce WWE-protected assets, logos, likenesses, music, branded names or one-to-one gimmick copies.
- Human/device acceptance must be recorded as human/device evidence, not inferred from CI.

## Done when

- [ ] Completed MatchResult applies once using match ID/idempotency protection.
- [ ] Wins/losses, opponent quality, match rating and momentum have documented bounded influence.
- [ ] Rankings update deterministically.
- [ ] A strong loss can improve some career metrics without counting as a win.
- [ ] History explains major progression changes.

## QA requirements

- [ ] Duplicate-result application test.
- [ ] Golden career progression scenarios.
- [ ] Long-season bounds/stability test.
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
