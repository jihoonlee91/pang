export const ACID_RAIN_START_STAGE = 100
export const ACID_RAIN_STAGE_COUNT = 10

export type AcidRainZone = {
  x: number
  width: number
  periodMs: number
  phaseMs: number
}

export type AcidRainState = 'dormant' | 'warning' | 'active'

const ACTIVE_MS = 900
// Falling rain reads slower to telegraph than Hell's instant lava burst —
// a visible drip-and-pool buildup gives more warning than a floor glow.
const WARNING_MS = 900

const ZONE_LAYOUTS: readonly (readonly Omit<
  AcidRainZone,
  'periodMs' | 'phaseMs'
>[])[] = [
  [{ x: 300, width: 180 }],
  [
    { x: 110, width: 160 },
    { x: 550, width: 160 },
  ],
  [
    { x: 190, width: 180 },
    { x: 490, width: 180 },
  ],
  [
    { x: 90, width: 150 },
    { x: 350, width: 150 },
    { x: 610, width: 150 },
  ],
  [
    { x: 150, width: 170 },
    { x: 510, width: 170 },
  ],
  [
    { x: 80, width: 160 },
    { x: 330, width: 160 },
    { x: 580, width: 160 },
  ],
  [
    { x: 210, width: 190 },
    { x: 470, width: 190 },
  ],
  [
    { x: 70, width: 150 },
    { x: 290, width: 150 },
    { x: 510, width: 150 },
    { x: 690, width: 150 },
  ],
  [
    { x: 140, width: 180 },
    { x: 460, width: 180 },
  ],
  [
    { x: 60, width: 160 },
    { x: 270, width: 160 },
    { x: 490, width: 160 },
    { x: 680, width: 160 },
  ],
]

// Falling acid-rain columns for the Toxic Marsh stages (101-110, 0-indexed
// 100-109). Same dormant -> warning -> active cycle as Hell's fire zones,
// but the danger falls from above instead of erupting from the floor —
// visually distinct, mechanically the same telegraphed instant-damage
// pattern the player already learned from Hell. Period shortens and zone
// count grows across the block, same escalation shape as fire zones.
export function getStageAcidRainZones(
  stageIndex: number,
): AcidRainZone[] | null {
  if (
    stageIndex < ACID_RAIN_START_STAGE ||
    stageIndex >= ACID_RAIN_START_STAGE + ACID_RAIN_STAGE_COUNT
  ) {
    return null
  }

  const depth = stageIndex - ACID_RAIN_START_STAGE
  const layout = ZONE_LAYOUTS[depth % ZONE_LAYOUTS.length]
  const periodMs = Math.max(2300, 3700 - depth * 130)
  return layout.map((zone, index) => ({
    ...zone,
    periodMs,
    phaseMs: (index * periodMs) / layout.length,
  }))
}

function cyclePosition(zone: AcidRainZone, elapsedMs: number): number {
  return (
    (((elapsedMs + zone.phaseMs) % zone.periodMs) + zone.periodMs) %
    zone.periodMs
  )
}

export function getAcidRainState(
  zone: AcidRainZone,
  elapsedMs: number,
): AcidRainState {
  const t = cyclePosition(zone, elapsedMs)
  const activeStart = zone.periodMs - ACTIVE_MS
  const warningStart = activeStart - WARNING_MS
  if (t >= activeStart) return 'active'
  if (t >= warningStart) return 'warning'
  return 'dormant'
}

// 0 at the start of the warning telegraph, 1 the instant the rain lands —
// lets the renderer grow a falling-drip preview as a readable countdown.
export function getAcidRainWarningProgress(
  zone: AcidRainZone,
  elapsedMs: number,
): number {
  const t = cyclePosition(zone, elapsedMs)
  const activeStart = zone.periodMs - ACTIVE_MS
  const warningStart = activeStart - WARNING_MS
  return Math.max(0, Math.min(1, (t - warningStart) / WARNING_MS))
}
