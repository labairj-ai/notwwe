# Wrestler match state machine

Explicit states prevent animation and input code from creating contradictory gameplay conditions.

## Baseline states

```text
STANDING
WALKING
RUNNING
GRAPPLING
ATTACKING
REVERSING
STUNNED
KNOCKED_DOWN
GETTING_UP
CORNERED
ROPES
APRON
TOP_ROPE
PINNING
PINNED
SUBMISSION_ATTACK
SUBMISSION_DEFENSE
TAUNTING
SIGNATURE
FINISHER
VICTORY
```

Additional substates may be introduced only when they represent gameplay rules rather than animation detail.

## Rules

- State transitions occur in simulation systems.
- Every action declares allowed source states and deterministic resulting states.
- Presentation may blend between animations without altering semantic state.
- `STUNNED` and `KNOCKED_DOWN` must have bounded exit rules; no permanent lock unless the match has ended.
- Pin/submission states are mutually exclusive with ordinary grapple/attack states.
- A winner/loser after `MATCH_ENDED` cannot accept new combat commands.
- Cancellation/interruption policy is explicit per action; never infer legality from the current animation clip.

## Example flow

```text
STANDING
  → ATTEMPT_GRAPPLE
GRAPPLING
  → successful move
ATTACKING
  → MOVE_CONNECTED
KNOCKED_DOWN (defender)
STANDING / recovery state (attacker)
```

A reversal branches to `REVERSING` and applies the reversal result defined by the move/rules system.
