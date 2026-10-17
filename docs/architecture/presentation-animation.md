# Presentation and animation architecture

## Contract

Presentation consumes semantic state plus domain events and converts them into visible/audible choreography. It is never the source of gameplay truth.

## Responsibilities

- locomotion blending;
- move choreography;
- attacker/defender synchronization;
- selling/knockdown/get-up animation;
- camera cues;
- crowd/VFX cues;
- ring-rope visual response;
- semantic fallback if a preferred clip is missing.

## Animation synchronization

A resolved move may contain a presentation descriptor identifying choreography roles and expected duration. The match simulation can lock semantic control for the declared action duration, but contact frames do not decide success.

## Interruption safety

Every choreography sequence needs documented ownership and interruption rules. Match end, reversal, canceled context or invalid asset load must return both wrestlers to valid semantic presentation without changing simulation outcome.

## Performance policy

Mobile budgets and reduced-motion behavior must be explicit. Cosmetic crowd density/particles/shadows may degrade before gameplay readability or input responsiveness.
