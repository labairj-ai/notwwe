# Testing and release gates

Green CI proves automated contracts only. It does not prove physical-device usability, motion quality, audible output or subjective match fun.

## Gate A — Architecture foundation

TODOs 0001–0006. Required: dependency rules, content schemas, deterministic state/RNG, movement foundation and state-machine tests.

## Gate B — Headless complete singles match

TODOs 0007–0016. Required: strike/grapple/damage/reversal/knockdown/pin/submission/momentum/crowd/AI scenarios complete without renderer dependency.

## Gate C — First playable

TODOs 0017–0021 plus human acceptance. Required: complete visual match, contextual controls, physical-mobile touch play, acceptable performance and no animation-driven state divergence.

## Gate D — Career meaningfulness

TODOs 0022–0032. Required: selecting different wrestlers and career histories creates meaningfully different booking/rivalry/title paths; save/load is safe and idempotent.

## Gate E — Release candidate

TODOs 0033–0039. Required: replay/evidence harness, audio/camera polish, supported match types, regression matrix, CI/branch rules and deployment verification.

## Release

TODO 0040 may deploy only an identified clean commit. Deployment must preserve rollback, verify packaged file integrity and record outstanding human acceptance rather than concealing it.
