# Content model

Content modules define stable data. They contain no DOM, Three.js, storage or simulation mutation logic.

## Wrestler definition

```js
{
  id,
  name,
  nickname,
  hometown,
  alignment,
  archetype,
  physical: { height, weight, bodyType, movementStyle },
  ratings: {
    power, striking, grappling, technique,
    speed, stamina, resilience, charisma
  },
  moveset: {
    strikes, grapples, runningMoves, aerialMoves,
    groundMoves, submissions, signature, finisher
  },
  presentation: { /* original asset references only */ }
}
```

## Move definition

A move should define semantics such as:

```js
{
  id,
  name,
  family,
  requiredContext,
  attackerStates,
  defenderStates,
  staminaCost,
  damage,
  bodyTargets,
  knockdown,
  stun,
  momentum,
  crowdTags,
  animationKey
}
```

`animationKey` is presentation metadata. Changing the animation asset cannot alter damage or legality.

## Match type definition

Defines legal win conditions and rule toggles, not implementation branches tied to UI.

## Validation

Build/test checks must reject duplicate IDs, unknown references, invalid ratings/ranges, missing signatures/finishers, invalid move contexts and non-original/prohibited asset references when mechanically detectable.
