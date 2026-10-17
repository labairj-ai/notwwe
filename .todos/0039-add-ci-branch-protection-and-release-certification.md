# 0039 — Add CI, branch protection and release certification

- **ID:** 0039
- **Status:** proposed
- **Created:** 2026-10-17
- **Priority:** critical
- **Depends:** 0033, 0038

## Problem

Make test/build/check and release identity mandatory, and separate implementation readiness from subjective certification.

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

- `.github/workflows/`
- `deploy/README.md`
- `docs/reviews/release-validation.md`

## Implementation guardrails

- UI, animation, camera and audio cannot become simulation authority.
- Do not use wall-clock/render-frame timing to determine gameplay outcomes.
- Do not add unrelated scope from later TODOs merely because the extension point is visible.
- Preserve deterministic replay and atomic rejection semantics.
- Do not introduce WWE-protected assets, logos, likenesses, music, branded names or one-to-one gimmick copies.
- Human/device acceptance must be recorded as human/device evidence, not inferred from CI.

## Done when

- [ ] PR to main requires successful CI check.
- [ ] Force push/deletion protections documented/verified where permissions allow.
- [ ] Release packages exact clean committed SHA with build metadata and hashes.
- [ ] Rollback procedure exists.
- [ ] Deployment verifier checks key assets/MIME/identity.

## QA requirements

- [ ] Disposable failing/passing PR or equivalent branch-rule verification where practical.
- [ ] Clean-build release rehearsal.
- [ ] Rollback rehearsal or validated procedure.
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
