# notwwe

A new wrestling game project, maintained independently from Notsims.

## Project plan

The [shared project overview](https://chatgpt.com/s/t_6ad3c07a1f1881918a99200c7da673ea) describes a 74-file Markdown
planning package, including 40 implementation TODOs. This repository preserves
that overview and its stated starting sequence. The linked ZIP and its detailed
specifications have **not yet been imported**; its `sandbox:/mnt/data/...` links
are references to files in the originating chat, not files available here.

The shared overview identifies these areas:

- Product vision, game design and a first-playable specification.
- Game architecture, system boundaries, commands/events and match resolution.
- Deterministic match state, seeded RNG, positioning and wrestler state machines.
- Wrestler/move schemas, opponent AI, careers, booking and rivalries.
- Mobile interfaces, persistence/replay, audio and asset provenance.
- Original-IP guardrails, testing/release gates and deployment contracts.

## Starting sequence

The source recommends TODOs **0001–0006**, in order:

1. Architecture foundations.
2. Application shell.
3. Content schemas.
4. Deterministic MatchState and RNG.
5. Ring positioning.
6. Wrestler state machine.

Combat follows those foundations. This list records the shared overview; the
original detailed task descriptions and acceptance criteria are still required
before implementation.

## Repository status

Project initialized; no game code or gameplay completion is claimed. No technology
stack or license has been selected from the unavailable detailed specifications.

See [the source record](docs/project-source.md) and [backlog status](.todos/README.md).
