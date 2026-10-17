# Opponent AI architecture

## Goal

Create readable wrestling behavior using deterministic decision policy, not an opaque real-time agent.

## Rules

- AI reads the same authoritative MatchState available to player queries.
- AI issues the same legal commands as a player.
- AI cannot directly apply damage, teleport wrestlers, force reversals or bypass stamina/state rules.
- Decision randomness uses the match RNG stream or a documented deterministic substream.
- Given identical state, seed and difficulty, AI decisions must be replayable.

## Decision inputs

Examples:

- distance/context;
- attacker/defender state;
- stamina;
- body damage;
- momentum/signature/finisher availability;
- wrestler archetype/moveset;
- recent action repetition;
- pin/submission opportunity;
- difficulty/personality policy.

## Behavior priorities

AI should appear to wrestle a match: create offense, vary moves, attempt sensible pins, pursue weakened body parts, use signatures/finishers, occasionally taunt at appropriate risk and react to context. Higher difficulty should improve decision quality/timing rather than simply grant hidden damage bonuses.
