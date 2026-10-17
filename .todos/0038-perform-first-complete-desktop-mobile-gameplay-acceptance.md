# 0038 — Perform first complete desktop/mobile gameplay acceptance

- **ID:** 0038
- **Status:** blocked
- **Created:** 2026-10-17
- **Priority:** critical
- **Depends:** 0021, 0033, 0034, 0035, 0036

## Problem

Run the human and physical-device evidence required to determine whether the game is actually playable and wrestling-like.

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

- `docs/reviews/first-playable-acceptance.md`

## Implementation guardrails

- UI, animation, camera and audio cannot become simulation authority.
- Do not use wall-clock/render-frame timing to determine gameplay outcomes.
- Do not add unrelated scope from later TODOs merely because the extension point is visible.
- Preserve deterministic replay and atomic rejection semantics.
- Do not introduce WWE-protected assets, logos, likenesses, music, branded names or one-to-one gimmick copies.
- Human/device acceptance must be recorded as human/device evidence, not inferred from CI.

## Done when

- [ ] Desktop human tester completes multiple matches.
- [ ] Physical iOS and Android touch matches are completed if devices are available for release target.
- [ ] Observations cover wrestling feel, readability, AI, pacing, camera, audio, touch comfort and replay desire.
- [ ] Automated failures and human criticisms become follow-up TODOs rather than being hidden.

## QA requirements

- [ ] Record real device/browser/tester conditions.
- [ ] Do not substitute emulator for physical acceptance.
- [ ] Re-run automated full suite on tested candidate SHA.
- [ ] Relevant full-suite tests, build and source checks pass.
- [ ] No new forbidden dependency direction or circular import is introduced.
- [ ] Save/replay impact is reviewed and documented.

## Implementation evidence (2026-10-17)

See [implementation validation](../docs/reviews/implementation-validation.md) for code ownership, commands, test counts, replay evidence and limitations. Status is intentionally not `complete`: unchecked acceptance below has not been certified. Human desktop, physical iOS/Android, audible-output, originality and gameplay acceptance are unavailable in this session. Certified production activation is gated on those results.

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
