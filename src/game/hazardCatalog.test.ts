import { describe, expect, it } from 'vitest'
import { HAZARD_CATALOG, getHazardIntroForStage } from './hazardCatalog'

describe('getHazardIntroForStage', () => {
  it('returns null on stages that are not a hazard block start', () => {
    expect(getHazardIntroForStage(0)).toBeNull()
    expect(getHazardIntroForStage(35)).toBeNull()
  })

  it('returns the matching hazard on its exact start stage', () => {
    const hazard = getHazardIntroForStage(30)
    expect(hazard?.id).toBe('portals')
  })

  it('has a unique, non-overlapping start stage per hazard', () => {
    const startStages = HAZARD_CATALOG.map((h) => h.startStage)
    expect(new Set(startStages).size).toBe(startStages.length)
  })
})
