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
