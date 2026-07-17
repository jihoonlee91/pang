export const FIRE_ZONE_START_STAGE = 80
export const FIRE_ZONE_STAGE_COUNT = 10

export type FireZone = {
  x: number
  width: number
  periodMs: number
  phaseMs: number
}

export type FireZoneState = 'dormant' | 'warning' | 'active'

const ACTIVE_MS = 850
const WARNING_MS = 550

const ZONE_LAYOUTS: readonly (readonly Omit<
  FireZone,
  'periodMs' | 'phaseMs'
>[])[] = [
  [{ x: 340, width: 160 }],
  [
    { x: 120, width: 150 },
    { x: 560, width: 150 },
  ],
  [
    { x: 200, width: 170 },
    { x: 500, width: 170 },
  ],
  [
    { x: 100, width: 140 },
    { x: 360, width: 140 },
    { x: 620, width: 140 },
  ],
  [
    { x: 160, width: 160 },
    { x: 520, width: 160 },
  ],
  [
    { x: 90, width: 150 },
    { x: 340, width: 150 },
    { x: 590, width: 150 },
  ],
  [
    { x: 220, width: 180 },
    { x: 480, width: 180 },
  ],
  [
    { x: 80, width: 140 },
    { x: 300, width: 140 },
    { x: 520, width: 140 },
    { x: 700, width: 140 },
  ],
  [
    { x: 150, width: 170 },
    { x: 470, width: 170 },
  ],
  [
    { x: 70, width: 150 },
    { x: 280, width: 150 },
    { x: 500, width: 150 },
    { x: 690, width: 150 },
  ],
]

// Periodic lava-burst floor zones for the Hell stages (81-90, 0-indexed
// 80-89) — a new instant-danger mechanic, distinct from every push/pull
// hazard so far. Each zone cycles dormant -> warning (telegraphed glow) ->
// active (damages the player on contact) on a fixed period; period shortens
// and zone count grows across the block so later Hell stages leave less
// safe floor space at any given moment.
export function getStageFireZones(stageIndex: number): FireZone[] | null {
  if (
    stageIndex < FIRE_ZONE_START_STAGE ||
    stageIndex >= FIRE_ZONE_START_STAGE + FIRE_ZONE_STAGE_COUNT
  ) {
    return null
  }

  const depth = stageIndex - FIRE_ZONE_START_STAGE
  const layout = ZONE_LAYOUTS[depth % ZONE_LAYOUTS.length]
  const periodMs = Math.max(2200, 3600 - depth * 130)
  return layout.map((zone, index) => ({
    ...zone,
    periodMs,
    phaseMs: (index * periodMs) / layout.length,
  }))
}

export function getFireZoneState(
  zone: FireZone,
  elapsedMs: number,
): FireZoneState {
  const t =
    (((elapsedMs + zone.phaseMs) % zone.periodMs) + zone.periodMs) %
    zone.periodMs
  const activeStart = zone.periodMs - ACTIVE_MS
  const warningStart = activeStart - WARNING_MS
  if (t >= activeStart) return 'active'
  if (t >= warningStart) return 'warning'
  return 'dormant'
}
