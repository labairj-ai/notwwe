# Not WWE implementation backlog

All initial tasks are **proposed**. Status may change only when the task's acceptance criteria and truthful completion evidence are satisfied.

## Recommended execution

### Phase 1 — Foundation

**0001 → 0002/0003 → 0004 → 0005 → 0006**

0002 and 0003 can proceed in parallel after 0001. Match systems should not be built before deterministic MatchState and the semantic state machine exist.

### Phase 2 — Headless wrestling

**0007 → 0008/0009 → 0010 → 0011 → 0012/0013 → 0014 → 0015 → 0016**

This phase must produce a complete headless singles match before relying on 3D presentation.

### Phase 3 — First playable

**0017 → 0018 → 0019 → 0020 → 0021**

Rendering may begin after ring/movement foundations, but combat choreography waits for resolved gameplay systems. Gate C requires human/physical mobile acceptance in addition to implementation.

### Phase 4 — Career

**0022 → 0023 → 0024 → 0025 → 0026 → 0027/0028 → 0029/0030/0031 → 0032**

Do not let broad roster/career work hide first-playable match-quality issues.

### Phase 5 — Quality and release

**0033 → 0034/0035 → 0036 → 0037 → 0038 → 0039 → 0040**

0037 is a tag-team architecture foundation, not permission to expand into a full multi-team game before singles is stable.

## Full backlog

| ID | Priority | Work | Depends |
| --- | --- | --- | --- |
| 0001 | Critical | Define Not WWE architecture contracts | none |
| 0002 | Critical | Scaffold browser application and Notsims-inspired UI shell | 0001 |
| 0003 | Critical | Define wrestler, move, arena and match content schemas | 0001 |
| 0004 | Critical | Build deterministic match state and seeded RNG | 0001, 0003 |
| 0005 | Critical | Build ring coordinates, movement and positioning | 0004 |
| 0006 | Critical | Build wrestler semantic state machine | 0004, 0005 |
| 0007 | Critical | Implement strike action resolution | 0005, 0006 |
| 0008 | Critical | Implement grapple and move-resolution engine | 0005, 0006, 0007 |
| 0009 | Critical | Add stamina, regional damage and recovery systems | 0007, 0008 |
| 0010 | Critical | Implement reversals and counters | 0008, 0009 |
| 0011 | Critical | Implement knockdown, stun and get-up logic | 0009, 0010 |
| 0012 | Critical | Implement pins and referee counts | 0011 |
| 0013 | High | Implement submissions and rope breaks | 0011, 0012 |
| 0014 | Critical | Add momentum, signatures and finishers | 0010, 0011, 0012 |
| 0015 | High | Add crowd reaction and match-quality scoring | 0014 |
| 0016 | Critical | Implement baseline deterministic opponent AI | 0010, 0011, 0012, 0013, 0014, 0015 |
| 0017 | High | Build Three.js ring and arena presentation | 0005 |
| 0018 | Critical | Add wrestler models and locomotion presentation | 0017, 0005, 0006 |
| 0019 | Critical | Build animation controller and combat choreography | 0007, 0008, 0010, 0011, 0012, 0013, 0014, 0018 |
| 0020 | Critical | Build contextual match-control UI | 0016, 0019 |
| 0021 | Critical | Add physical-mobile wrestling controls and bottom-sheet UX | 0020 |
| 0022 | High | Create initial original 12-wrestler roster | 0003, 0021 |
| 0023 | High | Add wrestler selection and new-career flow | 0022 |
| 0024 | Critical | Implement career progression and rankings | 0023, 0015 |
| 0025 | High | Implement rivalry and relationship engine | 0024 |
| 0026 | Critical | Implement deterministic promotion booking engine | 0024, 0025 |
| 0027 | High | Add championships and title history | 0026 |
| 0028 | High | Add weekly shows and major-event calendar | 0026, 0027 |
| 0029 | High | Add promo and story-event framework | 0025, 0026, 0028 |
| 0030 | High | Add training, skill development, fatigue and recovery | 0024, 0028 |
| 0031 | Medium | Add contracts, earnings and merchandise economy | 0024, 0028 |
| 0032 | Critical | Add versioned career save and migration pipeline | 0024, 0025, 0026, 0027, 0028, 0029, 0030, 0031 |
| 0033 | Critical | Add deterministic match replay and scenario acceptance harness | 0016, 0032 |
| 0034 | High | Add semantic audio, crowd ambience and entrance framework | 0019, 0022 |
| 0035 | High | Add camera director and broadcast presentation | 0019, 0034 |
| 0036 | Medium | Add No-DQ and championship singles match types | 0012, 0013, 0014, 0027, 0033 |
| 0037 | Medium | Add tag-team architecture foundation | 0036, 0033 |
| 0038 | Critical | Perform first complete desktop/mobile gameplay acceptance | 0021, 0033, 0034, 0035, 0036 |
| 0039 | Critical | Add CI, branch protection and release certification | 0033, 0038 |
| 0040 | Critical | Deploy first playable Not WWE release | 0039 |

## Status rules

Use statuses consistently:

- `proposed` — planned but not started;
- `in_progress` — implementation/evidence actively underway;
- `blocked` — cannot proceed because a prerequisite or external acceptance is missing;
- `implemented` — code exists and automated gates pass but required human/device acceptance remains;
- `complete` — all stated acceptance criteria, including required human/device criteria, are satisfied.

Never use `complete` merely because CI is green when the TODO explicitly requires human motion, physical mobile, audible-output or subjective gameplay acceptance.
