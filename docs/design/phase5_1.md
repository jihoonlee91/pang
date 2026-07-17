# Phase 5-1. The Trench (Stages 31-40)

> This is a draft. Details will be finalized after discussion.

## Goal

- Extend the game from 30 to 40 stages with a new environmental hazard,
  distinct from the ladder (stages 6-10) and portal (stages 21-30)
  mechanics already in place.

## Theme

- After breaching the Dimension X "Pang Core" at stage 30, the player
  falls through into an abyssal ocean — a bioluminescent deep-sea
  trench. Ten backdrops (trench walls, drifting jellyfish, shipwreck
  silhouettes, coral spires) are drawn procedurally in the same flat
  Canvas 2D style as the existing dimension backgrounds, varying by a
  per-stage index the same way `drawDimensionBackground` does.

## New mechanic: Current

- A periodic lateral "current" pushes every ball back and forth (a sine
  wave over time), layered on top of the normal gravity/bounce physics.
  It's visualized as drifting particle streaks near the floor whose
  direction flips with the current.
- Strength and cycle speed both increase across the ten stages (see
  `src/game/currents.ts`), so late trench stages feel genuinely
  choppier, not just "faster balls."
- The harpoon and player are unaffected — the current only pushes
  balls, so it's a read-and-reposition skill rather than a control
  impairment.

## Files

- `src/game/currents.ts` — per-stage current lookup + wind calculation
- `src/game/engine.ts` — `stepBall` accepts an optional `windAx`
- `src/GamePlay.tsx` — wires the current into the ball step loop and
  renders the drift-particle visual
- `src/game/backgrounds.ts` — 10 new trench backgrounds + stage names
- `src/game/constants.ts` — `STAGE_COUNT` raised, 10 new
  `STAGE_OBSTACLES` entries
