# Phase 5-2. Stellar Forge (Stages 41-50)

> This is a draft. Details will be finalized after discussion.

## Goal

- Extend the game from 40 to 50 (final) stages with a second new
  hazard, escalating past the trench's current into full gravitational
  chaos for the finale.

## Theme

- The trench opens into deep space — the player is flung out past the
  planet's crust into a forge of dying stars. Ten backdrops (nebulae,
  collapsing stars, forge-like structures) follow the same
  parametrized-generator pattern as the Dimension X backgrounds.

## New mechanic: Gravity Well

- Each stage has one fixed gravity well that pulls every ball toward it
  with inverse-square-law strength (stronger the closer a ball gets),
  layered on top of gravity/bounce/wall physics.
- Well position varies per stage and well strength escalates across the
  ten stages, so late stages have balls arcing unpredictably toward the
  well instead of falling straight down.
- Like currents, the well only affects balls (not the harpoon/player),
  keeping player control precise while balls behave more chaotically.
- Stage 50 is the true final stage — clearing it is the full game clear.

## Files

- `src/game/gravityWells.ts` — per-stage well lookup
- `src/game/engine.ts` — `stepBall` accepts an optional `well`
- `src/GamePlay.tsx` — wires the well into the ball step loop and
  renders the vortex visual
- `src/game/backgrounds.ts` — 10 new stellar-forge backgrounds + stage
  names
- `src/game/constants.ts` — `STAGE_COUNT` raised, 10 new
  `STAGE_OBSTACLES` entries
