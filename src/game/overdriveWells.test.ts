import { describe, expect, it } from 'vitest'
import {
  OVERDRIVE_START_STAGE,
  OVERDRIVE_STAGE_COUNT,
  getOverdrivePolarityPeriodMs,
  getOverdriveWellsAtTime,
  getStageOverdriveBaseWells,
} from './overdriveWells'

describe('getStageOverdriveBaseWells', () => {
  it('returns null outside the Overdrive Nexus stage range', () => {
    expect(getStageOverdriveBaseWells(OVERDRIVE_START_STAGE - 1)).toBeNull()
    expect(
      getStageOverdriveBaseWells(OVERDRIVE_START_STAGE + OVERDRIVE_STAGE_COUNT),
    ).toBeNull()
  })

  it('returns a twin-well pair with escalating strength', () => {
    const first = getStageOverdriveBaseWells(OVERDRIVE_START_STAGE)
    const last = getStageOverdriveBaseWells(
      OVERDRIVE_START_STAGE + OVERDRIVE_STAGE_COUNT - 1,
    )
    expect(first).toHaveLength(2)
    expect(last).toHaveLength(2)
    expect(last![0].strength).toBeGreaterThan(first![0].strength)
  })
})

describe('getOverdrivePolarityPeriodMs', () => {
  it('shortens with depth', () => {
    const first = getOverdrivePolarityPeriodMs(OVERDRIVE_START_STAGE)
    const last = getOverdrivePolarityPeriodMs(
      OVERDRIVE_START_STAGE + OVERDRIVE_STAGE_COUNT - 1,
    )
    expect(last).toBeLessThan(first)
  })
})

describe('getOverdriveWellsAtTime', () => {
  it('returns null when there are no base wells', () => {
    expect(getOverdriveWellsAtTime(null, OVERDRIVE_START_STAGE, 0)).toBeNull()
  })

  it('flips polarity between attracting and repelling over the cycle', () => {
    const baseWells = getStageOverdriveBaseWells(OVERDRIVE_START_STAGE)!
    const periodMs = getOverdrivePolarityPeriodMs(OVERDRIVE_START_STAGE)

    const attracting = getOverdriveWellsAtTime(
      baseWells,
      OVERDRIVE_START_STAGE,
      0,
    )!
    const repelling = getOverdriveWellsAtTime(
      baseWells,
      OVERDRIVE_START_STAGE,
      periodMs / 2,
    )!

    expect(attracting[0].strength).toBeGreaterThan(0)
    expect(repelling[0].strength).toBeLessThan(0)
    expect(Math.abs(repelling[0].strength)).toBe(baseWells[0].strength)
  })
})
