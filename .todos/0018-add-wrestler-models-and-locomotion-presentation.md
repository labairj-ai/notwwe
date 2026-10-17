# 0018 — Add wrestler models and locomotion presentation

- **ID:** 0018
- **Status:** proposed
- **Created:** 2026-10-17
- **Priority:** critical
- **Depends:** 0017, 0005, 0006

## Problem

Represent semantic movement/state with original/licensed wrestler models and deterministic presentation mapping.

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

- `src/render3d/wrestler.js`
- `src/presentation/wrestler-presentation.js`
- `assets/README.md`

## Implementation guardrails

- UI, animation, camera and audio cannot become simulation authority.
- Do not use wall-clock/render-frame timing to determine gameplay outcomes.
- Do not add unrelated scope from later TODOs merely because the extension point is visible.
- Preserve deterministic replay and atomic rejection semantics.
- Do not introduce WWE-protected assets, logos, likenesses, music, branded names or one-to-one gimmick copies.
- Human/device acceptance must be recorded as human/device evidence, not inferred from CI.

## Done when

- [ ] Marcus Reign and Cole Sterling have distinguishable original placeholder/final visual identities.
- [ ] Standing/walk/run/down/get-up semantic states have presentation.
- [ ] Visual position/facing interpolates toward authoritative state without writing it.
- [ ] Missing animation has a safe semantic fallback.
- [ ] Asset provenance/license metadata is complete.

## QA requirements

- [ ] Desktop browser motion smoke.
- [ ] No state divergence when presentation disabled.
- [ ] Asset validation/build budget checks where implemented.
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
