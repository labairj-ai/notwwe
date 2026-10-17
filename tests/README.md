# Test strategy

## Test classes

- unit tests for pure rules/calculations;
- invariant tests for system boundaries;
- command/dispatcher tests;
- deterministic match scenarios;
- replay equivalence tests;
- save/migration fixtures;
- UI/controller tests;
- render/presentation contract tests where useful;
- browser smoke;
- physical-device/human acceptance records.

## Required deterministic scenarios for first playable

At minimum cover:

- strike hit/miss/reversal;
- grapple success/reversal;
- stamina exhaustion/recovery;
- regional damage bounds;
- knockdown/get-up;
- legal/illegal pin attempts;
- 1/2/3 kick-out outcomes under fixed seeds/ratings;
- submission escape/tap;
- signature/finisher thresholds;
- match end prevents further commands;
- AI issues only legal commands;
- identical seed/commands produce identical events and final state;
- renderer frame rate does not change authoritative result.

## Human acceptance

Automated browser emulation cannot close tasks requiring physical iOS/Android, human animation review, audible-output confirmation or subjective gameplay/fun observations.
