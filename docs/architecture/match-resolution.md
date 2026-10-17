# Deterministic match resolution

## Authority

A wrestling action is resolved by simulation before its animation result is played. Animation events such as contact frames are presentation timing markers only.

## Baseline move-resolution sequence

1. Validate command schema and participant IDs.
2. Verify match is active.
3. Verify attacker/defender semantic states allow the action.
4. Verify contextual position/ring zone and move requirements.
5. Compute stamina eligibility/cost according to action policy.
6. Resolve defense/reversal/counter opportunity from deterministic ratings, state and RNG.
7. Resolve hit/success/failure.
8. Apply damage to declared body region(s).
9. Apply stamina and recovery effects.
10. Apply knockdown/stun/position/state transitions.
11. Apply momentum and crowd effects.
12. Evaluate signature/finisher availability.
13. Evaluate match-ending conditions where applicable.
14. Emit ordered domain events describing applied facts.

## Damage model

Track at minimum:

```text
head
torso
leftArm
rightArm
leftLeg
rightLeg
```

Damage influences recovery, move effectiveness and submission vulnerability without requiring graphic injury depiction.

## Stamina

Stamina is distinct from damage. Expensive offense, running and prolonged sequences consume stamina. Recovery is bounded and affected by wrestler attributes/state.

## Repetition

Match-quality scoring should penalize excessive repeated offense. Do not make repetition impossible; make variety strategically valuable.

## Numeric policy

All bounded resources define clamps and units in their owning system. Avoid hidden percentages mixed with 0–1 and 0–100 representations.
