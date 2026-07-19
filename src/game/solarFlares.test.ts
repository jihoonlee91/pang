import { describe, expect, it } from 'vitest'
import {
  SOLAR_FLARE_START_STAGE,
  SOLAR_FLARE_STAGE_COUNT,
  getSolarFlareState,
  getSolarFlareWarningProgress,
  getStageSolarFlare,
} from './solarFlares'

describe('getStageSolarFlare', () => {
  it('returns null outside the Solar Storm stage range', () => {
    expect(getStageSolarFlare(SOLAR_FLARE_START_STAGE - 1)).toBeNull()
    expect(
      getStageSolarFlare(SOLAR_FLARE_START_STAGE + SOLAR_FLARE_STAGE_COUNT),
    ).toBeNull()
  })

  it('shortens the period and cuts move speed harder with depth', () => {
    const first = getStageSolarFlare(SOLAR_FLARE_START_STAGE)
    const last = getStageSolarFlare(
      SOLAR_FLARE_START_STAGE + SOLAR_FLARE_STAGE_COUNT - 1,
    )
    expect(first).not.toBeNull()
    expect(last).not.toBeNull()
    expect(last!.periodMs).toBeLessThan(first!.periodMs)
    expect(last!.slowFactor).toBeLessThan(first!.slowFactor)
  })
})

describe('getSolarFlareState', () => {
  const flare = {
    periodMs: 5000,
    activeMs: 1600,
    warningMs: 1100,
    slowFactor: 0.5,
  }
  // activeStart = 5000 - 1600 = 3400; warningStart = 3400 - 1100 = 2300

  it('returns dormant when there is no flare', () => {
    expect(getSolarFlareState(null, 1000)).toBe('dormant')
  })

  it('starts dormant', () => {
    expect(getSolarFlareState(flare, 0)).toBe('dormant')
  })

  it('warns before becoming active', () => {
    expect(getSolarFlareState(flare, 2800)).toBe('warning')
  })

  it('goes active right before the period wraps', () => {
    expect(getSolarFlareState(flare, 4800)).toBe('active')
  })
})

describe('getSolarFlareWarningProgress', () => {
  const flare = {
    periodMs: 5000,
    activeMs: 1600,
    warningMs: 1100,
    slowFactor: 0.5,
  }
  // warningStart = 2300, activeStart = 3400

  it('returns 0 when there is no flare', () => {
    expect(getSolarFlareWarningProgress(null, 1000)).toBe(0)
  })

  it('is 0 right as the warning telegraph begins', () => {
    expect(getSolarFlareWarningProgress(flare, 2300)).toBe(0)
  })

  it('is 1 right as the flare peaks', () => {
    expect(getSolarFlareWarningProgress(flare, 3400)).toBe(1)
  })

  it('rises monotonically through the warning window', () => {
    expect(getSolarFlareWarningProgress(flare, 3000)).toBeGreaterThan(
      getSolarFlareWarningProgress(flare, 2500),
    )
  })
})
