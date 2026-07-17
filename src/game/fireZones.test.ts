import { describe, expect, it } from 'vitest'
import {
  FIRE_ZONE_START_STAGE,
  FIRE_ZONE_STAGE_COUNT,
  getFireZoneState,
  getStageFireZones,
} from './fireZones'

describe('getStageFireZones', () => {
  it('returns null outside the Hell stage range', () => {
    expect(getStageFireZones(FIRE_ZONE_START_STAGE - 1)).toBeNull()
    expect(
      getStageFireZones(FIRE_ZONE_START_STAGE + FIRE_ZONE_STAGE_COUNT),
    ).toBeNull()
  })

  it('adds more zones and shortens the period with depth', () => {
    const first = getStageFireZones(FIRE_ZONE_START_STAGE)
    const last = getStageFireZones(
      FIRE_ZONE_START_STAGE + FIRE_ZONE_STAGE_COUNT - 1,
    )
    expect(first).not.toBeNull()
    expect(last).not.toBeNull()
    expect(last!.length).toBeGreaterThanOrEqual(first!.length)
    expect(last![0].periodMs).toBeLessThan(first![0].periodMs)
  })
})

describe('getFireZoneState', () => {
  const zone = { x: 100, width: 100, periodMs: 3000, phaseMs: 0 }

  it('starts dormant', () => {
    expect(getFireZoneState(zone, 0)).toBe('dormant')
  })

  it('warns before becoming active', () => {
    // activeStart = 3000 - 850 = 2150; warningStart = 2150 - 550 = 1600
    expect(getFireZoneState(zone, 1700)).toBe('warning')
  })

  it('goes active right before the period wraps', () => {
    expect(getFireZoneState(zone, 2900)).toBe('active')
  })

  it('wraps around cleanly with phase offsets', () => {
    const offsetZone = { ...zone, phaseMs: 1500 }
    expect(getFireZoneState(offsetZone, 3400)).toBe(
      getFireZoneState(zone, 1900),
    )
  })
})
