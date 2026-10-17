# 0021 — Add physical-mobile wrestling controls and bottom-sheet UX

- **ID:** 0021
- **Status:** proposed
- **Created:** 2026-10-17
- **Priority:** critical
- **Depends:** 0020

## Problem

Make the complete first playable controllable on touch using the arena-first mobile shell.

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

- `src/mobile.css`
- `src/ui/mobile.js`
- `src/ui/gestures.js`

## Implementation guardrails

- UI, animation, camera and audio cannot become simulation authority.
- Do not use wall-clock/render-frame timing to determine gameplay outcomes.
- Do not add unrelated scope from later TODOs merely because the extension point is visible.
- Preserve deterministic replay and atomic rejection semantics.
- Do not introduce WWE-protected assets, logos, likenesses, music, branded names or one-to-one gimmick copies.
- Human/device acceptance must be recorded as human/device evidence, not inferred from CI.

## Done when

- [ ] All first-playable actions can be executed touch-only.
- [ ] Camera gesture arbitration prevents accidental wrestling commands.
- [ ] Context choices fit safe areas and maintain >=44px primary targets.
- [ ] Bottom sheet can collapse/expand without hiding critical match status.
- [ ] Physical-device acceptance checklist exists and automated emulation does not claim to satisfy it.

## QA requirements

- [ ] Responsive browser matrix.
- [ ] Trusted touch/pointer gesture tests.
- [ ] Actual iOS and Android human play results required to close physical acceptance portion.
- [ ] Performance/thermal observations recorded separately.
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
