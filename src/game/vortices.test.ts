import { describe, expect, it } from 'vitest'
import {
  VORTEX_START_STAGE,
  VORTEX_STAGE_COUNT,
  getStageVortex,
} from './vortices'
import { applyGravityWellPull } from './gravityWells'

describe('getStageVortex', () => {
  it('returns null outside the vortex-frontier stage range', () => {
    expect(getStageVortex(VORTEX_START_STAGE - 1)).toBeNull()
    expect(getStageVortex(VORTEX_START_STAGE + VORTEX_STAGE_COUNT)).toBeNull()
  })

  it('escalates strength and spin with depth', () => {
    const first = getStageVortex(VORTEX_START_STAGE)
    const last = getStageVortex(VORTEX_START_STAGE + VORTEX_STAGE_COUNT - 1)
    expect(first).not.toBeNull()
    expect(last).not.toBeNull()
    expect(last!.strength).toBeGreaterThan(first!.strength)
    expect(last!.spin).toBeGreaterThan(first!.spin!)
  })

  it('always sets a spin value, unlike a plain gravity well', () => {
    const well = getStageVortex(VORTEX_START_STAGE)
    expect(well!.spin).toBeGreaterThan(0)
  })
})

describe('applyGravityWellPull with spin', () => {
  it('adds a tangential component perpendicular to the radial pull', () => {
    const well = { x: 500, y: 300, strength: 4_000_000, spin: 2_000_000 }
    const radialOnly = applyGravityWellPull(
      { x: 500, y: 300, strength: 4_000_000 },
      400,
      300,
    )
    const withSpin = applyGravityWellPull(well, 400, 300)

    // Radial (x) pull unchanged, tangential (y) pull now nonzero.
    expect(withSpin.ax).toBeCloseTo(radialOnly.ax)
    expect(withSpin.ay).not.toBeCloseTo(radialOnly.ay)
  })
})
