import { describe, expect, it } from 'vitest'
import {
  ACID_RAIN_START_STAGE,
  ACID_RAIN_STAGE_COUNT,
  getAcidRainState,
  getAcidRainWarningProgress,
  getStageAcidRainZones,
} from './acidRain'

describe('getStageAcidRainZones', () => {
  it('returns null outside the Toxic Marsh stage range', () => {
    expect(getStageAcidRainZones(ACID_RAIN_START_STAGE - 1)).toBeNull()
    expect(
      getStageAcidRainZones(ACID_RAIN_START_STAGE + ACID_RAIN_STAGE_COUNT),
    ).toBeNull()
  })

  it('adds more zones and shortens the period with depth', () => {
    const first = getStageAcidRainZones(ACID_RAIN_START_STAGE)
    const last = getStageAcidRainZones(
      ACID_RAIN_START_STAGE + ACID_RAIN_STAGE_COUNT - 1,
    )
    expect(first).not.toBeNull()
    expect(last).not.toBeNull()
    expect(last!.length).toBeGreaterThanOrEqual(first!.length)
    expect(last![0].periodMs).toBeLessThan(first![0].periodMs)
  })
})

describe('getAcidRainState', () => {
  const zone = { x: 100, width: 100, periodMs: 3200, phaseMs: 0 }
  // activeStart = 3200 - 900 = 2300; warningStart = 2300 - 900 = 1400

  it('starts dormant', () => {
    expect(getAcidRainState(zone, 0)).toBe('dormant')
  })

  it('warns before becoming active', () => {
    expect(getAcidRainState(zone, 1700)).toBe('warning')
  })

  it('goes active right before the period wraps', () => {
    expect(getAcidRainState(zone, 3000)).toBe('active')
  })

  it('wraps around cleanly with phase offsets', () => {
    const offsetZone = { ...zone, phaseMs: 1500 }
    expect(getAcidRainState(offsetZone, 3600)).toBe(
      getAcidRainState(zone, 1900),
    )
  })
})

describe('getAcidRainWarningProgress', () => {
  const zone = { x: 100, width: 100, periodMs: 3200, phaseMs: 0 }
  // warningStart = 1400, activeStart = 2300

  it('is 0 right as the warning telegraph begins', () => {
    expect(getAcidRainWarningProgress(zone, 1400)).toBe(0)
  })

  it('is 1 right as the rain lands', () => {
    expect(getAcidRainWarningProgress(zone, 2300)).toBe(1)
  })

  it('rises monotonically through the warning window', () => {
    expect(getAcidRainWarningProgress(zone, 1900)).toBeGreaterThan(
      getAcidRainWarningProgress(zone, 1500),
    )
  })

  it('clamps to 0 while dormant, before the telegraph starts', () => {
    expect(getAcidRainWarningProgress(zone, 0)).toBe(0)
  })

  it('clamps to 1 once past impact, while active', () => {
    expect(getAcidRainWarningProgress(zone, 3000)).toBe(1)
  })
})
