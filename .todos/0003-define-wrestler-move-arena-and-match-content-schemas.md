# 0003 — Define wrestler, move, arena and match content schemas

- **ID:** 0003
- **Status:** implemented
- **Created:** 2026-10-17
- **Priority:** critical
- **Depends:** 0001

## Problem

Create data-driven content contracts so named wrestlers and moves do not become hardcoded gameplay branches.

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

- `src/content/wrestlers.js`
- `src/content/moves.js`
- `src/content/arenas.js`
- `src/content/match-types.js`
- `src/content/validate.js`

## Implementation guardrails

- UI, animation, camera and audio cannot become simulation authority.
- Do not use wall-clock/render-frame timing to determine gameplay outcomes.
- Do not add unrelated scope from later TODOs merely because the extension point is visible.
- Preserve deterministic replay and atomic rejection semantics.
- Do not introduce WWE-protected assets, logos, likenesses, music, branded names or one-to-one gimmick copies.
- Human/device acceptance must be recorded as human/device evidence, not inferred from CI.

## Done when

- [ ] Schema validators reject duplicate IDs, unknown move references and invalid ranges.
- [ ] Wrestler ratings/movesets are plain data.
- [ ] Move legality, costs, damage/body targets and animation keys are defined as data.
- [ ] One original arena and standard singles match definition exist.
- [ ] Marcus Reign and Cole Sterling content exists for the vertical slice.

## QA requirements

- [ ] Focused schema tests cover malformed/duplicate/unknown references.
- [ ] No Three.js/UI imports from content.
- [ ] Content can be serialized for diagnostics.
- [ ] Relevant full-suite tests, build and source checks pass.
- [ ] No new forbidden dependency direction or circular import is introduced.
- [ ] Save/replay impact is reviewed and documented.

## Implementation evidence (2026-10-17)

See [implementation validation](../docs/reviews/implementation-validation.md) for code ownership, commands, test counts, replay evidence and limitations. Status is intentionally not `complete`: unchecked acceptance below has not been certified. Software is implemented; browser/device/subjective criteria remain open where specified. Shared career systems live in `src/systems/career/career.js` rather than separate empty wrappers.

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
