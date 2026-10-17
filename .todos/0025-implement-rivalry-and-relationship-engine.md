# 0025 — Implement rivalry and relationship engine

- **ID:** 0025
- **Status:** proposed
- **Created:** 2026-10-17
- **Priority:** high
- **Depends:** 0024

## Problem

Create persistent feud history that can drive bookings and match-story bonuses without scripted one-off branches.

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

- `src/systems/rivalry/rivalry.js`
- `src/systems/rivalry/history.js`

## Implementation guardrails

- UI, animation, camera and audio cannot become simulation authority.
- Do not use wall-clock/render-frame timing to determine gameplay outcomes.
- Do not add unrelated scope from later TODOs merely because the extension point is visible.
- Preserve deterministic replay and atomic rejection semantics.
- Do not introduce WWE-protected assets, logos, likenesses, music, branded names or one-to-one gimmick copies.
- Human/device acceptance must be recorded as human/device evidence, not inferred from CI.

## Done when

- [ ] Rivalries track heat, chemistry, history, recency and context.
- [ ] Interactions update heat with repetition/cooldown policy.
- [ ] Resolved rivalries preserve historical record.
- [ ] MatchResult and story events can influence rivalry through explicit APIs.

## QA requirements

- [ ] Repeated-beat diminishing tests.
- [ ] Rivalry create/escalate/cool/resolve scenarios.
- [ ] Save-serialization readiness.
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
