# Phase 5-10. Frozen Summit (Stages 111-120)

## Goal

- Add a hazard that inverts an already-familiar pattern instead of
  introducing an unrelated new one: the Trench's current pushes the
  _balls_; this block pushes the _player_ instead, so the same
  sine-wave lateral-force code gets reused but the skill it tests
  (compensating your own aim/position, not reading a moving ball) is
  genuinely different.

## New mechanic: Ice Wind

- `getStageIceWind` (`iceWinds.ts`) mirrors `getStageCurrent`
  (`currents.ts`) almost exactly — same escalating-strength,
  shortening-period shape — but `getIceWindPush` returns a direct
  drift speed (px/s) rather than an acceleration, since the player has
  no persistent velocity state to build up the way a ball does via
  `stepBall`. Applied once per frame in `GamePlay.tsx`, directly after
  `stepPlayerOnTerrain`, clamped to the same arena bounds as normal
  player movement.
- Applies identically to the real player and the AI/demo controller
  (both go through the same `stepPlayerOnTerrain` + push step), so the
  AI has to keep re-correcting against the gust like a real player
  would, without needing dedicated AI-avoidance code.
- Neutralized by the new Grip Boots item (zeroes the push while
  active) — not by Stabilizer, following the precedent set by
  Fireproof/Anchor: hazards introduced after Stabilizer's original
  design get their own dedicated counter-item rather than folding into
  Stabilizer's older "current/gravity well" scope.

## Theme

- Ten high-altitude glacier compositions (a glacier approach, a jagged
  ridge, a hanging icefall, a windswept col, a cave arch, a blizzard
  field, a gothic ice-spire "cathedral," an aurora-lit cornice, a
  central ice spire, and a climactic peak combining aurora + wind +
  crystal motifs), Canvas-2D only.

## Files

- `src/game/iceWinds.ts` — new file: `ICE_WIND_START_STAGE`,
  `ICE_WIND_STAGE_COUNT`, `getStageIceWind`, `getIceWindPush`
- `src/game/iceWinds.test.ts` — new file, mirrors `currents.test.ts`
- `src/GamePlay.tsx` — `activeIceWindPush` applied to `playerXRef`,
  `drawIceGusts` visual, "ICE WIND" HUD badge, Grip Boots item wiring
- `src/StageMap.tsx` — "ICE WIND" stage-map badge
- `src/game/backgrounds.ts` — 10 new backgrounds + `STAGE_NAMES` entries
- `src/game/constants.ts` — 10 new `STAGE_OBSTACLES` entries,
  `GRIP_BOOTS_START_STAGE`/`GRIP_BOOTS_DURATION_MS` (see `phase3_4.md`)
- `src/game/hazardCatalog.ts` — `iceWind` entry
