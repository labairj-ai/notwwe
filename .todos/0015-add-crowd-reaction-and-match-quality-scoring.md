# 0015 — Add crowd reaction and match-quality scoring

- **ID:** 0015
- **Status:** proposed
- **Created:** 2026-10-17
- **Priority:** high
- **Depends:** 0014

## Problem

Score wrestling performance independently of win/loss and create a crowd-response resource for career consequences.

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

- `src/systems/crowd/crowd.js`
- `src/systems/scoring/match-quality.js`

## Implementation guardrails

- UI, animation, camera and audio cannot become simulation authority.
- Do not use wall-clock/render-frame timing to determine gameplay outcomes.
- Do not add unrelated scope from later TODOs merely because the extension point is visible.
- Preserve deterministic replay and atomic rejection semantics.
- Do not introduce WWE-protected assets, logos, likenesses, music, branded names or one-to-one gimmick copies.
- Human/device acceptance must be recorded as human/device evidence, not inferred from CI.

## Done when

- [ ] Scoring inputs include documented factors such as variety, drama, near falls, rivalry context, repetition and execution.
- [ ] Crowd response is bounded and distinct from momentum.
- [ ] Repeated same move yields diminishing score contribution.
- [ ] Match rating is deterministic from authoritative trace/state.
- [ ] Result exposes normalized story metrics for career systems.

## QA requirements

- [ ] Golden scenario ratings for boring/varied/dramatic matches.
- [ ] Repetition penalty tests.
- [ ] Score cannot depend on animation/audio/UI events.
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
