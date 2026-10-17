# Game design framework

## Player fantasy

Become an original professional wrestler and build a career from promising talent to promotion-defining superstar. The player should feel the difference between merely winning and creating a memorable wrestling performance.

## Core loop

```text
prepare / recover
→ weekly story or promo event
→ booked match
→ active wrestling match
→ result + match rating
→ popularity / rivalry / ranking / fatigue updates
→ next show
→ major-event payoff
```

## Wrestling-specific pillars

### Match control

The player actively controls positioning and chooses context-sensitive wrestling actions. Inputs should be readable on desktop and touch devices. Complex fighting-game command strings are out of scope.

### Selling and momentum

Damage, stamina, wrestler state, knockdowns, recovery speed and reversals should create momentum swings rather than a constant exchange of attacks.

### Story inside the match

Near falls, signatures, finishers, reversals, comeback moments, move variety and rivalry context should create a match-quality score independent of simple win/loss.

### Career consequence

A loss in a great match can improve reputation. A dull win can stall momentum. Rankings, popularity, rivalries, championships and contract opportunities should respond to meaningful history.

## Progression dimensions

- wrestler skill ratings;
- popularity/fan support;
- career momentum;
- championships and title history;
- rivalries and allies;
- contract quality and earnings;
- fatigue/injury risk;
- move unlocks or proficiency;
- alignment and character direction.

## Design restraint

The first goal is one excellent singles match. Career breadth, match-type breadth, large rosters and spectacular environmental physics must not hide a weak wrestling foundation.

## 0.2 pacing candidate

Match timing is data-driven in `src/content/timing.js`. AI decision intervals are easy 2.2s / normal 1.5s / hard 1.0s; attack telegraphs span 0.4–0.8s by family. Grapple selection lasts up to 6s, get-up 1.4s, and knockdowns reserve at least 2.5s after the attacker's move recovery for a readable cover opportunity. Pins protect the recovering defender from immediate repeated covers for 2.5s after a break. Hard AI conserves stamina rather than spending all low stamina on repeated readiness. Difficulty remains challenge tuning, not a different rules/clock path.

The target rhythm is setup → action → selling → decision → next exchange. Current automated samples and before/after values are in the character/control validation record. None of these values has passed human play acceptance; they are candidates for 0048 rather than asserted final balance.
