# System boundaries and state ownership

Ownership describes who may write authoritative fields. Other systems may read through stable queries or receive narrow data inputs.

## Career GameState

| Field/domain | Owner | Lifetime |
| --- | --- | --- |
| saveVersion | persistence | persistent schema marker |
| player.wrestlerId | career/character selection | persistent |
| player.popularity/fans/alignment | career/progression | persistent |
| player.money/contract | economy/contracts | persistent |
| calendar/week/show | career calendar | persistent |
| rankings | ranking system | persistent/derived according to final contract |
| championships/titleHistory | championship system | persistent |
| rivalries | rivalry system | persistent |
| fatigue/injuries | health/career | persistent |
| roster progression | career/progression | persistent |
| matchHistory | career/history | persistent bounded history |
| currentBooking | booking system | persistent until resolved |

## MatchState

| Field/domain | Owner | Lifetime |
| --- | --- | --- |
| matchId/seed/rngState | match session/core RNG | active match / replay |
| elapsed | match session | active match |
| participants | match session | active match |
| position/facing/ringZone | movement | active match |
| wrestlerState | match state machine | active match |
| damage/bodyParts | damage | active match |
| stamina | stamina | active match |
| momentum/signature/finisher availability | momentum | active match |
| crowd | crowd system | active match |
| pin state/count | pin/referee | active match |
| submission state | submission | active match |
| result | match rules/session | finalized result |
| event history | test/replay trace only unless explicitly bounded for UI | transient by default |

## Cross-system invariants

- Systems never mutate UI or renderer state.
- Rejected commands leave authoritative state unchanged.
- Cross-domain mutations that must be atomic are sequenced by the session layer.
- AI submits legal commands through the same dispatcher used by the player.
- Presentation events never cause gameplay effects.
- Content references are validated before entering live state.
