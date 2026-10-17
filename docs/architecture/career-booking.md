# Career and booking architecture

## Career authority

Career systems own long-term progression. Match systems output a normalized result and never directly edit rankings, rivalries or contracts.

## MatchResult boundary

A completed match should return data such as:

```js
{
  matchId,
  participants,
  winnerId,
  loserId,
  finishType,
  duration,
  matchRating,
  crowdScore,
  storyMetrics,
  damageSummary,
  notableEvents
}
```

Career systems consume this once. Idempotency or a recorded match ID must prevent applying the same result twice after reload/retry.

## Booking engine

Initial booking is deterministic rules-based logic. Inputs may include:

- rankings;
- popularity;
- alignment;
- rivalry heat;
- recent opponents/rematch fatigue;
- championship status;
- injuries/fatigue;
- recent match quality;
- calendar/major-event proximity.

Outputs may include matches, promos, rivalry beats and title opportunities.

A language model may later generate copy from an already-selected booking, but cannot select or mutate authoritative booking results unless a future explicit design changes this contract.

## Championships

Championship state must maintain current holder plus historical reign records. Title changes are atomic career events tied to a completed match result.
