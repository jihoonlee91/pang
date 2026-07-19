# Phase 5-7. Hell (Stages 81-90)

## Goal

- Add a new 10-stage block after Vortex Frontier, with a genuinely new
  hazard: an instant-danger mechanic, distinct from every push/pull
  hazard so far (current, gravity well, nebula field, vortex all only
  affect balls — this one threatens the player directly).

## New mechanic: Fire Zones

- One or more floor zones per stage cycle dormant → warning (a
  telegraphed, growing heat-glow preview — 800ms, `WARNING_MS` in
  `fireZones.ts`) → active (a rising flame that damages the player on
  contact) on a fixed period. Zone count and cycle speed both escalate
  across the block, so later Hell stages leave less safe floor space
  at any given moment. The warning glow's height grows with
  `getFireZoneWarningProgress` (0 at the start of the telegraph, 1 the
  instant it ignites), so the buildup itself reads as a countdown
  rather than a static blinking strip — originally 550ms and just a
  thin floor strip, which didn't give real reaction time or preview
  the flame's eventual height.
- Player-contact damage reuses the exact same invulnerability/barrier
  path as a ball hit (`GamePlay.tsx`'s existing HP-loss block), so a
  fire zone hit costs an HP and grants the usual brief invulnerability
  — no new damage/invulnerability system needed.
- The stage-start 3s invulnerability (`STAGE_START_INVULN_MS`) is now
  correctly re-armed at the moment real gameplay actually begins, not
  just at stage-clear time — see "Start invulnerability re-arm fix"
  below. Without that fix, fire zones (unlike balls, which take a
  moment to reach the player) could hit the instant a Hell stage
  became playable.
- AI/demo mode treats any non-dormant zone as an immediate danger zone
  (`chooseSafeX`'s existing `DangerZone` list), so it dodges Hell
  stages instead of walking into them.

## Start invulnerability re-arm fix

- The "get ready" countdown before the next stage
  (`stageAdvanceCountdown`, ~5s) reuses the same `GamePlay` instance as
  the stage that follows it, and `resetStageState` (which arms the 3s
  start invulnerability) only re-runs when `stageIndex` changes — which
  happens once, at the start of that countdown, not when it ends. So by
  the time the countdown finished and real gameplay began, the 3s grace
  window had already silently expired mid-countdown, leaving the player
  with zero actual invulnerability the instant a new stage (including
  Hell) became playable.
- Fixed by re-arming `invulnUntilRef` the moment `isStarting` transitions
  from true to false (`GamePlay.tsx`), instead of relying solely on the
  stage-index-keyed reset. Applies to every stage, not just Hell, but is
  most consequential there since fire zones can already be active the
  instant the stage starts.

## Theme

- Ten distinct hellscape compositions (a rock-arch gate, a lava-river
  canyon, sulfur spires, falling ash, an obsidian throne, a demonic
  forge, a cracked wasteland, an ember storm, a furnace door, and a
  climactic Abyssal Inferno finale) — same "distinct focal composition
  per stage, shared palette" approach as Vortex Frontier, avoiding the
  earlier "recolored template" complaint.

## Files

- `src/game/fireZones.ts` — new file: `FIRE_ZONE_START_STAGE`,
  `FIRE_ZONE_STAGE_COUNT`, `FireZone` type, `getStageFireZones`,
  `getFireZoneState` (dormant/warning/active cycle)
- `src/GamePlay.tsx` — `drawFireZones` render function; fire-zone
  contact folded into the existing player-damage check; fire zones
  added to the AI's danger-zone list
- `src/StageMap.tsx` — "FIRE ZONES" stage-map badge
- `src/game/backgrounds.ts` — 10 new backgrounds + `STAGE_NAMES`
  entries
- `src/game/constants.ts` — `STAGE_COUNT` raised to 90 (later 100, see
  `phase5_8.md`), 10 new `STAGE_OBSTACLES` entries, `FIREPROOF_START_STAGE`/
  `FIREPROOF_DURATION_MS` (see `phase3_4.md`'s Fireproof section)
