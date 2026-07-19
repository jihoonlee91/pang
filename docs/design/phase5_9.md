# Phase 5-9. Toxic Marsh (Stages 101-110)

## Goal

- Extend the game past its previous 100-stage ceiling with a new
  10-stage theme block, picking up the user's own suggestion of an
  acid-rain hazard. Reuse the fire zones' proven telegraph pattern
  rather than inventing a new state machine, but make the danger read
  as visually distinct (falling from above, not erupting from below).

## New mechanic: Acid Rain

- `getStageAcidRainZones` (`acidRain.ts`) returns 1-4 lateral columns
  per stage, each cycling `dormant -> warning -> active` on a fixed
  period — the exact same three-state shape as Hell's fire zones
  (`fireZones.ts`), reused instead of duplicated logic with new names:
  `getAcidRainState`, `getAcidRainWarningProgress`. Zone count grows and
  the period shortens with depth, same escalation curve as fire zones.
- Rendered as falling drip streaks during the warning telegraph
  (`drawAcidRain` in `GamePlay.tsx`) that thicken as impact approaches,
  then a solid acid-green column with rising bubbles while active.
- Damages the player on contact while `active`, gated the same way fire
  zones are: skipped during Clock/Invincible/Overdrive and the
  post-stage-start invulnerability window, and specifically neutralized
  by the new Umbrella item (see `phase3_4.md`).
- The AI/demo mode treats active-or-warning acid rain columns as danger
  zones to route around, mirroring `fireZoneDangers`.

## Theme

- Ten sickly, industrial-decay swamp compositions (dead-tree fume bogs,
  a winding sludge delta, a rusted refinery, mangroves, an acid
  waterfall, pipe-laced wetlands, hazy bowls, a glowing tainted
  reservoir, verdigris ruins, and a wide bubbling toxic delta finale),
  built entirely in Canvas 2D — no photo assets, matching the scope
  boundary already established for stages 21+.

## Files

- `src/game/acidRain.ts` — new file: `ACID_RAIN_START_STAGE`,
  `ACID_RAIN_STAGE_COUNT`, `getStageAcidRainZones`, `getAcidRainState`,
  `getAcidRainWarningProgress`
- `src/game/acidRain.test.ts` — new file: state-cycle and
  warning-progress tests mirroring `fireZones.test.ts`
- `src/GamePlay.tsx` — `drawAcidRain`, damage check, AI danger zones,
  "ACID RAIN" HUD badge, Umbrella item wiring
- `src/StageMap.tsx` — "ACID RAIN" stage-map badge
- `src/game/backgrounds.ts` — 10 new backgrounds + `STAGE_NAMES` entries
- `src/game/constants.ts` — `STAGE_COUNT` raised to 150, 10 new
  `STAGE_OBSTACLES` entries, `UMBRELLA_START_STAGE`/
  `UMBRELLA_DURATION_MS` (see `phase3_4.md`)
- `src/game/hazardCatalog.ts` — `acidRain` entry for the Glossary page
  and first-encounter intro modal
