# Mobile interface contract

Mobile is a first-class control surface, not a compressed desktop layout.

## Structural pattern

Reuse the proven browser-game pattern:

- full-screen 3D arena;
- compact top HUD for wrestler/resource status;
- contextual primary match actions near the bottom;
- persistent bottom navigation for Live/Career/Roster/Training outside active-match focus;
- draggable/collapsible bottom sheet for detail views;
- safe-area support;
- minimum 44px touch targets.

## First-playable action coverage

A touch-only user must be able to:

- move and reposition;
- run;
- strike;
- grapple and select a contextual move;
- act on a grounded opponent;
- pin;
- submit where legal;
- use signature/finisher;
- cancel/close context;
- pause/menu if supported.

No keyboard-only action may be required to finish a match.

## Gesture rules

Camera gestures must not accidentally issue combat/movement commands. Multi-touch camera navigation and single-touch action selection need explicit arbitration and automated gesture-safety tests.

## Physical acceptance

Emulated responsive Chrome is useful but cannot certify physical iOS/Android touch comfort, safe areas, thermal behavior or standalone/PWA behavior. Record real-device evidence separately.

## Stable two-thumb surface (0.2, supersedes dynamic action grid)

Five persistent buttons retain their DOM nodes/hit boxes for the entire match: Strike, Grapple, Action, Counter and Special. Context changes labels/availability, never placement. A floating left stick determines direction and analog magnitude; pushing farther runs. The Run toggle, directional button grid, live move-name list and single-finger mat movement have been removed. Buttons remain dim but can queue a bounded early input; Counter highlights an affordable telegraphed opportunity. Expired inputs explain range/recovery/momentum failure through non-authoritative feedback.

Direction + Grapple chooses authored neutral/up/left/right/down move slots. Strike chooses standing/running/ground/corner/rope variants. Action covers a down opponent; down + Action submits; Action releases an owned grapple/pin/submission or taunts when free. Unsupported weapons/climbing/whip commands are not fabricated. Special reserves the same button for signature/finisher thresholds. Keyboard J/K/L/I/O and gamepad buttons 0–4 map to these same verbs; arrows/WASD walk, Shift runs.

Geometry is configuration: Standard/Compact/Large/Left-handed presets are device preferences. Base diameters Strike/Grapple 70px, Action/Counter 62px, Special 56px; compact scale .94, large 1.06. Landscape applies an additional .94 scaling; the smallest compact Special target remains >49px. Stick radius 52px, deadzone .12, smooth saturation. Touch capture/release/cancel/lost capture, blur, visibility, orientation and layout changes release movement safely. Held keyboard/gamepad buttons are edge-triggered for verbs.

Match controls favor landscape; portrait career/menu remains usable. Safe-area insets, reserved bottom-sheet space and automatic wide camera framing keep required controls independent of camera operation. Two-finger camera adjustment or paused camera adjustment is optional. No single-finger camera gesture can dispatch wrestling. Physical thumb reach, notches, accidental touches and thermal/frame behavior remain open under TODO 0048.
