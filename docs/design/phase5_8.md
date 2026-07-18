# Phase 5-8. Void (Stages 91-100)

## Goal

- Add the newest 10-stage block after Hell, with a new hazard that
  changes the fundamental feel of ball physics rather than adding
  another push/pull/damage element on top of it.

## New mechanic: Low Gravity

- `GRAVITY` is scaled down to roughly 8-22% of normal across this
  block (weakest — floatiest — at the final stage), so balls drift
  instead of arcing down predictably. Landing-spot reads have to
  change completely: balls hang in the air far longer and bounce
  travel much further per hit.
- Implemented as a `gravityScale` multiplier threaded through
  `stepBall`/`predictLandingSpot` (`engine.ts`), defaulting to 1
  everywhere else — minimal-blast-radius addition, no other stage's
  physics changes. `getStageGravityScale` (`voidGravity.ts`) returns
  the per-stage value.
- Not neutralized by Stabilizer (it neutralizes the current/gravity-
  well/nebula-field/vortex _push-toward-a-point_ hazards specifically;
  low gravity is a baseline physics change for the whole block, not a
  point hazard to cancel).

## Theme

- Ten distinct emptiness/entropy compositions (floating wireframe
  debris, a silent starfield, fractured glitch-lines, decaying
  particles, a derelict structure, a fading horizon, a still center
  point, a hollow ring, an approaching anomaly, and a near-blank finale
  with a single point of light) — increasingly sparse as the block
  progresses, mirroring the floatier physics.

## Files

- `src/game/voidGravity.ts` — new file: `VOID_START_STAGE`,
  `VOID_STAGE_COUNT`, `getStageGravityScale`
- `src/game/engine.ts` — `stepBall`/`predictLandingSpot` gain a
  `gravityScale` parameter (default 1)
- `src/GamePlay.tsx` — `gravityScale` threaded into both call sites;
  "Low Gravity" HUD badge when scale < 1
- `src/StageMap.tsx` — "LOW GRAVITY" stage-map badge
- `src/game/backgrounds.ts` — 10 new backgrounds + `STAGE_NAMES`
  entries
- `src/game/constants.ts` — `STAGE_COUNT` raised to 100, 10 new
  `STAGE_OBSTACLES` entries, `getStageTimeSeconds` given a 12-second floor
  (see `phase3_2.md`) — without it, `STAGE_TIME_SECONDS - stageIndex` went
  to zero/negative for every Void stage and ended the run instantly,
  `ANCHOR_START_STAGE`/`ANCHOR_DURATION_MS` (see `phase3_4.md`'s Anchor
  section)
