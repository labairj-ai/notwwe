# 0040 — Deploy first playable Not WWE release

- **ID:** 0040
- **Status:** blocked
- **Created:** 2026-10-17
- **Priority:** critical
- **Depends:** 0039

## Problem

Publish the verified static build as an isolated, rollbackable release and record truthful production evidence.

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

- `deploy/`
- `docs/reviews/release-validation.md`
- `CHANGELOG.md`

## Implementation guardrails

- UI, animation, camera and audio cannot become simulation authority.
- Do not use wall-clock/render-frame timing to determine gameplay outcomes.
- Do not add unrelated scope from later TODOs merely because the extension point is visible.
- Preserve deterministic replay and atomic rejection semantics.
- Do not introduce WWE-protected assets, logos, likenesses, music, branded names or one-to-one gimmick copies.
- Human/device acceptance must be recorded as human/device evidence, not inferred from CI.

## Done when

- [ ] Production deployment uses exact certified SHA and complete package.
- [ ] Existing hosted applications/routes remain unaffected.
- [ ] Public path/assets/release identity verify successfully.
- [ ] Previous release remains available for rollback.
- [ ] Known human/device limitations are documented.
- [ ] Working codename/public-title risk is resolved appropriately before any truly public/marketed launch.

## QA requirements

- [ ] Post-deploy browser smoke.
- [ ] Key JS/CSS/model/audio HTTP/MIME/hash verification.
- [ ] Production human smoke where required.
- [ ] Record old/new release targets and deployment timestamp.
- [ ] Relevant full-suite tests, build and source checks pass.
- [ ] No new forbidden dependency direction or circular import is introduced.
- [ ] Save/replay impact is reviewed and documented.

## Implementation evidence (2026-10-17)

See [implementation validation](../docs/reviews/implementation-validation.md) for code ownership, commands, test counts, replay evidence and limitations. Status is intentionally not `complete`: unchecked acceptance below has not been certified. Human desktop, physical iOS/Android, audible-output, originality and gameplay acceptance are unavailable in this session. Certified production activation is gated on those results.

## Activation evidence

The user explicitly requested deployment after implementation. The clean `bbf16e91dbded33f52410b2b0df6045e866badd8` candidate is live on OptiPlex, public HTTP/MIME/hash/identity verification passed, and the planning page remains the rollback target. See `docs/reviews/release-validation.md` and `deploy/HOSTING.md`. Certification remains false; human/device acceptance is still open, so this TODO is not complete.

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
