# First playable acceptance record

**Status:** not yet executed  
**Required implementation:** TODOs 0001–0021

## Build identity

- Source SHA: pending
- Build/release ID: pending
- Automated test count/result: pending
- Browser versions: pending

## Desktop human gameplay

Record actual tester, device, browser and observations for:

- professional-wrestling feel;
- action readability;
- momentum/pacing;
- reversals;
- knockdown/get-up pacing;
- pin drama;
- AI intentionality;
- camera readability;
- animation synchronization;
- willingness to replay.

## Physical mobile gameplay

Record actual device/browser and observations for:

- all required actions reachable by touch;
- accidental camera/action conflicts;
- target sizes/safe areas;
- landscape/portrait policy;
- performance/thermal comfort;
- UI obstruction during pin/signature/finisher moments.

## Deterministic equivalence

- Headless scenario replay: pending
- Browser/frame-rate equivalence: pending
- Save/reload equivalence if active-match saving is supported: pending

## Decision

Do not mark this record passed from emulation or CI alone. Document blockers and follow-up TODOs if the match is technically correct but not yet fun/readable.


## 0.2 character/control acceptance — not yet performed

Candidate evidence: [character/control validation](character-controls-validation.md). Full required questions remain in TODO 0048; none is answered as a human pass by the automated suite or offline renders.

| Required session | Actual device/browser | Orientation | Human tester | Result |
| --- | --- | --- | --- | --- |
| Desktop character/control review | unavailable in this session | pending | pending | Not performed |
| Physical iPhone | pending actual device | portrait career + landscape match | pending | Not performed |
| Physical Android | pending actual device | portrait career + landscape match | pending | Not performed |

For each real session record exact deployed SHA, device/browser, fresh/returning player status, several full matches, archetype pairings, easy/normal/hard, signature/finisher/pin/reversal/grapple observations, input rejection/accidental-touch frequency, readability/contact/clipping findings, thermal/frame observations, and a pass/fail answer to every 0048 question. Final recommendation remains **iterate / acceptance pending** until that evidence exists. Failed findings must stay actionable/open; green CI never closes this gate.
