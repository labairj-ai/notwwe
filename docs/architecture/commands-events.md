# Commands and domain events

`dispatch(state, command)` is synchronous from the simulation's point of view and returns a serializable result such as `{ok, code, events}`. A future asynchronous UI may await assets or animations, but simulation dispatch itself remains deterministic.

## Command principles

- Commands express intent, not guaranteed results.
- Command payloads contain IDs and plain data only.
- Rejected commands emit no gameplay mutation.
- Player and opponent AI use the same command vocabulary.

## Initial match commands

```text
MOVE
RUN
ATTEMPT_STRIKE
ATTEMPT_GRAPPLE
SELECT_GRAPPLE_MOVE
ATTEMPT_GROUND_ACTION
ATTEMPT_PIN
ATTEMPT_SUBMISSION
ATTEMPT_REVERSAL   (only if explicit-input reversal design survives testing)
TAUNT
ATTEMPT_SIGNATURE
ATTEMPT_FINISHER
CANCEL_CONTEXT
```

Some actions may resolve through a contextual choice command rather than one overloaded command. Final command shapes belong in TODO-specific docs/tests.

## Career commands

```text
START_CAREER
SELECT_WRESTLER
CHOOSE_TRAINING
CHOOSE_RECOVERY
RESPOND_STORY_EVENT
ACCEPT_CONTRACT
ADVANCE_SHOW
```

Booking itself is system authority, not a UI direct-write command.

## Domain events

Examples:

```text
MATCH_STARTED
WRESTLER_MOVED
ATTACK_STARTED
ATTACK_MISSED
MOVE_CONNECTED
MOVE_REVERSED
DAMAGE_APPLIED
STAMINA_SPENT
STAMINA_RECOVERED
MOMENTUM_CHANGED
WRESTLER_KNOCKED_DOWN
WRESTLER_STATE_CHANGED
PIN_STARTED
PIN_COUNTED
PIN_BROKEN
SUBMISSION_STARTED
SUBMISSION_ESCAPED
SIGNATURE_AVAILABLE
FINISHER_AVAILABLE
MATCH_ENDED
MATCH_RATED
RIVALRY_CHANGED
RANKING_CHANGED
TITLE_CHANGED
```

Events are ordered facts returned from simulation. Audio, animation and camera systems can subscribe at the application/presentation boundary but cannot mutate authoritative state in response.

## Failure codes

Use stable machine-readable codes such as `INVALID_STATE`, `OUT_OF_RANGE`, `INSUFFICIENT_STAMINA`, `INVALID_TARGET`, `MOVE_NOT_AVAILABLE`, `MATCH_ENDED`, `PIN_NOT_LEGAL`. Human copy belongs to UI/presentation.
