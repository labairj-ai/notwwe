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
