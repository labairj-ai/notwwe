# Deterministic scenario and replay contract

## Scenario harness

Tests can start from a new match/career or validated fixture, execute serializable commands, advance explicit simulation time and assert result codes, ordered event types and meaningful state invariants.

## Replay trace

A trace should contain at minimum:

```js
{
  version,
  name,
  seed,
  initial,
  steps: [
    { command, result },
    { advance, result }
  ]
}
```

No DOM functions, assertion closures, wall-clock timestamps or renderer state belong in a replay trace.

## Determinism guarantee

For supported scenario granularity:

```text
same canonical initial state
+ same seed
+ same commands
+ same simulation-time advances
= same ordered results/events and authoritative final state
```

Rendering at 30, 60 or 120 fps must not affect this result.

## RNG

Use an explicit uint32-seeded reproducible generator with serializable state. If multiple streams are introduced, document which subsystem owns each stream and ensure cosmetic streams cannot perturb gameplay sequences.

## 0.2 replay identity

New traces are replay version 2 / simulationVersion 2. They include raw movement/control-intent commands, tick advances, ordered results and initial serializable state. Buffer expiry, wind-up resolution, AI initiative and RNG replay exactly through save/resume. Old version-1 traces are rejected explicitly because the timing/rules profile changed; the v1 save migration remains supported. Re-running old traces under new balance is not claimed compatible.

`npm run scenarios` covers 36 complete match-type/seed replays; `npm run pacing` separately samples all three difficulty tiers and records durations, pins, reversals, misses and per-participant attack rates. Headless timings are diagnostics, not human reaction-time or fun acceptance.
