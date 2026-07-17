export const CURRENT_START_STAGE = 40
export const CURRENT_STAGE_COUNT = 10

export type StageCurrent = {
  strength: number
  periodMs: number
}

// A lateral "current" hazard for the deep-sea trench stages (31-40, 0-indexed
// 30-39). It gets both stronger and choppier (shorter period) with depth, so
// later trench stages read as genuinely different rather than just faster.
export function getStageCurrent(stageIndex: number): StageCurrent | null {
  if (
    stageIndex < CURRENT_START_STAGE ||
    stageIndex >= CURRENT_START_STAGE + CURRENT_STAGE_COUNT
  ) {
    return null
  }

  const depth = stageIndex - CURRENT_START_STAGE
  return {
    strength: 90 + depth * 14,
    periodMs: Math.max(2600, 4200 - depth * 160),
  }
}

// Sine-wave lateral acceleration for the given current at a point in time.
export function getCurrentWindAx(
  current: StageCurrent | null,
  elapsedMs: number,
): number {
  if (!current) return 0
  return (
    Math.sin((elapsedMs / current.periodMs) * Math.PI * 2) * current.strength
  )
}
