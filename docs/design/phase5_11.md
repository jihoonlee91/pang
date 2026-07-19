# Phase 5-11. Solar Storm (Stages 121-130)

## Goal

- Add the first _global_ (screen-wide, not positional) hazard —
  everything so far (portals, current, wells, fire zones, acid rain)
  has a specific location the player can stand clear of. A blazing
  star's flare has no safe spot; it changes what it _costs_ to be
  anywhere at all for a few seconds.

## New mechanic: Solar Flare

- `getStageSolarFlare` (`solarFlares.ts`) returns a single per-stage
  flare descriptor cycling `dormant -> warning -> active` on a fixed
  period (`getSolarFlareState`, `getSolarFlareWarningProgress`) — the
  same three-state shape as fire zones/acid rain, but with no `x`/
  `width`, since it applies everywhere at once.
- While `active`, player move speed is multiplied by the flare's
  `slowFactor` (starts at 0.65, drops to as low as 0.35 by the end of
  the block) — glare slows reflexes rather than dealing direct damage,
  a different _kind_ of pressure than the block before it.
- `drawSolarFlareOverlay` renders a growing radial glow during the
  warning telegraph and a pulsing full-screen flash while active, drawn
  after the main scene `ctx.restore()` (same layering as the existing
  hit-flash overlay) so it reads as an atmospheric wash, not a shape on
  the playfield.
- Neutralized by the new Visor item (keeps move speed at full even
  during an active flare).

## Theme

- Ten blazing-star compositions (a rising flare horizon, a granulated
  sunspot field, a radiating corona burst, magnetic field loops, a
  photosphere rim, a radiant chasm, a plasma prominence arc, cascading
  ion streams, a chaotic solar maximum, and a blinding white-core
  zenith finale), Canvas-2D only.

## Files

- `src/game/solarFlares.ts` — new file: `SOLAR_FLARE_START_STAGE`,
  `SOLAR_FLARE_STAGE_COUNT`, `getStageSolarFlare`, `getSolarFlareState`,
  `getSolarFlareWarningProgress`
- `src/game/solarFlares.test.ts` — new file
- `src/GamePlay.tsx` — `playerSpeed` slowdown while active,
  `drawSolarFlareOverlay`, "SOLAR FLARE" HUD badge, Visor item wiring
- `src/StageMap.tsx` — "SOLAR FLARE" stage-map badge
- `src/game/backgrounds.ts` — 10 new backgrounds + `STAGE_NAMES` entries
- `src/game/constants.ts` — 10 new `STAGE_OBSTACLES` entries,
  `VISOR_START_STAGE`/`VISOR_DURATION_MS` (see `phase3_4.md`)
- `src/game/hazardCatalog.ts` — `solarFlare` entry
