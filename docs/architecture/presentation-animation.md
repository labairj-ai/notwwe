# Presentation and animation architecture

## Contract

Presentation consumes semantic state plus domain events and converts them into visible/audible choreography. It is never the source of gameplay truth.

## Responsibilities

- locomotion blending;
- move choreography;
- attacker/defender synchronization;
- selling/knockdown/get-up animation;
- camera cues;
- crowd/VFX cues;
- ring-rope visual response;
- semantic fallback if a preferred clip is missing.

## Animation synchronization

A resolved move may contain a presentation descriptor identifying choreography roles and expected duration. The match simulation can lock semantic control for the declared action duration, but contact frames do not decide success.

## Interruption safety

Every choreography sequence needs documented ownership and interruption rules. Match end, reversal, canceled context or invalid asset load must return both wrestlers to valid semantic presentation without changing simulation outcome.

## Performance policy

Mobile budgets and reduced-motion behavior must be explicit. Cosmetic crowd density/particles/shadows may degrade before gameplay readability or input responsiveness.

## Rigged pipeline (0.2)

Primary presentation now uses locally packaged GLTFLoader, SkeletonUtils.clone and AnimationMixer. Three source GLBs share a 53-bone contract. Only the athletic file contains the shared 38 original clips. Models load lazily with bounded caching, isolated cloned bones/materials, shared geometry/textures, and explicit mixer/material cleanup. A corrupt/missing GLB yields the prior procedural emergency body; a WebGL failure still yields tactical 2D. The application pauses its frame-driven advance while initial wrestler assets load, exactly like an ordinary UI pause; asset callbacks never alter domain state.

`clips.js` maps semantic states to clips, with safe Idle/CombatIdle fallback. Clips cross-fade, walk/run speed follows movement magnitude, pause freezes playback, and reduced motion samples semantic poses without paired flips. Winner/loser result determines Victory/Defeat presentation; both remain terminal in the simulation.

`choreography.js` defines move-specific actor/receiver clips, durations, contact/separation metadata and impact/camera hints. A shared presentation clock synchronizes normalized phase. Opponent-axis alignment offsets are clamped to 45 cm per axis and ring bounds, eased in/out, never written to MatchState. New resolved moves replace interrupted pairs; match changes/results clear them. No root motion reaches authoritative coordinates. Physical contact and body-size compatibility remain human-review criteria; offline geometric checks do not certify natural motion.

See `assets/README.md` for pinned authoring/provenance/budgets, `npm run assets:check` for shipped binary validation, and `docs/reviews/character-controls-validation.md` for measured evidence and limits.
