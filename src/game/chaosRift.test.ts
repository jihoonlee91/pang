import { describe, expect, it } from 'vitest'
import {
  CHAOS_RIFT_START_STAGE,
  CHAOS_RIFT_STAGE_COUNT,
  getChaosRiftCurrent,
  getChaosRiftFireZones,
  getChaosRiftWells,
} from './chaosRift'

describe('getChaosRiftCurrent', () => {
  it('returns null outside the Chaos Rift stage range', () => {
    expect(getChaosRiftCurrent(CHAOS_RIFT_START_STAGE - 1)).toBeNull()
    expect(
      getChaosRiftCurrent(CHAOS_RIFT_START_STAGE + CHAOS_RIFT_STAGE_COUNT),
    ).toBeNull()
  })

  it('is present in Fractured Gateway (block 0) and starts stronger than the Trench current ever gets', () => {
    const first = getChaosRiftCurrent(CHAOS_RIFT_START_STAGE)
    expect(first).not.toBeNull()
    expect(first!.strength).toBeGreaterThan(90 + 9 * 14)
  })

  it('is absent in Storm Citadel (block 1)', () => {
    expect(getChaosRiftCurrent(CHAOS_RIFT_START_STAGE + 10)).toBeNull()
  })

  it('reappears in Molten Maelstrom (block 2)', () => {
    expect(getChaosRiftCurrent(CHAOS_RIFT_START_STAGE + 20)).not.toBeNull()
  })
})

describe('getChaosRiftFireZones', () => {
  it('returns null outside the Chaos Rift stage range', () => {
    expect(getChaosRiftFireZones(CHAOS_RIFT_START_STAGE - 1)).toBeNull()
    expect(
      getChaosRiftFireZones(CHAOS_RIFT_START_STAGE + CHAOS_RIFT_STAGE_COUNT),
    ).toBeNull()
  })

  it('is present in Fractured Gateway (block 0)', () => {
    const zones = getChaosRiftFireZones(CHAOS_RIFT_START_STAGE)
    expect(zones).not.toBeNull()
    expect(zones!.length).toBeGreaterThan(0)
  })

  it('is absent in Molten Maelstrom (block 2), which is pure movement chaos', () => {
    expect(getChaosRiftFireZones(CHAOS_RIFT_START_STAGE + 20)).toBeNull()
  })

  it('reappears in Prism Collapse (block 3)', () => {
    expect(getChaosRiftFireZones(CHAOS_RIFT_START_STAGE + 30)).not.toBeNull()
  })
})

describe('getChaosRiftWells', () => {
  it('returns null outside the Chaos Rift stage range', () => {
    expect(getChaosRiftWells(CHAOS_RIFT_START_STAGE - 1)).toBeNull()
    expect(
      getChaosRiftWells(CHAOS_RIFT_START_STAGE + CHAOS_RIFT_STAGE_COUNT),
    ).toBeNull()
  })

  it('is absent in Fractured Gateway (block 0)', () => {
    expect(getChaosRiftWells(CHAOS_RIFT_START_STAGE)).toBeNull()
  })

  it('is present and non-spinning in Storm Citadel (block 1)', () => {
    const wells = getChaosRiftWells(CHAOS_RIFT_START_STAGE + 10)
    expect(wells).not.toBeNull()
    expect(wells![0].spin).toBeUndefined()
  })

  it('spins in Prism Collapse (block 3)', () => {
    const wells = getChaosRiftWells(CHAOS_RIFT_START_STAGE + 30)
    expect(wells).not.toBeNull()
    expect(wells![0].spin).toBeGreaterThan(0)
  })

  it('is present in the Final Singularity (block 4), alongside current and fire', () => {
    expect(getChaosRiftWells(CHAOS_RIFT_START_STAGE + 40)).not.toBeNull()
    expect(getChaosRiftFireZones(CHAOS_RIFT_START_STAGE + 40)).not.toBeNull()
  })
})
