export const ICE_WIND_START_STAGE = 110
export const ICE_WIND_STAGE_COUNT = 10

export type IceWind = {
  strength: number
  periodMs: number
}

// A lateral "icy gust" hazard for the Frozen Summit stages (111-120,
// 0-indexed 110-119) — the inverse of the Trench's current: instead of
// pushing the balls, it pushes the *player*, so aiming and dodging both
// have to account for a shove that isn't affecting anything else on
// screen. Gusts get both stronger and choppier (shorter period) with
// altitude, same escalation shape as the Trench current.
export function getStageIceWind(stageIndex: number): IceWind | null {
  if (
    stageIndex < ICE_WIND_START_STAGE ||
    stageIndex >= ICE_WIND_START_STAGE + ICE_WIND_STAGE_COUNT
  ) {
    return null
  }

  const depth = stageIndex - ICE_WIND_START_STAGE
  return {
    strength: 45 + depth * 7,
    periodMs: Math.max(2800, 4400 - depth * 150),
  }
}

// Sine-wave lateral drift speed (px/s, applied directly to player x rather
// than accumulated as acceleration — the player has no velocity state to
// build up in) for the given gust at a point in time.
export function getIceWindPush(
  wind: IceWind | null,
  elapsedMs: number,
): number {
  if (!wind) return 0
  return Math.sin((elapsedMs / wind.periodMs) * Math.PI * 2) * wind.strength
}
