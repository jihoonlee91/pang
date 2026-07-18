# Phase 5-7. Hell (Stages 81-90)

## Goal

- Add a new 10-stage block after Vortex Frontier, with a genuinely new
  hazard: an instant-danger mechanic, distinct from every push/pull
  hazard so far (current, gravity well, nebula field, vortex all only
  affect balls — this one threatens the player directly).

## New mechanic: Fire Zones

- One or more floor zones per stage cycle dormant → warning (a
  telegraphed pulsing glow) → active (a rising flame that damages the
  player on contact) on a fixed period. Zone count and cycle speed
  both escalate across the block, so later Hell stages leave less safe
  floor space at any given moment.
- Player-contact damage reuses the exact same invulnerability/barrier
  path as a ball hit (`GamePlay.tsx`'s existing HP-loss block), so a
  fire zone hit costs an HP and grants the usual brief invulnerability
  — no new damage/invulnerability system needed.
- AI/demo mode treats any non-dormant zone as an immediate danger zone
  (`chooseSafeX`'s existing `DangerZone` list), so it dodges Hell
  stages instead of walking into them.

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
