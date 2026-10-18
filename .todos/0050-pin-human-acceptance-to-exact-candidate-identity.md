# 0050 — Pin Human Acceptance to Exact Candidate Identity

- **ID:** 0050
- **Status:** implemented
- **Created:** 2026-10-17
- **Priority:** critical
- **Depends:** 0041, 0042, 0043, 0044, 0045, 0046, 0047
- **Blocks:** 0048

## Problem

`docs/reviews/first-playable-acceptance.md` still contains pending build-identity fields even though a specific candidate has been built, tested, merged and deployed.

Without an immutable candidate identity, human acceptance results could accidentally be recorded against a different source revision.

The current 0.2 implementation candidate is:

```text
e53e5cc406d85e72101365d4d8a1d8aec15214eb
```

Automated evidence currently includes:

```text
43 tests
36 deterministic replay cases
36 pacing runs
passing CI
clean OptiPlex deployment
certified:false
```

## Goal

Make every 0048 human/device acceptance observation traceable to an exact deployed source SHA and validation state.

## Proposed approach

Update the first-playable acceptance record with a frozen candidate header.

At minimum include:

```text
Source SHA
Deployment/release identity
Deployment URL
Deployment timestamp
Test count/result
Replay count/result
Pacing count/result
CI run
Build sourceClean state
certified flag
```

Each human/device session must independently record the source SHA it actually tested.

If the deployed candidate changes before 0048 is complete:

1. record the prior session against the prior SHA;
2. do not silently carry acceptance forward;
3. determine whether affected acceptance tests must be repeated.

## Touches

- `docs/reviews/first-playable-acceptance.md`
- `docs/reviews/character-controls-validation.md`
- `docs/reviews/release-validation.md`
- `docs/reviews/current-capability-map.md`
- `.todos/0048-perform-character-fidelity-and-mobile-control-human-acceptance.md`

## Implementation guardrails

- Do not mark 0048 complete under this task.
- Automated validation cannot satisfy human/device questions.
- Deployment does not imply certification.
- Preserve `certified:false` until the actual acceptance gate passes.
- Every tester/device record must identify the exact source SHA.
- If 0049 changes gameplay before acceptance, use the post-0049 SHA as the new candidate identity.
- Do not merge observations from materially different candidates as if they were one test session.

## Done when

- [x] Acceptance document identifies an exact candidate SHA.
- [x] Test count/result is populated.
- [x] Replay count/result is populated.
- [x] Pacing count/result is populated.
- [x] CI result/link is recorded.
- [x] Deployment identity is recorded.
- [x] `certified:false` is explicitly recorded before human acceptance.
- [x] Desktop acceptance row requires SHA confirmation.
- [x] iPhone acceptance row requires SHA confirmation.
- [x] Android acceptance row requires SHA confirmation.
- [x] Retest policy after candidate changes is documented.

## QA requirements

- [x] Candidate SHA exists on `main`.
- [x] Candidate SHA matches deployed build metadata.
- [x] Public build reports expected source SHA.
- [x] Public build still reports `certified:false`.
- [x] Test/replay/pacing counts match CI evidence.
- [x] Acceptance document contains no remaining ambiguous `pending` identity fields before testing begins.

## Completion evidence

Record:

- documentation commit SHA;
- candidate implementation SHA;
- deployed SHA verification;
- CI run reference;
- acceptance template revision;
- explicit confirmation that no human acceptance was inferred.

## Source

Created from review of the 0.2 candidate immediately before TODO 0048 human/device acceptance.

Imported from the [shared 0.2 acceptance follow-up plan](https://chatgpt.com/s/t_6ad40cea37508191834929255121f435) on 2026-10-17. Candidate identity, validation counts and review findings above describe the source plan; this import neither implements the task nor certifies human acceptance. For 0050, freeze the actual post-0049/post-0051 deployed SHA rather than carrying forward a superseded candidate.

## Completion evidence

Candidate implementation `dfcfe4cb8ee9df25db33e03a256b0d8aab51be7d` exists on main and exact-SHA CI [39082644918](https://github.com/labairj-ai/notwwe/actions/runs/39082644918) passed. Clean deployment record and public metadata identify the same source; certification remains false. Frozen acceptance template revision 3 and acceptance-candidate.json contain all identity/count fields, three independent observed-SHA session columns, diagnostics instructions and retest policy. Documentation commit SHA is recorded by the containing documentation PR and follow-up commit reference. No human acceptance inferred; 0048 stays blocked.

Documentation freeze commit: `94f32672cd7f3f38e60fb910ffb5ce8d60cf6223`. The subsequent reference-only commit records this hash and does not change the candidate.
