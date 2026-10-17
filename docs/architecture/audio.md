# Audio architecture

Audio is presentation. It reacts to semantic events and does not influence simulation.

## Categories

- music;
- crowd/arena ambience;
- impact and ring effects;
- wrestler/effort vocalizations using original/licensed assets;
- UI/interface;
- entrance presentation.

## Semantic cue examples

`MOVE_CONNECTED` may resolve an impact cue based on move family and body context. `PIN_COUNTED` can trigger a referee/crowd cue. `FINISHER_AVAILABLE` may trigger a bounded stinger. Cue selection must not write gameplay state.

## Browser rules

Audio starts only after a trusted user gesture according to browser policy. Muting, visibility changes, pause and device preferences must be handled without altering match time.

## Acceptance

Automated decode/graph tests are not proof a human heard correct output. Physical audible-output acceptance must record device/browser and human observation separately.
