import { describe, expect, it } from 'vitest'
import {
  ICE_WIND_START_STAGE,
  ICE_WIND_STAGE_COUNT,
  getIceWindPush,
  getStageIceWind,
} from './iceWinds'

describe('getStageIceWind', () => {
  it('returns null outside the Frozen Summit stage range', () => {
    expect(getStageIceWind(ICE_WIND_START_STAGE - 1)).toBeNull()
    expect(
      getStageIceWind(ICE_WIND_START_STAGE + ICE_WIND_STAGE_COUNT),
    ).toBeNull()
  })

  it('escalates strength and shortens the period with depth', () => {
    const first = getStageIceWind(ICE_WIND_START_STAGE)
    const last = getStageIceWind(
      ICE_WIND_START_STAGE + ICE_WIND_STAGE_COUNT - 1,
    )
    expect(first).not.toBeNull()
    expect(last).not.toBeNull()
    expect(last!.strength).toBeGreaterThan(first!.strength)
    expect(last!.periodMs).toBeLessThan(first!.periodMs)
  })
})

describe('getIceWindPush', () => {
  it('returns 0 when there is no wind', () => {
    expect(getIceWindPush(null, 1000)).toBe(0)
  })

  it('oscillates between -strength and +strength over one period', () => {
    const wind = { strength: 60, periodMs: 4000 }
    expect(getIceWindPush(wind, 0)).toBeCloseTo(0)
    expect(getIceWindPush(wind, 1000)).toBeCloseTo(60)
    expect(getIceWindPush(wind, 3000)).toBeCloseTo(-60)
  })
})
