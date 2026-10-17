# First playable specification

## Purpose

Prove that Not WWE can deliver a complete, enjoyable browser wrestling match before building a broad career game.

## Scenario

**Marcus Reign vs. Cole Sterling** in one original arena under standard singles rules.

## Required gameplay

- movement and facing;
- run;
- basic strikes;
- grapple initiation and move selection;
- 8–12 legal moves per wrestler;
- context near ropes/corner/ground;
- stamina cost and recovery;
- regional body damage;
- reversals/counters;
- knockdowns and getting up;
- pin attempts, kick-outs and referee count;
- momentum;
- signature and finisher;
- baseline opponent AI;
- match result and match-quality score;
- desktop and touch controls;
- save/reload only if the implementation explicitly supports in-progress matches at this stage;
- deterministic scenario/replay coverage.

## Human acceptance questions

A tester should be able to answer yes to these questions:

1. Does this feel like professional wrestling rather than generic fighting?
2. Are positioning and wrestler state understandable without reading debug data?
3. Do reversals, stamina and knockdowns create meaningful momentum swings?
4. Can a match produce a believable build toward signatures/finishers and near falls?
5. Can a phone user perform every required match action without a keyboard/gamepad?
6. Does the opponent behave intentionally rather than randomly?
7. Would the tester voluntarily play an immediate rematch?

## Explicit non-goals

No tag teams, battle royals, ladders, tables, backstage exploration, online multiplayer, large roster, create-an-arena, generative commentary or complex facial animation.

## Gate

TODOs 0001–0021 must be implemented with automated evidence. The first playable is not certified until human desktop and physical-mobile play observations are recorded in `docs/reviews/first-playable-acceptance.md`.
