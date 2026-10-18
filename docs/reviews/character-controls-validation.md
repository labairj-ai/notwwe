# Character and controls candidate — 0.2

Date: 2026-10-17. TODOs 0041–0047 are implemented candidates; required visual, motion and physical-device acceptance remains open. TODO 0048 is blocked on actual human/device evidence. No CI/screenshot/agent inspection is treated as that evidence.

## Implemented software

| TODO | Result | Verification / remaining acceptance |
| --- | --- | --- |
| 0041 | Three original rigged humanoid GLBs; primary GLTFLoader/SkeletonUtils pipeline; shared 53-bone rig; runtime skin/hair/gear customization; original wrestling attire/footwear; bounded cache; emergency procedural fallback | Actual shipped binaries checked, two cloned skeleton/material instances isolated, corrupt/missing asset fallback tested. Browser texture decode/GPU cost and comparison acceptance against Notsims remain open |
| 0042 | 38 original skeletal clips; semantic state mapping; cross-fades; walk/run magnitude; knockdown/get-up; winner/loser; pause/reduced-motion/missing-clip behavior | Actual GLB playback moves bones; pause and ground/root bounds tested. Naturalness, clipping, interpolation under real rendering remain human review |
| 0043 | Move-specific synchronized actor/receiver clips, bounded/eased opponent-axis alignment, interruption/reset, safe missing presentation fallback | Repeated pairs preserve MatchState and clamp offsets; offline lift/landing inspection prompted floor-clearance/contact-height corrections. Some contact/clipping still needs review across body sizes; no claim of motion-capture quality |
| 0044 | Fixed Strike/Grapple/Action/Counter/Special hit boxes; directional/contextual resolution; keyboard/gamepad adapters; no reflowing move list/Run toggle/directional grid | Stable DOM and inline geometry across seven states; standing/running/grapple/ground/defense/special/corner/rope queries use normal dispatcher legality. Human muscle-memory clarity remains open |
| 0045 | One bounded tick-based pending intent per player; inclusive expiry; first-legal-tick execution; no automatic AI buffer; source-aware serialized requests; attack wind-ups | Early/exact/late expiry, replacement, range/resources, terminal clearing, paused simulation, save/reload during pending intent/attack and exact replay tested |
| 0046 | Floating analog stick; five fixed right-thumb verbs; four device presets including left-handed; safe areas; landscape layout; portrait career; automatic camera; two-finger/paused optional adjustment | Deadzone/saturation/cancel and accessible configuration dimensions tested. Physical iPhone/Android reach, notches, canceled touches, orientation/thermal/frame behavior remain open |
| 0047 | Data-driven timing, telegraphed counter opportunities, alternating AI initiative, grapple/get-up/cover opportunities, pin recovery protection and hard-AI stamina conservation | 36 replay cases + 36 difficulty pacing cases. Repeated-pin and hard-defense loops corrected. Human easy/normal/hard responsiveness, rejection rates and fun remain open |
| 0048 | Review questions/device matrix retained in the TODO; candidate evidence prepared here | No real desktop visual session or physical phone available. CUA reports no registered browsers; Chrome native access returns `cgWindowNotFound`. Not complete |

## Automated evidence

- `npm test`: **43 passing tests** (legacy domain/career/release plus new buffer, controls, v1→v2/frozen saves, actual GLB/rig and paired presentation coverage).
- `npm run check`: syntax, full content, 43-module dependency graph/cycles and forbidden dependencies; checks actual binary asset budgets and source/asset manifest.
- `npm run scenarios`: 36 complete match-type/seed runs, exact final-state and ordered-event replay.
- `npm run pacing`: 12 seeds for each of easy/normal/hard; all finish by pin in this sample, no time-limit draws. Generated detailed per-match/participant rates in `artifacts/pacing.json` and CI artifact.
- `npm run build`: complete local static package with Three.js and the three addons, 3 GLBs, metadata/licenses and integrity hashes. Development builds truthfully remain dirty/uncertified; clean SHA rehearsal follows the commit.
- Node GLTFLoader tests strip texture bindings in memory to run CPU meshes/skin/animation. They do **not** certify image decode, WebGL, lighting, phone frame cost or audible output.

## Asset measurements

Source artifact hashes and exporter fingerprint: `assets/wrestlers/asset-manifest.json`. Blender 4.5.4 LTS + MPFB 2.0.18; CC0 declaration and source/license links in `assets/README.md`.

| Source GLB | Bytes | Triangles | Bones | Textures |
| --- | ---: | ---: | ---: | --- |
| athletic (+ shared clips) | 6,759,992 | 36,506 | 53 | 5 × 1024² PNG |
| powerhouse | 5,926,848 | 36,506 | 53 | 5 × 1024² PNG |
| women_athletic | 5,930,548 | 36,506 | 53 | 5 × 1024² PNG |

Total: 18,617,388 bytes. Decoded texture base pixels: 20 MiB per source, upper bound ~26.7 MiB with mipmaps; actual GPU allocations/frame cost remain unmeasured. First match generally requests athletic library + selected second body. Templates are cached, geometry/textures shared, per-wrestler bones/materials cloned. Authoring `.blend` files are not runtime downloads.

## Control matrix and geometry

