export const SOLAR_FLARE_START_STAGE = 120
export const SOLAR_FLARE_STAGE_COUNT = 10

export type SolarFlareState = 'dormant' | 'warning' | 'active'

export type SolarFlare = {
  periodMs: number
  activeMs: number
  warningMs: number
  /** Player move-speed multiplier while a flare is active — glare slows reflexes. */
  slowFactor: number
}

const BASE_ACTIVE_MS = 1600
const BASE_WARNING_MS = 1100

// A screen-wide glare hazard for the Solar Storm stages (121-130, 0-indexed
// 120-129) — unlike every earlier hazard, it isn't positional (there's no
// "safe spot" on the floor to stand in), it's a global dormant -> warning
// -> active cycle that dims player control everywhere at once while a
// flare is active. Gets longer/more frequent and cuts move speed harder
// with depth, so late Solar Storm stages spend more of their time in the
// slowed state.
export function getStageSolarFlare(stageIndex: number): SolarFlare | null {
  if (
    stageIndex < SOLAR_FLARE_START_STAGE ||
    stageIndex >= SOLAR_FLARE_START_STAGE + SOLAR_FLARE_STAGE_COUNT
  ) {
    return null
  }

  const depth = stageIndex - SOLAR_FLARE_START_STAGE
  return {
    periodMs: Math.max(3600, 5200 - depth * 150),
    activeMs: BASE_ACTIVE_MS + depth * 40,
    warningMs: BASE_WARNING_MS,
    slowFactor: Math.max(0.35, 0.65 - depth * 0.03),
  }
}

function cyclePosition(flare: SolarFlare, elapsedMs: number): number {
  return ((elapsedMs % flare.periodMs) + flare.periodMs) % flare.periodMs
}

export function getSolarFlareState(
  flare: SolarFlare | null,
  elapsedMs: number,
): SolarFlareState {
  if (!flare) return 'dormant'
  const t = cyclePosition(flare, elapsedMs)
  const activeStart = flare.periodMs - flare.activeMs
  const warningStart = activeStart - flare.warningMs
  if (t >= activeStart) return 'active'
  if (t >= warningStart) return 'warning'
  return 'dormant'
}

// 0 at the start of the warning telegraph, 1 the instant the flare peaks —
// lets the renderer ramp a growing flash/vignette as a readable countdown.
export function getSolarFlareWarningProgress(
  flare: SolarFlare | null,
  elapsedMs: number,
): number {
  if (!flare) return 0
  const t = cyclePosition(flare, elapsedMs)
  const activeStart = flare.periodMs - flare.activeMs
  const warningStart = activeStart - flare.warningMs
  return Math.max(0, Math.min(1, (t - warningStart) / flare.warningMs))
}
