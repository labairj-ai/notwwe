# First playable acceptance record

**Status:** human/device acceptance not performed; TODO 0048 remains blocked.  
**Template revision:** 3, frozen after TODOs 0049/0051. No human acceptance is inferred.

## Frozen candidate identity

| Field | Observed value |
| --- | --- |
| Source SHA on main | `dfcfe4cb8ee9df25db33e03a256b0d8aab51be7d` |
| Implementation | [PR #8](https://github.com/labairj-ai/notwwe/pull/8) |
| Release ID | `releases/dfcfe4cb8ee9df25db33e03a256b0d8aab51be7d` |
| Fixed acceptance URL | [https://optiplex.tailb97cdb.ts.net/notwwe/releases/dfcfe4cb8ee9df25db33e03a256b0d8aab51be7d/](https://optiplex.tailb97cdb.ts.net/notwwe/releases/dfcfe4cb8ee9df25db33e03a256b0d8aab51be7d/) |
| Current deployment URL | [https://optiplex.tailb97cdb.ts.net/notwwe/](https://optiplex.tailb97cdb.ts.net/notwwe/) |
| Activated UTC | 2026-10-18T00:25:39.250605+00:00 |
| Built UTC | 2026-10-18T00:25:01.164Z |
| Automated tests | 51 passed, 0 failed |
| Exact replay cases | 36 passed |
| Difficulty pacing runs | 36 completed, 0 draws |
| Source/content/asset checks | passed, 44 source modules |
| CI for this exact main SHA | [39082644918 — success](https://github.com/labairj-ai/notwwe/actions/runs/39082644918) |
| Clean source | `true` |
| Certification | `false` |
| Save / simulation / timing versions | 3 / 3 / 2 |

Machine-readable record: [acceptance-candidate.json](acceptance-candidate.json). Documentation commit identity is recorded in the documentation PR/commit history; it is separate from this deployed implementation identity.

The fixed URL serves the retained release directory; later changes to the current pointer cannot change it. The page's Menu → Acceptance tools displays the source SHA embedded at build time. Confirm that full SHA and the fixed URL at the start of every session. Export diagnostics before starting another match. Do not use the current URL for a frozen test unless its independently observed SHA matches this header.

## Required physical sessions

| Session | Actual device / OS / browser | Orientation | Human tester | Observed full source SHA | SHA matches header, confirmed by tester | Result |
| --- | --- | --- | --- | --- | --- | --- |
| Desktop character/control review | Not recorded | Not recorded | Not recorded | Not observed | Required before testing | Not performed |
| Physical iPhone | Not recorded | Portrait career + landscape match | Not recorded | Not observed | Required before testing | Not performed |
| Physical Android | Not recorded | Portrait career + landscape match | Not recorded | Not observed | Required before testing | Not performed |

For every session record date/time, fresh/returning player, several full matches, archetype pairings, easy/normal/hard, and a pass/fail answer to every question in TODO 0048. Record actual browser versions and device performance/thermal observations. Emulation, headless tests and asset renders do not satisfy these rows.

Desktop questions include professional-wrestling feel, action readability, momentum/pacing, reversals, get-up timing, pin drama, AI intentionality, camera readability, synchronization/contact/clipping and willingness to replay. Physical mobile questions include touch reach, accidental camera/action conflicts, target sizes/safe areas, orientation, thermal/frame comfort and HUD obstruction during pins/signatures/finishers. Keep failed findings actionable and open.

## Capturing local diagnostics

After each full match use Menu → Acceptance tools → Export control diagnostics, then export the save as a companion artifact. The report includes page build identity, completion flag, per-control counts, average/max wait and stable failure reasons. No personal information or remote telemetry is collected. Include the report filename and observed SHA in the session notes. A report marked partial (disabled/saturated counters) cannot be treated as complete control-frequency evidence.

Offline alternative: `node scripts/control-report.mjs save.json --out report.json`. Supply `--build-info build-info.json` only when that file's identity has been independently confirmed for the saved session; an arbitrary save does not prove its own historical build identity. [Sample completed-match report](control-diagnostics-sample.json) is synthetic automated evidence, with no candidate attached, and is not a human test.

## Deterministic evidence and remaining observations

Headless replay and active-match save/reload/chunk equivalence pass automated checks. Browser/frame-rate equivalence, WebGL visual output, audible output, physical ergonomics and subjective gameplay remain unperformed. Report these separately from deterministic simulation checks.

## Retest policy

Every observation belongs to its actual full source SHA. If the candidate changes, retain earlier notes under that SHA; create a new candidate header and new session rows. Never relabel or silently carry a pass forward. Changes to commands/buffers/pacing require repeating full control/gameplay sessions on desktop, iPhone and Android. Rendering/assets/camera changes require repeating fidelity, contact, readability and performance observations on all affected devices. Layout/input changes require repeating reach, accidental input and orientation checks on both physical phones plus affected desktop input. For documentation-only changes, record that assessment explicitly and retain the same deployed implementation SHA. Any unclear impact requires retesting the affected question before acceptance.

## Decision

**Iterate / human acceptance open.** No physical session, audible test, subjective fun, character fidelity or device pass is claimed. `certified:false` stays in the release until actual acceptance gates pass.