| Verb | Context | Command |
| --- | --- | --- |
| Move | free state | normalized velocity; magnitude >.72 runs, deadzone .12 |
| Strike | standing / running / ground / corner / ropes | authored legal strike variant or ground action |
| Grapple | near legal opponent | initiate grapple |
| Grapple + direction | grapple owner | neutral arm drag; up suplex; left arm drag; right back drop; down leg sweep (content slots) |
| Action | opponent down | pin; down+Action submits |
| Action | owned pin/submission/grapple | release |
| Action | free / no special context | taunt |
| Counter | telegraph, pin or submission defense | normal stamina/cooldown-limited defense readiness; never guaranteed reversal |
| Special | 60 / 90 momentum and normal legality | signature / finisher |

Keyboard: arrows/WASD, Shift run, J/K/L/I/O verbs. Gamepad left stick and buttons 0–4 use the same verbs. Held action buttons are edge-triggered. Unknown future weapons/climb/whip actions are intentionally unavailable.

Standard cluster centers (CSS px): Strike (110,104), Grapple (38,148), Action (183,148), Counter (110,211), Special (110,31). Diameters 70/70/62/62/56. Compact scale .94, Large 1.06, landscape additional .94. Minimum compact-landscape target: 49.5px. Landscape uses a wider 270×190 cluster: Strike (150,70), Grapple (70,120), Action (230,120), Counter (150,150), Special (230,40), so its targets fit short phone viewports. The geometry is constant across match contexts; viewport orientation may select a different configured arrangement. This is configuration/DOM evidence, not physical hit-box/reach measurement.

## Timing and diagnostic results

| Setting | 0.1 | 0.2 candidate |
| --- | --- | --- |
| AI easy/normal/hard decision cadence | 1.6 / 1.0 / .7s | 2.2 / 1.5 / 1.0s |
| Attack reaction cue | immediate resolved attack | 0.4–0.8s authoritative telegraph before resolution |
| Grapple choice timeout | 4s | 6s |
| Get-up | 1s | 1.4s |
| Guaranteed post-move cover opportunity | none | at least 2.5s after attacker recovery |
| Re-cover protection after a broken pin | none | 2.5s |
| Player intent buffer | none | Strike/Grapple/Special .3s, Action .4s, Counter .2s |

Current diagnostic sample:

| Difficulty | Minimum / median / maximum seconds | Pin attempts across 12 matches | Reversals | Draws |
| --- | --- | ---: | ---: | ---: |
| Easy | 124 / 206.5 / 438 | 97 | 26 | 0 |
| Normal | 139.5 / 217.5 / 345 | 111 | 88 | 0 |
| Hard | 94 / 163 / 319 | 90 | 82 | 0 |

The previous recorded default sample ended in 44–114s. Different timing and initiative change outcomes, so this is a balance revision rather than an assertion of old replay compatibility. Automated difficulty behavior is distinct, but challenge for a real player and human failed/rejected-input frequency have not been measured.

## Persistence, release and remaining evidence

Save v2 migrates v1 purely and preserves already resolved damage. Pending request/wind-up state resumes without duplicate execution. V2 browser writes use a separate key and preserve the old v1 snapshot for rollback. New replay version 2 rejects unsupported v1 traces explicitly.

CUA browser/desktop visual review is unavailable, as are physical iPhone/Android and human audible/gameplay observations. The original human gates remain open. Candidate deployment can be performed under the user's existing explicit OptiPlex instruction while `certified:false` stays truthful; deployment does not close 0048 or certify release quality. No broader career, roster or match-type expansion is included.

Offline source-asset illustrations (Blender, not runtime screenshots): [lift](media/suplex-lift-offline.png), [landing phase](media/suplex-landing-offline.png). These show an authored athletic/athletic pair with source material tints; the runtime uses independent roster proportions and bounded alignment. They do not certify contact at other sizes, a browser frame or physical-device quality.


## Published candidate identity

PR [#5](https://github.com/labairj-ai/notwwe/pull/5) merged after [passing CI](https://github.com/labairj-ai/notwwe/actions/runs/39066887973). Source `e53e5cc406d85e72101365d4d8a1d8aec15214eb` was built clean and activated on OptiPlex at 2026-10-17T20:30:25Z. Public HTTP/MIME/hash/source checks passed, including all three GLBs and packaged loader/skeleton modules. Previous playable release retained for rollback. See [release validation](release-validation.md). Human/device certification is still false; this activation does not close 0048.

## 0049/0051 follow-up

Semantic button-down buffering and bounded per-control local diagnostics are implemented. Eight new focused tests bring the suite to 51, including posture changes, both Special threshold cases, directional grapple/release identity, Counter before/after its window, immediate/buffered wait, resource/range/replacement/terminal failures, collection isolation, and frozen v3 validation/chunking. Existing exact replay/save tests cover deterministic counters. No remote telemetry or network dependency was added.

Capture a report with Menu → Acceptance tools → Export control diagnostics after a completed match. Offline: `node scripts/control-report.mjs save.json --out report.json`; optional `--build-info build-info.json` attaches explicitly supplied identity (the CLI does not infer a historical save's SHA). Source identity must be confirmed against the frozen acceptance header. V2 raw pending controls are intentionally cancelled on migration; existing damage/prepared attacks remain. See save schema for limits. Human/physical acceptance 0048 remains open.
