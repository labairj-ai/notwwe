# Rivalry and relationship system

Rivalries are persistent structured history, not a single heat number.

## Suggested rivalry state

```js
{
  id,
  participants,
  heat,
  chemistry,
  alignmentContext,
  championshipContext,
  startedWeek,
  lastInteractionWeek,
  recentHistory,
  winsByParticipant,
  promoHistory,
  interferenceHistory,
  betrayalFlags,
  resolved
}
```

## Principles

- Heat changes are bounded and explainable by recorded interactions.
- Repetition fatigue should prevent endlessly repeating the same beat for full value.
- Rivalry history influences match-quality/story scoring but must not override match rules.
- Rivalry generation must respect recent-opponent cooldowns unless a deliberate continuing feud justifies a rematch.
- Resolution does not erase history; it marks the active arc resolved and preserves career history.
